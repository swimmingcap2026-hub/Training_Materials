import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ---------------------------------------------------------------------------
// Shared viewer: lighting, picking, explode, cross-section, x-ray, labels.
// One instance per tab (full tool / single chamber).
// ---------------------------------------------------------------------------
export class Viewer {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.parts = new Map();          // partId -> { objects: [], meshes: [] }
    this.selected = null;
    this.hovered = null;
    this.isolated = false;
    this.labelsOn = false;
    this.explodeAmount = 0;
    this.clipEnabled = false;
    this.clipAxis = 'x';
    this.clipPos = 0;
    this.clipFlip = false;
    this.xray = false;
    this.xrayOpacity = 0.14;
    this.active = opts.active !== false;   // hidden tabs stop rendering
    // the full-tool view is static, so it renders on demand instead of
    // burning a core at 60 fps; the animated chamber sets alwaysRender
    this.alwaysRender = !!opts.alwaysRender;
    this._dirty = true;
    this.onSelect = opts.onSelect || (() => {});
    this.onFrame = opts.onFrame || (() => {});
    this.labelText = opts.labelText || (id => id);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 100);
    this.camera.position.set(...(opts.camera || [4.2, 3.0, 5.2]));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(w, h);
    this.renderer.localClippingEnabled = true;
    this.renderer.shadowMap.enabled = false;
    container.appendChild(this.renderer.domElement);

    this.labelLayer = document.createElement('div');
    this.labelLayer.className = 'label-layer';
    container.appendChild(this.labelLayer);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(...(opts.target || [0, 1.0, 0]));
    this.controls.maxPolarAngle = Math.PI * 0.92;
    this.controls.minDistance = 0.4;
    this.controls.maxDistance = 30;
    this.controls.addEventListener('change', () => { this._dirty = true; });

    // an environment map keeps metals from rendering as flat dark grey
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;

    this._lights();
    this._ground();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    this._bindEvents();
    this.clock = new THREE.Clock();
    this._tween = null;
    this._loop();
  }

  _lights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd7dee8, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(5, 8, 6);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdce8ff, 0.7);
    fill.position.set(-6, 4, -4);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff0e0, 0.5);
    rim.position.set(0, 3, -8);
    this.scene.add(rim);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  }

  _ground() {
    const grid = new THREE.GridHelper(
      this.opts.gridSize || 14, this.opts.gridDiv || 28, 0xc3cedb, 0xe6ecf3
    );
    grid.material.transparent = true;
    grid.material.opacity = 0.75;
    grid.position.y = this.opts.gridY ?? 0;
    this.scene.add(grid);
    this.grid = grid;
  }

  setModel(root) {
    if (this.model) this.scene.remove(this.model);
    this.model = root;
    this.scene.add(root);
    this.parts.clear();

    root.traverse(o => {
      if (o.userData && (o.userData.explodeDir || o.userData.ex)) {
        o.userData.homePos = o.position.clone();
        if (o.userData.ex) o.userData.explodeDir = new THREE.Vector3(...o.userData.ex);
      }
      const id = o.userData && o.userData.partId;
      if (!id) return;
      if (!this.parts.has(id)) this.parts.set(id, { objects: [], meshes: [] });
      const rec = this.parts.get(id);
      if (o.isMesh) rec.meshes.push(o);
      if (o.parent === root) rec.objects.push(o);
    });

    // group-level explode fallback: parts without their own vector move radially
    this.parts.forEach((rec, id) => {
      rec.objects.forEach(o => {
        if (!o.userData.homePos) o.userData.homePos = o.position.clone();
      });
    });

    this.applyExplode(this.explodeAmount);
    this.applyXray(this.xray);
    this._dirty = true;
  }

  _bindEvents() {
    const el = this.renderer.domElement;
    let downPos = null;
    el.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
    el.addEventListener('pointerup', e => {
      if (!downPos) return;
      const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
      downPos = null;
      if (moved > 5) return;               // was a drag, not a click
      const hit = this._pick(e);
      this.select(hit ? hit.userData.partId : null, { fromCanvas: true });
    });
    el.addEventListener('pointermove', e => {
      const hit = this._pick(e);
      const id = hit ? hit.userData.partId : null;
      if (id !== this.hovered) {
        this.hovered = id;
        el.style.cursor = id ? 'pointer' : 'grab';
        this._refreshHighlight();
      }
    });
    el.addEventListener('pointerleave', () => {
      if (this.hovered) { this.hovered = null; this._refreshHighlight(); }
    });
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(this.container);
  }

  _pick(e) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.model) return null;
    const hits = this.raycaster.intersectObject(this.model, true);
    for (const hit of hits) {
      const o = hit.object;
      if (!o.visible || !o.userData.partId) continue;
      // when the enclosure is see-through, click straight past it
      if (this.xray && o.userData.shell) continue;
      if (this.clipEnabled && this.clipPlane.distanceToPoint(hit.point) < 0) continue;
      return o;
    }
    return null;
  }

  select(id, meta = {}) {
    this.selected = id || null;
    if (this.isolated) this.applyIsolate(true);
    this._refreshHighlight();
    this.onSelect(this.selected, meta);
  }

  _refreshHighlight() {
    this._dirty = true;
    this.parts.forEach((rec, id) => {
      const on = id === this.selected ? 2 : (id === this.hovered ? 1 : 0);
      rec.meshes.forEach(m => {
        if (!m.material || !m.material.emissive) return;
        if (on === 2) {
          m.material.emissive.setHex(0xff8c1a);
          m.material.emissiveIntensity = 0.55;
        } else if (on === 1) {
          m.material.emissive.setHex(0x3d7bff);
          m.material.emissiveIntensity = 0.28;
        } else {
          m.material.emissive.setHex(0x000000);
          m.material.emissiveIntensity = 0;
        }
      });
    });
  }

  applyExplode(amount) {
    this._dirty = true;
    this.explodeAmount = amount;
    const scale = this.opts.explodeScale ?? 1;
    const seen = new Set();
    this.parts.forEach((rec, id) => {
      rec.objects.forEach(o => this._explodeObj(o, amount * scale, id, seen));
    });
    // nested pieces with their own vectors (chamber cells, enclosure panels)
    if (this.model) {
      this.model.traverse(o => {
        if (o.userData.explodeDir && o.userData.homePos && !seen.has(o)) {
          o.position.copy(o.userData.homePos).addScaledVector(o.userData.explodeDir, amount * scale);
        }
      });
    }
  }

  _explodeObj(o, amt, id, seen) {
    seen.add(o);
    const home = o.userData.homePos || o.position.clone();
    const dir = o.userData.explodeDir;
    if (dir) {
      o.position.copy(home).addScaledVector(dir, amt);
    } else {
      // radial fallback from the model center
      const c = this._partCenter(id);
      const v = new THREE.Vector3(c.x, (c.y - (this.opts.centerY ?? 1.0)) * 0.6, c.z).normalize();
      o.position.copy(home).addScaledVector(v, amt * 0.8);
    }
  }

  _partCenter(id) {
    const rec = this.parts.get(id);
    if (!rec) return new THREE.Vector3();
    if (rec._center) return rec._center;
    const bb = new THREE.Box3();
    rec.meshes.forEach(m => bb.expandByObject(m));
    rec._center = bb.getCenter(new THREE.Vector3());
    rec._box = bb;
    return rec._center;
  }

  partBox(id) {
    this._partCenter(id);
    const rec = this.parts.get(id);
    return rec ? rec._box : null;
  }

  applyXray(on) {
    this._dirty = true;
    this.xray = on;
    this.parts.forEach(rec => {
      rec.meshes.forEach(m => {
        if (!m.userData.shell) return;
        if (on) {
          m.material.transparent = true;
          m.material.opacity = this.xrayOpacity;
          m.material.depthWrite = false;
        } else {
          m.material.transparent = m.userData.baseTransparent;
          m.material.opacity = m.userData.baseOpacity;
          m.material.depthWrite = true;
        }
        m.material.needsUpdate = true;
      });
    });
  }

  setXrayOpacity(v) {
    this.xrayOpacity = v;
    this._dirty = true;
    if (this.xray) this.applyXray(true);
  }

  applySection(enabled, axis = this.clipAxis, pos = this.clipPos, flip = this.clipFlip) {
    this.clipEnabled = enabled;
    this.clipAxis = axis;
    this.clipPos = pos;
    this.clipFlip = flip;
    const n = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[axis];
    const sign = flip ? 1 : -1;
    this.clipPlane.normal.set(n[0] * sign, n[1] * sign, n[2] * sign);
    this.clipPlane.constant = -sign * pos;
    this.renderer.clippingPlanes = enabled ? [this.clipPlane] : [];
    this._dirty = true;
  }

  applyIsolate(on) {
    this._dirty = true;
    this.isolated = on;
    this.parts.forEach((rec, id) => {
      const show = !on || id === this.selected;
      rec.objects.forEach(o => { o.visible = show; });
    });
  }

  setLabels(on) {
    this._dirty = true;
    this.labelsOn = on;
    this.labelLayer.innerHTML = '';
    this._labelEls = new Map();
    if (!on) return;
    this.parts.forEach((rec, id) => {
      const el = document.createElement('div');
      el.className = 'part-label';
      el.textContent = this.labelText(id);
      el.addEventListener('click', () => this.select(id));
      this.labelLayer.appendChild(el);
      this._labelEls.set(id, el);
    });
  }

  refreshLabelText() {
    if (this.labelsOn) this.setLabels(true);
  }

  _updateLabels() {
    if (!this.labelsOn || !this._labelEls) return;
    const r = this.renderer.domElement;
    const w = r.clientWidth, h = r.clientHeight;
    const v = new THREE.Vector3();
    this._labelEls.forEach((el, id) => {
      const rec = this.parts.get(id);
      if (!rec || !rec.objects.some(o => o.visible)) { el.style.display = 'none'; return; }
      const c = this._partCenter(id);
      v.copy(c);
      // follow the exploded offset of the first object
      const o0 = rec.objects[0];
      if (o0 && o0.userData.homePos) v.add(o0.position.clone().sub(o0.userData.homePos));
      v.project(this.camera);
      if (v.z > 1) { el.style.display = 'none'; return; }
      el.style.display = 'block';
      el.style.left = ((v.x * 0.5 + 0.5) * w) + 'px';
      el.style.top = ((-v.y * 0.5 + 0.5) * h) + 'px';
      el.classList.toggle('is-selected', id === this.selected);
    });
  }

  focus(id, distFactor = 2.4) {
    const bb = this.partBox(id);
    if (!bb) return;
    const c = bb.getCenter(new THREE.Vector3());
    const rec = this.parts.get(id);
    const o0 = rec.objects[0];
    if (o0 && o0.userData.homePos) c.add(o0.position.clone().sub(o0.userData.homePos));
    const size = bb.getSize(new THREE.Vector3()).length() || 1;
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    const to = c.clone().addScaledVector(dir, Math.max(size * distFactor, 0.6));
    this._tweenCamera(to, c);
  }

  // Bounding box of the real geometry. Particle effects are skipped: dead
  // droplets are parked far off-scene and would blow the box up.
  _modelBox() {
    const b = new THREE.Box3();
    if (!this.model) return b;
    this.model.children.forEach(c => { if (!c.userData.fx && c.visible) b.expandByObject(c); });
    return b;
  }

  fitAll(pad = 1.15) {
    if (!this.model) return;
    const b = this._modelBox();
    if (b.isEmpty()) return;
    const c = b.getCenter(new THREE.Vector3());
    const r = b.getSize(new THREE.Vector3()).length() * 0.5;
    const dist = (r * pad) / Math.tan((this.camera.fov * Math.PI / 180) / 2);
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    this._tweenCamera(c.clone().addScaledVector(dir, dist), c);
  }

  setView(name) {
    const b = this._modelBox();
    if (b.isEmpty()) return;
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3()).length();
    const d = s * 0.75;
    const map = {
      iso: [c.x + d * 0.7, c.y + d * 0.5, c.z + d * 0.8],
      front: [c.x, c.y, c.z + d * 1.15],
      side: [c.x + d * 1.15, c.y, c.z],
      top: [c.x, c.y + d * 1.2, c.z + 0.001]
    };
    this._tweenCamera(new THREE.Vector3(...(map[name] || map.iso)), c);
  }

  _tweenCamera(toPos, toTarget) {
    this._dirty = true;
    this._tween = {
      fromPos: this.camera.position.clone(),
      toPos,
      fromT: this.controls.target.clone(),
      toT: toTarget,
      t: 0
    };
  }

  resize() {
    this._dirty = true;
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _loop() {
    const tick = () => {
      this._raf = requestAnimationFrame(tick);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      if (!this.active || document.hidden) return;   // idle while off-screen
      if (!this.alwaysRender && !this._dirty && !this._tween && !this.controls.autoRotate) return;
      if (this._tween) {
        this._tween.t = Math.min(1, this._tween.t + dt * 2.2);
        const e = 1 - Math.pow(1 - this._tween.t, 3);
        this.camera.position.lerpVectors(this._tween.fromPos, this._tween.toPos, e);
        this.controls.target.lerpVectors(this._tween.fromT, this._tween.toT, e);
        if (this._tween.t >= 1) this._tween = null;
      }
      this.controls.update();
      this.onFrame(dt);
      this._updateLabels();
      this.renderer.render(this.scene, this.camera);
      this._dirty = false;
    };
    tick();
  }

  setActive(on) {
    this.active = !!on;
    if (on) { this.clock.getDelta(); this.resize(); this.invalidate(); }
  }

  invalidate() { this._dirty = true; }

  setAutoRotate(on) {
    this.controls.autoRotate = on;
    this.controls.autoRotateSpeed = 0.9;
  }
}

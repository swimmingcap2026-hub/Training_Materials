import * as THREE from 'three';

// Materials are DoubleSide so cross-section clipping still shows solid walls.
export function mat(color, o = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: o.metalness ?? 0.25,
    roughness: o.roughness ?? 0.5,
    side: THREE.DoubleSide,
    transparent: !!o.transparent,
    opacity: o.opacity ?? 1,
    emissive: new THREE.Color(0x000000)
  });
}

export function box(w, h, d, color, o = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, o));
  m.position.set(o.x || 0, o.y || 0, o.z || 0);
  return m;
}

export function cyl(rTop, rBot, h, color, o = {}) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBot, h, o.seg || 28, 1, !!o.open),
    mat(color, o)
  );
  m.position.set(o.x || 0, o.y || 0, o.z || 0);
  if (o.rx) m.rotation.x = o.rx;
  if (o.rz) m.rotation.z = o.rz;
  return m;
}

export function tube(points, radius, color, o = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const m = new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(16, points.length * 8), radius, 10, false),
    mat(color, o)
  );
  return m;
}

export function torus(r, tubeR, color, o = {}) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tubeR, 10, o.seg || 36), mat(color, o));
  m.position.set(o.x || 0, o.y || 0, o.z || 0);
  m.rotation.x = o.rx ?? Math.PI / 2;
  return m;
}

// Lathe profile helper: pts = [[radius, y], ...]
export function lathe(pts, color, o = {}) {
  const v = pts.map(p => new THREE.Vector2(p[0], p[1]));
  const m = new THREE.Mesh(new THREE.LatheGeometry(v, o.seg || 48), mat(color, o));
  m.position.set(o.x || 0, o.y || 0, o.z || 0);
  return m;
}

// A part group: everything registered under one partId is selectable as a unit.
export function part(id, opts = {}) {
  const g = new THREE.Group();
  g.name = id;
  g.userData.partId = id;
  g.userData.shell = !!opts.shell;
  if (opts.explode) g.userData.explodeDir = new THREE.Vector3(...opts.explode);
  return g;
}

// Mark every mesh under a group so raycasting can resolve the owning part.
export function tagPart(group, refs) {
  const id = group.userData.partId;
  if (refs) Object.assign(group.userData, refs);
  group.traverse(o => {
    if (o.isMesh) {
      o.userData.partId = id;
      o.userData.shell = group.userData.shell || o.userData.shell;
      o.userData.baseColor = o.material.color.getHex();
      o.userData.baseOpacity = o.material.opacity;
      o.userData.baseTransparent = o.material.transparent;
    }
  });
  return group;
}

export function addAll(parent, ...children) {
  children.forEach(c => parent.add(c));
  return parent;
}

// Repeated small bolts / holes without a mesh per item.
export function instanced(geo, color, transforms, o = {}) {
  const m = new THREE.InstancedMesh(geo, mat(color, o), transforms.length);
  const dummy = new THREE.Object3D();
  transforms.forEach((t, i) => {
    dummy.position.set(t[0], t[1], t[2]);
    if (t[3]) dummy.rotation.set(t[3], t[4] || 0, t[5] || 0);
    else dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    m.setMatrixAt(i, dummy.matrix);
  });
  m.instanceMatrix.needsUpdate = true;
  return m;
}

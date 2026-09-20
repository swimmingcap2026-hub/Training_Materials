import * as THREE from 'three';
import { mat, box, cyl, tube, torus, lathe, part, tagPart, instanced } from './three-helpers.js';

// ---------------------------------------------------------------------------
// Single spin-clean process chamber, detailed and animatable.
// Wafer radius 0.15 (= 300 mm wafer), chamber roughly 1.2 units across.
// Returns { root, refs } where refs are the movable pieces the animation drives.
// ---------------------------------------------------------------------------

const WAFER_R = 0.15;
const WAFER_Y = 0.70;

function housing() {
  const g = part('ch_housing', { shell: true, explode: [0, 0.6, 0] });
  const o = { roughness: 0.3, metalness: 0.1 };
  const w = 1.22, d = 1.22, h = 1.3, y0 = 0.05;
  const L = box(0.025, h, d, 0xe3ebf2, { ...o, x: -w / 2, y: y0 + h / 2 }); L.userData.ex = [-1, 0, 0];
  const R = box(0.025, h, d, 0xe3ebf2, { ...o, x: w / 2, y: y0 + h / 2 }); R.userData.ex = [1, 0, 0];
  const B = box(w, h, 0.025, 0xe3ebf2, { ...o, z: -d / 2, y: y0 + h / 2 }); B.userData.ex = [0, 0, -1];
  const T = box(w, 0.025, d, 0xeef3f8, { ...o, y: y0 + h }); T.userData.ex = [0, 1, 0];
  const F = box(w, 0.05, d, 0xc9d6e2, { ...o, y: 0.03 }); F.userData.ex = [0, -1, 0];
  g.add(L, R, B, T, F);
  // corner posts give the housing its shape even when panels are transparent
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    g.add(box(0.05, h, 0.05, 0xb6c4d2, { x: sx * w / 2, y: y0 + h / 2, z: sz * d / 2, metalness: 0.4 }));
  });
  return tagPart(g);
}

function shutter() {
  const g = part('ch_window', { explode: [0, 0, 1.0] });
  const door = box(0.62, 0.34, 0.03, 0x9bd1ff, { y: 0.78, z: 0.61, transparent: true, opacity: 0.35, roughness: 0.05 });
  door.userData.shell = true;
  g.add(door);
  const railTop = box(0.68, 0.025, 0.025, 0x8fa6b8, { y: 0.98, z: 0.61, metalness: 0.5 });
  const railBot = box(0.68, 0.025, 0.025, 0x8fa6b8, { y: 0.585, z: 0.61, metalness: 0.5 });
  [railTop, railBot].forEach(r => { r.userData.shell = true; g.add(r); });
  // pneumatic cylinder that lifts the shutter
  g.add(cyl(0.035, 0.035, 0.3, 0x455a64, { x: 0.41, y: 1.12, z: 0.61, metalness: 0.7 }));
  g.add(cyl(0.012, 0.012, 0.16, 0xcfd8dc, { x: 0.41, y: 0.95, z: 0.61, metalness: 0.9 }));
  // view window on the front panel
  const win = box(0.3, 0.22, 0.02, 0xd6ecff, { x: -0.35, y: 1.0, z: 0.61, transparent: true, opacity: 0.4 });
  g.add(win);
  return tagPart(g, { door });
}

function spinChuck() {
  const g = part('spin_chuck', { explode: [0, 0.35, 0] });
  g.add(cyl(0.115, 0.105, 0.04, 0x2f80ed, { y: 0.648, metalness: 0.35, roughness: 0.35 }));
  g.add(cyl(0.125, 0.125, 0.012, 0x1b5fbf, { y: 0.624 }));
  // radial spokes out to the grip-pin ring
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(box(0.06, 0.014, 0.03, 0x1b5fbf, { x: Math.cos(a) * 0.132, y: 0.648, z: Math.sin(a) * 0.132 }));
  }
  // lightening pockets on the underside
  const pockets = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pockets.push([Math.cos(a) * 0.07, 0.624, Math.sin(a) * 0.07]);
  }
  g.add(instanced(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 12), 0x154a96, pockets));
  g.add(cyl(0.06, 0.06, 0.05, 0x1b5fbf, { y: 0.61 }));
  return tagPart(g);
}

function gripPins() {
  const g = part('chuck_pin', { explode: [0, 0.55, 0] });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * 0.152, z = Math.sin(a) * 0.152;
    g.add(cyl(0.012, 0.014, 0.055, 0xf2994a, { x, y: 0.695, metalness: 0.2, roughness: 0.4 }));
    // contact tip that grips the wafer edge
    g.add(cyl(0.008, 0.012, 0.016, 0xffd8a8, { x, y: 0.723 }));
    // eccentric shaft + centrifugal counterweight
    g.add(cyl(0.007, 0.007, 0.05, 0xb06a25, { x, y: 0.655 }));
    g.add(box(0.03, 0.014, 0.02, 0x8c5316, { x: x * 0.86, y: 0.64, z: z * 0.86 }));
  }
  return tagPart(g);
}

function wafer() {
  const g = part('wafer', { explode: [0, 0.8, 0] });
  const disc = cyl(WAFER_R, WAFER_R, 0.005, 0x9fb0c4, { y: WAFER_Y, seg: 64, metalness: 0.8, roughness: 0.12 });
  g.add(disc);
  g.add(torus(WAFER_R - 0.002, 0.0035, 0x7d8ea3, { y: WAFER_Y, seg: 64 }));
  // notch marker at the edge
  g.add(box(0.014, 0.007, 0.014, 0x37474f, { x: WAFER_R - 0.006, y: WAFER_Y }));
  // die grid hint on the top surface
  const dies = [];
  for (let ix = -4; ix <= 4; ix++) for (let iz = -4; iz <= 4; iz++) {
    const x = ix * 0.032, z = iz * 0.032;
    if (Math.hypot(x, z) < WAFER_R - 0.022) dies.push([x, WAFER_Y + 0.003, z]);
  }
  g.add(instanced(new THREE.BoxGeometry(0.026, 0.0012, 0.026), 0xc3d0de, dies, { metalness: 0.45, roughness: 0.25 }));
  return tagPart(g);
}

function spindle() {
  const g = part('spindle_motor', { explode: [0, -0.7, 0] });
  // direct-drive motor housing with cooling fins
  g.add(cyl(0.13, 0.13, 0.2, 0xeb5757, { y: 0.4, metalness: 0.5, roughness: 0.4 }));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    g.add(box(0.03, 0.18, 0.012, 0xc0392b, { x: Math.cos(a) * 0.14, y: 0.4, z: Math.sin(a) * 0.14 }));
  }
  // encoder can
  g.add(cyl(0.07, 0.07, 0.06, 0x7b241c, { y: 0.27 }));
  // hollow shaft + ferrofluidic seal + N2 purge fitting
  g.add(cyl(0.05, 0.05, 0.16, 0xd35400, { y: 0.575, metalness: 0.6 }));
  g.add(cyl(0.065, 0.065, 0.03, 0x515a5a, { y: 0.52, metalness: 0.8 }));
  g.add(cyl(0.014, 0.014, 0.12, 0x27ae60, { x: 0.1, y: 0.52, rz: Math.PI / 2, metalness: 0.7 }));
  return tagPart(g);
}

function backNozzle() {
  const g = part('back_nozzle', { explode: [0, -0.45, -0.5] });
  g.add(cyl(0.016, 0.016, 0.44, 0x56ccf2, { y: 0.45, metalness: 0.3 }));
  g.add(cyl(0.02, 0.01, 0.03, 0x2196f3, { y: 0.678 }));
  // feed line coming up through the base with a rotary union
  g.add(cyl(0.03, 0.03, 0.05, 0x78909c, { y: 0.22, metalness: 0.8 }));
  g.add(tube([[0, 0.2, 0], [0.12, 0.16, 0], [0.3, 0.14, 0.1], [0.45, 0.14, 0.2]], 0.014, 0x56ccf2));
  return tagPart(g);
}

function liftPins() {
  const g = part('lift_pin', { explode: [0, -0.3, 0] });
  const pins = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    pins.add(cyl(0.008, 0.008, 0.1, 0xf2c94c, { x: Math.cos(a) * 0.12, y: 0.66, z: Math.sin(a) * 0.12, metalness: 0.4 }));
    pins.add(cyl(0.011, 0.006, 0.014, 0xfff3cd, { x: Math.cos(a) * 0.12, y: 0.714, z: Math.sin(a) * 0.12 }));
  }
  g.add(pins);
  // lift ring + actuator
  g.add(torus(0.12, 0.008, 0xd4a017, { y: 0.6 }));
  g.add(cyl(0.02, 0.02, 0.12, 0x9e7b1f, { x: 0.12, y: 0.54, metalness: 0.6 }));
  return tagPart(g, { pins });
}

function cupAssembly() {
  const g = part('cup_assy', { explode: [0, 0.45, 0] });
  const movable = new THREE.Group();
  // three concentric lathe baffles: each catches one chemistry level
  const profiles = [
    { pts: [[0.20, 0.00], [0.22, 0.10], [0.28, 0.24], [0.30, 0.34], [0.27, 0.40], [0.26, 0.41]], c: 0x7fb3d5 },
    { pts: [[0.30, 0.00], [0.32, 0.10], [0.37, 0.26], [0.39, 0.36], [0.36, 0.43], [0.35, 0.44]], c: 0x5d9ec9 },
    { pts: [[0.40, 0.00], [0.42, 0.12], [0.46, 0.28], [0.48, 0.38], [0.45, 0.46], [0.44, 0.47]], c: 0x4489bd }
  ];
  profiles.forEach((p, i) => {
    const m = lathe(p.pts, p.c, { y: 0.30, seg: 56, transparent: true, opacity: 0.42, roughness: 0.2 });
    m.userData.shell = true;   // x-ray mode looks straight through the cup
    movable.add(m);
  });
  // collection gutters at the bottom of each baffle
  [0.25, 0.345, 0.44].forEach((r, i) => {
    movable.add(torus(r, 0.022, [0x27ae60, 0x2f80ed, 0xf2994a][i], { y: 0.31 }));
  });
  g.add(movable);
  return tagPart(g, { movable });
}

function cupBase() {
  const g = part('cup_base', { explode: [0, -0.9, 0] });
  g.add(cyl(0.5, 0.52, 0.1, 0x6b7a8f, { y: 0.15, metalness: 0.45 }));
  g.add(torus(0.46, 0.02, 0x54606f, { y: 0.21 }));
  // guide rods + elevation cylinders
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.9;
    const x = Math.cos(a) * 0.42, z = Math.sin(a) * 0.42;
    g.add(cyl(0.016, 0.016, 0.42, 0xbdc3c7, { x, y: 0.38, z, metalness: 0.9, roughness: 0.15 }));
    g.add(cyl(0.032, 0.032, 0.12, 0x34495e, { x, y: 0.22, z, metalness: 0.6 }));
  }
  // in-position proximity switches
  [0.2, 0.32, 0.44].forEach((y, i) => g.add(box(0.03, 0.02, 0.03, 0x00e676, { x: 0.46, y: y + 0.1, z: 0.12 })));
  return tagPart(g);
}

function drainPorts() {
  const g = part('drain_ports', { explode: [-0.9, -0.5, 0] });
  const colors = [0x27ae60, 0x2f80ed, 0xf2994a]; // reclaim / alkaline / acid
  colors.forEach((c, i) => {
    const a = Math.PI * (0.75 + i * 0.22);
    const x = Math.cos(a) * 0.45, z = Math.sin(a) * 0.45;
    g.add(tube([[x, 0.14, z], [x * 1.4, 0.06, z * 1.4], [x * 1.9, -0.05, z * 1.9]], 0.032, c));
    g.add(cyl(0.05, 0.05, 0.06, 0x546e7a, { x: x * 1.45, y: 0.04, z: z * 1.45, metalness: 0.6 }));
    // segregation valve actuator
    g.add(box(0.06, 0.07, 0.06, 0x37474f, { x: x * 1.7, y: 0.06, z: z * 1.7 }));
  });
  return tagPart(g);
}

function exhaustPort() {
  const g = part('exhaust_port', { explode: [0, -0.3, -1.0] });
  g.add(tube([[0, 0.2, -0.45], [0, 0.16, -0.62], [0, 0.1, -0.8]], 0.075, 0x9aa5b1));
  g.add(cyl(0.1, 0.1, 0.08, 0x607d8b, { y: 0.14, z: -0.72, rx: Math.PI / 2.4, metalness: 0.6 }));
  // damper blade + position indicator
  g.add(box(0.13, 0.01, 0.13, 0xffc107, { y: 0.14, z: -0.72, rx: 0.6 }));
  g.add(box(0.04, 0.05, 0.04, 0xff6f00, { x: 0.11, y: 0.17, z: -0.72 }));
  // gas/liquid separation baffle inside the cup base
  g.add(torus(0.47, 0.012, 0x90a4ae, { y: 0.12 }));
  return tagPart(g);
}

function topPlate() {
  const g = part('top_plate', { explode: [0, 1.0, 0] });
  g.add(cyl(0.46, 0.46, 0.022, 0xa0d8ef, { y: 1.2, seg: 48, transparent: true, opacity: 0.9 }));
  // perforation pattern
  const holes = [];
  for (let r = 0.06; r <= 0.42; r += 0.06) {
    const n = Math.max(6, Math.round(r * 90));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      holes.push([Math.cos(a) * r, 1.2, Math.sin(a) * r]);
    }
  }
  g.add(instanced(new THREE.CylinderGeometry(0.008, 0.008, 0.026, 6), 0x5b9bd5, holes));
  // N2 plenum above it
  g.add(cyl(0.48, 0.44, 0.1, 0xcfe8f7, { y: 1.27, transparent: true, opacity: 0.4 }));
  g.add(cyl(0.035, 0.035, 0.12, 0x27ae60, { x: 0.3, y: 1.36, metalness: 0.6 }));
  return tagPart(g);
}

function swingArm(id, opts) {
  // Pivot sits on a radius outside the cup; at armAngle = 0 the nozzle is over
  // the wafer center, and the home angle swings it out over its standby pot.
  const g = part(id, { explode: opts.explode });
  const px = opts.px, pz = opts.pz, py = opts.py;
  const len = Math.hypot(px, pz);

  // support column + rotary actuator
  g.add(cyl(0.028, 0.032, 0.46, 0x9fb1c0, { x: px, y: py - 0.23, z: pz, metalness: 0.55 }));
  g.add(cyl(0.05, 0.05, 0.07, 0x6b7f91, { x: px, y: py - 0.46, z: pz, metalness: 0.65 }));
  g.add(cyl(0.05, 0.05, 0.05, opts.color, { x: px, y: py + 0.02, z: pz, metalness: 0.4 }));

  const holder = new THREE.Group();
  holder.position.set(px, 0, pz);
  holder.rotation.y = -Math.atan2(pz, px);

  const arm = new THREE.Group();
  arm.add(box(len, 0.038, 0.055, opts.color, { x: -len / 2, y: py, metalness: 0.3, roughness: 0.4 }));
  arm.add(box(len * 0.9, 0.012, 0.02, opts.colorDark || opts.color, { x: -len / 2, y: py + 0.025 }));
  arm.add(tube([[0, py + 0.045, 0], [-len * 0.5, py + 0.075, 0], [-len, py + 0.02, 0]], 0.009, opts.nozzleColor));

  const head = new THREE.Group();
  head.position.set(-len, py, 0);
  head.add(box(0.055, 0.045, 0.05, opts.nozzleColor, { y: 0.005 }));
  head.add(cyl(0.022, 0.015, 0.075, opts.nozzleColor, { y: -0.05 }));
  if (opts.second) head.add(cyl(0.015, 0.011, 0.065, opts.second, { x: 0.045, y: -0.045 }));
  if (opts.transducer) head.add(box(0.09, 0.05, 0.06, opts.transducer, { x: 0.075, y: 0.03 }));
  arm.add(head);

  arm.rotation.y = opts.home;
  holder.add(arm);
  g.add(holder);

  // resolve where the nozzle sits at the home angle -> that is the standby pot
  g.updateMatrixWorld(true);
  const tip = new THREE.Vector3(0, -0.06, 0);
  head.localToWorld(tip);

  tagPart(g, { arm, head, tipY: py });
  g.userData.potPos = tip;
  return g;
}

function standbyPots(positions) {
  const g = part('nozzle_standby', { explode: [0.3, -0.3, 0.9] });
  positions.forEach(p => {
    g.add(cyl(0.062, 0.055, 0.1, 0x6fcf97, { x: p.x, y: p.y - 0.07, z: p.z, open: true }));
    g.add(cyl(0.05, 0.05, 0.02, 0x2ecc71, { x: p.x, y: p.y - 0.1, z: p.z, transparent: true, opacity: 0.75 }));
    // drain leg back to the cup base
    g.add(cyl(0.014, 0.014, 0.2, 0x27ae60, { x: p.x, y: p.y - 0.22, z: p.z }));
    g.add(box(0.05, 0.03, 0.05, 0x1e8449, { x: p.x, y: p.y - 0.33, z: p.z }));
  });
  return tagPart(g);
}

function sensors() {
  const g = part('ch_sensors', { explode: [-1.0, 0.2, -0.5] });
  // flow meters on the inlet lines
  [[-0.5, 1.0], [-0.5, 0.88], [-0.5, 0.76]].forEach(([x, y], i) => {
    g.add(cyl(0.028, 0.028, 0.1, [0x2f80ed, 0x56ccf2, 0xbb6bd9][i], { x, y, z: -0.45, rz: Math.PI / 2, metalness: 0.5 }));
    g.add(box(0.05, 0.05, 0.03, 0xe74c3c, { x, y: y + 0.045, z: -0.45 }));
  });
  // outlet thermocouple
  g.add(cyl(0.012, 0.012, 0.12, 0xe74c3c, { x: -0.36, y: 0.98, z: -0.45 }));
  // drain clog / level probe
  g.add(cyl(0.01, 0.01, 0.3, 0xff7043, { x: -0.4, y: 0.3, z: 0.25 }));
  // wafer-present optical sensor aimed across the chuck
  g.add(box(0.04, 0.04, 0.04, 0xff1744, { x: -0.3, y: 0.74, z: 0.4 }));
  g.add(box(0.04, 0.04, 0.04, 0xff1744, { x: 0.3, y: 0.74, z: 0.4 }));
  // signal junction box
  g.add(box(0.14, 0.18, 0.06, 0xb71c1c, { x: -0.52, y: 0.5, z: -0.45 }));
  return tagPart(g);
}

// --- liquid effects -------------------------------------------------------
function liquidFx() {
  const grp = new THREE.Group();
  grp.userData.fx = true;

  const streamMat = new THREE.MeshStandardMaterial({
    color: 0x56ccf2, transparent: true, opacity: 0.9, roughness: 0.08, metalness: 0.05,
    emissive: new THREE.Color(0x27506b), emissiveIntensity: 0.5, side: THREE.DoubleSide
  });
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.017, 1, 14), streamMat);
  stream.visible = false;
  grp.add(stream);

  const filmMat = new THREE.MeshStandardMaterial({
    color: 0x56ccf2, transparent: true, opacity: 0.6, roughness: 0.03,
    metalness: 0.15, side: THREE.DoubleSide
  });
  const film = new THREE.Mesh(new THREE.CylinderGeometry(WAFER_R, WAFER_R, 0.006, 56), filmMat);
  film.position.y = WAFER_Y + 0.006;
  film.visible = false;
  grp.add(film);

  const backStream = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.01, 0.03, 10), streamMat.clone());
  backStream.position.set(0, WAFER_Y - 0.02, 0);
  backStream.visible = false;
  grp.add(backStream);

  // throw-off droplets
  const N = 420;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x56ccf2, size: 0.012, transparent: true, opacity: 0.85, depthWrite: false });
  const points = new THREE.Points(pGeo, pMat);
  points.visible = false;
  points.userData = { vel, alive: new Float32Array(N) };
  grp.add(points);

  return { grp, stream, film, backStream, points };
}

export function buildChamber() {
  const root = new THREE.Group();
  root.name = 'chamber';

  const h = housing();
  const sh = shutter();
  const chuck = spinChuck();
  const pins = gripPins();
  const waf = wafer();
  const spin = spindle();
  const back = backNozzle();
  const lift = liftPins();
  const cup = cupAssembly();
  const cbase = cupBase();
  const drains = drainPorts();
  const exh = exhaustPort();
  const top = topPlate();
  const R = 0.55, PY = 0.92;
  const at = deg => ({ px: Math.cos(deg * Math.PI / 180) * R, pz: Math.sin(deg * Math.PI / 180) * R });
  const SWING = 1.154;   // swings the nozzle clear of the wafer, over its pot

  const chemArm = swingArm('chem_arm', {
    ...at(35), py: PY, color: 0x9b51e0, colorDark: 0x6c3483, nozzleColor: 0xbb6bd9,
    home: -SWING, explode: [0.9, 0.5, 0.5]
  });
  const rinseArm = swingArm('rinse_arm', {
    ...at(145), py: PY, color: 0x27ae60, colorDark: 0x196f3d, nozzleColor: 0x56ccf2,
    second: 0xbb6bd9, home: SWING, explode: [-0.9, 0.5, 0.5]
  });
  const tfArm = swingArm('two_fluid_nozzle', {
    ...at(265), py: PY + 0.06, color: 0x00b8a9, colorDark: 0x00796b, nozzleColor: 0x26c6da,
    transducer: 0x00695c, home: -SWING, explode: [0.3, 0.6, -0.9]
  });

  // the chemical nozzle tip is its own selectable part, riding on the arm head
  const chemNozzle = part('chem_nozzle', { explode: [0.9, 0.8, 0.5] });
  chemNozzle.add(cyl(0.028, 0.018, 0.055, 0xd291f0, { y: -0.055 }));
  chemNozzle.add(torus(0.026, 0.006, 0x8e44ad, { y: -0.028 }));
  tagPart(chemNozzle);
  chemArm.userData.head.add(chemNozzle);

  const pots = standbyPots([chemArm.userData.potPos, rinseArm.userData.potPos, tfArm.userData.potPos]);
  const sens = sensors();

  const fx = liquidFx();

  [h, sh, chuck, pins, waf, spin, back, lift, cup, cbase, drains, exh, top,
    chemArm, rinseArm, tfArm, pots, sens].forEach(p => root.add(p));
  root.add(fx.grp);

  // chuck + grip pins + wafer + lift pins all turn with the spindle
  const refs = {
    rotor: [chuck, pins, waf, lift.userData.pins],
    wafer: waf,
    cup: cup.userData.movable,
    chemArm: chemArm.userData.arm,
    rinseArm: rinseArm.userData.arm,
    twoFluidArm: tfArm.userData.arm,
    chemHead: chemArm.userData.head,
    rinseHead: rinseArm.userData.head,
    tfHead: tfArm.userData.head,
    shutterDoor: sh.userData.door,
    liftPins: lift.userData.pins,
    swing: SWING,
    fx
  };
  return { root, refs, WAFER_R, WAFER_Y };
}

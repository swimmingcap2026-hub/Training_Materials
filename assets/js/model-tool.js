import * as THREE from 'three';
import { mat, box, cyl, tube, torus, part, tagPart, addAll, instanced } from './three-helpers.js';

// ---------------------------------------------------------------------------
// Full SU-3200 style tool: EFEM + 12 process chambers + fluid & utility decks
// Coordinates: X = width (-1.8..1.8), Y = height (0..2.3), Z = depth
//              (+Z = operator side / front)
// ---------------------------------------------------------------------------
const C = {
  frameGray: 0x8792a8,
  panel: 0xdfe6ee,
  chamber: 0x00b8a9,
  chamberDark: 0x12808a,
  steel: 0x9aa5b1
};

const CHAMBER_POS = [];
for (const [ci, cx] of [-1.15, 0, 1.15].entries()) {
  for (const cz of [0.02, -1.0]) {
    for (const cy of [0.56, 1.33]) CHAMBER_POS.push({ x: cx, y: cy, z: cz, ci });
  }
}
export { CHAMBER_POS };

function frame() {
  const g = part('frame', { explode: [0, -0.6, 0] });
  // base plinth
  g.add(box(3.66, 0.22, 2.66, C.frameGray, { y: 0.11, metalness: 0.6, roughness: 0.4 }));
  // leveling feet
  [-1.6, 0, 1.6].forEach(x => [-1.15, 1.15].forEach(z => {
    g.add(cyl(0.06, 0.08, 0.1, 0x6b7a8f, { x, y: 0.05, z, metalness: 0.8 }));
  }));
  // corner + mid columns
  [-1.78, -0.6, 0.6, 1.78].forEach(x => [-1.28, 1.28].forEach(z => {
    g.add(box(0.07, 2.0, 0.07, C.frameGray, { x, y: 1.22, z, metalness: 0.6 }));
  }));
  // horizontal rails
  [0.28, 1.2, 2.16].forEach(y => {
    g.add(box(3.6, 0.06, 0.06, C.frameGray, { y, z: -1.28, metalness: 0.6 }));
    g.add(box(3.6, 0.06, 0.06, C.frameGray, { y, z: 1.28, metalness: 0.6 }));
    g.add(box(0.06, 0.06, 2.6, C.frameGray, { y, x: -1.78, metalness: 0.6 }));
    g.add(box(0.06, 0.06, 2.6, C.frameGray, { y, x: 1.78, metalness: 0.6 }));
  });
  // mid deck plate separating process bay from fluid bay
  g.add(box(3.5, 0.05, 1.8, 0x7e8ba3, { y: 0.45, z: -0.45, metalness: 0.5 }));
  return tagPart(g);
}

function enclosure() {
  const g = part('enclosure', { shell: true, explode: [0, 0.25, 0] });
  const o = { transparent: false, roughness: 0.35, metalness: 0.1 };
  const L = box(0.03, 1.95, 2.6, C.panel, { ...o, x: -1.81, y: 1.22 }); L.userData.ex = [-1, 0, 0];
  const R = box(0.03, 1.95, 2.6, C.panel, { ...o, x: 1.81, y: 1.22 }); R.userData.ex = [1, 0, 0];
  const B = box(3.6, 1.95, 0.03, C.panel, { ...o, z: -1.31, y: 1.22 }); B.userData.ex = [0, 0, -1];
  const T = box(3.62, 0.03, 2.62, C.panel, { ...o, y: 2.2 }); T.userData.ex = [0, 1, 0];
  g.add(L, R, B, T);
  // front maintenance doors below the EFEM with window slots
  [-1.2, -0.4, 0.4, 1.2].forEach((x, i) => {
    const d = box(0.76, 0.6, 0.025, i % 2 ? 0xe8eef5 : C.panel, { ...o, x, y: 0.62, z: 1.3 });
    d.userData.ex = [0, 0, 1];
    g.add(d);
    const win = box(0.5, 0.18, 0.01, 0x9bd1ff, { x, y: 0.75, z: 1.315, transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.05 });
    win.userData.ex = [0, 0, 1];
    g.add(win);
    const handle = cyl(0.012, 0.012, 0.16, 0x5b6b83, { x: x + 0.3, y: 0.55, z: 1.33, rx: Math.PI / 2, metalness: 0.9 });
    handle.userData.ex = [0, 0, 1];
    g.add(handle);
  });
  // upper front fascia closing the EFEM face, plus fillers between load ports
  const fascia = box(3.6, 0.28, 0.03, 0xeaf0f6, { ...o, y: 1.84, z: 1.16 });
  fascia.userData.ex = [0, 0, 1];
  g.add(fascia);
  [-1.8, -0.9, 0, 0.9, 1.8].forEach(x => {
    const f = box(0.19, 0.92, 0.03, 0xeaf0f6, { ...o, x, y: 1.24, z: 1.16 });
    f.userData.ex = [0, 0, 1];
    g.add(f);
  });
  // kick plate under the load ports
  const kick = box(3.6, 0.14, 0.03, 0xd6dfe9, { ...o, y: 0.86, z: 1.16 });
  kick.userData.ex = [0, 0, 1];
  g.add(kick);
  // side service panels with louvres
  [-1.825, 1.825].forEach(x => {
    for (let i = 0; i < 5; i++) {
      const lv = box(0.012, 0.03, 1.6, 0xc8d3e0, { x, y: 1.55 + i * 0.07, z: -0.2, metalness: 0.3 });
      lv.userData.ex = [Math.sign(x), 0, 0];
      g.add(lv);
    }
  });
  return tagPart(g);
}

function loadPorts() {
  const g = part('load_port', { explode: [0, 0, 1] });
  [-1.35, -0.45, 0.45, 1.35].forEach(x => {
    // port plate
    g.add(box(0.72, 1.0, 0.07, 0x2f80ed, { x, y: 1.28, z: 1.19, metalness: 0.4 }));
    // opening frame
    g.add(box(0.56, 0.44, 0.04, 0x1a5fb4, { x, y: 1.33, z: 1.23 }));
    // FOUP table with kinematic pins
    g.add(box(0.62, 0.05, 0.42, 0x4a90e2, { x, y: 1.06, z: 1.4, metalness: 0.5 }));
    [[-0.18, 0.12], [0.18, 0.12], [0, -0.16]].forEach(([dx, dz]) => {
      g.add(cyl(0.016, 0.022, 0.05, 0xf5f7fa, { x: x + dx, y: 1.11, z: 1.4 + dz, metalness: 0.8 }));
    });
    // mapping sensor head + N2 purge nozzles
    g.add(box(0.05, 0.05, 0.05, 0xff5252, { x: x + 0.26, y: 1.5, z: 1.26 }));
    [-0.15, 0.15].forEach(dx => g.add(cyl(0.012, 0.012, 0.06, 0x27ae60, { x: x + dx, y: 1.05, z: 1.4, metalness: 0.7 })));
    // status lamp strip
    g.add(box(0.5, 0.025, 0.02, 0x27e07a, { x, y: 0.82, z: 1.24 }));
  });
  return tagPart(g);
}

function foups() {
  const g = part('foup', { explode: [0, 0.5, 1.2] });
  [-1.35, -0.45, 0.45, 1.35].forEach((x, i) => {
    const body = box(0.5, 0.42, 0.44, 0xf2994a, { x, y: 1.3, z: 1.42, roughness: 0.45, metalness: 0.05 });
    g.add(body);
    // top handle + shell ribs
    g.add(box(0.2, 0.05, 0.1, 0xd9822b, { x, y: 1.54, z: 1.42 }));
    [-0.13, 0.13].forEach(dz => g.add(box(0.5, 0.02, 0.02, 0xd9822b, { x, y: 1.5, z: 1.42 + dz })));
    // wafer stack visible inside (a carrier holds 25)
    for (let s = 0; s < 9; s++) {
      g.add(cyl(0.2, 0.2, 0.004, 0xcdd7e2, { x, y: 1.14 + s * 0.042, z: 1.42, rx: 0, seg: 22, metalness: 0.6, roughness: 0.25 }));
    }
    // ID label
    g.add(box(0.14, 0.08, 0.005, 0xffffff, { x, y: 1.18, z: 1.645 }));
  });
  return tagPart(g);
}

function efemBody() {
  const g = part('efem_body', { shell: true, explode: [0, 0, 0.7] });
  const o = { transparent: false, roughness: 0.3 };
  g.add(box(3.6, 0.9, 0.72, 0xd9e2ec, { ...o, y: 1.35, z: 0.78 }));
  // inner floor + perforated return grille
  g.add(box(3.5, 0.03, 0.66, 0xb9c6d6, { y: 0.92, z: 0.78 }));
  const holes = [];
  for (let i = -16; i <= 16; i++) for (let j = -3; j <= 3; j++) holes.push([i * 0.1, 0.935, 0.78 + j * 0.09]);
  g.add(instanced(new THREE.CylinderGeometry(0.018, 0.018, 0.035, 8), 0x7f8fa6, holes));
  return tagPart(g);
}

function ffu() {
  const g = part('ffu', { explode: [0, 1.1, 0] });
  g.add(box(3.5, 0.16, 0.7, 0x27ae60, { y: 1.9, z: 0.78, metalness: 0.3 }));
  // ULPA media face
  g.add(box(3.4, 0.03, 0.62, 0xe9f7ef, { y: 1.81, z: 0.78 }));
  // blower housings
  [-1.2, -0.4, 0.4, 1.2].forEach(x => {
    g.add(cyl(0.16, 0.16, 0.12, 0x1e8449, { x, y: 2.02, z: 0.78, metalness: 0.5 }));
    g.add(cyl(0.05, 0.05, 0.06, 0x145a32, { x, y: 2.1, z: 0.78 }));
  });
  // a second FFU over the process bay
  g.add(box(3.4, 0.14, 1.5, 0x27ae60, { y: 1.92, z: -0.5, metalness: 0.3 }));
  g.add(box(3.3, 0.03, 1.42, 0xe9f7ef, { y: 1.84, z: -0.5 }));
  return tagPart(g);
}

function atmRobot() {
  const g = part('atm_robot', { explode: [0, 0.8, 0.3] });
  const base = new THREE.Group();
  base.add(cyl(0.16, 0.18, 0.12, 0xb8860b, { y: 1.0, z: 0.78, metalness: 0.7 }));
  base.add(cyl(0.11, 0.11, 0.22, 0xf2c94c, { y: 1.15, z: 0.78, metalness: 0.6 }));
  // shoulder + two SCARA links + two end effectors (dual arm)
  const arm = (yy, ang, col) => {
    const a = new THREE.Group();
    const l1 = box(0.42, 0.055, 0.1, col, { x: 0.21, y: yy, z: 0.78, metalness: 0.5 });
    const j = cyl(0.045, 0.045, 0.07, 0xdaa520, { x: 0.42, y: yy, z: 0.78 });
    const l2 = box(0.36, 0.045, 0.085, col, { x: 0.6, y: yy, z: 0.78, metalness: 0.5 });
    // blade end effector with edge-grip pads
    const blade = box(0.3, 0.012, 0.2, 0xece9e6, { x: 0.92, y: yy, z: 0.78, metalness: 0.2, roughness: 0.4 });
    a.add(l1, j, l2, blade);
    [-0.07, 0.07].forEach(dz => a.add(cyl(0.012, 0.012, 0.02, 0xff7043, { x: 1.02, y: yy + 0.012, z: 0.78 + dz })));
    a.rotation.y = ang;
    a.position.set(0, 0, 0);
    // rotate about the column: translate pivot to origin
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, 0.78);
    a.children.forEach(c => c.position.z -= 0.78);
    pivot.add(a);
    return pivot;
  };
  base.add(arm(1.22, 0.35, 0xf2c94c));
  base.add(arm(1.32, -0.9, 0xe0a800));
  g.add(base);
  return tagPart(g);
}

function aligner() {
  const g = part('aligner', { explode: [-0.6, 0.5, 0.4] });
  g.add(cyl(0.13, 0.15, 0.1, 0x9b51e0, { x: -1.6, y: 1.0, z: 0.62, metalness: 0.5 }));
  g.add(cyl(0.1, 0.1, 0.05, 0x7d3cbd, { x: -1.6, y: 1.07, z: 0.62 }));
  g.add(cyl(0.17, 0.17, 0.006, 0xcdd7e2, { x: -1.6, y: 1.1, z: 0.62, seg: 26, metalness: 0.6 }));
  // CCD edge sensor fork
  g.add(box(0.05, 0.16, 0.05, 0x4a235a, { x: -1.44, y: 1.14, z: 0.62 }));
  g.add(box(0.05, 0.03, 0.05, 0xff5252, { x: -1.44, y: 1.09, z: 0.62 }));
  return tagPart(g);
}

function robotRail() {
  const g = part('robot_rail', { explode: [0, -0.4, 0] });
  g.add(box(3.2, 0.07, 0.16, 0x56617a, { y: 0.5, z: -0.49, metalness: 0.8, roughness: 0.25 }));
  [-0.05, 0.05].forEach(dz => g.add(box(3.2, 0.03, 0.035, 0xc0c8d4, { y: 0.545, z: -0.49 + dz, metalness: 0.95, roughness: 0.12 })));
  // bellows way cover over the rail
  for (let i = 0; i < 24; i++) {
    g.add(box(0.055, 0.1, 0.2, i % 2 ? 0x3d4657 : 0x4c5566, { x: -1.5 + i * 0.13, y: 0.42, z: -0.49 }));
  }
  // cable carrier chain
  for (let i = 0; i < 18; i++) {
    g.add(box(0.07, 0.05, 0.08, 0x2f3640, { x: -1.4 + i * 0.16, y: 0.33, z: -0.72 }));
  }
  return tagPart(g);
}

function transferRobot() {
  const g = part('transfer_robot', { explode: [0, 0.9, 0] });
  const col = new THREE.Group();
  col.add(box(0.34, 0.12, 0.34, 0xeb5757, { y: 0.6, z: -0.49, metalness: 0.5 }));
  col.add(cyl(0.11, 0.13, 0.85, 0xc0392b, { y: 1.05, z: -0.49, metalness: 0.5 }));
  // dry hand (upper) and wet hand (lower), pointing at a chamber
  const hand = (yy, ang, col1, bladeCol) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, -0.49);
    const a = new THREE.Group();
    a.add(box(0.36, 0.05, 0.09, col1, { x: 0.18, y: yy, metalness: 0.5 }));
    a.add(cyl(0.04, 0.04, 0.06, 0x922b21, { x: 0.36, y: yy }));
    a.add(box(0.32, 0.04, 0.08, col1, { x: 0.52, y: yy, metalness: 0.5 }));
    a.add(box(0.28, 0.011, 0.19, bladeCol, { x: 0.8, y: yy, metalness: 0.2, roughness: 0.35 }));
    a.add(cyl(0.15, 0.15, 0.004, 0xcdd7e2, { x: 0.86, y: yy + 0.009, seg: 24, metalness: 0.6 }));
    a.rotation.y = ang;
    pivot.add(a);
    return pivot;
  };
  col.add(hand(1.02, -0.5, 0xeb5757, 0xf5f0e8));   // dry hand
  col.add(hand(0.86, 0.75, 0xa93226, 0xcfe8f5));   // wet hand
  g.add(col);
  return tagPart(g);
}

function chamberStack() {
  const g = part('chamber_stack');
  CHAMBER_POS.forEach((p, idx) => {
    const c = new THREE.Group();
    c.userData.partId = 'chamber_stack';
    c.userData.explodeDir = new THREE.Vector3(
      p.x === 0 ? 0 : Math.sign(p.x) * 0.5,
      p.y > 1 ? 0.75 : -0.15,
      Math.sign(p.z || -1) * 0.8
    );
    // housing (flagged as shell so x-ray reveals the cup and chuck inside)
    const shellBox = box(0.94, 0.7, 0.82, C.chamber, { x: p.x, y: p.y + 0.35, z: p.z, roughness: 0.4, metalness: 0.2 });
    shellBox.userData.shell = true;
    c.add(shellBox);
    // process port door facing the corridor
    const dz = p.z > -0.5 ? -0.42 : 0.42;
    c.add(box(0.6, 0.3, 0.03, 0x0b6e77, { x: p.x, y: p.y + 0.4, z: p.z + dz }));
    c.add(box(0.44, 0.1, 0.02, 0x9bd1ff, { x: p.x, y: p.y + 0.46, z: p.z + dz * 1.05, transparent: true, opacity: 0.6 }));
    // internal cup + chuck + wafer, only visible in x-ray / section
    c.add(cyl(0.3, 0.26, 0.26, 0x7fb3d5, { x: p.x, y: p.y + 0.3, z: p.z, open: true, seg: 26 }));
    c.add(cyl(0.14, 0.14, 0.03, 0x2f80ed, { x: p.x, y: p.y + 0.34, z: p.z }));
    c.add(cyl(0.155, 0.155, 0.004, 0xcdd7e2, { x: p.x, y: p.y + 0.37, z: p.z, seg: 26, metalness: 0.6 }));
    c.add(cyl(0.05, 0.05, 0.22, 0xeb5757, { x: p.x, y: p.y + 0.2, z: p.z }));
    // swing arm stub
    c.add(box(0.26, 0.03, 0.04, 0x9b51e0, { x: p.x + 0.12, y: p.y + 0.52, z: p.z + 0.16 }));
    // chamber id plate
    c.add(box(0.14, 0.07, 0.01, 0xffffff, { x: p.x - 0.35, y: p.y + 0.62, z: p.z + dz * 1.02 }));
    g.add(c);
  });
  return tagPart(g);
}

function chemCabinet() {
  const g = part('chem_cabinet', { explode: [-1.0, -0.2, 0.4] });
  g.add(box(1.3, 0.62, 0.66, 0x2d9cdb, { x: -1.05, y: 0.62, z: 0.78, roughness: 0.4 }));
  // chemical drums / day tanks
  [[-1.45, 0.62], [-1.05, 0.62], [-0.65, 0.62]].forEach(([x], i) => {
    g.add(cyl(0.14, 0.14, 0.42, [0x1f6fb2, 0x53b0e8, 0x88ccf5][i], { x, y: 0.62, z: 0.95 }));
    g.add(cyl(0.05, 0.05, 0.06, 0xffffff, { x, y: 0.86, z: 0.95 }));
  });
  // POU filters
  [-1.35, -1.0, -0.65].forEach((x, i) => g.add(cyl(0.05, 0.05, 0.28, 0xffffff, { x, y: 0.62, z: 0.55, metalness: 0.1, roughness: 0.3 })));
  // labelled valve block
  g.add(box(1.2, 0.08, 0.05, 0x154360, { x: -1.05, y: 0.36, z: 0.55 }));
  return tagPart(g);
}

function mixingUnit() {
  const g = part('mixing_unit', { explode: [0, -0.3, 0.6] });
  // static mixer + inline heater
  g.add(cyl(0.07, 0.07, 0.5, 0xff7a45, { x: 0.15, y: 0.62, z: 0.9, rz: Math.PI / 2, metalness: 0.4 }));
  g.add(cyl(0.09, 0.09, 0.3, 0xe64a19, { x: 0.15, y: 0.62, z: 0.66, rz: Math.PI / 2 }));
  // quartz heater window
  g.add(cyl(0.05, 0.05, 0.26, 0xffd8a8, { x: 0.15, y: 0.62, z: 0.66, rz: Math.PI / 2, transparent: true, opacity: 0.8 }));
  // ratio valves + flow meters
  [-0.1, 0.05, 0.2, 0.35].forEach((x, i) => {
    g.add(box(0.07, 0.1, 0.07, [0x2f80ed, 0x27ae60, 0xf2c94c, 0xeb5757][i], { x, y: 0.88, z: 0.9 }));
    g.add(cyl(0.02, 0.02, 0.14, 0xb0bec5, { x, y: 0.76, z: 0.9, metalness: 0.8 }));
  });
  g.add(box(0.16, 0.1, 0.03, 0x263238, { x: 0.45, y: 0.88, z: 0.9 }));
  return tagPart(g);
}

function pumpPanel() {
  const g = part('pump_panel', { explode: [1.0, -0.3, 0.5] });
  g.add(box(1.0, 0.6, 0.6, 0x6fcf97, { x: 1.2, y: 0.62, z: 0.8, roughness: 0.45 }));
  // diaphragm pumps + pulsation dampers
  [0.88, 1.2, 1.52].forEach((x, i) => {
    g.add(cyl(0.09, 0.09, 0.18, 0x2e8b57, { x, y: 0.55, z: 0.95, metalness: 0.5 }));
    g.add(cyl(0.06, 0.06, 0.12, 0xd7f5e3, { x, y: 0.72, z: 0.95 }));
    g.add(cyl(0.03, 0.03, 0.2, 0xb0bec5, { x, y: 0.86, z: 0.95, metalness: 0.85 }));
  });
  // flow controller faces
  [0.95, 1.45].forEach(x => g.add(box(0.3, 0.14, 0.02, 0x102a43, { x, y: 0.62, z: 1.11 })));
  return tagPart(g);
}

function n2IpaUnit() {
  const g = part('n2_ipa_unit', { explode: [1.0, 0, -0.8] });
  g.add(box(0.62, 0.8, 0.5, 0xbb6bd9, { x: 1.45, y: 0.9, z: -1.0, roughness: 0.4 }));
  // IPA vaporizer vessel with level gauge
  g.add(cyl(0.16, 0.16, 0.44, 0x8e44ad, { x: 1.45, y: 0.86, z: -0.86, metalness: 0.4 }));
  g.add(box(0.04, 0.34, 0.04, 0xf3e5f5, { x: 1.62, y: 0.86, z: -0.86, transparent: true, opacity: 0.85 }));
  // N2 carrier line + MFC
  g.add(box(0.12, 0.09, 0.09, 0x27ae60, { x: 1.2, y: 1.2, z: -0.86 }));
  g.add(cyl(0.022, 0.022, 0.5, 0x27ae60, { x: 1.45, y: 1.2, z: -0.86, rz: Math.PI / 2, metalness: 0.7 }));
  // combustible gas detector
  g.add(box(0.1, 0.12, 0.06, 0xff1744, { x: 1.7, y: 1.34, z: -1.0 }));
  return tagPart(g);
}

function drainManifold() {
  const g = part('drain_manifold', { explode: [0, -0.9, 0] });
  const cols = [0xf2994a, 0x2f80ed, 0x9b51e0, 0x27ae60]; // acid / alkaline / organic / reclaim
  cols.forEach((c, i) => {
    g.add(cyl(0.045, 0.045, 3.2, c, { y: 0.3 - i * 0.055, z: -1.12 + i * 0.03, rz: Math.PI / 2, metalness: 0.3 }));
  });
  // per-chamber drop legs into the header
  CHAMBER_POS.filter(p => p.y < 1).forEach(p => {
    cols.forEach((c, i) => {
      if (i > 2) return;
      g.add(cyl(0.022, 0.022, 0.32, c, { x: p.x + (i - 1) * 0.07, y: 0.42, z: p.z, metalness: 0.3 }));
    });
  });
  // diverter valve bodies
  CHAMBER_POS.filter(p => p.y < 1).forEach(p => g.add(box(0.2, 0.08, 0.1, 0x5d6d7e, { x: p.x, y: 0.29, z: p.z })));
  // P-traps to house drain
  g.add(tube([[1.6, 0.25, -1.12], [1.85, 0.2, -1.12], [1.9, 0.05, -1.12], [1.7, 0.02, -1.12]], 0.05, 0x7f8fa6));
  return tagPart(g);
}

function exhaustDuct() {
  const g = part('exhaust_duct', { explode: [0, 0.9, -0.7] });
  // three segregated risers: acid / alkaline / organic
  [[-0.9, 0xf2994a], [0, 0x2f80ed], [0.9, 0xbb6bd9]].forEach(([x, c]) => {
    g.add(cyl(0.11, 0.11, 1.9, c, { x, y: 1.3, z: -1.15, metalness: 0.35, roughness: 0.5 }));
    // damper body with position indicator
    g.add(cyl(0.14, 0.14, 0.1, 0x546e7a, { x, y: 0.75, z: -1.15 }));
    g.add(box(0.05, 0.05, 0.12, 0xffeb3b, { x: x + 0.14, y: 0.75, z: -1.15 }));
    // manometer tap
    g.add(cyl(0.03, 0.03, 0.1, 0xeceff1, { x: x + 0.12, y: 1.5, z: -1.15, rz: Math.PI / 2 }));
  });
  // collection plenum under the chambers
  g.add(box(2.6, 0.12, 0.24, 0x9aa5b1, { y: 0.55, z: -1.15, metalness: 0.4 }));
  return tagPart(g);
}

function pipeDeck() {
  const g = part('pipe_deck', { explode: [0, 1.4, 0] });
  g.add(box(3.4, 0.03, 2.3, 0xcfe3f2, { y: 1.96, z: -0.1, transparent: true, opacity: 0.85 }));
  // colour-coded chemical runs, matched lengths, dropping to each chamber column
  const runs = [
    [0x2f80ed, 2.06], [0x27ae60, 2.10], [0xf2c94c, 2.02], [0xbb6bd9, 2.14], [0x56ccf2, 2.10]
  ];
  runs.forEach(([c, y], i) => {
    g.add(cyl(0.028, 0.028, 3.2, c, { y, z: -0.9 + i * 0.13, rz: Math.PI / 2, metalness: 0.3 }));
    [-1.15, 0, 1.15].forEach(x => g.add(cyl(0.02, 0.02, 0.3, c, { x, y: y - 0.16, z: -0.9 + i * 0.13 })));
  });
  // secondary containment channel
  g.add(box(3.3, 0.06, 0.1, 0xb3cde0, { y: 1.9, z: -0.95, transparent: true, opacity: 0.5 }));
  return tagPart(g);
}

function controlRack() {
  const g = part('control_rack', { explode: [-1.2, 0.2, -0.6] });
  g.add(box(0.6, 1.5, 0.55, 0x34495e, { x: -1.45, y: 1.1, z: -1.0, roughness: 0.5 }));
  // PLC / servo drive stacks
  for (let i = 0; i < 5; i++) {
    g.add(box(0.5, 0.16, 0.42, i === 0 ? 0x1abc9c : 0x2c3e50, { x: -1.45, y: 0.55 + i * 0.22, z: -0.98 }));
    g.add(box(0.03, 0.03, 0.02, 0x00e676, { x: -1.68, y: 0.58 + i * 0.22, z: -0.78 }));
  }
  // safety relay module (separate from normal logic)
  g.add(box(0.5, 0.12, 0.42, 0xffd600, { x: -1.45, y: 1.72, z: -0.98 }));
  // cabinet cooling
  g.add(cyl(0.08, 0.08, 0.05, 0x7f8c8d, { x: -1.45, y: 1.86, z: -1.0, metalness: 0.7 }));
  return tagPart(g);
}

function operatorPanel() {
  const g = part('operator_panel', { explode: [0.6, 0.3, 1.0] });
  const arm = box(0.05, 0.05, 0.3, 0x5d6d7e, { x: 1.6, y: 1.72, z: 1.35, metalness: 0.6 });
  g.add(arm);
  const screen = box(0.62, 0.42, 0.05, 0x1f7ae0, { x: 1.55, y: 1.72, z: 1.52, metalness: 0.3 });
  screen.rotation.y = -0.35;
  g.add(screen);
  const face = box(0.56, 0.36, 0.01, 0x0b2e59, { x: 1.55, y: 1.72, z: 1.55 });
  face.rotation.y = -0.35;
  g.add(face);
  // chamber status tiles on the GUI
  for (let i = 0; i < 12; i++) {
    const tile = box(0.1, 0.05, 0.005, [0x2ecc71, 0xf1c40f, 0x2ecc71, 0xe74c3c][i % 4], {
      x: 1.55 - 0.18 + (i % 4) * 0.12, y: 1.84 - Math.floor(i / 4) * 0.08, z: 1.57
    });
    tile.rotation.y = -0.35;
    g.add(tile);
  }
  return tagPart(g);
}

function towerLight() {
  const g = part('tower_light', { explode: [0, 1.2, 0] });
  g.add(cyl(0.025, 0.025, 0.2, 0x5d6d7e, { x: -1.5, y: 2.3, z: 0.8, metalness: 0.7 }));
  [[0xe74c3c, 2.55], [0xf1c40f, 2.47], [0x2ecc71, 2.39]].forEach(([c, y]) => {
    const l = cyl(0.07, 0.07, 0.08, c, { x: -1.5, y, z: 0.8, transparent: true, opacity: 0.9, roughness: 0.2 });
    l.material.emissive = new THREE.Color(c);
    l.material.emissiveIntensity = 0.35;
    g.add(l);
  });
  g.add(cyl(0.05, 0.07, 0.06, 0x2c3e50, { x: -1.5, y: 2.61, z: 0.8 }));
  return tagPart(g);
}

function leakTray() {
  const g = part('leak_tray', { explode: [0, -1.2, 0] });
  g.add(box(3.4, 0.06, 2.4, 0xe57373, { y: 0.26, z: -0.2, transparent: true, opacity: 0.55 }));
  [-1.4, 0, 1.4].forEach(x => {
    g.add(box(0.12, 0.05, 0.12, 0xb71c1c, { x, y: 0.3, z: -0.2 }));
    g.add(cyl(0.012, 0.012, 0.1, 0xffffff, { x, y: 0.35, z: -0.2 }));
  });
  // sloped sump
  g.add(box(0.3, 0.04, 0.3, 0xc62828, { y: 0.23, z: -1.0 }));
  return tagPart(g);
}

export function buildTool() {
  const root = new THREE.Group();
  root.name = 'tool';
  [
    frame(), enclosure(), loadPorts(), foups(), efemBody(), ffu(), atmRobot(), aligner(),
    robotRail(), transferRobot(), chamberStack(), chemCabinet(), mixingUnit(), pumpPanel(),
    n2IpaUnit(), drainManifold(), exhaustDuct(), pipeDeck(), controlRack(), operatorPanel(),
    towerLight(), leakTray()
  ].forEach(p => root.add(p));
  return root;
}

import * as THREE from 'three';
import { UI, LANGS, t } from './i18n.js';
import { TOOL_PARTS, CHAMBER_PARTS, PROCESS_STEPS } from './parts-data.js';
import { QUIZ } from './quiz-data.js';
import { Viewer } from './viewer.js';
import { buildTool } from './model-tool.js';
import { buildChamber } from './model-chamber.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let lang = localStorage.getItem('su3200.lang') || 'zh';
if (!UI[lang]) lang = 'zh';

const S = {
  tool: { viewer: null, parts: TOOL_PARTS, mode: 'solid', isolate: false, search: '' },
  ch: { viewer: null, parts: CHAMBER_PARTS, mode: 'solid', isolate: false, search: '' }
};
const byId = new Map([...TOOL_PARTS, ...CHAMBER_PARTS].map(p => [p.id, p]));

// ---------------------------------------------------------------- i18n -----
function applyI18n() {
  document.documentElement.lang = { zh: 'zh-Hant', en: 'en', ja: 'ja' }[lang];
  $$('[data-i18n]').forEach(el => { el.textContent = t(lang, el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(lang, el.dataset.i18nPh); });
  $$('#langSwitch button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  renderList('tool', '#listTool');
  renderList('ch', '#listCh');
  renderInfo('tool');
  renderInfo('ch');
  renderFlow();
  renderQuiz();
  renderProcSteps();
  updateProcReadout();
  ['tool', 'ch'].forEach(k => S[k].viewer && S[k].viewer.refreshLabelText());
  document.dispatchEvent(new CustomEvent('lang-changed'));
}

function buildLangSwitch() {
  const wrap = $('#langSwitch');
  wrap.innerHTML = '';
  LANGS.forEach(l => {
    const b = document.createElement('button');
    b.textContent = l.label;
    b.dataset.lang = l.code;
    b.addEventListener('click', () => {
      lang = l.code;
      localStorage.setItem('su3200.lang', lang);
      applyI18n();
    });
    wrap.appendChild(b);
  });
}

const hex = n => '#' + n.toString(16).padStart(6, '0');

// ------------------------------------------------------------ part list ----
function renderList(key, sel) {
  const host = $(sel);
  if (!host) return;
  const q = S[key].search.trim().toLowerCase();
  const groups = new Map();
  S[key].parts.forEach(p => {
    const name = p[lang].name;
    if (q && !(name.toLowerCase().includes(q) || p.id.includes(q) || p[lang].fn.toLowerCase().includes(q))) return;
    if (!groups.has(p.group)) groups.set(p.group, []);
    groups.get(p.group).push(p);
  });
  host.innerHTML = '';
  if (!groups.size) {
    host.innerHTML = `<p class="panel-hint" style="padding:16px">${t(lang, 'list.empty')}</p>`;
    return;
  }
  groups.forEach((items, g) => {
    const h = document.createElement('div');
    h.className = 'group-title';
    h.textContent = t(lang, 'group.' + g);
    host.appendChild(h);
    items.forEach(p => {
      const b = document.createElement('button');
      b.className = 'part-item';
      b.dataset.id = p.id;
      b.innerHTML = `<i class="swatch" style="background:${hex(p.color)}"></i><span>${p[lang].name}</span>`;
      b.addEventListener('click', () => {
        const v = S[key].viewer;
        if (v) { v.select(p.id); v.focus(p.id); }
        else { S[key].pending = p.id; renderInfo(key); }
      });
      host.appendChild(b);
    });
  });
  markActive(key);
}

function markActive(key) {
  const sel = key === 'tool' ? '#listTool' : '#listCh';
  const cur = S[key].viewer ? S[key].viewer.selected : S[key].pending;
  $$(sel + ' .part-item').forEach(b => b.classList.toggle('active', b.dataset.id === cur));
}

// ----------------------------------------------------------- info panel ----
function renderInfo(key) {
  const host = $(key === 'tool' ? '#infoTool' : '#infoCh');
  if (!host) return;
  const id = S[key].viewer ? S[key].viewer.selected : S[key].pending;
  const p = id && byId.get(id);
  if (!p) {
    host.innerHTML = `<div class="info-empty"><span class="big">◎</span>${t(lang, 'info.selectHint')}</div>`;
    return;
  }
  const d = p[lang];
  host.innerHTML = `
    <div class="info-title">
      <i class="swatch" style="background:${hex(p.color)}"></i>
      <h3>${d.name}</h3>
    </div>
    <div class="info-group-tag">${t(lang, 'group.' + p.group)}</div>
    <div class="info-actions">
      <button data-info-act="focus">${t(lang, 'info.focus')}</button>
      <button data-info-act="isolate" class="${S[key].isolate ? 'active' : ''}">${S[key].isolate ? t(lang, 'info.isolateOff') : t(lang, 'info.isolate')}</button>
    </div>
    <div class="info-section"><h4>${t(lang, 'info.function')}</h4><p>${d.fn}</p></div>
    <div class="info-section principle"><h4>${t(lang, 'info.principle')}</h4><p>${d.pr}</p></div>
    <div class="info-section spec"><h4>${t(lang, 'info.spec')}</h4><p>${d.sp}</p></div>
    <div class="info-section risk"><h4>${t(lang, 'info.risk')}</h4><p>${d.rk}</p></div>`;
  host.querySelector('[data-info-act="focus"]').addEventListener('click', () => S[key].viewer && S[key].viewer.focus(id));
  host.querySelector('[data-info-act="isolate"]').addEventListener('click', () => {
    S[key].isolate = !S[key].isolate;
    S[key].viewer && S[key].viewer.applyIsolate(S[key].isolate);
    renderInfo(key);
  });
  markActive(key);
}

// -------------------------------------------------------------- viewers ----
function toolbarFor(key, viewportSel, sliderSel) {
  const root = $(viewportSel);
  const sliders = $(sliderSel);
  const st = S[key];

  const syncSliderRows = () => {
    const show = st.mode === 'explode' || st.mode === 'section' || st.mode === 'xray';
    sliders.classList.toggle('show', show);
    sliders.querySelectorAll('.slider-row').forEach(r => {
      r.style.display = r.dataset.for === st.mode ? 'flex' : 'none';
    });
  };

  root.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      st.mode = btn.dataset.mode;
      root.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b === btn));
      const v = st.viewer;
      if (!v) return;
      v.applyXray(st.mode === 'xray');
      v.applySection(st.mode === 'section');
      if (st.mode !== 'explode') {
        v.applyExplode(0);
        const s = sliders.querySelector('[data-slider=explode]');
        s.value = 0; s.parentElement.querySelector('.val').textContent = '0%';
      } else {
        const s = sliders.querySelector('[data-slider=explode]');
        if (+s.value === 0) { s.value = 45; s.parentElement.querySelector('.val').textContent = '45%'; }
        v.applyExplode(+s.value / 100);
        setTimeout(() => v.fitAll(1.05), 30);
      }
      syncSliderRows();
    });
  });

  sliders.querySelectorAll('input[type=range]').forEach(inp => {
    inp.addEventListener('input', () => {
      const v = st.viewer;
      const out = inp.parentElement.querySelector('.val');
      const kind = inp.dataset.slider;
      if (kind === 'explode') { out.textContent = inp.value + '%'; v && v.applyExplode(+inp.value / 100); }
      if (kind === 'opacity') { out.textContent = inp.value + '%'; v && v.setXrayOpacity(+inp.value / 100); }
      if (kind === 'section') {
        out.textContent = inp.value;
        const span = key === 'tool' ? 2.0 : 0.8;
        v && v.applySection(true, v.clipAxis, (+inp.value / 100) * span, v.clipFlip);
      }
    });
  });

  sliders.querySelectorAll('[data-seg=axis] button').forEach(b => {
    b.addEventListener('click', () => {
      sliders.querySelectorAll('[data-seg=axis] button').forEach(x => x.classList.toggle('active', x === b));
      const v = st.viewer; if (!v) return;
      const pos = +sliders.querySelector('[data-slider=section]').value / 100 * (key === 'tool' ? 2.0 : 0.8);
      v.applySection(true, b.dataset.axis, pos, v.clipFlip);
    });
  });
  sliders.querySelector('[data-act=flip]').addEventListener('click', e => {
    const v = st.viewer; if (!v) return;
    e.currentTarget.classList.toggle('active');
    v.applySection(true, v.clipAxis, v.clipPos, !v.clipFlip);
  });

  root.querySelectorAll('[data-act]').forEach(btn => {
    if (btn.closest('.slider-group')) return;
    btn.addEventListener('click', () => {
      const v = st.viewer; if (!v) return;
      const a = btn.dataset.act;
      if (a === 'labels') { btn.classList.toggle('active'); v.setLabels(btn.classList.contains('active')); }
      if (a === 'autorotate') { btn.classList.toggle('active'); v.setAutoRotate(btn.classList.contains('active')); }
      if (a === 'reset') {
        v.setView('iso');
        v.select(null);
        if (st.isolate) { st.isolate = false; v.applyIsolate(false); renderInfo(key); }
      }
    });
  });

  root.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => S[key].viewer && S[key].viewer.setView(btn.dataset.view));
  });
}

function initToolViewer() {
  if (S.tool.viewer) return;
  const v = new Viewer($('#viewTool'), {
    camera: [4.0, 2.9, 4.9], target: [0, 1.05, 0], gridSize: 16, gridDiv: 32,
    explodeScale: 1.8, centerY: 1.1,
    labelText: id => (byId.get(id) ? byId.get(id)[lang].name : id),
    onSelect: id => { renderInfo('tool'); markActive('tool'); }
  });
  v.setModel(buildTool());
  S.tool.viewer = v;
  if (S.tool.pending) v.select(S.tool.pending);
  $('#loadTool').classList.add('hide');
}

// ------------------------------------------------- chamber + animation -----
const P = { playing: false, idx: 0, t: 0, rpm: 0, angle: 0, cupY: 0, armAngle: {}, doorY: 0, liftY: 0 };

function initChamberViewer() {
  if (S.ch.viewer) return;
  const built = buildChamber();
  const v = new Viewer($('#viewCh'), {
    camera: [1.75, 2.35, 2.15], target: [0, 0.66, 0], gridSize: 4, gridDiv: 16,
    explodeScale: 1.3, centerY: 0.7,
    active: document.querySelector('#tab-chamber').classList.contains('active'),
    alwaysRender: true,   // the process animation runs every frame
    labelText: id => (byId.get(id) ? byId.get(id)[lang].name : id),
    onSelect: () => { renderInfo('ch'); markActive('ch'); },
    onFrame: dt => animateChamber(dt, built)
  });
  v.setModel(built.root);
  S.ch.viewer = v;
  S.ch.built = built;
  if (S.ch.pending) v.select(S.ch.pending);
  // the chamber tab opens see-through: the whole point here is watching the
  // wafer, the nozzles and the liquid, which a solid housing would hide
  const xrayBtn = document.querySelector('#viewCh [data-mode="xray"]');
  if (xrayBtn) xrayBtn.click();
  $('#loadCh').classList.add('hide');
}

const lerp = (a, b, k) => a + (b - a) * Math.min(1, k);

function animateChamber(dt, built) {
  const step = PROCESS_STEPS[P.idx];
  const refs = built.refs;
  const { fx } = refs;

  if (P.playing) {
    P.t += dt;
    if (P.t >= step.duration) {
      P.t = 0;
      P.idx = (P.idx + 1) % PROCESS_STEPS.length;
      onStepChanged();
    }
  }
  const cur = PROCESS_STEPS[P.idx];

  // spindle ramp (rpm/s), then a damped visual rotation so it never strobes
  const ramp = 1400 * dt;
  P.rpm += THREE.MathUtils.clamp(cur.rpm - P.rpm, -ramp, ramp);
  P.angle += (P.rpm / 60) * Math.PI * 2 * dt * 0.09;
  refs.rotor.forEach(o => { o.rotation.y = P.angle; });

  // cup elevation: 4 discrete heights
  const cupTarget = [-0.24, -0.08, 0.06, 0.2][cur.cup];
  P.cupY = lerp(P.cupY, cupTarget, dt * 4);
  refs.cup.position.y = P.cupY;

  // shutter + lift pins only move during load / unload
  const open = cur.id === 'load' || cur.id === 'unload';
  P.doorY = lerp(P.doorY, open ? 0.34 : 0, dt * 4);
  refs.shutterDoor.position.y = P.doorY;
  P.liftY = lerp(P.liftY, open ? 0.05 : 0, dt * 4);
  refs.liftPins.position.y = P.liftY;

  // arms: 0 rad = over wafer center, ±swing = parked over the standby pot
  const scan = 0.273 * (0.5 - 0.5 * Math.cos(P.t * 2.0));  // center <-> wafer edge
  const targets = {
    chemArm: cur.arm === 'chem' ? scan : -refs.swing,
    rinseArm: cur.arm === 'rinse' ? scan * 0.6 : refs.swing,
    twoFluidArm: cur.id === 'sc1' ? scan * 0.8 : -refs.swing
  };
  ['chemArm', 'rinseArm', 'twoFluidArm'].forEach(k => {
    const a = refs[k];
    a.rotation.y = lerp(a.rotation.y, targets[k], dt * 3.2);
  });

  // ---- liquid -------------------------------------------------------------
  const head = cur.arm === 'chem' ? refs.chemHead : (cur.arm === 'rinse' ? refs.rinseHead : null);
  const dispensing = !!cur.liquid;
  const col = new THREE.Color(cur.liquid || 0x56ccf2);

  if (dispensing && head) {
    const tip = head.getWorldPosition(new THREE.Vector3());
    tip.y -= 0.08;
    const top = built.WAFER_Y + 0.008;
    const h = Math.max(0.02, tip.y - top);
    fx.stream.visible = true;
    fx.stream.scale.set(1, h, 1);
    fx.stream.position.set(tip.x, top + h / 2, tip.z);
    fx.stream.material.color.copy(col);
  } else {
    fx.stream.visible = false;
  }

  fx.backStream.visible = cur.id === 'backrinse';
  if (fx.backStream.visible) fx.backStream.material.color.copy(col);

  const filmOn = dispensing;
  fx.film.visible = filmOn;
  if (filmOn) {
    fx.film.material.color.copy(col);
    // film thins as the wafer speeds up
    fx.film.material.opacity = THREE.MathUtils.clamp(0.7 - P.rpm / 3500, 0.28, 0.7);
    fx.film.scale.setScalar(1);
    fx.film.position.y = built.WAFER_Y + (cur.id === 'backrinse' ? -0.02 : 0.006);
  }

  updateDroplets(dt, built, dispensing || (cur.id === 'dry' && P.t < 2.2), col);

  if (P.playing) $('#procProgress').style.width = (P.t / cur.duration * 100).toFixed(1) + '%';
  if (Math.abs(P.rpm - (P._lastShown ?? -1)) > 8) {
    P._lastShown = P.rpm;
    const el = document.getElementById('rdRpm');
    if (el) el.textContent = Math.round(P.rpm);
  }
}

function updateDroplets(dt, built, spawning, color) {
  const pts = built.refs.fx.points;
  const pos = pts.geometry.attributes.position.array;
  const vel = pts.userData.vel;
  const alive = pts.userData.alive;
  const N = alive.length;
  pts.material.color.copy(color);
  let visible = false;
  let budget = spawning ? Math.ceil(dt * 260 * Math.min(1, P.rpm / 260)) : 0;

  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    if (alive[i] > 0) {
      vel[i3 + 1] -= 3.2 * dt;
      pos[i3] += vel[i3] * dt;
      pos[i3 + 1] += vel[i3 + 1] * dt;
      pos[i3 + 2] += vel[i3 + 2] * dt;
      alive[i] -= dt;
      const r = Math.hypot(pos[i3], pos[i3 + 2]);
      if (pos[i3 + 1] < 0.3 || r > 0.47) alive[i] = 0;
      if (alive[i] > 0) visible = true;
    } else if (budget > 0) {
      budget--;
      const a = Math.random() * Math.PI * 2;
      const r = built.WAFER_R * (0.985 + Math.random() * 0.03);
      pos[i3] = Math.cos(a) * r;
      pos[i3 + 1] = built.WAFER_Y + 0.012;
      pos[i3 + 2] = Math.sin(a) * r;
      const sp = 0.35 + P.rpm / 1600;
      vel[i3] = Math.cos(a) * sp;
      vel[i3 + 1] = 0.12 + Math.random() * 0.2;
      vel[i3 + 2] = Math.sin(a) * sp;
      alive[i] = 0.35 + Math.random() * 0.3;
      visible = true;
    } else {
      pos[i3 + 1] = -99;
    }
  }
  pts.geometry.attributes.position.needsUpdate = true;
  pts.visible = visible;
}

function onStepChanged() {
  renderProcSteps();
  updateProcReadout();
}

function renderProcSteps() {
  const host = $('#procSteps');
  if (!host) return;
  host.innerHTML = '';
  PROCESS_STEPS.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'proc-step' + (i === P.idx ? ' active' : '');
    b.textContent = s[lang].name;
    b.addEventListener('click', () => { P.idx = i; P.t = 0; onStepChanged(); });
    host.appendChild(b);
  });
  const act = host.querySelector('.active');
  if (act) act.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function updateProcReadout() {
  const s = PROCESS_STEPS[P.idx];
  if (!s || !$('#rdRpm')) return;
  $('#rdRpm').textContent = Math.round(P.rpm);
  $('#rdChem').textContent = s.liquid ? s[lang].chem : t(lang, 'chamber.none');
  $('#procProgress').style.width = '0%';
}

function bindProcControls() {
  const playBtn = $('#procPlay');
  const setLabel = () => {
    playBtn.innerHTML = `<span class="ico">${P.playing ? '❚❚' : '▶'}</span><span>${t(lang, P.playing ? 'chamber.pause' : 'chamber.play')}</span>`;
  };
  playBtn.addEventListener('click', () => { P.playing = !P.playing; setLabel(); });
  $('#procPrev').addEventListener('click', () => {
    P.idx = (P.idx - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length; P.t = 0; onStepChanged();
  });
  $('#procNext').addEventListener('click', () => {
    P.idx = (P.idx + 1) % PROCESS_STEPS.length; P.t = 0; onStepChanged();
  });
  setLabel();
  document.addEventListener('lang-changed', setLabel);
}

// ---------------------------------------------------------------- flow -----
function renderFlow() {
  const host = $('#flowList');
  if (!host) return;
  const colors = ['#1f6feb', '#8b5cf6', '#00a396', '#f0932b', '#e05260'];
  host.innerHTML = '';
  PROCESS_STEPS.forEach((s, i) => {
    const d = s[lang];
    const card = document.createElement('div');
    card.className = 'flow-card';
    card.innerHTML = `
      <div class="flow-idx" style="background:${colors[i % colors.length]}">${i + 1}</div>
      <div>
        <h3>${d.name}</h3>
        <div class="flow-meta">
          <span class="chip time">${t(lang, 'flow.duration')} ≈ ${s.duration}s</span>
          <span class="chip rpm">${t(lang, 'chamber.rpm')}: ${s.rpm} rpm</span>
          <span class="chip chem">${t(lang, 'flow.chemistry')}: ${d.chem}</span>
        </div>
        <p class="flow-purpose">${t(lang, 'flow.purpose')}：${d.purpose}</p>
        <p>${d.detail}</p>
      </div>`;
    host.appendChild(card);
  });
}

// ---------------------------------------------------------------- quiz -----
let quizAnswers = {};
function renderQuiz() {
  const host = $('#quizList');
  if (!host) return;
  host.innerHTML = '';
  QUIZ.forEach((q, qi) => {
    const d = q[lang];
    const el = document.createElement('div');
    el.className = 'quiz-q';
    el.innerHTML = `<h3>${qi + 1}. ${d.q}</h3>` +
      d.o.map((o, oi) => `
        <label class="quiz-opt" data-q="${qi}" data-o="${oi}">
          <input type="radio" name="q${qi}" value="${oi}" ${quizAnswers[qi] === oi ? 'checked' : ''}>
          <span>${o}</span>
        </label>`).join('') +
      `<div class="quiz-explain"><b>${t(lang, 'quiz.explain')}</b><br>${d.e}</div>`;
    host.appendChild(el);
  });
  host.querySelectorAll('input[type=radio]').forEach(r => {
    r.addEventListener('change', e => {
      const lab = e.target.closest('.quiz-opt');
      quizAnswers[+lab.dataset.q] = +lab.dataset.o;
    });
  });
  $('#quizScore').textContent = '';
}

function bindQuiz() {
  $('#quizCheck').addEventListener('click', () => {
    let score = 0;
    QUIZ.forEach((q, qi) => {
      const card = $$('#quizList .quiz-q')[qi];
      card.querySelectorAll('.quiz-opt').forEach(lab => {
        const oi = +lab.dataset.o;
        lab.classList.remove('correct', 'wrong');
        if (oi === q.a) lab.classList.add('correct');
        else if (quizAnswers[qi] === oi) lab.classList.add('wrong');
      });
      card.querySelector('.quiz-explain').classList.add('show');
      if (quizAnswers[qi] === q.a) score++;
    });
    $('#quizScore').textContent = `${t(lang, 'quiz.score')}: ${score} / ${QUIZ.length}`;
  });
  $('#quizReset').addEventListener('click', () => { quizAnswers = {}; renderQuiz(); });
}

// ---------------------------------------------------------------- tabs -----
function bindTabs() {
  $$('#tabbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.tab;
      $$('#tabbar button').forEach(b => b.classList.toggle('active', b === btn));
      $$('.tabpanel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
      if (name === 'overview') initToolViewer();
      if (name === 'chamber') initChamberViewer();
      // only the visible viewer keeps rendering
      if (S.tool.viewer) S.tool.viewer.setActive(name === 'overview');
      if (S.ch.viewer) S.ch.viewer.setActive(name === 'chamber');
    });
  });
}

// ---------------------------------------------------------------- boot -----
function boot() {
  buildLangSwitch();
  bindTabs();
  bindProcControls();
  bindQuiz();
  toolbarFor('tool', '#viewTool', '#slidersTool');
  toolbarFor('ch', '#viewCh', '#slidersCh');
  $('#searchTool').addEventListener('input', e => { S.tool.search = e.target.value; renderList('tool', '#listTool'); });
  $('#searchCh').addEventListener('input', e => { S.ch.search = e.target.value; renderList('ch', '#listCh'); });
  applyI18n();
  initToolViewer();
  // warm the chamber tab in the background so switching is instant
  setTimeout(initChamberViewer, 600);
}

// expose state for debugging / external embedding
window.SU3200 = { S, P, get lang() { return lang; } };
window.addEventListener('DOMContentLoaded', boot);

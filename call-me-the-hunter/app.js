// Call me the hunter — the shell. The rules are in Gleam (js/hunter/);
// this file draws the state onto a 160×144 canvas and feeds in the stick
// and the two buttons.
import * as H from './js/hunter/hunter.mjs';
import * as music from './music.js';

const W = 160;
const H_ = 144;
const FIELD_TOP = 10;
const BEST_KEY = 'hunter-best';
const MUSIC_KEY = 'hunter-music';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Four shades. Not the green ones you're thinking of.
const P = ['#1b2a2a', '#3f6b55', '#8fc77e', '#e3f6c8'];

let game = H.new_game();

// ---------------------------------------------------------------------------
// A 3×5 pixel font (uppercase, digits, a little punctuation)
// ---------------------------------------------------------------------------

const FONT = {
  A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'],
  C: ['011', '100', '100', '100', '011'], D: ['110', '101', '101', '101', '110'],
  E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
  G: ['011', '100', '101', '101', '011'], H: ['101', '101', '111', '101', '101'],
  I: ['111', '010', '010', '010', '111'], J: ['001', '001', '001', '101', '010'],
  K: ['101', '101', '110', '101', '101'], L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'], N: ['110', '101', '101', '101', '101'],
  O: ['010', '101', '101', '101', '010'], P: ['110', '101', '110', '100', '100'],
  Q: ['010', '101', '101', '110', '011'], R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'], T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'], V: ['101', '101', '101', '101', '010'],
  W: ['101', '101', '111', '111', '101'], X: ['101', '101', '010', '101', '101'],
  Y: ['101', '101', '010', '010', '010'], Z: ['111', '001', '010', '100', '111'],
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '011', '001', '111'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '001', '001', '001'],
  8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'],
  ' ': ['000', '000', '000', '000', '000'], '.': ['000', '000', '000', '000', '010'],
  ',': ['000', '000', '000', '010', '100'], '!': ['010', '010', '010', '000', '010'],
  '?': ['111', '001', '011', '000', '010'], '+': ['000', '010', '111', '010', '000'],
  '-': ['000', '000', '111', '000', '000'], ':': ['000', '010', '000', '010', '000'],
  '/': ['001', '001', '010', '100', '100'], '(': ['010', '100', '100', '100', '010'],
  ')': ['010', '001', '001', '001', '010'], "'": ['010', '010', '000', '000', '000'],
  '>': ['100', '010', '001', '010', '100'], '<': ['001', '010', '100', '010', '001'],
};

function px(x, y, c) {
  ctx.fillStyle = P[c];
  ctx.fillRect(x, y, 1, 1);
}

function text(str, x, y, c = 0, scale = 1) {
  const s = str.toUpperCase();
  let cx = x;
  for (const ch of s) {
    const glyph = FONT[ch] || FONT['?'];
    for (let r = 0; r < 5; r++) {
      for (let col = 0; col < 3; col++) {
        if (glyph[r][col] === '1') {
          ctx.fillStyle = P[c];
          ctx.fillRect(cx + col * scale, y + r * scale, scale, scale);
        }
      }
    }
    cx += 4 * scale;
  }
}

function textWidth(str, scale = 1) {
  return str.length * 4 * scale - scale;
}

function centered(str, y, c = 0, scale = 1) {
  text(str, Math.round((W - textWidth(str, scale)) / 2), y, c, scale);
}

// ---------------------------------------------------------------------------
// Sprites ('.' is transparent, a digit is a palette shade)
// ---------------------------------------------------------------------------

// The hunter, facing right, net over the shoulder. 9×11.
const HUNTER = [
  '.......00',
  '......0.0',
  '.......0.',
  '..000..0.',
  '.00000.0.',
  '..222.0..',
  '..212....',
  '..111....',
  '.11111...',
  '..1.1....',
  '..0.0....',
];

// Turtles, two walk frames, facing right. 8×4.
const TURTLE = [
  ['..0000..', '.011110.', '01011011', '.0.00.0.'],
  ['..0000..', '.011110.', '01011011', '0.0..0.0'],
];

function sprite(rows, x, y, flip = false) {
  const w = rows[0].length;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < w; c++) {
      const ch = rows[r][c];
      if (ch === '.') continue;
      px(x + (flip ? w - 1 - c : c), y + r, Number(ch));
    }
  }
}

function circle(cx, cy, r, c, fill) {
  const x0 = Math.floor(cx - r - 1);
  const y0 = Math.floor(cy - r - 1);
  for (let y = y0; y <= cy + r + 1; y++) {
    for (let x = x0; x <= cx + r + 1; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (fill ? d <= r : Math.abs(d - r) < 0.7) px(x, y, c);
    }
  }
}

function line(x0, y0, x1, y1, c) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= steps; i++) {
    px(Math.round(x0 + ((x1 - x0) * i) / steps), Math.round(y0 + ((y1 - y0) * i) / steps), c);
  }
}

// ---------------------------------------------------------------------------
// Drawing the field
// ---------------------------------------------------------------------------

function drawRocks(g) {
  g.rocks.toArray().forEach((r, i) => {
    const x = Math.round(r.x);
    const y = Math.round(r.y);
    const w = Math.round(r.w);
    const h = Math.round(r.h);
    ctx.fillStyle = P[1];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = P[0];
    ctx.fillRect(x, y, w, 1);
    ctx.fillRect(x, y, 1, h);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x + w - 1, y, 1, h);
    // a couple of speckles so it reads as a rock, not a box
    px(x + 2 + (i % 3), y + 2, 2);
    px(x + w - 3, y + h - 3, 0);
  });
}

function drawQuake(g, info) {
  const [kind, cx, cy, r, left] = info;
  if (kind === 'calm') return;
  if (kind === 'warning') {
    const total = H.warn_ms(g.level);
    const progress = 1 - left / total;
    // Cracks spreading out from the centre, jittering as they grow.
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.sin(i * 7.3) * 0.5;
      const len = r * Math.min(1, progress * 1.3) * (0.7 + 0.3 * Math.sin(i * 3.1));
      line(cx, cy, cx + Math.cos(a) * len + (Math.random() - 0.5) * 2, cy + Math.sin(a) * len + (Math.random() - 0.5) * 2, 0);
    }
    // The danger line blinks faster as time runs out.
    const blink = Math.floor(g.time / (left < 1000 ? 80 : 180)) % 2 === 0;
    if (blink) circle(cx, cy, r, 0, false);
  } else {
    // Open: a hole. It closes again in the last moments.
    const rr = left < 600 ? r * (left / 600) : r;
    circle(cx, cy, rr, 0, true);
    circle(cx, cy, rr, 1, false);
    px(Math.round(cx - rr * 0.4), Math.round(cy - rr * 0.3), 1);
    px(Math.round(cx + rr * 0.3), Math.round(cy + rr * 0.4), 1);
  }
}

function drawTurtles(g) {
  const frame = Math.floor(g.time / 160) % 2;
  for (const t of g.turtles.toArray()) {
    sprite(TURTLE[frame], Math.round(t.x) - 4, Math.round(t.y) - 2, t.dx < 0);
  }
}

function drawHunter(g) {
  const x = Math.round(g.hx) - 4;
  const y = Math.round(g.hy) - 6;
  const flip = g.fx < 0;
  sprite(HUNTER, x, y, flip);
  // Hat size. Does nothing. Looks great.
  if (g.hat_lvl > 0) {
    const crown = g.hat_lvl * 2;
    ctx.fillStyle = P[0];
    ctx.fillRect(x + (flip ? 4 : 2), y + 3 - crown, 3, crown);
  }
  if (g.swing > 0) {
    const nx = g.hx + g.fx * H.net_reach(g);
    const ny = g.hy + g.fy * H.net_reach(g);
    const r = H.net_radius(g);
    circle(nx, ny, r, 0, false);
    // mesh
    for (let i = -r; i <= r; i += 3) {
      line(nx + i, ny - r + 1, nx + i, ny + r - 1, 1);
    }
    // the handle, from shoulder to rim
    line(g.hx, g.hy - 2, nx - g.fx * r, ny - g.fy * r, 0);
  }
}

function drawPop(g) {
  if (g.pop_left <= 0) return;
  const rise = (1 - g.pop_left / 900) * 12;
  const x = Math.round(Math.min(W - textWidth(g.pop) - 1, Math.max(1, g.pop_x - textWidth(g.pop) / 2)));
  text(g.pop, x, Math.round(g.pop_y - 8 - rise), 0);
}

function drawHud(g, best) {
  ctx.fillStyle = P[0];
  ctx.fillRect(0, 0, W, FIELD_TOP);
  text(`L${g.level}`, 2, 3, 3);
  text(`${g.score}`, 22, 3, 3);
  text(`T${H.turtles_left(g)}`, 64, 3, 3);
  text(`HI${best}`, 92, 3, 2);
  // B is lit when the jump is ready
  text('B', 150, 3, g.jump_cool > 0 ? 1 : 3);
  if (g.swing_cool > 0) text('A', 142, 3, 1);
  else text('A', 142, 3, 3);
}

// ---------------------------------------------------------------------------
// Overlays (drawn on the canvas, like it's 1991)
// ---------------------------------------------------------------------------

function box(x, y, w, h) {
  ctx.fillStyle = P[3];
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = P[0];
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x, y, 1, h);
  ctx.fillRect(x + w - 1, y, 1, h);
}

function drawTitle(g, best) {
  ctx.fillStyle = P[3];
  ctx.fillRect(0, 0, W, H_);
  centered('CALL ME', 16, 0, 2);
  centered('THE HUNTER', 30, 0, 2);
  centered('(THE TURTLE GAME)', 46, 1);
  // a little scene
  const t = Math.floor(g.time / 160) % 2;
  sprite(TURTLE[t], 30 + Math.round(Math.sin(g.time / 400) * 6), 66, false);
  sprite(TURTLE[1 - t], 118 - Math.round(Math.sin(g.time / 500) * 6), 70, true);
  sprite(HUNTER, 76, 62, false);
  centered('STICK: MOVE', 90, 1);
  centered('A: NET   B: JUMP', 98, 1);
  centered('LEAVE THE CRACKS', 106, 1);
  if (best > 0) centered(`BEST ${best}`, 118, 0);
  if (Math.floor(g.time / 500) % 2 === 0) centered('PRESS A', 130, 0);
}

function drawDead(g) {
  box(14, 40, 132, 60);
  centered('YOU FELL IN.', 48, 0, 2);
  centered('THE AD DID NOT', 66, 0);
  centered('CARE.', 74, 0);
  centered(`BACK TO ${g.level_start_score} POINTS`, 84, 1);
  if (Math.floor(g.time / 500) % 2 === 0) centered(`A: RETRY LEVEL ${g.level}`, 92, 0);
}

let shopCursor = 0;
const SHOP = [
  { item: 1, name: 'SPEED', lvl: (g) => g.speed_lvl },
  { item: 2, name: 'NET', lvl: (g) => g.net_lvl },
  { item: 3, name: 'HAT', lvl: (g) => g.hat_lvl },
];

function drawShop(g) {
  box(6, 18, 148, 114);
  centered(`LEVEL ${g.level} CLEAR!`, 24, 0, 2);
  centered(`POINTS TO SPEND: ${g.score}`, 40, 1);
  SHOP.forEach((s, i) => {
    const y = 54 + i * 14;
    const sel = i === shopCursor;
    const cost = H.cost(g, s.item);
    const can = H.can_buy(g, s.item);
    if (sel) text('>', 14, y, 0);
    const lvl = s.lvl(g);
    const lvlStr = s.item === 3 ? `${lvl}` : `${lvl}/5`;
    text(`${s.name} ${lvlStr}`, 22, y, sel ? 0 : 1);
    text(`${cost}`, 86, y, can ? 0 : 1);
    if (s.item === 3) text('DOES NOTHING', 102, y, 1);
    else if (!can && lvl >= 5) text('MAXED', 102, y, 1);
  });
  centered('STICK: PICK  A: BUY', 104, 1);
  if (Math.floor(g.time / 500) % 2 === 0) centered(`B: LEVEL ${g.level + 1}`, 116, 0);
}

// ---------------------------------------------------------------------------
// The ad in the chasm, plus the voice that reads it
// ---------------------------------------------------------------------------

const adEl = document.getElementById('ad');
const adProduct = document.getElementById('ad-product');
const adTagline = document.getElementById('ad-tagline');
let shownAdId = -1;
let adLeaveTimer = null;

const TERRIBLE_VOICES = ['Fred', 'Zarvox', 'Trinoids', 'Albert', 'Bad News', 'Boing'];

function speak(line) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(line);
  const voices = synth.getVoices();
  const bad =
    voices.find((v) => TERRIBLE_VOICES.includes(v.name)) ??
    voices.find((v) => v.lang.startsWith('en'));
  if (bad) u.voice = bad;
  u.pitch = 0.4;
  u.rate = 0.95;
  synth.speak(u);
}

function syncAd(g, info) {
  const [id, product, tagline] = H.quake_ad(g);
  if (id >= 0 && id !== shownAdId) {
    shownAdId = id;
    clearTimeout(adLeaveTimer);
    adEl.className = `ad look-${id % 6}`;
    adProduct.textContent = product;
    adTagline.textContent = tagline;
    // Sits on the hole, but never off the screen or over the HUD.
    adEl.style.left = `${Math.min(76, Math.max(24, (info[1] / W) * 100))}%`;
    adEl.style.top = `${Math.min(82, Math.max(26, (info[2] / H_) * 100))}%`;
    adEl.hidden = false;
    // Just the product details. Not the whole card. We were asked.
    speak(`${product}. ${tagline}`);
  } else if (id < 0 && shownAdId >= 0 && !adEl.hidden && !adEl.classList.contains('leaving')) {
    adEl.classList.add('leaving');
    adLeaveTimer = setTimeout(() => {
      adEl.hidden = true;
      shownAdId = -1;
    }, 500);
  }
}

// ---------------------------------------------------------------------------
// Input: stick on the right, two buttons on the left, keys for desktops
// ---------------------------------------------------------------------------

const stickEl = document.getElementById('stick');
const knobEl = document.getElementById('knob');
const btnA = document.getElementById('btn-a');
const btnB = document.getElementById('btn-b');

let stickVec = { x: 0, y: 0 };
let stickPointer = null;
const keys = new Set();
let menuFlick = 0; // -1 up, 1 down, 0 centred — edge-triggered in the shop

function firstGesture() {
  music.start();
}

function sendInput() {
  let { x, y } = stickVec;
  if (stickPointer === null) {
    x = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    y = (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0);
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
  }
  game = H.set_input(game, x, y);
  menuNav(y);
}

function menuNav(y) {
  if (H.phase_name(game) !== 'clear') return;
  if (y < -0.6 && menuFlick !== -1) {
    menuFlick = -1;
    shopCursor = (shopCursor + SHOP.length - 1) % SHOP.length;
  } else if (y > 0.6 && menuFlick !== 1) {
    menuFlick = 1;
    shopCursor = (shopCursor + 1) % SHOP.length;
  } else if (Math.abs(y) < 0.3) {
    menuFlick = 0;
  }
}

function stickMove(e) {
  const r = stickEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const radius = r.width * 0.3;
  let dx = (e.clientX - cx) / radius;
  let dy = (e.clientY - cy) / radius;
  const len = Math.hypot(dx, dy);
  if (len > 1) {
    dx /= len;
    dy /= len;
  }
  // a small dead zone so a resting thumb doesn't drift
  if (len < 0.15) {
    dx = 0;
    dy = 0;
  }
  stickVec = { x: dx, y: dy };
  knobEl.style.transform = `translate(${dx * radius}px, ${dy * radius}px)`;
  sendInput();
}

stickEl.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  firstGesture();
  stickPointer = e.pointerId;
  stickEl.setPointerCapture(e.pointerId);
  stickMove(e);
});
stickEl.addEventListener('pointermove', (e) => {
  if (e.pointerId === stickPointer) stickMove(e);
});
for (const ev of ['pointerup', 'pointercancel']) {
  stickEl.addEventListener(ev, (e) => {
    if (e.pointerId !== stickPointer) return;
    stickPointer = null;
    stickVec = { x: 0, y: 0 };
    knobEl.style.transform = '';
    sendInput();
  });
}

function pressA() {
  firstGesture();
  const phase = H.phase_name(game);
  if (phase === 'clear') {
    const item = SHOP[shopCursor].item;
    if (H.can_buy(game, item)) {
      game = H.buy(game, item);
      music.sfx.buy();
    } else {
      music.sfx.nope();
    }
    return;
  }
  const before = game;
  game = H.press_a(game);
  if (phase === 'playing' && game.swing_cool > 0 && before.swing_cool <= 0) {
    const caught = H.turtles_left(before) - H.turtles_left(game);
    if (caught > 0) music.sfx.catch(caught);
    else music.sfx.swing();
  }
}

function pressB() {
  firstGesture();
  if (H.phase_name(game) === 'clear') {
    game = H.next_level(game);
    shopCursor = 0;
    return;
  }
  const before = game;
  game = H.press_b(game);
  if (game.jump_cool > 0 && before.jump_cool <= 0) music.sfx.jump();
}

function wireButton(el, fn) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    el.classList.add('down');
    fn();
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) {
    el.addEventListener(ev, () => el.classList.remove('down'));
  }
}
wireButton(btnA, pressA);
wireButton(btnB, pressB);

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (['KeyZ', 'KeyJ', 'Space', 'Enter'].includes(e.code)) {
    e.preventDefault();
    btnA.classList.add('down');
    pressA();
  } else if (['KeyX', 'KeyK', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
    e.preventDefault();
    btnB.classList.add('down');
    pressB();
  } else if (e.code.startsWith('Arrow') || ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
    e.preventDefault();
    firstGesture();
    keys.add(e.code);
    sendInput();
  }
});
window.addEventListener('keyup', (e) => {
  if (['KeyZ', 'KeyJ', 'Space', 'Enter'].includes(e.code)) btnA.classList.remove('down');
  if (['KeyX', 'KeyK', 'ShiftLeft', 'ShiftRight'].includes(e.code)) btnB.classList.remove('down');
  if (keys.delete(e.code)) sendInput();
});

// Music toggle, remembered.
const musicBtn = document.getElementById('music');
try {
  if (localStorage.getItem(MUSIC_KEY) === 'off') {
    music.setEnabled(false);
    musicBtn.classList.add('off');
  }
} catch {}
musicBtn.addEventListener('click', () => {
  const on = !music.isEnabled();
  music.setEnabled(on);
  music.start();
  musicBtn.classList.toggle('off', !on);
  try {
    localStorage.setItem(MUSIC_KEY, on ? 'on' : 'off');
  } catch {}
});

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

let best = 0;
try {
  best = Number(localStorage.getItem(BEST_KEY)) || 0;
} catch {}

let lastTs = 0;
let lastPhase = 'title';
let lastQuake = 'calm';

function frame(ts) {
  const dt = Math.min(50, lastTs ? ts - lastTs : 16);
  lastTs = ts;
  game = H.tick(game, dt);
  const g = game;
  const phase = H.phase_name(g);
  const info = H.quake_info(g);

  if (g.score > best) {
    best = g.score;
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch {}
  }

  // Sound cues on transitions.
  if (info[0] !== lastQuake) {
    music.sfx.rumble(info[0] === 'warning');
    if (info[0] === 'open') music.sfx.open();
    lastQuake = info[0];
  }
  if (phase !== lastPhase) {
    if (phase === 'dead') {
      music.sfx.rumble(false);
      music.sfx.fall();
    }
    if (phase === 'clear') {
      music.sfx.rumble(false);
      music.sfx.clear();
    }
    lastPhase = phase;
  }

  // --- draw ---
  ctx.fillStyle = P[3];
  ctx.fillRect(0, 0, W, H_);

  if (phase === 'title') {
    drawTitle(g, best);
  } else {
    ctx.save();
    if (info[0] === 'warning') {
      const amp = 1 + Math.round((1 - info[4] / H.warn_ms(g.level)) * 2);
      ctx.translate(Math.round((Math.random() - 0.5) * 2 * amp), Math.round((Math.random() - 0.5) * 2 * amp));
    }
    drawQuake(g, info);
    drawRocks(g);
    drawTurtles(g);
    if (phase !== 'dead') drawHunter(g);
    drawPop(g);
    ctx.restore();
    drawHud(g, best);
    if (phase === 'dead') drawDead(g);
    if (phase === 'clear') drawShop(g);
  }

  syncAd(g, info);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

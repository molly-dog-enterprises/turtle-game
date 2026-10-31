// Turtle Game — flat JS shell. All game logic lives in src/turtle_game.gleam,
// compiled to plain ES modules in js/ (committed, so no build step to serve).
import * as TG from './js/turtle_game/turtle_game.mjs';

const ARENA_W = 800;
const ARENA_H = 600;

/** Session persistence: refreshing the page costs you two levels. */
const SESSION_KEY = 'turtle-game-level';
/** Best score survives across visits. */
const BEST_KEY = 'turtle-game-best';

/** Fold a finished score into the stored best; says whether it's a new one. */
function updateBest(score) {
  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    // private browsing etc. — best just lives for this page load
  }
  const isNew = score > best;
  if (isNew) {
    best = score;
    try {
      localStorage.setItem(BEST_KEY, String(score));
    } catch {}
  }
  return { best, isNew };
}

const $ = (id) => document.getElementById(id);
const arena = $('arena');
const sprites = $('sprites');
const graceEl = $('grace');
const interstitialEl = $('interstitial');
const intProduct = $('int-product');
const intTagline = $('int-tagline');
const intSkip = $('int-skip');
const overlayEl = $('overlay');
const hudLevel = $('hud-level');
const hudTime = $('hud-time');
const hudTimeItem = $('hud-time-item');
const hudLeft = $('hud-left');
const hudScore = $('hud-score');

let game = TG.new_game();
try {
  const saved = Number(sessionStorage.getItem(SESSION_KEY));
  if (Number.isFinite(saved) && saved > 1) {
    game = TG.resume(saved);
    sessionStorage.setItem(SESSION_KEY, String(game.level));
  }
} catch {
  // no session storage — start fresh at level 1
}

// ---------------------------------------------------------------------------
// Bad computer voice: some ads get read out loud. You're welcome.
// ---------------------------------------------------------------------------

/** macOS novelty voices make ideal terrible announcers; otherwise any
 *  English voice pitched down badly does the job. */
const TERRIBLE_VOICES = ['Zarvox', 'Trinoids', 'Fred', 'Albert', 'Bad News'];

function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel(); // one terrible announcement at a time
    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const bad =
      voices.find((v) => TERRIBLE_VOICES.includes(v.name)) ??
      voices.find((v) => v.lang.startsWith('en'));
    if (bad) u.voice = bad;
    u.pitch = 0.3;
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    // no speech synthesis — the ads stay mercifully silent
  }
}

/** Ads already announced (or deliberately skipped), by id. */
const announced = new Set();
let wasPaused = false;

function announceAds(g) {
  for (const a of g.ads.toArray()) {
    if (announced.has(a.id)) continue;
    announced.add(a.id);
    if (a.spoken) speak(`${a.product}. ${a.tagline}. Buy now.`);
  }
  if (g.paused && !wasPaused) {
    speak(`A word from our sponsors. ${g.pause_product}. ${g.pause_tagline}. Buy now.`);
  }
  wasPaused = g.paused;
}

// ---------------------------------------------------------------------------
// Pointer events
// ---------------------------------------------------------------------------

/** Map a pointer event to logical arena coordinates. */
function toArena(e) {
  const r = arena.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * ARENA_W,
    y: ((e.clientY - r.top) / r.height) * ARENA_H,
  };
}

arena.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const p = toArena(e);
  game = TG.press(game, p.x, p.y);
});
arena.addEventListener('pointermove', (e) => {
  e.preventDefault();
  const p = toArena(e);
  game = TG.move_to(game, p.x, p.y);
});
// Lifting your finger or leaving the arena resets the turtle's head start.
for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) {
  arena.addEventListener(ev, () => {
    game = TG.release(game);
  });
}
/** Skip the game-pausing interstitial (only works once the lock expires). */
intSkip.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  game = TG.dismiss(game);
});

// ---------------------------------------------------------------------------
// Rendering: one element per turtle/ad, keyed by id
// ---------------------------------------------------------------------------

const turtleEls = new Map();
const adEls = new Map();
const pct = (v, total) => `${(v / total) * 100}%`;

function renderTurtles(g, shielded) {
  const seen = new Set();
  for (const t of g.turtles.toArray()) {
    seen.add(t.id);
    let el = turtleEls.get(t.id);
    if (!el) {
      el = document.createElement('span');
      el.className = 'turtle';
      el.textContent = '🐢';
      sprites.appendChild(el);
      turtleEls.set(t.id, el);
    }
    el.style.left = pct(t.x, ARENA_W);
    el.style.top = pct(t.y, ARENA_H);
    el.style.transform = `translate(-50%, -50%) scaleX(${t.dx < 0 ? -1 : 1})`;
    el.classList.toggle('golden', t.golden);
    el.classList.toggle('shielded', shielded);
  }
  for (const [id, el] of turtleEls) {
    if (!seen.has(id)) {
      el.remove();
      turtleEls.delete(id);
    }
  }
}

function makeAdEl(a) {
  const el = document.createElement('div');
  el.className = 'ad';
  const close = document.createElement('button');
  close.className = 'ad-close';
  close.textContent = '✕';
  // The ✕ does what every real ad's ✕ does: spawns another ad.
  close.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    game = TG.annoy(game);
  });
  const badge = document.createElement('span');
  badge.className = 'ad-badge';
  badge.textContent = 'AD';
  const product = document.createElement('strong');
  product.className = 'ad-product';
  product.textContent = a.product;
  const tagline = document.createElement('em');
  tagline.className = 'ad-tagline';
  tagline.textContent = a.tagline;
  const cta = document.createElement('span');
  cta.className = 'ad-cta';
  cta.textContent = 'BUY NOW!!';
  el.append(close, badge, product, tagline, cta);
  return el;
}

function renderAds(g) {
  const seen = new Set();
  for (const a of g.ads.toArray()) {
    seen.add(a.id);
    let el = adEls.get(a.id);
    if (!el) {
      el = makeAdEl(a);
      sprites.appendChild(el);
      adEls.set(a.id, el);
    }
    const flashing = a.flash > 0;
    el.classList.toggle('flashing', flashing);
    el.style.left = flashing ? '0%' : pct(a.x, ARENA_W);
    el.style.top = flashing ? '0%' : pct(a.y, ARENA_H);
    el.style.width = flashing ? '100%' : pct(a.w, ARENA_W);
    el.style.height = flashing ? '100%' : pct(a.h, ARENA_H);
  }
  for (const [id, el] of adEls) {
    if (!seen.has(id)) {
      el.remove();
      adEls.delete(id);
    }
  }
}

// The overlay only re-renders when the phase or level changes.
let overlayKey = '';

function renderOverlay(phase, g) {
  if (phase === 'playing') {
    overlayEl.hidden = true;
    overlayKey = '';
    return;
  }
  const key = `${phase}:${g.level}`;
  overlayEl.hidden = false;
  if (key === overlayKey) return;
  overlayKey = key;
  if (phase === 'intro') {
    overlayEl.innerHTML = `
      <h1>🐢 Turtle Game</h1>
      <p>
        Press and hold — the turtle gets a <strong>2 second head start</strong>, then chase it
        with your finger. Lift your finger and the head start resets.
      </p>
      <p class="overlay-small">
        The clock is stupidly short. Golden turtles ✨ appear from level 5 — worth 500 points
        and +3 seconds. Refreshing the page costs you two levels.
      </p>
      <p class="overlay-tap">Press anywhere to start level ${g.level}</p>`;
  } else if (phase === 'clear') {
    const { best, isNew } = updateBest(g.score);
    overlayEl.innerHTML = `
      <h1>Level ${g.level} cleared!</h1>
      <p>The turtles are getting faster. And smarter. And better at hiding behind ads.</p>
      <p class="overlay-small">${
        isNew ? `🏆 New best score: ${best}!` : `Score ${g.score} — your best is ${best}.`
      }</p>
      <p class="overlay-tap">Press anywhere for level ${g.level + 1}</p>`;
  } else {
    const { best, isNew } = updateBest(g.score);
    overlayEl.innerHTML = `
      <h1>Time's up.</h1>
      <p>The turtle outlived your attention span. You died on level ${g.level} — score ${g.score}.</p>
      ${
        best > 0
          ? `<p class="overlay-small">${
              isNew ? `🏆 New best score: ${best}!` : `Your best is ${best}.`
            }</p>`
          : ''
      }
      <p class="overlay-tap">Press anywhere to retry level ${g.level} (score starts over)</p>
      <button type="button" class="restart-btn">Restart at level 1</button>`;
    overlayEl.querySelector('.restart-btn').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      game = TG.new_game();
    });
  }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

let lastTs = 0;
let savedLevel = game.level;

function frame(ts) {
  const dt = lastTs ? ts - lastTs : 16;
  lastTs = ts;
  game = TG.tick(game, dt);
  const g = game;
  const phase = TG.phase_name(g);

  if (g.level !== savedLevel) {
    savedLevel = g.level;
    try {
      sessionStorage.setItem(SESSION_KEY, String(g.level));
    } catch {
      // private browsing etc. — the game just won't remember the level
    }
  }

  hudLevel.textContent = g.level;
  hudTime.textContent = `${(Math.max(0, g.time_left) / 1000).toFixed(1)}s`;
  hudTimeItem.classList.toggle('panic', phase === 'playing' && g.time_left < 3000);
  hudLeft.textContent = TG.turtles_left(g);
  hudScore.textContent = g.score;

  /** Turtles can't be caught during the head start — show it. */
  const shielded = phase === 'playing' && g.pointer_down && g.grace_left > 0;
  renderTurtles(g, shielded);
  renderAds(g);

  if (phase === 'playing' && g.pointer_down && g.grace_left > 0) {
    graceEl.hidden = false;
    graceEl.classList.remove('grace-warn');
    graceEl.textContent = `Head start: ${(g.grace_left / 1000).toFixed(1)}s — it's getting away!`;
  } else if (phase === 'playing' && !g.pointer_down) {
    graceEl.hidden = false;
    graceEl.classList.add('grace-warn');
    graceEl.textContent = 'Finger down to chase (head start has reset)';
  } else {
    graceEl.hidden = true;
  }

  interstitialEl.hidden = !g.paused;
  if (g.paused) {
    intProduct.textContent = g.pause_product;
    intTagline.textContent = g.pause_tagline;
    intSkip.disabled = g.pause_lock > 0;
    intSkip.textContent =
      g.pause_lock > 0 ? `Skip in ${(g.pause_lock / 1000).toFixed(1)}s` : 'Skip ad ✕';
  }

  renderOverlay(phase, g);
  announceAds(g);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

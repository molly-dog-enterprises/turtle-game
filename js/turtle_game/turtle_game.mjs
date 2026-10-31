import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  Ok,
  Error,
  toList,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  divideFloat,
} from "./gleam.mjs";
import { random, sqrt } from "./turtle_game_ffi.mjs";

export class Intro extends $CustomType {}
export const Phase$Intro$const = new Intro();
export const Phase$Intro = () => Phase$Intro$const;
export const Phase$isIntro = (value) => value instanceof Intro;

export class Playing extends $CustomType {}
export const Phase$Playing$const = new Playing();
export const Phase$Playing = () => Phase$Playing$const;
export const Phase$isPlaying = (value) => value instanceof Playing;

export class LevelClear extends $CustomType {}
export const Phase$LevelClear$const = new LevelClear();
export const Phase$LevelClear = () => Phase$LevelClear$const;
export const Phase$isLevelClear = (value) => value instanceof LevelClear;

export class GameOver extends $CustomType {}
export const Phase$GameOver$const = new GameOver();
export const Phase$GameOver = () => Phase$GameOver$const;
export const Phase$isGameOver = (value) => value instanceof GameOver;

export class Turtle extends $CustomType {
  constructor(id, x, y, dx, dy, golden, ttl, juke_ms, jx, jy) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.golden = golden;
    this.ttl = ttl;
    this.juke_ms = juke_ms;
    this.jx = jx;
    this.jy = jy;
  }
}
export const Turtle$Turtle = (id, x, y, dx, dy, golden, ttl, juke_ms, jx, jy) =>
  new Turtle(id, x, y, dx, dy, golden, ttl, juke_ms, jx, jy);
export const Turtle$isTurtle = (value) => value instanceof Turtle;
export const Turtle$Turtle$id = (value) => value.id;
export const Turtle$Turtle$0 = (value) => value.id;
export const Turtle$Turtle$x = (value) => value.x;
export const Turtle$Turtle$1 = (value) => value.x;
export const Turtle$Turtle$y = (value) => value.y;
export const Turtle$Turtle$2 = (value) => value.y;
export const Turtle$Turtle$dx = (value) => value.dx;
export const Turtle$Turtle$3 = (value) => value.dx;
export const Turtle$Turtle$dy = (value) => value.dy;
export const Turtle$Turtle$4 = (value) => value.dy;
export const Turtle$Turtle$golden = (value) => value.golden;
export const Turtle$Turtle$5 = (value) => value.golden;
export const Turtle$Turtle$ttl = (value) => value.ttl;
export const Turtle$Turtle$6 = (value) => value.ttl;
export const Turtle$Turtle$juke_ms = (value) => value.juke_ms;
export const Turtle$Turtle$7 = (value) => value.juke_ms;
export const Turtle$Turtle$jx = (value) => value.jx;
export const Turtle$Turtle$8 = (value) => value.jx;
export const Turtle$Turtle$jy = (value) => value.jy;
export const Turtle$Turtle$9 = (value) => value.jy;

export class Ad extends $CustomType {
  constructor(id, x, y, w, h, product, tagline, ttl, flash, spoken) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.product = product;
    this.tagline = tagline;
    this.ttl = ttl;
    this.flash = flash;
    this.spoken = spoken;
  }
}
export const Ad$Ad = (id, x, y, w, h, product, tagline, ttl, flash, spoken) =>
  new Ad(id, x, y, w, h, product, tagline, ttl, flash, spoken);
export const Ad$isAd = (value) => value instanceof Ad;
export const Ad$Ad$id = (value) => value.id;
export const Ad$Ad$0 = (value) => value.id;
export const Ad$Ad$x = (value) => value.x;
export const Ad$Ad$1 = (value) => value.x;
export const Ad$Ad$y = (value) => value.y;
export const Ad$Ad$2 = (value) => value.y;
export const Ad$Ad$w = (value) => value.w;
export const Ad$Ad$3 = (value) => value.w;
export const Ad$Ad$h = (value) => value.h;
export const Ad$Ad$4 = (value) => value.h;
export const Ad$Ad$product = (value) => value.product;
export const Ad$Ad$5 = (value) => value.product;
export const Ad$Ad$tagline = (value) => value.tagline;
export const Ad$Ad$6 = (value) => value.tagline;
export const Ad$Ad$ttl = (value) => value.ttl;
export const Ad$Ad$7 = (value) => value.ttl;
export const Ad$Ad$flash = (value) => value.flash;
export const Ad$Ad$8 = (value) => value.flash;
export const Ad$Ad$spoken = (value) => value.spoken;
export const Ad$Ad$9 = (value) => value.spoken;

export class Game extends $CustomType {
  constructor(phase, level, score, time_left, grace_left, pointer_down, px, py, last_px, last_py, pvx, pvy, turtles, ads, ad_cooldown, paused, pause_product, pause_tagline, pause_lock, seq) {
    super();
    this.phase = phase;
    this.level = level;
    this.score = score;
    this.time_left = time_left;
    this.grace_left = grace_left;
    this.pointer_down = pointer_down;
    this.px = px;
    this.py = py;
    this.last_px = last_px;
    this.last_py = last_py;
    this.pvx = pvx;
    this.pvy = pvy;
    this.turtles = turtles;
    this.ads = ads;
    this.ad_cooldown = ad_cooldown;
    this.paused = paused;
    this.pause_product = pause_product;
    this.pause_tagline = pause_tagline;
    this.pause_lock = pause_lock;
    this.seq = seq;
  }
}
export const Game$Game = (phase, level, score, time_left, grace_left, pointer_down, px, py, last_px, last_py, pvx, pvy, turtles, ads, ad_cooldown, paused, pause_product, pause_tagline, pause_lock, seq) =>
  new Game(phase,
  level,
  score,
  time_left,
  grace_left,
  pointer_down,
  px,
  py,
  last_px,
  last_py,
  pvx,
  pvy,
  turtles,
  ads,
  ad_cooldown,
  paused,
  pause_product,
  pause_tagline,
  pause_lock,
  seq);
export const Game$isGame = (value) => value instanceof Game;
export const Game$Game$phase = (value) => value.phase;
export const Game$Game$0 = (value) => value.phase;
export const Game$Game$level = (value) => value.level;
export const Game$Game$1 = (value) => value.level;
export const Game$Game$score = (value) => value.score;
export const Game$Game$2 = (value) => value.score;
export const Game$Game$time_left = (value) => value.time_left;
export const Game$Game$3 = (value) => value.time_left;
export const Game$Game$grace_left = (value) => value.grace_left;
export const Game$Game$4 = (value) => value.grace_left;
export const Game$Game$pointer_down = (value) => value.pointer_down;
export const Game$Game$5 = (value) => value.pointer_down;
export const Game$Game$px = (value) => value.px;
export const Game$Game$6 = (value) => value.px;
export const Game$Game$py = (value) => value.py;
export const Game$Game$7 = (value) => value.py;
export const Game$Game$last_px = (value) => value.last_px;
export const Game$Game$8 = (value) => value.last_px;
export const Game$Game$last_py = (value) => value.last_py;
export const Game$Game$9 = (value) => value.last_py;
export const Game$Game$pvx = (value) => value.pvx;
export const Game$Game$10 = (value) => value.pvx;
export const Game$Game$pvy = (value) => value.pvy;
export const Game$Game$11 = (value) => value.pvy;
export const Game$Game$turtles = (value) => value.turtles;
export const Game$Game$12 = (value) => value.turtles;
export const Game$Game$ads = (value) => value.ads;
export const Game$Game$13 = (value) => value.ads;
export const Game$Game$ad_cooldown = (value) => value.ad_cooldown;
export const Game$Game$14 = (value) => value.ad_cooldown;
export const Game$Game$paused = (value) => value.paused;
export const Game$Game$15 = (value) => value.paused;
export const Game$Game$pause_product = (value) => value.pause_product;
export const Game$Game$16 = (value) => value.pause_product;
export const Game$Game$pause_tagline = (value) => value.pause_tagline;
export const Game$Game$17 = (value) => value.pause_tagline;
export const Game$Game$pause_lock = (value) => value.pause_lock;
export const Game$Game$18 = (value) => value.pause_lock;
export const Game$Game$seq = (value) => value.seq;
export const Game$Game$19 = (value) => value.seq;

export const arena_h = 600.0;

export const arena_w = 800.0;

const grace_ms = 2000.0;

const catch_radius = 36.0;

const turtle_margin = 28.0;

export function new_game() {
  return new Game(
    Phase$Intro$const,
    1,
    0,
    0.0,
    grace_ms,
    false,
    arena_w / 2.0,
    arena_h / 2.0,
    arena_w / 2.0,
    arena_h / 2.0,
    0.0,
    0.0,
    $List$Empty$const,
    $List$Empty$const,
    1500.0,
    false,
    "",
    "",
    0.0,
    0,
  );
}

function dist(x1, y1, x2, y2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return sqrt((dx * dx) + (dy * dy));
}

function spawn_turtle(g, golden) {
  let x = 60.0 + (random() * (arena_w - 120.0));
  let y = 60.0 + (random() * 340.0);
  let _block;
  let $1 = dist(x, y, g.px, g.py) < 180.0;
  if ($1) {
    _block = [arena_w - x, 460.0 - y];
  } else {
    _block = [x, y];
  }
  let $ = _block;
  let x$1 = $[0];
  let y$1 = $[1];
  let turtle = new Turtle(
    g.seq,
    x$1,
    y$1,
    0.0,
    0.0,
    golden,
    (() => {
      if (golden) {
        return 6000.0;
      } else {
        return 0.0;
      }
    })(),
    0.0,
    0.0,
    0.0,
  );
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    g.pvx,
    g.pvy,
    listPrepend(turtle, g.turtles),
    g.ads,
    g.ad_cooldown,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq + 1,
  );
}

/**
 * The number (of turtles) on the screen increases as you level up.
 * 
 * @ignore
 */
function turtle_count(level) {
  return $int.min(1 + (globalThis.Math.trunc((level - 1) / 2)), 6);
}

/**
 * Each level's timeout is stupidly short, and it only gets worse.
 * 
 * @ignore
 */
function level_time(level) {
  return $float.max(4000.0, 13000.0 - ($int.to_float(level) * 900.0));
}

function start_level(g, x, y) {
  let base = new Game(
    Phase$Playing$const,
    g.level,
    g.score,
    level_time(g.level),
    grace_ms,
    true,
    x,
    y,
    x,
    y,
    0.0,
    0.0,
    $List$Empty$const,
    $List$Empty$const,
    1200.0,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq,
  );
  let _block;
  let _pipe = $list.repeat(undefined, turtle_count(g.level));
  _block = $list.fold(
    _pipe,
    base,
    (acc, _) => { return spawn_turtle(acc, false); },
  );
  let with_turtles = _block;
  let $ = (g.level >= 5) && (random() < 0.45);
  if ($) {
    return spawn_turtle(with_turtles, true);
  } else {
    return with_turtles;
  }
}

function do_press(g, x, y) {
  let $ = g.phase;
  if ($ instanceof Intro) {
    return start_level(g, x, y);
  } else if ($ instanceof Playing) {
    return new Game(
      g.phase,
      g.level,
      g.score,
      g.time_left,
      grace_ms,
      true,
      x,
      y,
      x,
      y,
      0.0,
      0.0,
      g.turtles,
      g.ads,
      g.ad_cooldown,
      g.paused,
      g.pause_product,
      g.pause_tagline,
      g.pause_lock,
      g.seq,
    );
  } else if ($ instanceof LevelClear) {
    return start_level(
      new Game(
        g.phase,
        g.level + 1,
        g.score,
        g.time_left,
        g.grace_left,
        g.pointer_down,
        g.px,
        g.py,
        g.last_px,
        g.last_py,
        g.pvx,
        g.pvy,
        g.turtles,
        g.ads,
        g.ad_cooldown,
        g.paused,
        g.pause_product,
        g.pause_tagline,
        g.pause_lock,
        g.seq,
      ),
      x,
      y,
    );
  } else {
    let _record = new_game();
    return new Game(
      _record.phase,
      _record.level,
      0,
      _record.time_left,
      _record.grace_left,
      _record.pointer_down,
      _record.px,
      _record.py,
      _record.last_px,
      _record.last_py,
      _record.pvx,
      _record.pvy,
      _record.turtles,
      _record.ads,
      _record.ad_cooldown,
      _record.paused,
      _record.pause_product,
      _record.pause_tagline,
      _record.pause_lock,
      _record.seq,
    );
  }
}

/**
 * Finger/mouse pressed down at logical coordinates. Ignored while an
 * interstitial has the game paused — only the skip button works then.
 */
export function press(g, x, y) {
  let $ = g.paused;
  if ($) {
    return g;
  } else {
    return do_press(g, x, y);
  }
}

/**
 * Finger/mouse moved while down. Frozen during an interstitial so the
 * pointer can't teleport while the turtles can't react.
 */
export function move_to(g, x, y) {
  let $ = g.paused;
  if ($) {
    return g;
  } else {
    return new Game(
      g.phase,
      g.level,
      g.score,
      g.time_left,
      g.grace_left,
      g.pointer_down,
      x,
      y,
      g.last_px,
      g.last_py,
      g.pvx,
      g.pvy,
      g.turtles,
      g.ads,
      g.ad_cooldown,
      g.paused,
      g.pause_product,
      g.pause_tagline,
      g.pause_lock,
      g.seq,
    );
  }
}

/**
 * Finger lifted or left the screen: the safe time resets.
 */
export function release(g) {
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    grace_ms,
    false,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    0.0,
    0.0,
    g.turtles,
    g.ads,
    g.ad_cooldown,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq,
  );
}

/**
 * Ads arrive faster at higher levels.
 * 
 * @ignore
 */
function next_cooldown(g) {
  return $float.max(900.0, 2200.0 - ($int.to_float(g.level) * 120.0)) + (random() * 2800.0);
}

function products() {
  return toList([
    ["Invisible Socks", "Feel the breeze. Lose them instantly."],
    ["Wi-Fi Scented Candle", "Smells like 2.4GHz."],
    ["Left-Handed Teabags", "Finally. Steeping for the other 10%."],
    ["Dehydrated Water", "Just add water."],
    ["Bluetooth Spoon", "Pairs with soup."],
    ["Premium Air (Lightly Used)", "Breathed near celebrities."],
    ["Solar-Powered Torch", "Works best when you don't need it."],
    ["Inflatable Dartboard", "One game only."],
    ["USB Pet Rock Pro", "Now with a subscription."],
    ["Gluten-Free Gravel", "Crunchy. Regret-forward."],
    ["Silent Doorbell", "You'll never know."],
    ["AI-Powered Stick", "It's a stick. With a roadmap."],
    ["Waterproof Teabag", "Uncompromising. Undrinkable."],
    ["Turtle Insurance", "Covers everything except turtles."],
  ]);
}

function pick_product() {
  let all = products();
  let idx = $float.truncate(random() * $int.to_float($list.length(all)));
  let $ = $list.drop(all, idx);
  if ($ instanceof $Empty) {
    return ["Mystery Box", "Contains a smaller mystery box."];
  } else {
    let p = $.head;
    return p;
  }
}

/**
 * Pop an ad somewhere random on the screen.
 * 
 * @ignore
 */
function spawn_ad(g) {
  let w = 170.0 + (random() * 90.0);
  let h = 95.0 + (random() * 55.0);
  let x = random() * (arena_w - w);
  let y = random() * (arena_h - h);
  let $ = pick_product();
  let product = $[0];
  let tagline = $[1];
  let ad = new Ad(
    g.seq,
    x,
    y,
    w,
    h,
    product,
    tagline,
    4500.0 + (random() * 4000.0),
    0.0,
    random() < 0.4,
  );
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    g.pvx,
    g.pvy,
    g.turtles,
    listPrepend(ad, g.ads),
    next_cooldown(g),
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq + 1,
  );
}

/**
 * Clicking an ad's ✕ does what every real ✕ does: spawns another ad.
 */
export function annoy(g) {
  let $ = g.phase;
  if ($ instanceof Playing) {
    return spawn_ad(g);
  } else {
    return g;
  }
}

function point_in(px, py, x, y, w, h) {
  return (((px >= x) && (px <= (x + w))) && (py >= y)) && (py <= (y + h));
}

/**
 * Touching an ad — a press or just dragging your finger across it —
 * flashes it up fullscreen for a second. When the flash ends it shrinks
 * back to its old size, in a different location.
 * 
 * @ignore
 */
function touch_ads(g) {
  let $ = g.pointer_down;
  if ($) {
    let ads = $list.map(
      g.ads,
      (a) => {
        let $1 = (a.flash <= 0.0) && point_in(g.px, g.py, a.x, a.y, a.w, a.h);
        if ($1) {
          return new Ad(
            a.id,
            a.x,
            a.y,
            a.w,
            a.h,
            a.product,
            a.tagline,
            $float.max(a.ttl, 2000.0),
            1000.0,
            a.spoken,
          );
        } else {
          return a;
        }
      },
    );
    return new Game(
      g.phase,
      g.level,
      g.score,
      g.time_left,
      g.grace_left,
      g.pointer_down,
      g.px,
      g.py,
      g.last_px,
      g.last_py,
      g.pvx,
      g.pvy,
      g.turtles,
      ads,
      g.ad_cooldown,
      g.paused,
      g.pause_product,
      g.pause_tagline,
      g.pause_lock,
      g.seq,
    );
  } else {
    return g;
  }
}

export function phase_name(g) {
  let $ = g.phase;
  if ($ instanceof Intro) {
    return "intro";
  } else if ($ instanceof Playing) {
    return "playing";
  } else if ($ instanceof LevelClear) {
    return "clear";
  } else {
    return "over";
  }
}

/**
 * How many turtles still need catching this level.
 */
export function turtles_left(g) {
  let _pipe = $list.filter(g.turtles, (t) => { return !t.golden; });
  return $list.length(_pipe);
}

function norm(x, y) {
  let len = sqrt((x * x) + (y * y));
  let $ = len < 0.0001;
  if ($) {
    return [0.0, 0.0];
  } else {
    return [divideFloat(x, len), divideFloat(y, len)];
  }
}

function nearest_ad(ads, t) {
  return $list.fold(
    ads,
    new Error(undefined),
    (best, a) => {
      let cx = a.x + (a.w / 2.0);
      let cy = a.y + (a.h / 2.0);
      let d = dist(t.x, t.y, cx, cy);
      if (best instanceof Ok) {
        let bx = best[0][0];
        let by = best[0][1];
        let $ = d < dist(t.x, t.y, bx, by);
        if ($) {
          return new Ok([cx, cy]);
        } else {
          return best;
        }
      } else {
        return new Ok([cx, cy]);
      }
    },
  );
}

function wall_push(distance, range) {
  let $ = distance < range;
  if ($) {
    return (divideFloat((range - distance), range)) * 1.6;
  } else {
    return 0.0;
  }
}

function wander(t) {
  let $ = (t.dx === 0.0) && (t.dy === 0.0);
  if ($) {
    return norm(random() - 0.5, random() - 0.5);
  } else {
    return [t.dx, t.dy];
  }
}

function turtle_speed(level) {
  return $float.min(110.0 + ($int.to_float(level) * 22.0), 330.0);
}

/**
 * Escape-code smartness tier: 1 flees, 2 avoids walls, 3 predicts your
 * finger and hides behind ads, 4 panic-dashes when you get close.
 * 
 * @ignore
 */
function ai_tier(level) {
  let l = level;
  if (l >= 9) {
    return 4;
  } else {
    let l$1 = level;
    if (l$1 >= 6) {
      return 3;
    } else {
      let l$2 = level;
      if (l$2 >= 3) {
        return 2;
      } else {
        return 1;
      }
    }
  }
}

function step_turtle(t, g, dt) {
  let tier = ai_tier(g.level);
  let _block;
  let $ = t.golden;
  if ($) {
    _block = turtle_speed(g.level) * 1.2;
  } else {
    _block = turtle_speed(g.level);
  }
  let speed = _block;
  let _block$1;
  let $2 = tier >= 3;
  if ($2) {
    _block$1 = [g.px + (g.pvx * 0.25), g.py + (g.pvy * 0.25)];
  } else {
    _block$1 = [g.px, g.py];
  }
  let $1 = _block$1;
  let threat_x = $1[0];
  let threat_y = $1[1];
  let d_threat = dist(t.x, t.y, threat_x, threat_y);
  let _block$2;
  let $4 = g.pointer_down;
  if ($4) {
    _block$2 = norm(t.x - threat_x, t.y - threat_y);
  } else {
    _block$2 = wander(t);
  }
  let $3 = _block$2;
  let sx = $3[0];
  let sy = $3[1];
  let _block$3;
  let $6 = tier >= 2;
  if ($6) {
    let push = 90.0;
    let wx = wall_push(t.x, push) - wall_push(arena_w - t.x, push);
    let wy = wall_push(t.y, push) - wall_push(arena_h - t.y, push);
    _block$3 = [sx + wx, sy + wy];
  } else {
    _block$3 = [sx, sy];
  }
  let $5 = _block$3;
  let sx$1 = $5[0];
  let sy$1 = $5[1];
  let _block$4;
  let $8 = ((tier >= 3) && g.pointer_down) && (d_threat > 220.0);
  if ($8) {
    let $9 = nearest_ad(g.ads, t);
    if ($9 instanceof Ok) {
      let ax = $9[0][0];
      let ay = $9[0][1];
      let $10 = norm(ax - t.x, ay - t.y);
      let hx = $10[0];
      let hy = $10[1];
      _block$4 = [(sx$1 * 0.5) + (hx * 0.9), (sy$1 * 0.5) + (hy * 0.9)];
    } else {
      _block$4 = [sx$1, sy$1];
    }
  } else {
    _block$4 = [sx$1, sy$1];
  }
  let $7 = _block$4;
  let sx$2 = $7[0];
  let sy$2 = $7[1];
  let _block$5;
  let $9 = ((((tier >= 4) && g.pointer_down) && (d_threat < 100.0)) && (t.juke_ms <= 0.0)) && (random() < 0.12);
  if ($9) {
    let $10 = norm(t.x - g.px, t.y - g.py);
    let fx = $10[0];
    let fy = $10[1];
    let _block$6;
    let $11 = random() < 0.5;
    if ($11) {
      _block$6 = 1.0;
    } else {
      _block$6 = -1.0;
    }
    let sign = _block$6;
    _block$5 = new Turtle(
      t.id,
      t.x,
      t.y,
      t.dx,
      t.dy,
      t.golden,
      t.ttl,
      260.0,
      0.0 - (fy * sign),
      fx * sign,
    );
  } else {
    _block$5 = t;
  }
  let t$1 = _block$5;
  let _block$6;
  let $11 = t$1.juke_ms > 0.0;
  if ($11) {
    _block$6 = [t$1.jx * 2.0, t$1.jy * 2.0];
  } else {
    _block$6 = [sx$2, sy$2];
  }
  let $10 = _block$6;
  let sx$3 = $10[0];
  let sy$3 = $10[1];
  let $12 = [sx$3 + ((random() - 0.5) * 0.4), sy$3 + ((random() - 0.5) * 0.4)];
  let sx$4 = $12[0];
  let sy$4 = $12[1];
  let $13 = norm(
    (t$1.dx * 0.55) + (sx$4 * 0.45),
    (t$1.dy * 0.55) + (sy$4 * 0.45),
  );
  let nx = $13[0];
  let ny = $13[1];
  let _block$7;
  let $14 = g.pointer_down;
  if ($14) {
    _block$7 = speed;
  } else {
    _block$7 = speed * 0.25;
  }
  let move = _block$7;
  let x = $float.clamp(
    t$1.x + ((((nx * move) * dt)) / 1000.0),
    turtle_margin,
    arena_w - turtle_margin,
  );
  let y = $float.clamp(
    t$1.y + ((((ny * move) * dt)) / 1000.0),
    turtle_margin,
    arena_h - turtle_margin,
  );
  return new Turtle(
    t$1.id,
    x,
    y,
    nx,
    ny,
    t$1.golden,
    t$1.ttl - dt,
    $float.max(0.0, t$1.juke_ms - dt),
    t$1.jx,
    t$1.jy,
  );
}

/**
 * A word from our sponsors: freeze everything until the skip unlocks.
 * 
 * @ignore
 */
function open_interstitial(g) {
  let $ = pick_product();
  let product = $[0];
  let tagline = $[1];
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    g.pvx,
    g.pvy,
    g.turtles,
    g.ads,
    next_cooldown(g),
    true,
    product,
    tagline,
    1200.0 + (random() * 1400.0),
    g.seq,
  );
}

/**
 * Chance that a spawning ad is a full-screen, game-pausing notice.
 * 
 * @ignore
 */
function interstitial_chance(level) {
  let $ = level >= 2;
  if ($) {
    return $float.min(0.08 + ($int.to_float(level) * 0.02), 0.3);
  } else {
    return 0.0;
  }
}

/**
 * Ads start at level 2; one more every two levels after that, capped at 6.
 * 
 * @ignore
 */
function max_ads(level) {
  let $ = level >= 2;
  if ($) {
    return $int.min(1 + (globalThis.Math.trunc((level - 2) / 2)), 6);
  } else {
    return 0;
  }
}

/**
 * Same size, different place — and never straight under the finger, or it
 * would just flash again immediately.
 * 
 * @ignore
 */
function relocate(a, g) {
  let x = random() * (arena_w - a.w);
  let y = random() * (arena_h - a.h);
  let _block;
  let $1 = g.pointer_down && point_in(g.px, g.py, x, y, a.w, a.h);
  if ($1) {
    _block = [(arena_w - a.w) - x, (arena_h - a.h) - y];
  } else {
    _block = [x, y];
  }
  let $ = _block;
  let x$1 = $[0];
  let y$1 = $[1];
  return new Ad(
    a.id,
    x$1,
    y$1,
    a.w,
    a.h,
    a.product,
    a.tagline,
    a.ttl,
    0.0,
    a.spoken,
  );
}

function step_ads(g, dt) {
  let _block;
  let _pipe = g.ads;
  let _pipe$1 = $list.map(
    _pipe,
    (a) => {
      let $ = a.flash > 0.0;
      if ($) {
        let $1 = (a.flash - dt) <= 0.0;
        if ($1) {
          return relocate(a, g);
        } else {
          return new Ad(
            a.id,
            a.x,
            a.y,
            a.w,
            a.h,
            a.product,
            a.tagline,
            a.ttl,
            a.flash - dt,
            a.spoken,
          );
        }
      } else {
        return new Ad(
          a.id,
          a.x,
          a.y,
          a.w,
          a.h,
          a.product,
          a.tagline,
          a.ttl - dt,
          a.flash,
          a.spoken,
        );
      }
    },
  );
  _block = $list.filter(_pipe$1, (a) => { return a.ttl > 0.0; });
  let ads = _block;
  let g$1 = new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    g.pvx,
    g.pvy,
    g.turtles,
    ads,
    g.ad_cooldown - dt,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq,
  );
  let $ = (g$1.ad_cooldown <= 0.0) && ($list.length(g$1.ads) < max_ads(
    g$1.level,
  ));
  if ($) {
    let $1 = random() < interstitial_chance(g$1.level);
    if ($1) {
      return open_interstitial(g$1);
    } else {
      return spawn_ad(g$1);
    }
  } else {
    return g$1;
  }
}

function tick_playing(g, dt) {
  let ivx = (divideFloat((g.px - g.last_px), dt)) * 1000.0;
  let ivy = (divideFloat((g.py - g.last_py), dt)) * 1000.0;
  let g$1 = new Game(
    g.phase,
    g.level,
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.px,
    g.py,
    (g.pvx * 0.8) + (ivx * 0.2),
    (g.pvy * 0.8) + (ivy * 0.2),
    g.turtles,
    g.ads,
    g.ad_cooldown,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq,
  );
  let _block;
  let $ = g$1.pointer_down && (g$1.grace_left > 0.0);
  if ($) {
    _block = new Game(
      g$1.phase,
      g$1.level,
      g$1.score,
      g$1.time_left,
      $float.max(0.0, g$1.grace_left - dt),
      g$1.pointer_down,
      g$1.px,
      g$1.py,
      g$1.last_px,
      g$1.last_py,
      g$1.pvx,
      g$1.pvy,
      g$1.turtles,
      g$1.ads,
      g$1.ad_cooldown,
      g$1.paused,
      g$1.pause_product,
      g$1.pause_tagline,
      g$1.pause_lock,
      g$1.seq,
    );
  } else {
    _block = g$1;
  }
  let g$2 = _block;
  let _block$1;
  let _pipe = step_ads(g$2, dt);
  _block$1 = touch_ads(_pipe);
  let g$3 = _block$1;
  let chasing = g$3.pointer_down && (g$3.grace_left <= 0.0);
  let _block$2;
  let _pipe$1 = g$3.turtles;
  let _pipe$2 = $list.map(_pipe$1, (t) => { return step_turtle(t, g$3, dt); });
  _block$2 = $list.filter(
    _pipe$2,
    (t) => { return !t.golden || (t.ttl > 0.0); },
  );
  let turtles = _block$2;
  let _block$3;
  if (chasing) {
    _block$3 = $list.partition(
      turtles,
      (t) => { return dist(t.x, t.y, g$3.px, g$3.py) < catch_radius; },
    );
  } else {
    _block$3 = [$List$Empty$const, turtles];
  }
  let $1 = _block$3;
  let caught = $1[0];
  let free = $1[1];
  let gained = $list.fold(
    caught,
    0,
    (acc, t) => {
      let $2 = t.golden;
      if ($2) {
        return acc + 500;
      } else {
        return acc + 100 * g$3.level;
      }
    },
  );
  let time_bonus = $list.fold(
    caught,
    0.0,
    (acc, t) => {
      let $2 = t.golden;
      if ($2) {
        return acc + 3000.0;
      } else {
        return acc;
      }
    },
  );
  let g$4 = new Game(
    g$3.phase,
    g$3.level,
    g$3.score + gained,
    (g$3.time_left + time_bonus) - dt,
    g$3.grace_left,
    g$3.pointer_down,
    g$3.px,
    g$3.py,
    g$3.last_px,
    g$3.last_py,
    g$3.pvx,
    g$3.pvy,
    free,
    g$3.ads,
    g$3.ad_cooldown,
    g$3.paused,
    g$3.pause_product,
    g$3.pause_tagline,
    g$3.pause_lock,
    g$3.seq,
  );
  let cleared = !$list.any(g$4.turtles, (t) => { return !t.golden; });
  let $2 = g$4.time_left <= 0.0;
  if (cleared) {
    return new Game(
      Phase$LevelClear$const,
      g$4.level,
      g$4.score + $float.truncate(g$4.time_left / 100.0),
      g$4.time_left,
      g$4.grace_left,
      false,
      g$4.px,
      g$4.py,
      g$4.last_px,
      g$4.last_py,
      g$4.pvx,
      g$4.pvy,
      g$4.turtles,
      g$4.ads,
      g$4.ad_cooldown,
      g$4.paused,
      g$4.pause_product,
      g$4.pause_tagline,
      g$4.pause_lock,
      g$4.seq,
    );
  } else if ($2) {
    return new Game(
      Phase$GameOver$const,
      g$4.level,
      g$4.score,
      0.0,
      g$4.grace_left,
      g$4.pointer_down,
      g$4.px,
      g$4.py,
      g$4.last_px,
      g$4.last_py,
      g$4.pvx,
      g$4.pvy,
      g$4.turtles,
      g$4.ads,
      g$4.ad_cooldown,
      g$4.paused,
      g$4.pause_product,
      g$4.pause_tagline,
      g$4.pause_lock,
      g$4.seq,
    );
  } else {
    return g$4;
  }
}

/**
 * Advance the simulation by dt_ms milliseconds. While an interstitial is
 * up, the only thing that moves is the skip-button countdown.
 */
export function tick(g, dt_ms) {
  let $ = g.phase;
  let $1 = g.paused;
  if ($1) {
    if ($ instanceof Playing) {
      return new Game(
        g.phase,
        g.level,
        g.score,
        g.time_left,
        g.grace_left,
        g.pointer_down,
        g.px,
        g.py,
        g.last_px,
        g.last_py,
        g.pvx,
        g.pvy,
        g.turtles,
        g.ads,
        g.ad_cooldown,
        g.paused,
        g.pause_product,
        g.pause_tagline,
        $float.max(0.0, g.pause_lock - dt_ms),
        g.seq,
      );
    } else {
      return g;
    }
  } else if ($ instanceof Playing) {
    return tick_playing(g, $float.clamp(dt_ms, 1.0, 50.0));
  } else {
    return g;
  }
}

/**
 * Start a fresh game resuming a saved session: refreshing the page costs
 * you two levels.
 */
export function resume(level) {
  let g = new_game();
  return new Game(
    g.phase,
    $int.max(1, level - 2),
    g.score,
    g.time_left,
    g.grace_left,
    g.pointer_down,
    g.px,
    g.py,
    g.last_px,
    g.last_py,
    g.pvx,
    g.pvy,
    g.turtles,
    g.ads,
    g.ad_cooldown,
    g.paused,
    g.pause_product,
    g.pause_tagline,
    g.pause_lock,
    g.seq,
  );
}

/**
 * Skip the interstitial — once the lock has run out, obviously.
 */
export function dismiss(g) {
  let $ = g.paused && (g.pause_lock <= 0.0);
  if ($) {
    return new Game(
      g.phase,
      g.level,
      g.score,
      g.time_left,
      g.grace_left,
      g.pointer_down,
      g.px,
      g.py,
      g.last_px,
      g.last_py,
      g.pvx,
      g.pvy,
      g.turtles,
      g.ads,
      g.ad_cooldown,
      false,
      g.pause_product,
      g.pause_tagline,
      g.pause_lock,
      g.seq,
    );
  } else {
    return g;
  }
}

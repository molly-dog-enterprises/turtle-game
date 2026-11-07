import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  toList,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  CustomType as $CustomType,
  divideFloat,
} from "./gleam.mjs";
import { random, sqrt, cos, sin } from "./hunter_ffi.mjs";

export class Title extends $CustomType {}
export const Phase$Title$const = new Title();
export const Phase$Title = () => Phase$Title$const;
export const Phase$isTitle = (value) => value instanceof Title;

export class Playing extends $CustomType {}
export const Phase$Playing$const = new Playing();
export const Phase$Playing = () => Phase$Playing$const;
export const Phase$isPlaying = (value) => value instanceof Playing;

export class Dead extends $CustomType {}
export const Phase$Dead$const = new Dead();
export const Phase$Dead = () => Phase$Dead$const;
export const Phase$isDead = (value) => value instanceof Dead;

export class LevelClear extends $CustomType {}
export const Phase$LevelClear$const = new LevelClear();
export const Phase$LevelClear = () => Phase$LevelClear$const;
export const Phase$isLevelClear = (value) => value instanceof LevelClear;

export class Calm extends $CustomType {}
export const Quake$Calm$const = new Calm();
export const Quake$Calm = () => Quake$Calm$const;
export const Quake$isCalm = (value) => value instanceof Calm;

/**
 * The ground is cracking. Leave the circle before `left` hits zero.
 */
export class Warning extends $CustomType {
  constructor(cx, cy, r, left) {
    super();
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.left = left;
  }
}
export const Quake$Warning = (cx, cy, r, left) => new Warning(cx, cy, r, left);
export const Quake$isWarning = (value) => value instanceof Warning;
export const Quake$Warning$cx = (value) => value.cx;
export const Quake$Warning$0 = (value) => value.cx;
export const Quake$Warning$cy = (value) => value.cy;
export const Quake$Warning$1 = (value) => value.cy;
export const Quake$Warning$r = (value) => value.r;
export const Quake$Warning$2 = (value) => value.r;
export const Quake$Warning$left = (value) => value.left;
export const Quake$Warning$3 = (value) => value.left;

/**
 * The chasm is open and an ad has rotated out of it. Don't walk in.
 */
export class Open extends $CustomType {
  constructor(id, cx, cy, r, left, product, tagline) {
    super();
    this.id = id;
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.left = left;
    this.product = product;
    this.tagline = tagline;
  }
}
export const Quake$Open = (id, cx, cy, r, left, product, tagline) =>
  new Open(id, cx, cy, r, left, product, tagline);
export const Quake$isOpen = (value) => value instanceof Open;
export const Quake$Open$id = (value) => value.id;
export const Quake$Open$0 = (value) => value.id;
export const Quake$Open$cx = (value) => value.cx;
export const Quake$Open$1 = (value) => value.cx;
export const Quake$Open$cy = (value) => value.cy;
export const Quake$Open$2 = (value) => value.cy;
export const Quake$Open$r = (value) => value.r;
export const Quake$Open$3 = (value) => value.r;
export const Quake$Open$left = (value) => value.left;
export const Quake$Open$4 = (value) => value.left;
export const Quake$Open$product = (value) => value.product;
export const Quake$Open$5 = (value) => value.product;
export const Quake$Open$tagline = (value) => value.tagline;
export const Quake$Open$6 = (value) => value.tagline;

export class Turtle extends $CustomType {
  constructor(id, x, y, dx, dy, wander) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.wander = wander;
  }
}
export const Turtle$Turtle = (id, x, y, dx, dy, wander) =>
  new Turtle(id, x, y, dx, dy, wander);
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
export const Turtle$Turtle$wander = (value) => value.wander;
export const Turtle$Turtle$5 = (value) => value.wander;

export class Rock extends $CustomType {
  constructor(x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
export const Rock$Rock = (x, y, w, h) => new Rock(x, y, w, h);
export const Rock$isRock = (value) => value instanceof Rock;
export const Rock$Rock$x = (value) => value.x;
export const Rock$Rock$0 = (value) => value.x;
export const Rock$Rock$y = (value) => value.y;
export const Rock$Rock$1 = (value) => value.y;
export const Rock$Rock$w = (value) => value.w;
export const Rock$Rock$2 = (value) => value.w;
export const Rock$Rock$h = (value) => value.h;
export const Rock$Rock$3 = (value) => value.h;

export class Game extends $CustomType {
  constructor(phase, level, score, level_start_score, hx, hy, fx, fy, ix, iy, swing, swing_cool, jump_cool, speed_lvl, net_lvl, hat_lvl, turtles, rocks, quake, quake_timer, pop, pop_x, pop_y, pop_left, time, seq) {
    super();
    this.phase = phase;
    this.level = level;
    this.score = score;
    this.level_start_score = level_start_score;
    this.hx = hx;
    this.hy = hy;
    this.fx = fx;
    this.fy = fy;
    this.ix = ix;
    this.iy = iy;
    this.swing = swing;
    this.swing_cool = swing_cool;
    this.jump_cool = jump_cool;
    this.speed_lvl = speed_lvl;
    this.net_lvl = net_lvl;
    this.hat_lvl = hat_lvl;
    this.turtles = turtles;
    this.rocks = rocks;
    this.quake = quake;
    this.quake_timer = quake_timer;
    this.pop = pop;
    this.pop_x = pop_x;
    this.pop_y = pop_y;
    this.pop_left = pop_left;
    this.time = time;
    this.seq = seq;
  }
}
export const Game$Game = (phase, level, score, level_start_score, hx, hy, fx, fy, ix, iy, swing, swing_cool, jump_cool, speed_lvl, net_lvl, hat_lvl, turtles, rocks, quake, quake_timer, pop, pop_x, pop_y, pop_left, time, seq) =>
  new Game(phase,
  level,
  score,
  level_start_score,
  hx,
  hy,
  fx,
  fy,
  ix,
  iy,
  swing,
  swing_cool,
  jump_cool,
  speed_lvl,
  net_lvl,
  hat_lvl,
  turtles,
  rocks,
  quake,
  quake_timer,
  pop,
  pop_x,
  pop_y,
  pop_left,
  time,
  seq);
export const Game$isGame = (value) => value instanceof Game;
export const Game$Game$phase = (value) => value.phase;
export const Game$Game$0 = (value) => value.phase;
export const Game$Game$level = (value) => value.level;
export const Game$Game$1 = (value) => value.level;
export const Game$Game$score = (value) => value.score;
export const Game$Game$2 = (value) => value.score;
export const Game$Game$level_start_score = (value) => value.level_start_score;
export const Game$Game$3 = (value) => value.level_start_score;
export const Game$Game$hx = (value) => value.hx;
export const Game$Game$4 = (value) => value.hx;
export const Game$Game$hy = (value) => value.hy;
export const Game$Game$5 = (value) => value.hy;
export const Game$Game$fx = (value) => value.fx;
export const Game$Game$6 = (value) => value.fx;
export const Game$Game$fy = (value) => value.fy;
export const Game$Game$7 = (value) => value.fy;
export const Game$Game$ix = (value) => value.ix;
export const Game$Game$8 = (value) => value.ix;
export const Game$Game$iy = (value) => value.iy;
export const Game$Game$9 = (value) => value.iy;
export const Game$Game$swing = (value) => value.swing;
export const Game$Game$10 = (value) => value.swing;
export const Game$Game$swing_cool = (value) => value.swing_cool;
export const Game$Game$11 = (value) => value.swing_cool;
export const Game$Game$jump_cool = (value) => value.jump_cool;
export const Game$Game$12 = (value) => value.jump_cool;
export const Game$Game$speed_lvl = (value) => value.speed_lvl;
export const Game$Game$13 = (value) => value.speed_lvl;
export const Game$Game$net_lvl = (value) => value.net_lvl;
export const Game$Game$14 = (value) => value.net_lvl;
export const Game$Game$hat_lvl = (value) => value.hat_lvl;
export const Game$Game$15 = (value) => value.hat_lvl;
export const Game$Game$turtles = (value) => value.turtles;
export const Game$Game$16 = (value) => value.turtles;
export const Game$Game$rocks = (value) => value.rocks;
export const Game$Game$17 = (value) => value.rocks;
export const Game$Game$quake = (value) => value.quake;
export const Game$Game$18 = (value) => value.quake;
export const Game$Game$quake_timer = (value) => value.quake_timer;
export const Game$Game$19 = (value) => value.quake_timer;
export const Game$Game$pop = (value) => value.pop;
export const Game$Game$20 = (value) => value.pop;
export const Game$Game$pop_x = (value) => value.pop_x;
export const Game$Game$21 = (value) => value.pop_x;
export const Game$Game$pop_y = (value) => value.pop_y;
export const Game$Game$22 = (value) => value.pop_y;
export const Game$Game$pop_left = (value) => value.pop_left;
export const Game$Game$23 = (value) => value.pop_left;
export const Game$Game$time = (value) => value.time;
export const Game$Game$24 = (value) => value.time;
export const Game$Game$seq = (value) => value.seq;
export const Game$Game$25 = (value) => value.seq;

export const screen_h = 144.0;

export const screen_w = 160.0;

/**
 * The HUD takes the top band of the screen; the field is everything below.
 */
export const field_top = 10.0;

const pi = 3.14159265;

const swing_cooldown_ms = 420.0;

const swing_ms = 220.0;

const turtle_half = 3.0;

const jump_ms = 1100.0;

const hunter_half = 3.0;

const jump_distance = 30.0;

const max_upgrade = 5;

const chasm_open_ms = 6000.0;

export function new_game() {
  return new Game(
    Phase$Title$const,
    1,
    0,
    0,
    screen_w / 2.0,
    screen_h - 14.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0,
    0,
    0,
    $List$Empty$const,
    $List$Empty$const,
    Quake$Calm$const,
    0.0,
    "",
    0.0,
    0.0,
    0.0,
    0.0,
    0,
  );
}

/**
 * Joystick vector. The shell sends something of length 0..1.
 */
export function set_input(g, x, y) {
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    x,
    y,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
}

function quake_interval(level) {
  return $float.max(5000.0, 14000.0 - ($int.to_float(level) * 900.0));
}

function rock_count(level) {
  let $ = level >= 4;
  if ($) {
    return $int.min(level - 3, 5);
  } else {
    return 0;
  }
}

function spawn_rocks(n) {
  return $list.map(
    $list.repeat(undefined, n),
    (_) => {
      let w = 10.0 + (random() * 14.0);
      let h = 6.0 + (random() * 8.0);
      return new Rock(random() * (screen_w - w), 48.0 + (random() * 62.0), w, h);
    },
  );
}

function turtle_count(level) {
  return $int.min(1 + level, 8);
}

function spawn_turtles(n, seq) {
  let turtles = $list.index_map(
    $list.repeat(undefined, n),
    (_, i) => {
      let angle = (random() * 2.0) * pi;
      return new Turtle(
        seq + i,
        16.0 + (random() * (screen_w - 32.0)),
        (field_top + 8.0) + (random() * 24.0),
        cos(angle),
        sin(angle),
        angle,
      );
    },
  );
  return [turtles, seq + n];
}

function start_level(g) {
  let $ = spawn_turtles(turtle_count(g.level), g.seq);
  let turtles = $[0];
  let seq = $[1];
  return new Game(
    Phase$Playing$const,
    g.level,
    g.score,
    g.score,
    screen_w / 2.0,
    screen_h - 14.0,
    0.0,
    -1.0,
    g.ix,
    g.iy,
    0.0,
    0.0,
    0.0,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    turtles,
    spawn_rocks(rock_count(g.level)),
    Quake$Calm$const,
    quake_interval(g.level) + 2500.0,
    g.pop,
    g.pop_x,
    g.pop_y,
    0.0,
    0.0,
    seq,
  );
}

function catch_points_loop(loop$n, loop$each, loop$acc) {
  while (true) {
    let n = loop$n;
    let each = loop$each;
    let acc = loop$acc;
    let $ = n <= 0;
    if ($) {
      return $float.round(acc);
    } else {
      loop$n = n - 1;
      loop$each = each * 1.5;
      loop$acc = acc + each;
    }
  }
}

/**
 * 10 for a turtle; each extra turtle in the same swing is worth 50% more
 * than the one before it. One = 10, two = 25, three = 48, four = 81.
 * 
 * @ignore
 */
function catch_points(n) {
  return catch_points_loop(n, 10.0, 0.0);
}

function dist(ax, ay, bx, by) {
  let dx = ax - bx;
  let dy = ay - by;
  return sqrt((dx * dx) + (dy * dy));
}

export function net_radius(g) {
  return 7.0 + (2.0 * $int.to_float(g.net_lvl));
}

/**
 * How far in front of the hunter the net lands.
 */
export function net_reach(g) {
  return 9.0 + (2.0 * $int.to_float(g.net_lvl));
}

function swing_net(g) {
  let $ = g.swing_cool > 0.0;
  if ($) {
    return g;
  } else {
    let nx = g.hx + (g.fx * net_reach(g));
    let ny = g.hy + (g.fy * net_reach(g));
    let r = net_radius(g) + turtle_half;
    let $1 = $list.partition(
      g.turtles,
      (t) => { return dist(t.x, t.y, nx, ny) < r; },
    );
    let caught = $1[0];
    let free = $1[1];
    let g$1 = new Game(
      g.phase,
      g.level,
      g.score,
      g.level_start_score,
      g.hx,
      g.hy,
      g.fx,
      g.fy,
      g.ix,
      g.iy,
      swing_ms,
      swing_cooldown_ms,
      g.jump_cool,
      g.speed_lvl,
      g.net_lvl,
      g.hat_lvl,
      g.turtles,
      g.rocks,
      g.quake,
      g.quake_timer,
      g.pop,
      g.pop_x,
      g.pop_y,
      g.pop_left,
      g.time,
      g.seq,
    );
    let $2 = $list.length(caught);
    if ($2 === 0) {
      return g$1;
    } else {
      let n = $2;
      let pts = catch_points(n);
      let g$2 = new Game(
        g$1.phase,
        g$1.level,
        g$1.score + pts,
        g$1.level_start_score,
        g$1.hx,
        g$1.hy,
        g$1.fx,
        g$1.fy,
        g$1.ix,
        g$1.iy,
        g$1.swing,
        g$1.swing_cool,
        g$1.jump_cool,
        g$1.speed_lvl,
        g$1.net_lvl,
        g$1.hat_lvl,
        free,
        g$1.rocks,
        g$1.quake,
        g$1.quake_timer,
        "+" + $int.to_string(pts),
        nx,
        ny,
        900.0,
        g$1.time,
        g$1.seq,
      );
      if (free instanceof $Empty) {
        return new Game(
          Phase$LevelClear$const,
          g$2.level,
          g$2.score,
          g$2.level_start_score,
          g$2.hx,
          g$2.hy,
          g$2.fx,
          g$2.fy,
          0.0,
          0.0,
          g$2.swing,
          g$2.swing_cool,
          g$2.jump_cool,
          g$2.speed_lvl,
          g$2.net_lvl,
          g$2.hat_lvl,
          g$2.turtles,
          g$2.rocks,
          g$2.quake,
          g$2.quake_timer,
          g$2.pop,
          g$2.pop_x,
          g$2.pop_y,
          g$2.pop_left,
          g$2.time,
          g$2.seq,
        );
      } else {
        return g$2;
      }
    }
  }
}

/**
 * Button A: start / swing the net / retry after falling in.
 */
export function press_a(g) {
  let $ = g.phase;
  if ($ instanceof Title) {
    return start_level(new_game());
  } else if ($ instanceof Playing) {
    return swing_net(g);
  } else if ($ instanceof Dead) {
    return start_level(
      new Game(
        g.phase,
        g.level,
        g.level_start_score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        g.quake,
        g.quake_timer,
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      ),
    );
  } else {
    return g;
  }
}

function fall_in(g) {
  return new Game(
    Phase$Dead$const,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    0.0,
    0.0,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
}

function in_open_chasm(g, x, y) {
  let $ = g.quake;
  if ($ instanceof Open) {
    let cx = $.cx;
    let cy = $.cy;
    let r = $.r;
    return dist(x, y, cx, cy) < (r - 1.0);
  } else {
    return false;
  }
}

/**
 * A box of half-size `half` centred on (x, y) overlaps some rock.
 * 
 * @ignore
 */
function hits_rock(x, y, half, rocks) {
  return $list.any(
    rocks,
    (r) => {
      return ((((x + half) > r.x) && ((x - half) < (r.x + r.w))) && ((y + half) > r.y)) && ((y - half) < (r.y + r.h));
    },
  );
}

function clamp(v, lo, hi) {
  return $float.min(hi, $float.max(lo, v));
}

function jump(loop$g, loop$tries) {
  while (true) {
    let g = loop$g;
    let tries = loop$tries;
    let $ = tries <= 0;
    if ($) {
      return g;
    } else {
      let angle = (random() * 2.0) * pi;
      let lx = clamp(
        g.hx + (cos(angle) * jump_distance),
        hunter_half,
        screen_w - hunter_half,
      );
      let ly = clamp(
        g.hy + (sin(angle) * jump_distance),
        field_top + hunter_half,
        screen_h - hunter_half,
      );
      let $1 = hits_rock(lx, ly, hunter_half, g.rocks);
      if ($1) {
        loop$g = g;
        loop$tries = tries - 1;
      } else {
        let g$1 = new Game(
          g.phase,
          g.level,
          g.score,
          g.level_start_score,
          lx,
          ly,
          g.fx,
          g.fy,
          g.ix,
          g.iy,
          g.swing,
          g.swing_cool,
          jump_ms,
          g.speed_lvl,
          g.net_lvl,
          g.hat_lvl,
          g.turtles,
          g.rocks,
          g.quake,
          g.quake_timer,
          g.pop,
          g.pop_x,
          g.pop_y,
          g.pop_left,
          g.time,
          g.seq,
        );
        let $2 = in_open_chasm(g$1, lx, ly);
        if ($2) {
          return fall_in(g$1);
        } else {
          return g$1;
        }
      }
    }
  }
}

/**
 * Button B: emergency jump. Direction is random. That's the emergency.
 */
export function press_b(g) {
  let $ = g.phase;
  let $1 = g.jump_cool <= 0.0;
  if ($1 && $ instanceof Playing) {
    return jump(g, 6);
  } else {
    return g;
  }
}

export function cost(g, item) {
  if (item === 1) {
    return 30 + 30 * g.speed_lvl;
  } else if (item === 2) {
    return 30 + 30 * g.net_lvl;
  } else {
    return 5 + 5 * g.hat_lvl;
  }
}

export function can_buy(g, item) {
  let _block;
  if (item === 1) {
    _block = g.speed_lvl;
  } else if (item === 2) {
    _block = g.net_lvl;
  } else {
    _block = 0;
  }
  let lvl = _block;
  return (g.score >= cost(g, item)) && (lvl < max_upgrade);
}

/**
 * Shop: 1 = movement speed, 2 = net size, 3 = hat size (does nothing).
 */
export function buy(g, item) {
  let $ = (g.phase instanceof LevelClear) && can_buy(g, item);
  if ($) {
    let g$1 = new Game(
      g.phase,
      g.level,
      g.score - cost(g, item),
      g.level_start_score,
      g.hx,
      g.hy,
      g.fx,
      g.fy,
      g.ix,
      g.iy,
      g.swing,
      g.swing_cool,
      g.jump_cool,
      g.speed_lvl,
      g.net_lvl,
      g.hat_lvl,
      g.turtles,
      g.rocks,
      g.quake,
      g.quake_timer,
      g.pop,
      g.pop_x,
      g.pop_y,
      g.pop_left,
      g.time,
      g.seq,
    );
    if (item === 1) {
      return new Game(
        g$1.phase,
        g$1.level,
        g$1.score,
        g$1.level_start_score,
        g$1.hx,
        g$1.hy,
        g$1.fx,
        g$1.fy,
        g$1.ix,
        g$1.iy,
        g$1.swing,
        g$1.swing_cool,
        g$1.jump_cool,
        g$1.speed_lvl + 1,
        g$1.net_lvl,
        g$1.hat_lvl,
        g$1.turtles,
        g$1.rocks,
        g$1.quake,
        g$1.quake_timer,
        g$1.pop,
        g$1.pop_x,
        g$1.pop_y,
        g$1.pop_left,
        g$1.time,
        g$1.seq,
      );
    } else if (item === 2) {
      return new Game(
        g$1.phase,
        g$1.level,
        g$1.score,
        g$1.level_start_score,
        g$1.hx,
        g$1.hy,
        g$1.fx,
        g$1.fy,
        g$1.ix,
        g$1.iy,
        g$1.swing,
        g$1.swing_cool,
        g$1.jump_cool,
        g$1.speed_lvl,
        g$1.net_lvl + 1,
        g$1.hat_lvl,
        g$1.turtles,
        g$1.rocks,
        g$1.quake,
        g$1.quake_timer,
        g$1.pop,
        g$1.pop_x,
        g$1.pop_y,
        g$1.pop_left,
        g$1.time,
        g$1.seq,
      );
    } else {
      return new Game(
        g$1.phase,
        g$1.level,
        g$1.score,
        g$1.level_start_score,
        g$1.hx,
        g$1.hy,
        g$1.fx,
        g$1.fy,
        g$1.ix,
        g$1.iy,
        g$1.swing,
        g$1.swing_cool,
        g$1.jump_cool,
        g$1.speed_lvl,
        g$1.net_lvl,
        g$1.hat_lvl + 1,
        g$1.turtles,
        g$1.rocks,
        g$1.quake,
        g$1.quake_timer,
        g$1.pop,
        g$1.pop_x,
        g$1.pop_y,
        g$1.pop_left,
        g$1.time,
        g$1.seq,
      );
    }
  } else {
    return g;
  }
}

export function next_level(g) {
  let $ = g.phase;
  if ($ instanceof LevelClear) {
    return start_level(
      new Game(
        g.phase,
        g.level + 1,
        g.score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        g.quake,
        g.quake_timer,
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      ),
    );
  } else {
    return g;
  }
}

function products() {
  return toList([
    ["Soup Umbrella", "Keeps the rain off your soup."],
    ["Left-Handed Teabags", "Finally."],
    ["Decaf Espresso Shots", "All of the ritual. None of the point."],
    ["Pre-Chewed Gum", "We did the hard part."],
    ["Invisible Hi-Vis Vest", "Safety you can't see."],
    ["Solar-Powered Torch", "Works best when you don't need it."],
    ["Waterproof Sponge", "Absorbs nothing. Lasts forever."],
    ["Silent Doorbell", "Respects your boundaries."],
    ["Square Wheels", "For when round is too mainstream."],
    ["Scented Candle: Wet Dog", "Just like home."],
    ["Glow-in-the-Dark Sunglasses", "Find them at night. Wear them never."],
    ["Diet Water", "Zero calories. Somehow less."],
    ["Pocket Trampoline", "Do not put in pocket."],
    ["Inflatable Anvil", "Lightweight. Pointless."],
    ["Non-Stick Glue", "Our strongest formula yet."],
    ["Self-Folding Map", "It will not unfold."],
    ["Hollow Chocolate Spoon", "Dissolves on contact with soup."],
    ["Turtle Repellent", "Unscented. Untested. Unlikely."],
    ["Stairs for Snakes", "Twelve steps. No takers."],
    ["Reusable Napkin: Single Use", "Read the label twice."],
    ["Mild Hot Sauce", "Room temperature hot."],
    ["Indoor Kite", "Low ceiling edition."],
    ["Unsalted Sea Salt", "From the sea. Minus the sea."],
    ["Cordless Extension Cord", "Reach for nothing."],
  ]);
}

function pick_product() {
  let all = products();
  let n = $list.length(all);
  let i = $float.truncate(random() * $int.to_float(n));
  let $ = $list.drop(all, i);
  if ($ instanceof $Empty) {
    return ["Thing", "It's a thing."];
  } else {
    let p = $.head;
    return p;
  }
}

function open_chasm(g, cx, cy, r) {
  let $ = pick_product();
  let product = $[0];
  let tagline = $[1];
  let g$1 = new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    g.ix,
    g.iy,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    $list.filter(g.turtles, (t) => { return dist(t.x, t.y, cx, cy) >= r; }),
    g.rocks,
    new Open(g.seq, cx, cy, r, chasm_open_ms, product, tagline),
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq + 1,
  );
  let $1 = dist(g$1.hx, g$1.hy, cx, cy) < r;
  if ($1) {
    return fall_in(g$1);
  } else {
    let $2 = g$1.turtles;
    if ($2 instanceof $Empty) {
      return new Game(
        Phase$LevelClear$const,
        g$1.level,
        g$1.score,
        g$1.level_start_score,
        g$1.hx,
        g$1.hy,
        g$1.fx,
        g$1.fy,
        0.0,
        0.0,
        g$1.swing,
        g$1.swing_cool,
        g$1.jump_cool,
        g$1.speed_lvl,
        g$1.net_lvl,
        g$1.hat_lvl,
        g$1.turtles,
        g$1.rocks,
        g$1.quake,
        g$1.quake_timer,
        g$1.pop,
        g$1.pop_x,
        g$1.pop_y,
        g$1.pop_left,
        g$1.time,
        g$1.seq,
      );
    } else {
      return g$1;
    }
  }
}

export function warn_ms(level) {
  return $float.max(1500.0, 4000.0 - ($int.to_float(level) * 250.0));
}

function chasm_radius(level) {
  return $float.min(22.0 + ($int.to_float(level) * 1.5), 36.0);
}

/**
 * The ground cracks around the hunter — never conveniently elsewhere.
 * 
 * @ignore
 */
function start_warning(g) {
  let r = chasm_radius(g.level);
  let angle = (random() * 2.0) * pi;
  let off = (random() * r) * 0.5;
  let cx = clamp(g.hx + (cos(angle) * off), r * 0.5, screen_w - (r * 0.5));
  let cy = clamp(
    g.hy + (sin(angle) * off),
    field_top + (r * 0.5),
    screen_h - (r * 0.5),
  );
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    g.ix,
    g.iy,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    new Warning(cx, cy, r, warn_ms(g.level)),
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
}

function tick_quake(g, dt) {
  let $ = g.quake;
  if ($ instanceof Calm) {
    let $1 = (g.quake_timer - dt) <= 0.0;
    if ($1) {
      return start_warning(g);
    } else {
      return new Game(
        g.phase,
        g.level,
        g.score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        g.quake,
        g.quake_timer - dt,
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      );
    }
  } else if ($ instanceof Warning) {
    let cx = $.cx;
    let cy = $.cy;
    let r = $.r;
    let left = $.left;
    let $1 = (left - dt) <= 0.0;
    if ($1) {
      return open_chasm(g, cx, cy, r);
    } else {
      return new Game(
        g.phase,
        g.level,
        g.score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        new Warning(cx, cy, r, left - dt),
        g.quake_timer,
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      );
    }
  } else {
    let id = $.id;
    let cx = $.cx;
    let cy = $.cy;
    let r = $.r;
    let left = $.left;
    let product = $.product;
    let tagline = $.tagline;
    let $1 = (left - dt) <= 0.0;
    if ($1) {
      return new Game(
        g.phase,
        g.level,
        g.score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        Quake$Calm$const,
        quake_interval(g.level),
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      );
    } else {
      return new Game(
        g.phase,
        g.level,
        g.score,
        g.level_start_score,
        g.hx,
        g.hy,
        g.fx,
        g.fy,
        g.ix,
        g.iy,
        g.swing,
        g.swing_cool,
        g.jump_cool,
        g.speed_lvl,
        g.net_lvl,
        g.hat_lvl,
        g.turtles,
        g.rocks,
        new Open(id, cx, cy, r, left - dt, product, tagline),
        g.quake_timer,
        g.pop,
        g.pop_x,
        g.pop_y,
        g.pop_left,
        g.time,
        g.seq,
      );
    }
  }
}

function normalize(x, y) {
  let d = sqrt((x * x) + (y * y));
  let $ = d < 0.0001;
  if ($) {
    return [0.0, -1.0];
  } else {
    return [divideFloat(x, d), divideFloat(y, d)];
  }
}

/**
 * 0 when further than `margin` from a wall, rising to 1.5 against it.
 * 
 * @ignore
 */
function wall_push(distance, margin) {
  let $ = distance < margin;
  if ($) {
    return (divideFloat((margin - distance), margin)) * 1.5;
  } else {
    return 0.0;
  }
}

/**
 * #(is there one, cx, cy, r) for whichever quake stage is on screen.
 * 
 * @ignore
 */
function quake_circle(q) {
  if (q instanceof Calm) {
    return [false, 0.0, 0.0, 0.0];
  } else if (q instanceof Warning) {
    let cx = q.cx;
    let cy = q.cy;
    let r = q.r;
    return [true, cx, cy, r];
  } else {
    let cx = q.cx;
    let cy = q.cy;
    let r = q.r;
    return [true, cx, cy, r];
  }
}

/**
 * How far away a turtle notices the hunter.
 * 
 * @ignore
 */
function flee_radius(level) {
  return $float.min(22.0 + ($int.to_float(level) * 4.0), 64.0);
}

function turtle_speed(level) {
  return $float.min(20.0 + ($int.to_float(level) * 3.0), 46.0);
}

function step_turtle(t, g, dt) {
  let step = ((turtle_speed(g.level) * dt)) / 1000.0;
  let _block;
  let $1 = g.level >= 6;
  if ($1) {
    _block = [g.hx + (g.fx * 14.0), g.hy + (g.fy * 14.0)];
  } else {
    _block = [g.hx, g.hy];
  }
  let $ = _block;
  let hx = $[0];
  let hy = $[1];
  let ddx = t.x - hx;
  let ddy = t.y - hy;
  let d = $float.max(1.0, sqrt((ddx * ddx) + (ddy * ddy)));
  let sense = flee_radius(g.level);
  let _block$1;
  let $2 = d < sense;
  if ($2) {
    _block$1 = 1.0 + ((divideFloat((sense - d), sense)) * 3.0);
  } else {
    _block$1 = 0.0;
  }
  let fear = _block$1;
  let sx = (divideFloat(ddx, d)) * fear;
  let sy = (divideFloat(ddy, d)) * fear;
  let _block$2;
  let $4 = quake_circle(g.quake);
  if ($4[0]) {
    let cx = $4[1];
    let cy = $4[2];
    let r = $4[3];
    let qx = t.x - cx;
    let qy = t.y - cy;
    let qd = $float.max(1.0, sqrt((qx * qx) + (qy * qy)));
    let $5 = qd < (r + 14.0);
    if ($5) {
      _block$2 = [
        sx + ((divideFloat(qx, qd)) * 3.0),
        sy + ((divideFloat(qy, qd)) * 3.0),
      ];
    } else {
      _block$2 = [sx, sy];
    }
  } else {
    _block$2 = [sx, sy];
  }
  let $3 = _block$2;
  let sx$1 = $3[0];
  let sy$1 = $3[1];
  let _block$3;
  let $6 = g.level >= 3;
  if ($6) {
    let margin = 14.0;
    let wx = wall_push(t.x, margin) - wall_push(screen_w - t.x, margin);
    let wy = wall_push(t.y - field_top, margin) - wall_push(
      screen_h - t.y,
      margin,
    );
    _block$3 = [sx$1 + wx, sy$1 + wy];
  } else {
    _block$3 = [sx$1, sy$1];
  }
  let $5 = _block$3;
  let sx$2 = $5[0];
  let sy$2 = $5[1];
  let wander = t.wander + ((random() - 0.5) * 1.4);
  let sx$3 = sx$2 + (cos(wander) * 0.5);
  let sy$3 = sy$2 + (sin(wander) * 0.5);
  let $7 = normalize(sx$3, sy$3);
  let sx$4 = $7[0];
  let sy$4 = $7[1];
  let $8 = normalize(
    (t.dx * 0.75) + (sx$4 * 0.25),
    (t.dy * 0.75) + (sy$4 * 0.25),
  );
  let dx = $8[0];
  let dy = $8[1];
  let nx = t.x + (dx * step);
  let ny = t.y + (dy * step);
  let _block$4;
  let $10 = (nx < turtle_half) || (nx > (screen_w - turtle_half));
  if ($10) {
    _block$4 = [t.x, -1.0 * dx];
  } else {
    _block$4 = [nx, dx];
  }
  let $9 = _block$4;
  let nx$1 = $9[0];
  let dx$1 = $9[1];
  let _block$5;
  let $12 = (ny < (field_top + turtle_half)) || (ny > (screen_h - turtle_half));
  if ($12) {
    _block$5 = [t.y, -1.0 * dy];
  } else {
    _block$5 = [ny, dy];
  }
  let $11 = _block$5;
  let ny$1 = $11[0];
  let dy$1 = $11[1];
  let $13 = hits_rock(nx$1, ny$1, turtle_half, g.rocks);
  if ($13) {
    return new Turtle(t.id, t.x, t.y, -1.0 * dx$1, -1.0 * dy$1, wander);
  } else {
    return new Turtle(t.id, nx$1, ny$1, dx$1, dy$1, wander);
  }
}

function move_turtles(g, dt) {
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    g.ix,
    g.iy,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    $list.map(g.turtles, (t) => { return step_turtle(t, g, dt); }),
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
}

export function hunter_speed(g) {
  return 36.0 + (5.0 * $int.to_float(g.speed_lvl));
}

function move_hunter(g, dt) {
  let step = ((hunter_speed(g) * dt)) / 1000.0;
  let nx = clamp(g.hx + (g.ix * step), hunter_half, screen_w - hunter_half);
  let ny = clamp(
    g.hy + (g.iy * step),
    field_top + hunter_half,
    screen_h - hunter_half,
  );
  let _block;
  let $ = hits_rock(nx, g.hy, hunter_half, g.rocks);
  if ($) {
    _block = g.hx;
  } else {
    _block = nx;
  }
  let nx$1 = _block;
  let _block$1;
  let $1 = hits_rock(nx$1, ny, hunter_half, g.rocks);
  if ($1) {
    _block$1 = g.hy;
  } else {
    _block$1 = ny;
  }
  let ny$1 = _block$1;
  let _block$2;
  let $3 = (g.ix === 0.0) && (g.iy === 0.0);
  if ($3) {
    _block$2 = [g.fx, g.fy];
  } else {
    _block$2 = normalize(g.ix, g.iy);
  }
  let $2 = _block$2;
  let fx = $2[0];
  let fy = $2[1];
  let g$1 = new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    nx$1,
    ny$1,
    fx,
    fy,
    g.ix,
    g.iy,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
  let $4 = in_open_chasm(g$1, g$1.hx, g$1.hy);
  if ($4) {
    return fall_in(g$1);
  } else {
    return g$1;
  }
}

function tick_timers(g, dt) {
  return new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    g.ix,
    g.iy,
    $float.max(0.0, g.swing - dt),
    $float.max(0.0, g.swing_cool - dt),
    $float.max(0.0, g.jump_cool - dt),
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    g.pop_left,
    g.time,
    g.seq,
  );
}

export function tick(g, dt) {
  let g$1 = new Game(
    g.phase,
    g.level,
    g.score,
    g.level_start_score,
    g.hx,
    g.hy,
    g.fx,
    g.fy,
    g.ix,
    g.iy,
    g.swing,
    g.swing_cool,
    g.jump_cool,
    g.speed_lvl,
    g.net_lvl,
    g.hat_lvl,
    g.turtles,
    g.rocks,
    g.quake,
    g.quake_timer,
    g.pop,
    g.pop_x,
    g.pop_y,
    $float.max(0.0, g.pop_left - dt),
    g.time + dt,
    g.seq,
  );
  let $ = g$1.phase;
  if ($ instanceof Playing) {
    let _pipe = g$1;
    let _pipe$1 = tick_timers(_pipe, dt);
    let _pipe$2 = move_hunter(_pipe$1, dt);
    let _pipe$3 = move_turtles(_pipe$2, dt);
    return tick_quake(_pipe$3, dt);
  } else {
    return g$1;
  }
}

export function phase_name(g) {
  let $ = g.phase;
  if ($ instanceof Title) {
    return "title";
  } else if ($ instanceof Playing) {
    return "playing";
  } else if ($ instanceof Dead) {
    return "dead";
  } else {
    return "clear";
  }
}

/**
 * #(kind, cx, cy, r, ms left) — kind is "calm", "warning" or "open".
 */
export function quake_info(g) {
  let $ = g.quake;
  if ($ instanceof Calm) {
    return ["calm", 0.0, 0.0, 0.0, 0.0];
  } else if ($ instanceof Warning) {
    let cx = $.cx;
    let cy = $.cy;
    let r = $.r;
    let left = $.left;
    return ["warning", cx, cy, r, left];
  } else {
    let cx = $.cx;
    let cy = $.cy;
    let r = $.r;
    let left = $.left;
    return ["open", cx, cy, r, left];
  }
}

/**
 * #(id, product, tagline) for the ad in the open chasm; id -1 if none.
 */
export function quake_ad(g) {
  let $ = g.quake;
  if ($ instanceof Open) {
    let id = $.id;
    let product = $.product;
    let tagline = $.tagline;
    return [id, product, tagline];
  } else {
    return [-1, "", ""];
  }
}

export function turtles_left(g) {
  return $list.length(g.turtles);
}

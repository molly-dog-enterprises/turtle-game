//// Call me the hunter (The turtle game).
////
//// A from-scratch second game. All the rules live here, compiled to
//// JavaScript; the shell draws the state onto a tiny 160×144 screen and
//// forwards the joystick and two buttons.
////
//// Rules:
//// - You are the hunter, with a net over your shoulder. The turtles start
////   at the top of the screen, you start at the bottom.
//// - Joystick moves. Button A swings the net: every turtle inside it is
////   caught at once, and catching several in one swing pays extra.
//// - Button B is an emergency jump in a random direction. Random.
//// - Every so often the ground cracks under you. You have a few seconds to
////   leave the circle before it opens into a chasm. Stand in it, walk into
////   it later, or jump into it, and you fall in. Falling in lets you retry
////   the level; the points you earned this level go with you.
//// - Each chasm vomits up an ad for a product nobody wants.
//// - Catch every turtle to clear the level. Between levels you can spend
////   points on movement speed, net size, or hat size. Hat size does
////   nothing.
//// - Higher levels: more turtles, faster, better at avoiding you, less
////   warning before chasms, and rocks in the way.

import gleam/float
import gleam/int
import gleam/list

@external(javascript, "./hunter_ffi.mjs", "random")
fn random() -> Float

@external(javascript, "./hunter_ffi.mjs", "sqrt")
fn sqrt(x: Float) -> Float

@external(javascript, "./hunter_ffi.mjs", "cos")
fn cos(x: Float) -> Float

@external(javascript, "./hunter_ffi.mjs", "sin")
fn sin(x: Float) -> Float

// ---------------------------------------------------------------------------
// Constants (logical screen: the shell scales it up with crunchy pixels)
// ---------------------------------------------------------------------------

pub const screen_w = 160.0

pub const screen_h = 144.0

/// The HUD takes the top band of the screen; the field is everything below.
pub const field_top = 10.0

const hunter_half = 3.0

const turtle_half = 3.0

const pi = 3.14159265

const swing_ms = 220.0

const swing_cooldown_ms = 420.0

const jump_ms = 1100.0

const jump_distance = 30.0

const chasm_open_ms = 6000.0

const max_upgrade = 5

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

pub type Phase {
  Title
  Playing
  Dead
  LevelClear
}

pub type Quake {
  Calm
  /// The ground is cracking. Leave the circle before `left` hits zero.
  Warning(cx: Float, cy: Float, r: Float, left: Float)
  /// The chasm is open and an ad has rotated out of it. Don't walk in.
  Open(
    id: Int,
    cx: Float,
    cy: Float,
    r: Float,
    left: Float,
    product: String,
    tagline: String,
  )
}

pub type Turtle {
  Turtle(
    id: Int,
    x: Float,
    y: Float,
    // heading, unit-ish, blended each tick
    dx: Float,
    dy: Float,
    // the angle it wanders in when nothing is scaring it
    wander: Float,
  )
}

pub type Rock {
  Rock(x: Float, y: Float, w: Float, h: Float)
}

pub type Game {
  Game(
    phase: Phase,
    level: Int,
    score: Int,
    /// Score when this level began — dying rolls you back to it.
    level_start_score: Int,
    // --- the hunter ---
    hx: Float,
    hy: Float,
    // facing (where the net swings), kept from the last stick input
    fx: Float,
    fy: Float,
    // stick input, a vector of length 0..1
    ix: Float,
    iy: Float,
    // net swing animation left, and cooldown before the next swing
    swing: Float,
    swing_cool: Float,
    jump_cool: Float,
    speed_lvl: Int,
    net_lvl: Int,
    hat_lvl: Int,
    // --- the world ---
    turtles: List(Turtle),
    rocks: List(Rock),
    quake: Quake,
    /// ms until the ground next cracks (only counts while Calm)
    quake_timer: Float,
    // --- feedback for the shell ---
    /// a floating "+25" that rises and fades
    pop: String,
    pop_x: Float,
    pop_y: Float,
    pop_left: Float,
    /// ms elapsed this level, for animation
    time: Float,
    seq: Int,
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

pub fn new_game() -> Game {
  Game(
    phase: Title,
    level: 1,
    score: 0,
    level_start_score: 0,
    hx: screen_w /. 2.0,
    hy: screen_h -. 14.0,
    fx: 0.0,
    fy: -1.0,
    ix: 0.0,
    iy: 0.0,
    swing: 0.0,
    swing_cool: 0.0,
    jump_cool: 0.0,
    speed_lvl: 0,
    net_lvl: 0,
    hat_lvl: 0,
    turtles: [],
    rocks: [],
    quake: Calm,
    quake_timer: 0.0,
    pop: "",
    pop_x: 0.0,
    pop_y: 0.0,
    pop_left: 0.0,
    time: 0.0,
    seq: 0,
  )
}

/// Joystick vector. The shell sends something of length 0..1.
pub fn set_input(g: Game, x: Float, y: Float) -> Game {
  Game(..g, ix: x, iy: y)
}

/// Button A: start / swing the net / retry after falling in.
pub fn press_a(g: Game) -> Game {
  case g.phase {
    Title -> start_level(new_game())
    Playing -> swing_net(g)
    Dead -> start_level(Game(..g, score: g.level_start_score))
    // In the shop the shell maps A to `buy` and B to `next_level`.
    LevelClear -> g
  }
}

/// Button B: emergency jump. Direction is random. That's the emergency.
pub fn press_b(g: Game) -> Game {
  case g.phase, g.jump_cool <=. 0.0 {
    Playing, True -> jump(g, 6)
    _, _ -> g
  }
}

/// Shop: 1 = movement speed, 2 = net size, 3 = hat size (does nothing).
pub fn buy(g: Game, item: Int) -> Game {
  case g.phase == LevelClear && can_buy(g, item) {
    False -> g
    True -> {
      let g = Game(..g, score: g.score - cost(g, item))
      case item {
        1 -> Game(..g, speed_lvl: g.speed_lvl + 1)
        2 -> Game(..g, net_lvl: g.net_lvl + 1)
        _ -> Game(..g, hat_lvl: g.hat_lvl + 1)
      }
    }
  }
}

pub fn can_buy(g: Game, item: Int) -> Bool {
  let lvl = case item {
    1 -> g.speed_lvl
    2 -> g.net_lvl
    _ -> 0
  }
  g.score >= cost(g, item) && lvl < max_upgrade
}

pub fn cost(g: Game, item: Int) -> Int {
  case item {
    1 -> 30 + 30 * g.speed_lvl
    2 -> 30 + 30 * g.net_lvl
    _ -> 5 + 5 * g.hat_lvl
  }
}

pub fn next_level(g: Game) -> Game {
  case g.phase {
    LevelClear -> start_level(Game(..g, level: g.level + 1))
    _ -> g
  }
}

pub fn tick(g: Game, dt: Float) -> Game {
  let g =
    Game(..g, time: g.time +. dt, pop_left: float.max(0.0, g.pop_left -. dt))
  case g.phase {
    Playing ->
      g
      |> tick_timers(dt)
      |> move_hunter(dt)
      |> move_turtles(dt)
      |> tick_quake(dt)
    _ -> g
  }
}

// --- read-only helpers for the shell -------------------------------------

pub fn phase_name(g: Game) -> String {
  case g.phase {
    Title -> "title"
    Playing -> "playing"
    Dead -> "dead"
    LevelClear -> "clear"
  }
}

/// #(kind, cx, cy, r, ms left) — kind is "calm", "warning" or "open".
pub fn quake_info(g: Game) -> #(String, Float, Float, Float, Float) {
  case g.quake {
    Calm -> #("calm", 0.0, 0.0, 0.0, 0.0)
    Warning(cx, cy, r, left) -> #("warning", cx, cy, r, left)
    Open(_, cx, cy, r, left, _, _) -> #("open", cx, cy, r, left)
  }
}

/// #(id, product, tagline) for the ad in the open chasm; id -1 if none.
pub fn quake_ad(g: Game) -> #(Int, String, String) {
  case g.quake {
    Open(id, _, _, _, _, product, tagline) -> #(id, product, tagline)
    _ -> #(-1, "", "")
  }
}

pub fn turtles_left(g: Game) -> Int {
  list.length(g.turtles)
}

pub fn hunter_speed(g: Game) -> Float {
  36.0 +. 5.0 *. int.to_float(g.speed_lvl)
}

/// How far in front of the hunter the net lands.
pub fn net_reach(g: Game) -> Float {
  9.0 +. 2.0 *. int.to_float(g.net_lvl)
}

pub fn net_radius(g: Game) -> Float {
  7.0 +. 2.0 *. int.to_float(g.net_lvl)
}

pub fn warn_ms(level: Int) -> Float {
  float.max(1500.0, 4000.0 -. int.to_float(level) *. 250.0)
}

// ---------------------------------------------------------------------------
// Level setup
// ---------------------------------------------------------------------------

fn start_level(g: Game) -> Game {
  let #(turtles, seq) = spawn_turtles(turtle_count(g.level), g.seq)
  Game(
    ..g,
    phase: Playing,
    level_start_score: g.score,
    hx: screen_w /. 2.0,
    hy: screen_h -. 14.0,
    fx: 0.0,
    fy: -1.0,
    swing: 0.0,
    swing_cool: 0.0,
    jump_cool: 0.0,
    turtles: turtles,
    rocks: spawn_rocks(rock_count(g.level)),
    quake: Calm,
    // the first one holds off a little so you can find your feet
    quake_timer: quake_interval(g.level) +. 2500.0,
    pop_left: 0.0,
    time: 0.0,
    seq: seq,
  )
}

fn spawn_turtles(n: Int, seq: Int) -> #(List(Turtle), Int) {
  let turtles =
    list.index_map(list.repeat(Nil, n), fn(_, i) {
      let angle = random() *. 2.0 *. pi
      Turtle(
        id: seq + i,
        x: 16.0 +. random() *. { screen_w -. 32.0 },
        y: field_top +. 8.0 +. random() *. 24.0,
        dx: cos(angle),
        dy: sin(angle),
        wander: angle,
      )
    })
  #(turtles, seq + n)
}

fn spawn_rocks(n: Int) -> List(Rock) {
  list.map(list.repeat(Nil, n), fn(_) {
    let w = 10.0 +. random() *. 14.0
    let h = 6.0 +. random() *. 8.0
    // the middle band: clear of the turtles' start and the hunter's
    Rock(x: random() *. { screen_w -. w }, y: 48.0 +. random() *. 62.0, w: w, h: h)
  })
}

// ---------------------------------------------------------------------------
// Difficulty
// ---------------------------------------------------------------------------

fn turtle_count(level: Int) -> Int {
  int.min(1 + level, 8)
}

fn turtle_speed(level: Int) -> Float {
  float.min(20.0 +. int.to_float(level) *. 3.0, 46.0)
}

/// How far away a turtle notices the hunter.
fn flee_radius(level: Int) -> Float {
  float.min(22.0 +. int.to_float(level) *. 4.0, 64.0)
}

fn quake_interval(level: Int) -> Float {
  float.max(5000.0, 14_000.0 -. int.to_float(level) *. 900.0)
}

fn chasm_radius(level: Int) -> Float {
  float.min(22.0 +. int.to_float(level) *. 1.5, 36.0)
}

fn rock_count(level: Int) -> Int {
  case level >= 4 {
    True -> int.min(level - 3, 5)
    False -> 0
  }
}

// ---------------------------------------------------------------------------
// The hunter
// ---------------------------------------------------------------------------

fn tick_timers(g: Game, dt: Float) -> Game {
  Game(
    ..g,
    swing: float.max(0.0, g.swing -. dt),
    swing_cool: float.max(0.0, g.swing_cool -. dt),
    jump_cool: float.max(0.0, g.jump_cool -. dt),
  )
}

fn move_hunter(g: Game, dt: Float) -> Game {
  let step = hunter_speed(g) *. dt /. 1000.0
  let nx = clamp(g.hx +. g.ix *. step, hunter_half, screen_w -. hunter_half)
  let ny =
    clamp(g.hy +. g.iy *. step, field_top +. hunter_half, screen_h -. hunter_half)
  // Rocks: slide along them one axis at a time.
  let nx = case hits_rock(nx, g.hy, hunter_half, g.rocks) {
    True -> g.hx
    False -> nx
  }
  let ny = case hits_rock(nx, ny, hunter_half, g.rocks) {
    True -> g.hy
    False -> ny
  }
  let #(fx, fy) = case g.ix == 0.0 && g.iy == 0.0 {
    True -> #(g.fx, g.fy)
    False -> normalize(g.ix, g.iy)
  }
  let g = Game(..g, hx: nx, hy: ny, fx: fx, fy: fy)
  // Walking into an open chasm is exactly as bad as it sounds.
  case in_open_chasm(g, g.hx, g.hy) {
    True -> fall_in(g)
    False -> g
  }
}

fn swing_net(g: Game) -> Game {
  case g.swing_cool >. 0.0 {
    True -> g
    False -> {
      let nx = g.hx +. g.fx *. net_reach(g)
      let ny = g.hy +. g.fy *. net_reach(g)
      let r = net_radius(g) +. turtle_half
      let #(caught, free) =
        list.partition(g.turtles, fn(t) { dist(t.x, t.y, nx, ny) <. r })
      let g = Game(..g, swing: swing_ms, swing_cool: swing_cooldown_ms)
      case list.length(caught) {
        0 -> g
        n -> {
          let pts = catch_points(n)
          let g =
            Game(
              ..g,
              turtles: free,
              score: g.score + pts,
              pop: "+" <> int.to_string(pts),
              pop_x: nx,
              pop_y: ny,
              pop_left: 900.0,
            )
          case free {
            [] -> Game(..g, phase: LevelClear, ix: 0.0, iy: 0.0)
            _ -> g
          }
        }
      }
    }
  }
}

/// 10 for a turtle; each extra turtle in the same swing is worth 50% more
/// than the one before it. One = 10, two = 25, three = 48, four = 81.
fn catch_points(n: Int) -> Int {
  catch_points_loop(n, 10.0, 0.0)
}

fn catch_points_loop(n: Int, each: Float, acc: Float) -> Int {
  case n <= 0 {
    True -> float.round(acc)
    False -> catch_points_loop(n - 1, each *. 1.5, acc +. each)
  }
}

fn jump(g: Game, tries: Int) -> Game {
  case tries <= 0 {
    True -> g
    False -> {
      let angle = random() *. 2.0 *. pi
      let lx =
        clamp(
          g.hx +. cos(angle) *. jump_distance,
          hunter_half,
          screen_w -. hunter_half,
        )
      let ly =
        clamp(
          g.hy +. sin(angle) *. jump_distance,
          field_top +. hunter_half,
          screen_h -. hunter_half,
        )
      case hits_rock(lx, ly, hunter_half, g.rocks) {
        True -> jump(g, tries - 1)
        False -> {
          let g = Game(..g, hx: lx, hy: ly, jump_cool: jump_ms)
          case in_open_chasm(g, lx, ly) {
            True -> fall_in(g)
            False -> g
          }
        }
      }
    }
  }
}

fn fall_in(g: Game) -> Game {
  Game(..g, phase: Dead, ix: 0.0, iy: 0.0)
}

// ---------------------------------------------------------------------------
// Turtles
// ---------------------------------------------------------------------------

fn move_turtles(g: Game, dt: Float) -> Game {
  Game(..g, turtles: list.map(g.turtles, fn(t) { step_turtle(t, g, dt) }))
}

fn step_turtle(t: Turtle, g: Game, dt: Float) -> Turtle {
  let step = turtle_speed(g.level) *. dt /. 1000.0
  // Smarter turtles flee from where the hunter is heading, not where he is.
  let #(hx, hy) = case g.level >= 6 {
    True -> #(g.hx +. g.fx *. 14.0, g.hy +. g.fy *. 14.0)
    False -> #(g.hx, g.hy)
  }
  let ddx = t.x -. hx
  let ddy = t.y -. hy
  let d = float.max(1.0, sqrt(ddx *. ddx +. ddy *. ddy))
  let sense = flee_radius(g.level)
  let fear = case d <. sense {
    True -> 1.0 +. { sense -. d } /. sense *. 3.0
    False -> 0.0
  }
  let sx = ddx /. d *. fear
  let sy = ddy /. d *. fear
  // Turtles know about the chasm. They are the smart ones here.
  let #(sx, sy) = case quake_circle(g.quake) {
    #(False, _, _, _) -> #(sx, sy)
    #(True, cx, cy, r) -> {
      let qx = t.x -. cx
      let qy = t.y -. cy
      let qd = float.max(1.0, sqrt(qx *. qx +. qy *. qy))
      case qd <. r +. 14.0 {
        True -> #(sx +. qx /. qd *. 3.0, sy +. qy /. qd *. 3.0)
        False -> #(sx, sy)
      }
    }
  }
  // Walls: level 3+ stops running into corners.
  let #(sx, sy) = case g.level >= 3 {
    False -> #(sx, sy)
    True -> {
      let margin = 14.0
      let wx =
        wall_push(t.x, margin) -. wall_push(screen_w -. t.x, margin)
      let wy =
        wall_push(t.y -. field_top, margin) -. wall_push(screen_h -. t.y, margin)
      #(sx +. wx, sy +. wy)
    }
  }
  // Wander when nothing is scaring it.
  let wander = t.wander +. { random() -. 0.5 } *. 1.4
  let sx = sx +. cos(wander) *. 0.5
  let sy = sy +. sin(wander) *. 0.5
  let #(sx, sy) = normalize(sx, sy)
  let #(dx, dy) = normalize(t.dx *. 0.75 +. sx *. 0.25, t.dy *. 0.75 +. sy *. 0.25)
  let nx = t.x +. dx *. step
  let ny = t.y +. dy *. step
  // Bounce off the edges and the rocks.
  let #(nx, dx) = case nx <. turtle_half || nx >. screen_w -. turtle_half {
    True -> #(t.x, -1.0 *. dx)
    False -> #(nx, dx)
  }
  let #(ny, dy) = case
    ny <. field_top +. turtle_half || ny >. screen_h -. turtle_half
  {
    True -> #(t.y, -1.0 *. dy)
    False -> #(ny, dy)
  }
  case hits_rock(nx, ny, turtle_half, g.rocks) {
    True -> Turtle(..t, dx: -1.0 *. dx, dy: -1.0 *. dy, wander: wander)
    False -> Turtle(..t, x: nx, y: ny, dx: dx, dy: dy, wander: wander)
  }
}

/// 0 when further than `margin` from a wall, rising to 1.5 against it.
fn wall_push(distance: Float, margin: Float) -> Float {
  case distance <. margin {
    True -> { margin -. distance } /. margin *. 1.5
    False -> 0.0
  }
}

// ---------------------------------------------------------------------------
// Earthquakes
// ---------------------------------------------------------------------------

fn tick_quake(g: Game, dt: Float) -> Game {
  case g.quake {
    Calm ->
      case g.quake_timer -. dt <=. 0.0 {
        True -> start_warning(g)
        False -> Game(..g, quake_timer: g.quake_timer -. dt)
      }
    Warning(cx, cy, r, left) ->
      case left -. dt <=. 0.0 {
        True -> open_chasm(g, cx, cy, r)
        False -> Game(..g, quake: Warning(cx, cy, r, left -. dt))
      }
    Open(id, cx, cy, r, left, product, tagline) ->
      case left -. dt <=. 0.0 {
        True -> Game(..g, quake: Calm, quake_timer: quake_interval(g.level))
        False ->
          Game(..g, quake: Open(id, cx, cy, r, left -. dt, product, tagline))
      }
  }
}

/// The ground cracks around the hunter — never conveniently elsewhere.
fn start_warning(g: Game) -> Game {
  let r = chasm_radius(g.level)
  let angle = random() *. 2.0 *. pi
  let off = random() *. r *. 0.5
  let cx = clamp(g.hx +. cos(angle) *. off, r *. 0.5, screen_w -. r *. 0.5)
  let cy =
    clamp(g.hy +. sin(angle) *. off, field_top +. r *. 0.5, screen_h -. r *. 0.5)
  Game(..g, quake: Warning(cx, cy, r, warn_ms(g.level)))
}

fn open_chasm(g: Game, cx: Float, cy: Float, r: Float) -> Game {
  let #(product, tagline) = pick_product()
  let g =
    Game(
      ..g,
      quake: Open(g.seq, cx, cy, r, chasm_open_ms, product, tagline),
      seq: g.seq + 1,
      // Any turtle still standing in it goes down with the ground.
      turtles: list.filter(g.turtles, fn(t) { dist(t.x, t.y, cx, cy) >=. r }),
    )
  case dist(g.hx, g.hy, cx, cy) <. r {
    True -> fall_in(g)
    False ->
      case g.turtles {
        // The earth did your job for you. No points, but it counts.
        [] -> Game(..g, phase: LevelClear, ix: 0.0, iy: 0.0)
        _ -> g
      }
  }
}

fn in_open_chasm(g: Game, x: Float, y: Float) -> Bool {
  case g.quake {
    Open(_, cx, cy, r, _, _, _) -> dist(x, y, cx, cy) <. r -. 1.0
    _ -> False
  }
}

/// #(is there one, cx, cy, r) for whichever quake stage is on screen.
fn quake_circle(q: Quake) -> #(Bool, Float, Float, Float) {
  case q {
    Calm -> #(False, 0.0, 0.0, 0.0)
    Warning(cx, cy, r, _) -> #(True, cx, cy, r)
    Open(_, cx, cy, r, _, _, _) -> #(True, cx, cy, r)
  }
}

// ---------------------------------------------------------------------------
// Ads: products that don't exist, now rising out of the ground
// ---------------------------------------------------------------------------

fn products() -> List(#(String, String)) {
  [
    #("Soup Umbrella", "Keeps the rain off your soup."),
    #("Left-Handed Teabags", "Finally."),
    #("Decaf Espresso Shots", "All of the ritual. None of the point."),
    #("Pre-Chewed Gum", "We did the hard part."),
    #("Invisible Hi-Vis Vest", "Safety you can't see."),
    #("Solar-Powered Torch", "Works best when you don't need it."),
    #("Waterproof Sponge", "Absorbs nothing. Lasts forever."),
    #("Silent Doorbell", "Respects your boundaries."),
    #("Square Wheels", "For when round is too mainstream."),
    #("Scented Candle: Wet Dog", "Just like home."),
    #("Glow-in-the-Dark Sunglasses", "Find them at night. Wear them never."),
    #("Diet Water", "Zero calories. Somehow less."),
    #("Pocket Trampoline", "Do not put in pocket."),
    #("Inflatable Anvil", "Lightweight. Pointless."),
    #("Non-Stick Glue", "Our strongest formula yet."),
    #("Self-Folding Map", "It will not unfold."),
    #("Hollow Chocolate Spoon", "Dissolves on contact with soup."),
    #("Turtle Repellent", "Unscented. Untested. Unlikely."),
    #("Stairs for Snakes", "Twelve steps. No takers."),
    #("Reusable Napkin: Single Use", "Read the label twice."),
    #("Mild Hot Sauce", "Room temperature hot."),
    #("Indoor Kite", "Low ceiling edition."),
    #("Unsalted Sea Salt", "From the sea. Minus the sea."),
    #("Cordless Extension Cord", "Reach for nothing."),
  ]
}

fn pick_product() -> #(String, String) {
  let all = products()
  let n = list.length(all)
  let i = float.truncate(random() *. int.to_float(n))
  case list.drop(all, i) {
    [p, ..] -> p
    [] -> #("Thing", "It's a thing.")
  }
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

fn clamp(v: Float, lo: Float, hi: Float) -> Float {
  float.min(hi, float.max(lo, v))
}

fn dist(ax: Float, ay: Float, bx: Float, by: Float) -> Float {
  let dx = ax -. bx
  let dy = ay -. by
  sqrt(dx *. dx +. dy *. dy)
}

fn normalize(x: Float, y: Float) -> #(Float, Float) {
  let d = sqrt(x *. x +. y *. y)
  case d <. 0.0001 {
    True -> #(0.0, -1.0)
    False -> #(x /. d, y /. d)
  }
}

/// A box of half-size `half` centred on (x, y) overlaps some rock.
fn hits_rock(x: Float, y: Float, half: Float, rocks: List(Rock)) -> Bool {
  list.any(rocks, fn(r) {
    x +. half >. r.x
    && x -. half <. r.x +. r.w
    && y +. half >. r.y
    && y -. half <. r.y +. r.h
  })
}

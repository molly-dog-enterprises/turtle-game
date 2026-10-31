//// Turtle Game — chase the turtle with your finger (or mouse).
////
//// All game logic lives here, compiled to JavaScript. The Vue shell only
//// forwards pointer events and renders the state.
////
//// Rules:
//// - Press the screen: the turtle gets a 2 second head start to escape.
//// - After the head start you can catch turtles by touching them.
//// - Lift your finger / leave the screen and the head start resets.
//// - Each level has a stupidly short timeout. Miss it and you lose.
//// - Higher levels: faster turtles, more turtles, smarter escape code,
////   and bonus golden turtles worth points and extra time.
//// - Ads for products nobody wants pop up in random locations, more of
////   them as you level up. Turtles can (and will) hide behind them.
//// - Sometimes an ad is a full-screen notice that pauses the game until
////   you're allowed to skip it. You know the kind.

import gleam/float
import gleam/int
import gleam/list

@external(javascript, "./turtle_game_ffi.mjs", "random")
fn random() -> Float

@external(javascript, "./turtle_game_ffi.mjs", "sqrt")
fn sqrt(x: Float) -> Float

// ---------------------------------------------------------------------------
// Constants (logical arena, matches the main game's turtle arena)
// ---------------------------------------------------------------------------

pub const arena_w = 800.0

pub const arena_h = 600.0

const grace_ms = 2000.0

const catch_radius = 36.0

const turtle_margin = 28.0

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

pub type Phase {
  Intro
  Playing
  LevelClear
  GameOver
}

pub type Turtle {
  Turtle(
    id: Int,
    x: Float,
    y: Float,
    // current heading (unit-ish vector, blended each tick)
    dx: Float,
    dy: Float,
    golden: Bool,
    // goldens despawn when ttl runs out; ignored for normal turtles
    ttl: Float,
    // panic-dash state (tier 4 AI)
    juke_ms: Float,
    jx: Float,
    jy: Float,
  )
}

pub type Ad {
  Ad(
    id: Int,
    x: Float,
    y: Float,
    w: Float,
    h: Float,
    product: String,
    tagline: String,
    ttl: Float,
    // While > 0 the ad is flashed up fullscreen; when it runs out the ad
    // shrinks back to its old size somewhere else.
    flash: Float,
    // Some ads get read out loud in a bad computer voice. Lucky you.
    spoken: Bool,
  )
}

pub type Game {
  Game(
    phase: Phase,
    level: Int,
    score: Int,
    time_left: Float,
    grace_left: Float,
    pointer_down: Bool,
    px: Float,
    py: Float,
    last_px: Float,
    last_py: Float,
    // smoothed pointer velocity (px/s) — smart turtles flee where you're going
    pvx: Float,
    pvy: Float,
    turtles: List(Turtle),
    ads: List(Ad),
    ad_cooldown: Float,
    // Full-screen interstitial: pauses everything until dismissed.
    paused: Bool,
    pause_product: String,
    pause_tagline: String,
    // How long until the skip button unlocks. You know the kind.
    pause_lock: Float,
    seq: Int,
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

pub fn new_game() -> Game {
  Game(
    phase: Intro,
    level: 1,
    score: 0,
    time_left: 0.0,
    grace_left: grace_ms,
    pointer_down: False,
    px: arena_w /. 2.0,
    py: arena_h /. 2.0,
    last_px: arena_w /. 2.0,
    last_py: arena_h /. 2.0,
    pvx: 0.0,
    pvy: 0.0,
    turtles: [],
    ads: [],
    ad_cooldown: 1500.0,
    paused: False,
    pause_product: "",
    pause_tagline: "",
    pause_lock: 0.0,
    seq: 0,
  )
}

/// Finger/mouse pressed down at logical coordinates. Ignored while an
/// interstitial has the game paused — only the skip button works then.
pub fn press(g: Game, x: Float, y: Float) -> Game {
  case g.paused {
    True -> g
    False -> do_press(g, x, y)
  }
}

fn do_press(g: Game, x: Float, y: Float) -> Game {
  case g.phase {
    Intro -> start_level(g, x, y)
    LevelClear -> start_level(Game(..g, level: g.level + 1), x, y)
    GameOver -> Game(..new_game(), score: 0)
    Playing ->
      // A fresh press always grants the turtle its full head start again.
      Game(
        ..g,
        pointer_down: True,
        grace_left: grace_ms,
        px: x,
        py: y,
        last_px: x,
        last_py: y,
        pvx: 0.0,
        pvy: 0.0,
      )
  }
}

/// Finger/mouse moved while down. Frozen during an interstitial so the
/// pointer can't teleport while the turtles can't react.
pub fn move_to(g: Game, x: Float, y: Float) -> Game {
  case g.paused {
    True -> g
    False -> Game(..g, px: x, py: y)
  }
}

/// Finger lifted or left the screen: the safe time resets.
pub fn release(g: Game) -> Game {
  Game(..g, pointer_down: False, grace_left: grace_ms, pvx: 0.0, pvy: 0.0)
}

/// Clicking an ad's ✕ does what every real ✕ does: spawns another ad.
pub fn annoy(g: Game) -> Game {
  case g.phase {
    Playing -> spawn_ad(g)
    _ -> g
  }
}

/// Touching an ad — a press or just dragging your finger across it —
/// flashes it up fullscreen for a second. When the flash ends it shrinks
/// back to its old size, in a different location.
fn touch_ads(g: Game) -> Game {
  case g.pointer_down {
    False -> g
    True -> {
      let ads =
        list.map(g.ads, fn(a) {
          case a.flash <=. 0.0 && point_in(g.px, g.py, a.x, a.y, a.w, a.h) {
            // Keep it alive long enough to land somewhere new afterwards.
            True -> Ad(..a, flash: 1000.0, ttl: float.max(a.ttl, 2000.0))
            False -> a
          }
        })
      Game(..g, ads: ads)
    }
  }
}

fn point_in(px: Float, py: Float, x: Float, y: Float, w: Float, h: Float) -> Bool {
  px >=. x && px <=. x +. w && py >=. y && py <=. y +. h
}

pub fn phase_name(g: Game) -> String {
  case g.phase {
    Intro -> "intro"
    Playing -> "playing"
    LevelClear -> "clear"
    GameOver -> "over"
  }
}

/// How many turtles still need catching this level.
pub fn turtles_left(g: Game) -> Int {
  list.filter(g.turtles, fn(t) { !t.golden }) |> list.length
}

/// Advance the simulation by dt_ms milliseconds. While an interstitial is
/// up, the only thing that moves is the skip-button countdown.
pub fn tick(g: Game, dt_ms: Float) -> Game {
  case g.phase, g.paused {
    Playing, True ->
      Game(..g, pause_lock: float.max(0.0, g.pause_lock -. dt_ms))
    Playing, False -> tick_playing(g, float.clamp(dt_ms, 1.0, 50.0))
    _, _ -> g
  }
}

/// Start a fresh game resuming a saved session: refreshing the page costs
/// you two levels.
pub fn resume(level: Int) -> Game {
  let g = new_game()
  Game(..g, level: int.max(1, level - 2))
}

/// Skip the interstitial — once the lock has run out, obviously.
pub fn dismiss(g: Game) -> Game {
  case g.paused && g.pause_lock <=. 0.0 {
    True -> Game(..g, paused: False)
    False -> g
  }
}

// ---------------------------------------------------------------------------
// Level setup
// ---------------------------------------------------------------------------

fn start_level(g: Game, x: Float, y: Float) -> Game {
  let base =
    Game(
      ..g,
      phase: Playing,
      time_left: level_time(g.level),
      grace_left: grace_ms,
      pointer_down: True,
      px: x,
      py: y,
      last_px: x,
      last_py: y,
      pvx: 0.0,
      pvy: 0.0,
      turtles: [],
      ads: [],
      ad_cooldown: 1200.0,
    )
  let with_turtles =
    list.repeat(Nil, turtle_count(g.level))
    |> list.fold(base, fn(acc, _) { spawn_turtle(acc, False) })
  // Bonus at higher levels: a golden turtle sometimes joins. Catching it is
  // worth big points and extra time — but it despawns if you dawdle.
  case g.level >= 5 && random() <. 0.45 {
    True -> spawn_turtle(with_turtles, True)
    False -> with_turtles
  }
}

/// Each level's timeout is stupidly short, and it only gets worse.
fn level_time(level: Int) -> Float {
  float.max(4000.0, 13_000.0 -. int.to_float(level) *. 900.0)
}

/// The number (of turtles) on the screen increases as you level up.
fn turtle_count(level: Int) -> Int {
  int.min(1 + { level - 1 } / 2, 6)
}

fn turtle_speed(level: Int) -> Float {
  float.min(110.0 +. int.to_float(level) *. 22.0, 330.0)
}

/// Escape-code smartness tier: 1 flees, 2 avoids walls, 3 predicts your
/// finger and hides behind ads, 4 panic-dashes when you get close.
fn ai_tier(level: Int) -> Int {
  case level {
    l if l >= 9 -> 4
    l if l >= 6 -> 3
    l if l >= 3 -> 2
    _ -> 1
  }
}

fn spawn_turtle(g: Game, golden: Bool) -> Game {
  let x = 60.0 +. random() *. { arena_w -. 120.0 }
  let y = 60.0 +. random() *. 340.0
  // Never spawn under the player's finger: mirror away if too close.
  let #(x, y) = case dist(x, y, g.px, g.py) <. 180.0 {
    True -> #(arena_w -. x, 460.0 -. y)
    False -> #(x, y)
  }
  let turtle =
    Turtle(
      id: g.seq,
      x: x,
      y: y,
      dx: 0.0,
      dy: 0.0,
      golden: golden,
      ttl: case golden {
        True -> 6000.0
        False -> 0.0
      },
      juke_ms: 0.0,
      jx: 0.0,
      jy: 0.0,
    )
  Game(..g, turtles: [turtle, ..g.turtles], seq: g.seq + 1)
}

// ---------------------------------------------------------------------------
// Ads: products that don't exist and nobody wants
// ---------------------------------------------------------------------------

fn products() -> List(#(String, String)) {
  [
    #("Invisible Socks", "Feel the breeze. Lose them instantly."),
    #("Wi-Fi Scented Candle", "Smells like 2.4GHz."),
    #("Left-Handed Teabags", "Finally. Steeping for the other 10%."),
    #("Dehydrated Water", "Just add water."),
    #("Bluetooth Spoon", "Pairs with soup."),
    #("Premium Air (Lightly Used)", "Breathed near celebrities."),
    #("Solar-Powered Torch", "Works best when you don't need it."),
    #("Inflatable Dartboard", "One game only."),
    #("USB Pet Rock Pro", "Now with a subscription."),
    #("Gluten-Free Gravel", "Crunchy. Regret-forward."),
    #("Silent Doorbell", "You'll never know."),
    #("AI-Powered Stick", "It's a stick. With a roadmap."),
    #("Waterproof Teabag", "Uncompromising. Undrinkable."),
    #("Turtle Insurance", "Covers everything except turtles."),
  ]
}

fn pick_product() -> #(String, String) {
  let all = products()
  let idx = float.truncate(random() *. int.to_float(list.length(all)))
  case list.drop(all, idx) {
    [p, ..] -> p
    [] -> #("Mystery Box", "Contains a smaller mystery box.")
  }
}

/// Ads start at level 2; one more every two levels after that, capped at 6.
fn max_ads(level: Int) -> Int {
  case level >= 2 {
    True -> int.min(1 + { level - 2 } / 2, 6)
    False -> 0
  }
}

/// Chance that a spawning ad is a full-screen, game-pausing notice.
fn interstitial_chance(level: Int) -> Float {
  case level >= 2 {
    True -> float.min(0.08 +. int.to_float(level) *. 0.02, 0.3)
    False -> 0.0
  }
}

/// Pop an ad somewhere random on the screen.
fn spawn_ad(g: Game) -> Game {
  let w = 170.0 +. random() *. 90.0
  let h = 95.0 +. random() *. 55.0
  let x = random() *. { arena_w -. w }
  let y = random() *. { arena_h -. h }
  let #(product, tagline) = pick_product()
  let ad =
    Ad(
      id: g.seq,
      x: x,
      y: y,
      w: w,
      h: h,
      product: product,
      tagline: tagline,
      ttl: 4500.0 +. random() *. 4000.0,
      flash: 0.0,
      spoken: random() <. 0.4,
    )
  Game(..g, ads: [ad, ..g.ads], seq: g.seq + 1, ad_cooldown: next_cooldown(g))
}

/// Ads arrive faster at higher levels.
fn next_cooldown(g: Game) -> Float {
  float.max(900.0, 2200.0 -. int.to_float(g.level) *. 120.0)
  +. random() *. 2800.0
}

/// A word from our sponsors: freeze everything until the skip unlocks.
fn open_interstitial(g: Game) -> Game {
  let #(product, tagline) = pick_product()
  Game(
    ..g,
    paused: True,
    pause_product: product,
    pause_tagline: tagline,
    pause_lock: 1200.0 +. random() *. 1400.0,
    ad_cooldown: next_cooldown(g),
  )
}

/// Same size, different place — and never straight under the finger, or it
/// would just flash again immediately.
fn relocate(a: Ad, g: Game) -> Ad {
  let x = random() *. { arena_w -. a.w }
  let y = random() *. { arena_h -. a.h }
  let #(x, y) = case g.pointer_down && point_in(g.px, g.py, x, y, a.w, a.h) {
    True -> #(arena_w -. a.w -. x, arena_h -. a.h -. y)
    False -> #(x, y)
  }
  Ad(..a, flash: 0.0, x: x, y: y)
}

fn step_ads(g: Game, dt: Float) -> Game {
  let ads =
    g.ads
    |> list.map(fn(a) {
      case a.flash >. 0.0 {
        // Fullscreen flash: ttl is frozen; when the flash ends, move it.
        True ->
          case a.flash -. dt <=. 0.0 {
            True -> relocate(a, g)
            False -> Ad(..a, flash: a.flash -. dt)
          }
        False -> Ad(..a, ttl: a.ttl -. dt)
      }
    })
    |> list.filter(fn(a) { a.ttl >. 0.0 })
  let g = Game(..g, ads: ads, ad_cooldown: g.ad_cooldown -. dt)
  case g.ad_cooldown <=. 0.0 && list.length(g.ads) < max_ads(g.level) {
    True ->
      case random() <. interstitial_chance(g.level) {
        True -> open_interstitial(g)
        False -> spawn_ad(g)
      }
    False -> g
  }
}

// ---------------------------------------------------------------------------
// Main tick
// ---------------------------------------------------------------------------

fn tick_playing(g: Game, dt: Float) -> Game {
  // Smoothed pointer velocity, so clever turtles dodge where you're headed.
  let ivx = { g.px -. g.last_px } /. dt *. 1000.0
  let ivy = { g.py -. g.last_py } /. dt *. 1000.0
  let g =
    Game(
      ..g,
      pvx: g.pvx *. 0.8 +. ivx *. 0.2,
      pvy: g.pvy *. 0.8 +. ivy *. 0.2,
      last_px: g.px,
      last_py: g.py,
    )

  // Head-start countdown only runs while the finger is on the screen.
  let g = case g.pointer_down && g.grace_left >. 0.0 {
    True -> Game(..g, grace_left: float.max(0.0, g.grace_left -. dt))
    False -> g
  }

  let g = step_ads(g, dt) |> touch_ads

  let chasing = g.pointer_down && g.grace_left <=. 0.0

  // Move turtles, expire golden ones.
  let turtles =
    g.turtles
    |> list.map(fn(t) { step_turtle(t, g, dt) })
    |> list.filter(fn(t) { !t.golden || t.ttl >. 0.0 })

  // Catch anything under the finger (yes, even blind behind an ad).
  let #(caught, free) = case chasing {
    True ->
      list.partition(turtles, fn(t) {
        dist(t.x, t.y, g.px, g.py) <. catch_radius
      })
    False -> #([], turtles)
  }
  let gained =
    list.fold(caught, 0, fn(acc, t) {
      case t.golden {
        True -> acc + 500
        False -> acc + 100 * g.level
      }
    })
  let time_bonus =
    list.fold(caught, 0.0, fn(acc, t) {
      case t.golden {
        True -> acc +. 3000.0
        False -> acc
      }
    })

  let g =
    Game(
      ..g,
      turtles: free,
      score: g.score + gained,
      time_left: g.time_left +. time_bonus -. dt,
    )

  let cleared = !list.any(g.turtles, fn(t) { !t.golden })
  case cleared, g.time_left <=. 0.0 {
    True, _ ->
      // Level clear bonus: leftover tenths of a second become points.
      Game(
        ..g,
        phase: LevelClear,
        score: g.score + float.truncate(g.time_left /. 100.0),
        pointer_down: False,
      )
    False, True -> Game(..g, phase: GameOver, time_left: 0.0)
    False, False -> g
  }
}

// ---------------------------------------------------------------------------
// Turtle AI
// ---------------------------------------------------------------------------

fn step_turtle(t: Turtle, g: Game, dt: Float) -> Turtle {
  let tier = ai_tier(g.level)
  let speed = case t.golden {
    True -> turtle_speed(g.level) *. 1.2
    False -> turtle_speed(g.level)
  }

  // Tier 3+: flee from where your finger WILL be, not where it is.
  let #(threat_x, threat_y) = case tier >= 3 {
    True -> #(g.px +. g.pvx *. 0.25, g.py +. g.pvy *. 0.25)
    False -> #(g.px, g.py)
  }
  let d_threat = dist(t.x, t.y, threat_x, threat_y)

  // Base steering: flee the pointer while it's down, otherwise amble.
  let #(sx, sy) = case g.pointer_down {
    True -> norm(t.x -. threat_x, t.y -. threat_y)
    False -> wander(t)
  }

  // Tier 2+: refuse to be cornered — walls push back.
  let #(sx, sy) = case tier >= 2 {
    True -> {
      let push = 90.0
      let wx =
        wall_push(t.x, push) -. wall_push(arena_w -. t.x, push)
      let wy =
        wall_push(t.y, push) -. wall_push(arena_h -. t.y, push)
      #(sx +. wx, sy +. wy)
    }
    False -> #(sx, sy)
  }

  // Tier 3+: when it has breathing room, sneak behind the nearest ad.
  let #(sx, sy) = case tier >= 3 && g.pointer_down && d_threat >. 220.0 {
    True ->
      case nearest_ad(g.ads, t) {
        Ok(#(ax, ay)) -> {
          let #(hx, hy) = norm(ax -. t.x, ay -. t.y)
          #(sx *. 0.5 +. hx *. 0.9, sy *. 0.5 +. hy *. 0.9)
        }
        Error(Nil) -> #(sx, sy)
      }
    False -> #(sx, sy)
  }

  // Tier 4: panic dash sideways when the finger closes in.
  let t = case
    tier >= 4
    && g.pointer_down
    && d_threat <. 100.0
    && t.juke_ms <=. 0.0
    && random() <. 0.12
  {
    True -> {
      let #(fx, fy) = norm(t.x -. g.px, t.y -. g.py)
      let sign = case random() <. 0.5 {
        True -> 1.0
        False -> -1.0
      }
      Turtle(..t, juke_ms: 260.0, jx: 0.0 -. fy *. sign, jy: fx *. sign)
    }
    False -> t
  }

  let #(sx, sy) = case t.juke_ms >. 0.0 {
    True -> #(t.jx *. 2.0, t.jy *. 2.0)
    False -> #(sx, sy)
  }

  // A little chaos so even dumb turtles aren't clockwork.
  let #(sx, sy) = #(
    sx +. { random() -. 0.5 } *. 0.4,
    sy +. { random() -. 0.5 } *. 0.4,
  )

  // Blend heading for smooth motion, then move and stay inside the arena.
  let #(nx, ny) = norm(t.dx *. 0.55 +. sx *. 0.45, t.dy *. 0.55 +. sy *. 0.45)
  let move = case g.pointer_down {
    True -> speed
    False -> speed *. 0.25
  }
  let x = float.clamp(
    t.x +. nx *. move *. dt /. 1000.0,
    turtle_margin,
    arena_w -. turtle_margin,
  )
  let y = float.clamp(
    t.y +. ny *. move *. dt /. 1000.0,
    turtle_margin,
    arena_h -. turtle_margin,
  )
  Turtle(
    ..t,
    x: x,
    y: y,
    dx: nx,
    dy: ny,
    ttl: t.ttl -. dt,
    juke_ms: float.max(0.0, t.juke_ms -. dt),
  )
}

fn wander(t: Turtle) -> #(Float, Float) {
  case t.dx == 0.0 && t.dy == 0.0 {
    True -> norm(random() -. 0.5, random() -. 0.5)
    False -> #(t.dx, t.dy)
  }
}

fn wall_push(distance: Float, range: Float) -> Float {
  case distance <. range {
    True -> { range -. distance } /. range *. 1.6
    False -> 0.0
  }
}

fn nearest_ad(ads: List(Ad), t: Turtle) -> Result(#(Float, Float), Nil) {
  list.fold(ads, Error(Nil), fn(best, a) {
    let cx = a.x +. a.w /. 2.0
    let cy = a.y +. a.h /. 2.0
    let d = dist(t.x, t.y, cx, cy)
    case best {
      Error(Nil) -> Ok(#(cx, cy))
      Ok(#(bx, by)) ->
        case d <. dist(t.x, t.y, bx, by) {
          True -> Ok(#(cx, cy))
          False -> best
        }
    }
  })
}

// ---------------------------------------------------------------------------
// Maths
// ---------------------------------------------------------------------------

fn dist(x1: Float, y1: Float, x2: Float, y2: Float) -> Float {
  let dx = x1 -. x2
  let dy = y1 -. y2
  sqrt(dx *. dx +. dy *. dy)
}

fn norm(x: Float, y: Float) -> #(Float, Float) {
  let len = sqrt(x *. x +. y *. y)
  case len <. 0.0001 {
    True -> #(0.0, 0.0)
    False -> #(x /. len, y /. len)
  }
}

# 🐢 Turtle Games

Small, silly games about chasing a turtle that does not want to be caught.
The site root is a landing page; each game lives in its own folder.

**Play:** <https://molly-dog-enterprises.github.io/turtle-game/>

## Just finger it (The Turtle Game)

Chase the turtle with your finger (or mouse) before a stupidly short clock
runs out — while ads for products nobody wants get in your way.

**Play it:** <https://molly-dog-enterprises.github.io/turtle-game/just-finger-it/>

All game logic is written in [Gleam](https://gleam.run) and compiled to plain
JavaScript ES modules. The page itself is flat HTML/CSS/JS — no framework, no
bundler, no build step to serve it.

## How to play

1. **Press and hold** the screen. The turtle gets a **2-second head start** to
   escape — it flashes red while it's protected and can't be caught.
2. When the head start ends, catch turtles by touching them.
3. **Lift your finger or leave the screen and the head start resets.**
4. Catch every turtle before the level clock runs out (13 seconds at level 1,
   shrinking by 0.9s per level to a floor of 4 seconds). Miss it and you lose.
5. Losing keeps your level — press anywhere to retry it, with your score back
   at zero. A **Restart at level 1** button on the game-over screen wipes the
   slate properly. Your best score is remembered between visits.
6. Your level is saved in the browser session — but **refreshing the page
   costs you two levels**.

Levelling up: turtles get faster, more of them appear (up to 6), and the
escape code genuinely gets smarter — level 3+ avoids corners, level 6+
predicts where your finger is heading and hides behind ads, level 9+
panic-dashes when you close in. Golden turtles ✨ appear from level 5: 500
points and +3 seconds.

The ads: fake banners for products that don't exist, popping up in random
places, more per level. Turtles hide behind them. Touching one — a tap or
dragging across it mid-chase — flashes it fullscreen for a second, then it
relocates. The ✕ spawns another ad. Some ads (and every game-pausing
interstitial) are read out loud in a bad computer voice.

## Call me the hunter (The turtle game)

A from-scratch second game in the shape of a purple handheld: joystick on
the right, two buttons on the left, a 160×144 four-shade screen.

**Play it:** <https://molly-dog-enterprises.github.io/turtle-game/call-me-the-hunter/>

- **Stick** moves the hunter. **A** swings the net — every turtle inside it
  is caught at once: 10 points for one, and each extra turtle in the same
  swing is worth 50% more than the last (two = 25, three = 48). **B** is an
  emergency jump in a random direction.
- Every so often the ground cracks around you. Leave the circle before it
  opens into a chasm or you fall in. Walking or jumping into an open chasm
  counts too. Falling in restarts the level and rolls your score back to
  where the level began.
- Each chasm spins out an ad for a product nobody wants, which is read aloud.
  Just the product details, not the whole card.
- Clear a level (catch everything) and you can spend points on movement
  speed, net size, or hat size. Hat size does nothing.
- Higher levels: more turtles, faster, better at avoiding you, less warning
  before chasms, rocks in the way.
- Keyboard works too: arrows/WASD, Z (or space) = A, X (or shift) = B.

The music is an original 8-bit garage stomp synthesised in the browser
(`call-me-the-hunter/music.js`) — no audio files. Toggle it with the ♪ pill.

## Repo layout

| Path                    | What it is                                              |
| ----------------------- | ------------------------------------------------------- |
| `index.html`            | The Turtle Games landing page — every game links off it |
| `just-finger-it/`       | The first game: flat shell (`index.html` / `style.css` / `app.js`) plus `js/`, the compiled Gleam output (committed so Pages can serve it) |
| `src/turtle_game.gleam` | The first game's rules: state machine, turtle AI, ads, scoring |
| `src/turtle_game_ffi.mjs` | Tiny FFI shim for `Math.random` and `Math.sqrt`       |
| `call-me-the-hunter/`   | The second game, self-contained: its own Gleam project (`gleam.toml`, `src/hunter.gleam`), flat shell (`index.html` / `style.css` / `app.js` / `music.js`) and compiled `js/` |
| `NEXT-VERSION.md`       | The design brief the second game was built from        |

## Developing

Requires the Gleam compiler (`brew install gleam`; no Erlang needed — this
targets JavaScript only).

```sh
gleam build                                  # compile src/ to build/
rm -rf just-finger-it/js                     # refresh the committed output
cp -R build/dev/javascript just-finger-it/js
rm -rf just-finger-it/js/fingerprint just-finger-it/js/*/_gleam_artefacts
python3 -m http.server 8787                  # serve, then open localhost:8787
```

Commit the refreshed `just-finger-it/js/` along with your `src/` change —
GitHub Pages serves exactly what's committed.

The second game is the same dance inside its own folder:

```sh
cd call-me-the-hunter
gleam build && rm -rf js && cp -R build/dev/javascript js
rm -rf js/fingerprint js/*/_gleam_artefacts && find js -name '*.erl' -delete
```

## Hosting

Served by GitHub Pages from the `main` branch root. Pushing to `main`
redeploys automatically.

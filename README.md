# 🐢 Turtle Game

Chase the turtle with your finger (or mouse) before a stupidly short clock
runs out — while ads for products nobody wants get in your way.

**Play it:** <https://molly-dog-enterprises.github.io/turtle-game/>

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

## Repo layout

| Path                    | What it is                                              |
| ----------------------- | ------------------------------------------------------- |
| `src/turtle_game.gleam` | The whole game: state machine, turtle AI, ads, scoring  |
| `src/turtle_game_ffi.mjs` | Tiny FFI shim for `Math.random` and `Math.sqrt`       |
| `index.html` / `style.css` / `app.js` | The flat shell: pointer events in, DOM out |
| `js/`                   | The compiled Gleam output (committed so Pages can serve it) |

## Developing

Requires the Gleam compiler (`brew install gleam`; no Erlang needed — this
targets JavaScript only).

```sh
gleam build                                  # compile src/ to build/
rm -rf js && cp -R build/dev/javascript js   # refresh the committed output
rm -rf js/fingerprint js/*/_gleam_artefacts  # drop compiler cache files
python3 -m http.server 8787                  # serve, then open localhost:8787
```

Commit the refreshed `js/` along with your `src/` change — GitHub Pages
serves exactly what's committed.

## Hosting

Served by GitHub Pages from the `main` branch root. Pushing to `main`
redeploys automatically.

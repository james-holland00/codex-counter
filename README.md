# Counted

A responsive blackjack card-counting trainer built around the Hi-Lo system. It runs as a lightweight web app on desktop and mobile, can be installed from a supported browser, and keeps progress on the current device.

## Run locally

From this folder, start any static file server. For example:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Included

- Guided Hi-Lo card-value lesson
- Multi-deck basic-strategy charts for hard totals, soft totals, and pairs
- 20, 40, and 52-card practice sessions
- Round-based Casino Mode with configurable table rules, 0–3 automatic players and running-count checks
- Rapid Flash true-count sprints with four speeds and adjustable shoe depth
- Mouse, touch, and keyboard input
- Live accuracy, answer streak, and running count
- Locally stored session history and card-group mastery
- XP levels, daily goals, rank milestones, and unlockable achievements
- Responsive desktop and mobile layouts
- Persistent light and dark themes with system-preference detection
- Interactive True Count Lab
- iPhone home-screen installation with offline support
- Installable PWA shell with offline caching

Progress is stored in browser local storage and stays on that device.

## Install directly on an iPhone with Xcode

The iOS project packages the trainer inside the app, so the core experience works
without loading the hosted website.

1. Install the full Xcode app from the Mac App Store and open it once.
2. From this folder, run `npm run ios:sync`, then `npm run ios:open`.
3. Connect and unlock the iPhone, then enable Developer Mode if iOS requests it.
4. In Xcode, select the **App** target, open **Signing & Capabilities**, and choose
   your Apple Account under **Team**. Keep **Automatically manage signing** enabled.
5. Choose the connected iPhone as the run destination and press **Run**.

After changing the trainer's HTML, CSS, JavaScript, or assets, run
`npm run ios:sync` before building again in Xcode.

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
- Timed Casino Mode with four running-count checkpoints
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

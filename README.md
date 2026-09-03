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
- Free 20-card practice sessions and complete Progress tracking, with 40- and 52-card sessions in Counted Pro
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

## Free premium sessions

Free users get one 30-card Rapid Flash sprint and one Casino shoe (up to its cut
card, or until **End shoe**). Each allowance is recorded independently in
`counted-progress-v1.freeSessionsUsed` when Start is pressed. Opening a mode or
changing its settings does not spend it. Existing training history predates this
offer and does not consume either allowance.

An active session remains accessible when navigating away and back. Reloading or
closing the app abandons that session; its saved use remains. These allowances
use the same device-local storage as progress, with no account or cross-device
sync. Pro users retain unlimited sessions and never spend the free allowances.

## Install directly on an iPhone with Xcode

The iOS project packages the trainer inside the app, so the core experience works
without loading the hosted website.

1. Download the full Xcode app from Apple’s developer website and open it once. This project currently uses `/Users/jamesholland/Downloads/Xcode-beta.app`.
2. From this folder, run `npm run ios:sync`, then open `ios/App/App.xcodeproj` in that Xcode app.
3. Connect and unlock the iPhone, then enable Developer Mode if iOS requests it.
4. In Xcode, select the **App** target, open **Signing & Capabilities**, and choose
   your Apple Account under **Team**. Keep **Automatically manage signing** enabled.
5. Choose the connected iPhone as the run destination and press **Run**.

After changing the trainer's HTML, CSS, JavaScript, or assets, run
`npm run ios:sync` before building again in Xcode.

## Test Counted Pro before joining the Developer Program

The shared **App** scheme uses `ios/App/App/Counted.storekit`, which defines the local
`com.jamesholland.counted.pro.annual` subscription at £2.99/year. Choose a simulator
or connected iPhone in Xcode and press **Run**. Apple’s local StoreKit environment can
then test purchase, renewal, expiry, restore and cancellation without App Store Connect
and without charging a real Apple Account.

Run the automated product-boundary and Pit Boss timer checks with `npm test`, or run
the complete JavaScript and web-build verification with `npm run verify`.

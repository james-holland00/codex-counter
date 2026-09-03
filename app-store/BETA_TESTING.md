# Counted TestFlight beta

The current priority is TestFlight feedback before App Store submission. Product-page copy and artwork remain drafts. Do not submit a production App Store version or release the app until the owner asks to proceed after beta testing.

## First run on an iPhone

Install through Apple's TestFlight invitation. Confirm the version and build in TestFlight before reporting an issue. Replacing an existing developer build may retain its local progress, so record whether the installation is fresh or an upgrade.

1. Confirm **1.0 (3)** is installed. Start a free 20-card Practice session; check scoring, results and Progress. Read Learn and the basic-strategy charts.
2. As a free user, confirm Rapid Flash and Casino each show “1 free session”. Open and leave each without pressing Start; neither allowance should be spent.
3. Start Rapid Flash, finish all checkpoints and check its result message. Reopening/restarting should show the existing Pro paywall. Casino should still have its independent free session.
4. Start Casino and play through the shoe, then check its result message and replay paywall. Also test the reverse order on a separate fresh test installation. Existing local history should not remove the new allowances.
5. On a separate unused trial, start then navigate away and return to the same session. Refreshing/closing the app after Start abandons it and must not refund the allowance. Record whether the installation is fresh or an upgrade; do not delete real progress for testing.
6. Check the Pro dialog fits without background scrolling. Purchase through TestFlight’s sandbox sheet and confirm both modes become unlimited and 40/52-card Practice unlocks. Pro users must see no free-session messaging. If product loading initially fails, reconnect and retry; a stale failure must not permanently block the purchase button.
7. Close/reopen the app, confirm Pro persists, then test Restore Purchases. Report the exact visible error and whether Apple’s purchase sheet appeared. Browser simulations and successful native compilation do not establish a working Apple transaction.
8. After a successful purchase, turn on Airplane Mode and check lessons, Practice, Pro drills and local progress. Record how long the app was offline if access changes.
9. Check light/dark appearance, safe areas, buttons, keyboard and dialogs on the smallest/largest available iPhones.
10. Later, use a dedicated Apple sandbox account to verify accelerated renewal, expiry, cancellation and restored access. A successful initial purchase does not establish expiry handling.

## Feedback

Use TestFlight's Send Beta Feedback or take a screenshot and share it through TestFlight. Include the screen, steps, expected result, actual result, device model, iOS version and build number. For purchase failures, include the visible error and whether the Apple purchase sheet opened; never include passwords or payment details.

Prioritise incorrect counts or strategy, crashes, blocked purchases/restores, lost progress, unreadable controls and confusing beginner instructions. Collect screenshot and marketing suggestions separately from defects.

## Distribution

- `Counted Internal`: build 1.0 (3) is available for the owner’s install and purchase checks.
- `Counted Beta`: build 3 is attached, but Apple currently blocks its review submission while build 2 is awaiting review. External testers require Apple’s TestFlight approval. The initial share link is https://testflight.apple.com/join/VSdVdSyu , capped at 25 testers. It will not offer this build until approved.
- iPhone beta availability only; Mac and Apple Vision availability are disabled for both groups.
- No third-party email invitations have been sent. Use a shareable invitation link once the external build is approved, or invite specific people when the owner supplies and authorizes their addresses.

Apple references: [TestFlight overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/), [testing purchases in sandbox](https://developer.apple.com/documentation/StoreKit/testing-in-app-purchases-with-sandbox).

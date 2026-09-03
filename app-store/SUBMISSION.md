# Counted App Store submission pack

This file contains a working first-release listing. Text marked **INPUT REQUIRED** cannot be completed safely without the account holder.

## Product page

- App Store name: `Counted: Blackjack Trainer`
- Home-screen name: `Counted`
- Subtitle: `Master the Hi-Lo count`
- Primary category: `Education`
- Secondary category: `Games`
- Version: `1.0`
- Build: `3`
- Price: `Free download`; Counted Pro is `£2.99/year`
- Availability: iPhone only
- Copyright: `© 2026 James Holland`
- Privacy policy URL: `https://counted-blackjack-trainer.james-holland.chatgpt.site/trainer/privacy.html`
- Support URL: `https://counted-blackjack-trainer.james-holland.chatgpt.site/trainer/support.html`
- Support email: `counted.help@outlook.com`
- Primary language: `English (UK)`
- Bundle ID: `com.jamesholland.counted`
- SKU: `counted-ios`

Both HTTPS pages were verified without authentication on 3 September 2026. See `RELEASE_STATUS.md` for the current account and build blockers.

## In-App Purchase

- Type: `Auto-Renewable Subscription`
- Reference name: `Counted Pro Annual`
- Product ID: `com.jamesholland.counted.pro.annual`
- Subscription group: `Counted Pro`
- Duration: `1 year`
- UK price: `£2.99`
- Free tier: Hi-Lo lessons, basic-strategy charts, 20-card Practice, Progress and achievements, plus one Rapid Flash sprint and one Casino shoe
- Pro tier: 40/52-card Practice, unlimited Rapid Flash, unlimited Casino and future advanced training modules
- Subscription introductory trial: none. The two independent free training sessions are device-local allowances, consumed only when Start is pressed.
- English display name: `Counted Pro Annual`
- English description: `Longer Practice, Rapid Flash and Casino training.`
- App Review screenshot: `screenshots/6.9-inch/06-counted-pro.png`

The same product is defined in `ios/App/App/Counted.storekit` for local Xcode testing. The local definition does not create an App Store Connect product. Create the subscription with exactly this identifier and attach the first subscription to the app version submitted for review.

The app record now uses “Counted: Blackjack Trainer” (Apple ID 6808117018). Listing text and artwork remain drafts while TestFlight feedback is gathered.

## Promotional text

Build an accurate Hi-Lo running count, sharpen true-count conversion and practise at realistic table speeds—all privately and offline.

## Description

Counted turns Hi-Lo card counting into focused, repeatable practice.

Learn the three card-value groups, make recognition automatic and build the concentration needed to hold a running count through a full sequence.

TRAIN WITH PURPOSE

• Practise +1, 0 and −1 card values without answer hints
• Start free with focused 20-card sessions and complete Progress tracking
• Upgrade to Counted Pro for longer sessions and complete simulated blackjack rounds
• Build speed with Pro’s Rapid Flash true-count sprints
• Study hard totals, soft totals and pairs in the included basic-strategy charts
• Track accuracy, streaks, mastery, XP and achievements

PRIVATE AND OFFLINE

Counted requires no in-app account, includes no advertising and contains no third-party analytics. Training progress stays on your device, and the core app works without an internet connection. Counted Pro purchases are securely handled by Apple.

Counted is an educational training tool. It does not accept wagers, provide gambling services or promise positive results. Gambling involves risk; card counting does not guarantee winnings.

COUNTED PRO

Counted Pro is an optional annual subscription at £2.99 per year in the UK. Local prices may vary and are shown before purchase. Payment is charged to your Apple Account. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel your subscription in your App Store account settings.

Privacy policy: https://counted-blackjack-trainer.james-holland.chatgpt.site/trainer/privacy.html
Terms of Use (Apple standard EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

## Keywords

`blackjack,card counting,hi-lo,trainer,practice,true count,basic strategy,cards,casino,learning`

## App privacy answers

- Data collection: `No, we do not collect data from this app.`
- Tracking: `No`
- Advertising: `None`
- Analytics SDKs: `None`
- Accounts: `None`

Local practice progress and preferences remain on the device. Under Apple’s App Privacy definition, data processed only on-device and never transmitted is not collected.

## Age rating notes

Complete the questionnaire from the actual app content. Counted includes wager-free simulated blackjack rounds and a casino-style practice table, but it has:

- no wagering or betting mechanic;
- no virtual currency, prizes or loot boxes;
- no real-money gambling links or services;
- no user-generated content, chat or advertising.

Do not describe it as a gambling service. Do disclose the casino/blackjack theme wherever Apple’s questionnaire asks about simulated or mature themes; App Store Connect will calculate the rating.

## Export compliance

`ITSAppUsesNonExemptEncryption` is set to `NO`. Counted implements no custom or non-exempt encryption. It relies only on operating-system facilities and does not require network access for its core experience.

## Screenshot plan

The existing upload set is in `marketing-screenshots/app-store-ready/`, ordered by filename. All six JPEGs were checked on 3 September 2026: 1320 × 2868 pixels, with no alpha channel. Retain the current approved artwork; these checks establish file compatibility, not a new native Release capture.

Before submission, compare the screenshots with the final signed build. The original capture subjects are:

1. Practice — visible card and three answer controls
2. Casino Mode — player and dealer hands in progress
3. Rapid Flash — true-count sprint in progress
4. Learn — three Hi-Lo groups
5. Progress — accuracy, XP and achievements

Use Apple’s currently accepted 6.9-inch iPhone size first. Additional sizes can be scaled only where App Store Connect permits it.

## TestFlight before launch

The owner chose beta testing before App Store submission. App record, API access, paid-team signing, draft listing, review contact and Counted Pro metadata have been configured. A stable-Xcode build is uploaded and valid; internal testing is enabled and external TestFlight review is pending. See `RELEASE_STATUS.md` and `BETA_TESTING.md` for verified state and the testing checklist.

1. Install the latest build of version 1.0 through TestFlight and check free training, native Pro purchase, restore, offline use and layout.
2. The owner confirmed the Paid Apps Agreement is signed. Verify sandbox purchases and resolve the subscription's remaining `MISSING_METADATA` status if product loading fails.
3. Gather beta feedback and revise the app, screenshots and listing copy.
4. Before production submission, complete age rating, privacy, content rights, price, launch territories and any outstanding tax/banking information.
5. Verify the final signed build against the screenshots, attach the first subscription, and keep untested Mac and Apple Vision availability disabled.
6. Submit a production version only after the owner asks to proceed following beta testing. Manual release is already selected.

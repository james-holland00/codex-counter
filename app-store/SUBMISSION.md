# Counted App Store submission pack

This file contains a working first-release listing. Text marked **INPUT REQUIRED** cannot be completed safely without the account holder.

## Product page

- App Store name: `Counted: Blackjack Trainer`
- Home-screen name: `Counted`
- Subtitle: `Master the Hi-Lo count`
- Primary category: `Education`
- Secondary category: `Games`
- Version: `1.0`
- Build: `2`
- Price: `Free download`; Counted Pro is `£2.99/year`
- Availability: iPhone only
- Copyright: `© 2026 James Holland`
- Privacy policy URL: **INPUT REQUIRED — publish `privacy.html` and paste its HTTPS URL**
- Support URL: **INPUT REQUIRED — publish `support.html` and paste its HTTPS URL**
- Support email: `counted.help@outlook.com`

## In-App Purchase

- Type: `Auto-Renewable Subscription`
- Reference name: `Counted Pro Annual`
- Product ID: `com.jamesholland.counted.pro.annual`
- Subscription group: `Counted Pro`
- Duration: `1 year`
- UK price: `£2.99`
- Free tier: Hi-Lo lessons, basic-strategy charts, 20-card Practice, Progress and achievements
- Pro tier: 40/52-card Practice, Rapid Flash, Casino and future advanced training modules
- Free trial: none for version 1.0

The same product is already defined in `ios/App/App/Counted.storekit` for local testing before App Store Connect exists. Recreate the identifiers exactly in App Store Connect after enrolment.

The exact name cannot be reserved until the app record is created in App Store Connect. Similar apps already use “Counted,” so the descriptive suffix is intentional.

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

Capture clean portrait screenshots from the Release build, with no debug overlays or placeholder support text:

1. Practice — visible card and three answer controls
2. Casino Mode — player and dealer hands in progress
3. Rapid Flash — true-count sprint in progress
4. Learn — three Hi-Lo groups
5. Progress — accuracy, XP and achievements

Use Apple’s currently accepted 6.9-inch iPhone size first. Additional sizes can be scaled only where App Store Connect permits it.

## Account-only finishing steps

1. Enrol in the Apple Developer Program.
2. Create the App Store Connect app record and confirm the name.
3. Add the privacy and support URLs, legal copyright owner and support email.
4. Create the Counted Pro subscription using the identifiers above and add its App Review screenshot.
5. Complete pricing, availability, content rights and age-rating forms.
6. Build a signed archive with stable Xcode, upload it and run TestFlight checks.
7. Add screenshots and the review notes from `REVIEW_NOTES.txt`.
8. Opt out of iPhone-on-Mac and Apple Vision Pro availability unless those platforms are tested separately.

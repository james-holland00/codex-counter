# Counted beta status — 3 September 2026

The owner has chosen TestFlight testing before App Store launch. Product-page text and artwork remain drafts. No production App Store version has been submitted. Version 1.0 is set to manual release.

## Apple account and app

- Paid developer team verified: `JC455HT6P9`.
- App Store Connect API authentication works using the key the owner saved in iCloud. The private key remains outside this repository and has not been sent to GitHub.
- App record: **Counted: Blackjack Trainer**, Apple ID `6808117018`, bundle ID `com.jamesholland.counted`, SKU `counted-ios`, primary locale `en-GB`.
- Draft description, promotional text, keywords, subtitle, privacy/support URLs, copyright and Education / Games–Card categories are saved in App Store Connect.
- App Review and TestFlight review notes and the owner's contact details are saved privately in Apple’s system. No sign-in is required in the app.
- App Store product-page screenshots remain to be uploaded after beta feedback. Only the Pro purchase-screen image has been uploaded for subscription review metadata.

## Build and upload

The local Xcode 27 beta archive compiled and signed successfully, but Apple rejected its upload as an unsupported SDK/Xcode build. That archive is not the TestFlight candidate.

A replacement was compiled on GitHub's Mac using **Xcode 26.6 (17F113)** and the **iOS 26.5 SDK (23F81a)**:

- Workflow: `.github/workflows/ios-release-build.yml`.
- Source commit: `d13627769852a1cef72ac250cc534a9fdf3f68cc`.
- [Successful build run](https://github.com/james-holland00/codex-counter/actions/runs/33725904105).
- Version `1.0`, build `2`, iPhone only, minimum iOS `17.0`.
- The existing six tests and JavaScript syntax checks passed on the runner. Capacitor sync and native Release archive succeeded.
- Downloaded artifact SHA-256 verified: `9e923c98a2dfa5548ffb7241197363aa66d306d5464095c1464575a8a735b1c4`.
- Archived HTML, app JavaScript, counting logic and CSS match the current source.
- The archive was signed locally using the paid Apple team. The stable compiler and SDK metadata were preserved.
- Apple accepted the upload at 08:09 BST. Upload resource: `abeee35b-6e7a-4c4c-a6a3-6a8d80dc4b8e`. Processing completed successfully: build state `VALID`, no non-exempt encryption, internal state `IN_BETA_TESTING`.

The previous local `npm run verify` also passed the production web build. Compilation and upload do not establish native purchase or device behavior; those checks must use the installed TestFlight build.

## TestFlight configuration

- Internal group: `Counted Internal` (`790fe070-ff30-40de-8e8f-d1ac8b369f49`).
- The owner has been added as a tester using the Apple account address. Apple accepted a request to send the owner’s TestFlight invitation (HTTP 201); email delivery and installation are not yet verified.
- External group: `Counted Beta` (`ebf73a52-afe1-49e9-a6fe-6ef200aaa464`).
- Mac and Apple Vision availability are disabled for both groups.
- Beta description, feedback address and review information are saved.
- External beta link is configured for an initial 25 testers: https://testflight.apple.com/join/VSdVdSyu . It becomes usable for this build after Apple’s beta approval. No third-party email invitations have been sent.
- Build 1.0 (2) is attached to both groups and What to Test is saved. External TestFlight submission state: `WAITING_FOR_REVIEW` / `WAITING_FOR_BETA_REVIEW`. This is beta review only, not production App Store submission.
- Use `BETA_TESTING.md` for initial install, free-tier, Pro purchase/restore, offline, layout and later expiry checks.

## Counted Pro

- Group: `Counted Pro` (`22355556`).
- Subscription: `Counted Pro Annual` (`6808118897`).
- Product ID: `com.jamesholland.counted.pro.annual`; duration: one year; no introductory offer.
- UK price verified through Apple’s API: **GBP 2.99**. UK availability is configured for the initial purchase test.
- English (UK) group and product localizations are saved.
- Review image: `screenshots/6.9-inch/06-counted-pro.png`; Apple asset state `COMPLETE`.
- Apple still reports `MISSING_METADATA`; inspect any remaining account/product requirements if the product does not load in TestFlight. The owner confirmed signing the Paid Apps Agreement on 3 September 2026. Apple’s account/product changes may still be propagating.
- Do not submit the subscription for production review yet. Native sandbox purchase and restore still need verification on the installed beta.

## Later, after beta feedback

Revisit screenshots, copy, price and launch territories; complete age rating, privacy, content-rights and account forms; verify tax/banking and Paid Apps agreement; address beta defects; then obtain the owner’s instruction before production App Store submission or release.

## Local evidence

- Stable unsigned archive: `/tmp/counted-stable-release/Counted.xcarchive`.
- Signed IPA: `/tmp/counted-stable-export/App.ipa`.
- Export log: `/tmp/counted-stable-export.log` — `EXPORT SUCCEEDED`.
- Upload log: `/tmp/counted-stable-upload.log` — `Upload succeeded` and `EXPORT SUCCEEDED`.
- Temporary API responses: `/tmp/counted-metadata/`; these include private account contact details and must not be committed.
- Temporary files may be removed by macOS. The workflow can recreate the archive from the recorded source commit without Apple credentials on GitHub.

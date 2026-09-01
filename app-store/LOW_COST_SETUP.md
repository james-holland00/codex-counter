# Counted low-cost launch setup

## Public support email — £0

Create an Outlook.com alias dedicated to Counted, ideally `counted.support@outlook.com`
or the closest available professional variation. An alias uses the existing Microsoft
inbox and can also be selected in the From field, so it avoids a second mailbox and a
second password.

After reserving the address, replace `SUPPORT_EMAIL_GOES_HERE` in `support.html`, copy
the same change to `public/trainer/support.html`, and run `npm run ios:sync`.

Do not buy a custom domain or paid mailbox for version 1.0. Reconsider a domain only
after the app has enough renewals to justify the recurring cost.

## Privacy and support hosting — £0 extra

The existing Sites project already provides managed HTTPS hosting at:

`https://counted-blackjack-trainer.james-holland.chatgpt.site`

Use these App Store Connect URLs after the site is made public:

- Privacy policy: `https://counted-blackjack-trainer.james-holland.chatgpt.site/trainer/privacy.html`
- Support: `https://counted-blackjack-trainer.james-holland.chatgpt.site/trainer/support.html`

The site is currently owner-only. Keep it private while the support-email marker is
present. Publish it publicly only after the email is reserved and both URLs have been
checked while signed out.

## Minimum unavoidable launch cost

- Development, local StoreKit testing, support email and hosting: £0
- Apple Developer Program: defer until the release candidate and listing are ready
- Optional domain and custom-domain email: defer

This preserves the quality-critical pieces — HTTPS, a real support channel, native
StoreKit, offline operation and a tested iPhone build — without adding pre-launch
subscriptions.

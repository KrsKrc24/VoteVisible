# VoteVisible

A student-built civic information website based in Issaquah, Washington. Explore selected healthcare legislation, find issues that matter to you, and prepare a message for your state representatives.

## Run locally

Requires Node.js 22.13+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build`, then `npm start`. This repository deploys to Vercel with the standard Next.js configuration; no translation API key is required.

## Features

- 487 bill summaries across 12 states and 18 topic categories, with counts derived from the dataset.
- Search by bill number, title, summary, topic, or state; combined filters, sorting, pagination, and shareable filter URLs.
- Personal issue finder and keyboard-accessible state atlas with per-state counts.
- Saved bills stored on your device, without an account.
- Bill-specific language reader with searchable language choices, loading states, retry, and immediate return to English.
- Representative resource links and a message builder that copies a draft for you to review and send yourself. Personal input is not submitted or saved by VoteVisible.
- Original logo, an editorial home page featuring actual bill records, visible keyboard focus, accessible modal search, responsive layouts, and reduced-motion support.

## Translation design

The English title and summary remain in the main document. Selecting a language creates a fresh, isolated iframe containing that English source and Google's Website Translator. The widget never rewrites the React application's navigation, filters, or original text. Responses must match the active iframe, request number, and language; stale results are ignored. Returning to English removes the frame immediately. Failure or timeout shows a retry state, never a false success.

Translation requires a network connection and Google's service, which may be blocked by browser settings or extensions. Google receives the public bill text for the requested translation. Language availability and machine-translation quality vary. Automated output can distort names, dates, and legal meaning; verify important details against the English source and official legislative records. A language choice is not treated as evidence that a translation completed. Old page-wide translator cookies are not used as application state.

## Verification

```sh
npm run check
npm run build
```

`check` runs dataset integrity checks, reader regression checks, lint, and TypeScript. Data checks validate unique IDs, registered states/topics/statuses, status-label consistency, counts, and shared search behavior. They do not certify legislative accuracy or freshness. Reader checks cover stale/mismatched requests, malformed messages, safe HTML/script serialization, English-source initialization, and timeout behavior.

## Data and attribution

Bill records are condensed summaries in `src/data/bills/`. Some need verification. The site is a selected collection, not a live legislative feed or legal advice; consult the official legislature before taking action.

The local state map in `public/us-states.json` comes from [us-atlas v3](https://github.com/topojson/us-atlas), under the ISC license, using U.S. Census Bureau cartographic boundaries. It shows state boundaries, not legislative districts. Translation is provided by Google. Icons are from Lucide.

## Team

Shritan Pothini (Team Lead), Akshaj Mamidi, Arjun Harshe, Prady Mandalapu, and Alexander Mammar.

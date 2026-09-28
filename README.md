# Senior Care Advisory

A Next.js conversational senior-care advisory site. The Care Companion uses a server-side Gemini endpoint and progressively saves lead fields to Firebase Firestore.

## Run locally

1. Install Node.js 24 or newer.
2. Install dependencies with `npm ci`.
3. Copy `.env.example` to `.env.local` and fill in the Firebase web-app values and `GEMINI_API_KEY`.
4. In Firebase Authentication, enable the Anonymous sign-in provider. Create a Firestore database and publish `firestore.rules`.
5. Run `npm run dev` and open `http://localhost:3000`.

The chat route returns a setup message until `GEMINI_API_KEY` is configured. Firestore saves are disabled until Firebase client configuration is present.

## Deploy

GitHub Pages supports static files only and cannot run the `/api/chat` route. Deploy this app to a Next.js server platform such as Vercel:

1. Import `vkkeesari/SeniorCare` into Vercel.
2. Add the environment variables from `.env.example` in the Vercel project settings. Keep `GEMINI_API_KEY` server-only, without the `NEXT_PUBLIC_` prefix.
3. Deploy the app, then add the deployed domain to Firebase Authentication's authorized domains.
4. Configure a Firebase budget alert and restrict the Firebase web API key to the deployed domains.

GitHub Actions runs lint and production-build checks; deployment is handled by the connected Vercel project.

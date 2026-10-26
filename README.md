# Portfolio Project

This is the personal portfolio for Alemu Kelemework, built with Next.js, TypeScript, Drizzle, and Better Auth.

## Local development

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values for your environment.
3. Start the app:
   `npm run dev`
4. Open http://localhost:3000

## Required environment variables

- `DATABASE_URL`: Postgres connection string for Drizzle.
- `CONTACT_EMAIL`: Inbox that receives portfolio messages (defaults to `alemukelemework363@gmail.com`).
- `GMAIL_SMTP_USER` and `GMAIL_APP_PASSWORD`: Gmail SMTP credentials for direct delivery. Use a Google App Password, not your account password.
- `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`: Optional alternative; the sender must belong to a verified Resend domain.
- `BETTER_AUTH_SECRET`: Strong secret used by Better Auth.
- `BETTER_AUTH_URL`: Public base URL, such as `http://localhost:3000` or your production domain.
- `NEXT_PUBLIC_SITE_URL`: Public site URL used for metadata, sitemap, and robots.
- `ADMIN_EMAIL`: Email that is allowed to access the admin dashboard.

## Admin access

1. Start the app.
2. Visit `/sign-up` in development to create an admin account.
3. Add the account email to `ADMIN_EMAIL` in your local and production environment.
4. Sign in at `/sign-in`.

## Deployment

Use Vercel or any compatible Node.js host.

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the environment variables listed above in the project settings.
4. Confirm the root directory is the repository root and the build command is `npm run build`.
5. Deploy and verify the site, admin access, and contact submission flow.

## Content updates

- Update the portfolio content in `lib/content.ts`.
- Edit project data, roles, skills, and process steps there.
- The homepage automatically reflects changes without rewriting the page markup.

## Notes

- Keep secrets out of source control.
- For Gmail SMTP, enable 2-Step Verification and create an App Password in your Google Account. Store it only in `.env.local` and your production host's environment settings.
- For Resend, use a sender address on a domain verified in the Resend dashboard; `onboarding@resend.dev` is not used for arbitrary inbox delivery.
- Add or replace the resume file at `public/alemu-kelemework-cv.pdf` when a new version is required.

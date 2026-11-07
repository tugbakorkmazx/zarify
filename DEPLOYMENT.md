# Zarify: Preview and deployment

Zarify consists of a Next.js frontend in `frontend/` and an ASP.NET Core API in `backend/Zarify.Api/`, backed by MySQL.

## Automatic checks

The GitHub Actions workflow `.github/workflows/ci.yml` runs frontend lint, TypeScript checking and a production build, plus an API restore/build. CI uses example HTTPS origins **only to verify compilation**. Those URLs are not working services. No secrets or production database are required for these checks.

## Frontend preview (Vercel)

1. Import `tugbakorkmazx/zarify` into Vercel and set **Root Directory** to `frontend`.
2. Keep the Next.js framework preset and npm install/build defaults.
3. Configure environment variables for **Preview** deployments:
   - `NEXT_PUBLIC_API_URL`: public HTTPS URL of a separately deployed **test API**.
   - `NEXT_PUBLIC_SITE_URL`: the actual origin of the preview deployment. This is used for absolute share-preview URLs.
4. Configure the same two variables separately for **Production**, using real production origins.
5. Connect a preview branch such as `feature/event-types` and inspect the deployment build logs.

**Important:** `NEXT_PUBLIC_*` values are embedded during build. The current Next.js configuration requires both variables and uses the API origin in the Content Security Policy. A fake API URL can allow a build but does not enable login, saving invitations, RSVP, or payment workflows.

**Preview URL detail:** Vercel may generate distinct URLs for individual commits. Because `NEXT_PUBLIC_SITE_URL` is a build-time value, choose a stable preview domain/alias and configure it consistently before relying on share images. Do not assume the auto-generated URL always matches the configured value.

## Backend and database

Deploy the ASP.NET Core 9 API separately to a provider supporting .NET, with a separate **test MySQL database**. Configure API environment settings, CORS origins, authentication secrets, mail and other integrations according to the existing app configuration. Never put database passwords or JWT secrets in `NEXT_PUBLIC_*` variables.

Review and test EF Core migrations against the test database before applying them. The `AddInvitationEventType` migration has not yet been executed or verified. Do not point a preview API at the production database.

## Release gates

- GitHub Actions checks pass.
- Preview frontend and test API are reachable over HTTPS.
- Test database migrations succeed.
- Manual checks pass: registration/login, create/edit invitation, template preview, public invitation, RSVP and admin/payment flows.
- Only then consider merging the feature branch into `main`.

This repository configuration alone does **not** create a Vercel project, API host, database, or live preview URL. Those services must be connected and provisioned separately.

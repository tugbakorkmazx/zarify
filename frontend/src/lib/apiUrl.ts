/** Where the API lives. NEXT_PUBLIC_ values are inlined at build time, and a
 * production build refuses to start without it (see next.config.ts), so the
 * localhost fallback only ever applies to `next dev`. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5097";

/** The site's own public origin, for absolute links in share previews
 * (Open Graph images). Required in production builds too. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

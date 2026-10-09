import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const isDev = process.env.NODE_ENV === "development";

// NEXT_PUBLIC_* values are baked into the bundle at build time. A production
// build without them would quietly point every request at localhost (and
// every share preview at a localhost image), so the build stops instead.
// `next dev` keeps the localhost defaults from lib/apiUrl.ts.
const REQUIRED_FOR_BUILD = {
  NEXT_PUBLIC_API_URL: "the API's public URL, e.g. https://api.zarify.com.tr",
  NEXT_PUBLIC_SITE_URL: "the site's public URL, e.g. https://zarify.com.tr (used for share-preview images)",
} as const;

function checkBuildEnv() {
  const problems = Object.entries(REQUIRED_FOR_BUILD).flatMap(([name, what]) => {
    const value = process.env[name]?.trim();
    if (!value) return [`  - ${name} is not set: ${what}`];
    try {
      new URL(value);
      return [];
    } catch {
      return [`  - ${name} is not a valid URL: "${value}"`];
    }
  });
  if (problems.length > 0) {
    throw new Error(
      `Production build stopped — required environment variables are missing:\n${problems.join("\n")}\n` +
        "Set them in the build environment (or .env.production.local) and build again.",
    );
  }
}

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    checkBuildEnv();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5097";
  const apiOrigin = new URL(apiUrl).origin;

  // A baseline Content-Security-Policy that the site works under as built:
  // every script, style, image and font is served from our own origin
  // (next/font self-hosts the Google fonts, next/image serves the art), and
  // the only cross-origin call is to the API. Inline scripts/styles stay
  // allowed because Next's bootstrap and React's style props need them
  // without nonces — nonces would force every page to render dynamically.
  // 'unsafe-eval' and websockets are for the dev server only.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Only once the API itself is on https — upgrading a plain-http API on a
    // local production build would break it.
    ...(apiOrigin.startsWith("https:") ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const securityHeaders = [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Legacy twin of frame-ancestors 'none', for older browsers.
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
  ];

  // Couples' invitations and the owner's page carry names, dates and
  // addresses: never indexed, whatever a crawler makes of the HTML. (Share
  // previews still work — WhatsApp and the like read Open Graph tags
  // regardless; robots.txt deliberately doesn't block these paths, or
  // crawlers could never see this header.)
  const noIndex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

  return {
    poweredByHeader: false,
    async headers() {
      return [
        { source: "/(.*)", headers: securityHeaders },
        { source: "/davetiye/:path*", headers: noIndex },
        { source: "/davetiyem/:path*", headers: noIndex },
        { source: "/davetiyelerim/:path*", headers: noIndex },
      ];
    },
  };
}

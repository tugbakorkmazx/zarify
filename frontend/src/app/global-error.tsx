"use client";

/** Last resort, when the root layout itself fails: no fonts, providers or
 * images can be relied on, so plain markup in the site's colours. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#efe8d6", color: "#1f1c17", fontFamily: "Georgia, serif", textAlign: "center", padding: "24px" }}>
        <main>
          <p style={{ color: "#6d1d28", letterSpacing: "0.14em", fontVariant: "all-small-caps" }}>Zarify</p>
          <h1 style={{ fontWeight: 400, fontSize: "2.25rem", margin: "8px 0 16px" }}>Bir sorun oluştu.</h1>
          <p style={{ fontStyle: "italic", color: "#4c463b" }}>Something went wrong. Lütfen tekrar deneyin · Please try again.</p>
          <p style={{ marginTop: "32px", display: "flex", gap: "16px", justifyContent: "center" }}>
            <button type="button" onClick={reset} style={{ background: "#6d1d28", color: "#efe8d6", border: 0, padding: "12px 24px", fontFamily: "inherit", fontSize: "1rem", cursor: "pointer" }}>
              Tekrar dene
            </button>
            {/* The router may be what failed — a plain link reloads the site. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ color: "#6d1d28", alignSelf: "center" }}>Ana sayfa</a>
          </p>
        </main>
      </body>
    </html>
  );
}

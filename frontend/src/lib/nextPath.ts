/** Only same-site paths are accepted as a post-login destination — never
 * another origin ("//evil.example", "/\evil", "https://…") or anything with
 * control characters or backslashes. Shared by the sign-in page (a server
 * component) and the client. */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  if (/[\u0000-\u001f\\]/.test(next)) return null;
  return next;
}

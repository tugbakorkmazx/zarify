import { API_URL } from "@/lib/apiUrl";
import type { InvitationDto } from "@/lib/invitations";

/** Server-side lookup for share previews (metadata and the Open Graph
 * image). Sends no token, so the API only ever answers with a Published
 * invitation — a pending or unknown one comes back null and its preview
 * stays generic, never showing names before the couple has paid. Cached
 * briefly: crawlers hit these URLs repeatedly, and an edit shows up within
 * minutes. */
export async function getPublishedInvitation(slug: string): Promise<InvitationDto | null> {
  try {
    const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(slug)}`, {
      headers: { "Accept-Language": "tr" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const invitation = (await res.json()) as InvitationDto;
    return invitation.status === "published" ? invitation : null;
  } catch {
    return null;
  }
}

import { apiErrorFrom } from "@/lib/apiErrors";
import type { InvitationDto } from "@/lib/invitations";

import { API_URL } from "@/lib/apiUrl";

export interface AdminInvitation {
  invitation: InvitationDto;
  owner: { email: string; firstName: string; lastName: string };
  /** "ZRF-4K7Q" — what the couple was told to write in the transfer
   * description. Null only for invitations that predate payments. */
  paymentReference: string | null;
}

/** Invitations whose bank transfer hasn't been confirmed yet, oldest first. */
export async function getPendingPayments(token: string): Promise<AdminInvitation[]> {
  const res = await fetch(`${API_URL}/api/admin/invitations/pending-payment`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

/** Confirms the transfer arrived — the invitation goes live. */
export async function approvePayment(token: string, invitationId: string): Promise<InvitationDto> {
  const res = await fetch(`${API_URL}/api/admin/invitations/${invitationId}/approve-payment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

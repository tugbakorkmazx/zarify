import { apiErrorFrom } from "@/lib/apiErrors";
import type { InvitationDto, SalesAgreement } from "@/lib/invitations";

import { API_URL } from "@/lib/apiUrl";

export interface AdminInvitation {
  invitation: InvitationDto;
  owner: { email: string; firstName: string; lastName: string };
  /** "ZRF-4K7Q" — what the couple was told to write in the transfer
   * description. Null only for invitations that predate payments. */
  paymentReference: string | null;
  /** The price fixed on the order when it was placed. */
  amountTry: number | null;
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

/** The transfer couldn't be confirmed: the order stays pending with the
 * note, which is emailed to the couple and shown on their payment page. */
export async function rejectPayment(token: string, invitationId: string, note: string): Promise<InvitationDto> {
  const res = await fetch(`${API_URL}/api/admin/invitations/${invitationId}/reject-payment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

/** Orders their owners cancelled before publishing, newest first. */
export async function getCancelledOrders(token: string): Promise<SalesAgreement[]> {
  const res = await fetch(`${API_URL}/api/admin/orders/cancelled`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

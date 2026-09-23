import { ApiError } from "@/lib/auth";
import type { InvitationDto } from "@/lib/invitations";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";

export interface AdminInvitation {
  invitation: InvitationDto;
  owner: { email: string; firstName: string; lastName: string };
  /** "ZRF-4K7Q" — what the couple was told to write in the transfer
   * description. Null only for invitations that predate payments. */
  paymentReference: string | null;
}

async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    if (typeof body?.message === "string") return body.message;
  } catch {
    // not JSON
  }
  return fallback;
}

/** Invitations whose bank transfer hasn't been confirmed yet, oldest first. */
export async function getPendingPayments(token: string): Promise<AdminInvitation[]> {
  const res = await fetch(`${API_URL}/api/admin/invitations/pending-payment`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await errorMessage(res, "Liste yüklenemedi."));
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
    throw new ApiError(res.status, await errorMessage(res, "Ödeme onaylanamadı."));
  }
  return res.json();
}

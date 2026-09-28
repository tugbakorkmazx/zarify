import { apiErrorFrom } from "@/lib/apiErrors";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";

export interface ScheduleItemDto {
  /** "HH:mm" */
  time: string;
  title: string;
  description: string | null;
}

export interface InvitationDto {
  id: string;
  slug: string;
  templateSlug: string;
  brideName: string;
  groomName: string;
  /** "2027-10-10" */
  weddingDate: string;
  /** "16:00:00" */
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  /** Optional content — null / empty when the couple left it blank, in
   * which case the page doesn't render that section at all. */
  storyText: string | null;
  schedule: ScheduleItemDto[];
  dressCode: string | null;
  giftNote: string | null;
  accommodationNote: string | null;
  /** "2027-05-01" */
  rsvpDeadline: string | null;
  rsvpEnabled: boolean;
  /** Guests can see the invitation (and RSVP) only once it's "published" —
   * after an admin confirms the bank transfer. */
  status: InvitationStatus;
  publishedAtUtc: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export type InvitationStatus = "draft" | "pendingPayment" | "published";

/** Everything an owner can set — the body of both create and update. */
export interface InvitationFieldsInput {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  storyText: string | null;
  schedule: { time: string; title: string; description: string | null }[];
  dressCode: string | null;
  giftNote: string | null;
  accommodationNote: string | null;
  rsvpDeadline: string | null;
  rsvpEnabled: boolean;
}

export interface CreateInvitationInput extends InvitationFieldsInput {
  templateSlug: string;
}

/** Persists a filled-in draft + chosen template as a real invitation owned
 * by the signed-in user and returns it, slug included. */
export async function createInvitation(
  token: string,
  input: CreateInvitationInput,
): Promise<InvitationDto> {
  const res = await fetch(`${API_URL}/api/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

/** Updates one of the owner's invitations in place — same slug, so links
 * already shared with guests keep working. */
export async function updateInvitation(
  token: string,
  id: string,
  input: InvitationFieldsInput,
): Promise<InvitationDto> {
  const res = await fetch(`${API_URL}/api/invitations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

export type InvitationLookup =
  | { kind: "found"; invitation: InvitationDto }
  | { kind: "not-found" }
  | { kind: "not-published" };

/** Lookup by slug for the guest-facing /davetiye/[slug] page — no auth
 * needed. Guests only get Published invitations; pass the owner's token and
 * the owner also gets their own invitation in any status (preview while the
 * payment is pending). "Unknown slug" and "exists but not live yet" are
 * distinct, expected outcomes rather than errors. */
export async function getInvitationBySlug(slug: string, token?: string | null): Promise<InvitationLookup> {
  const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(slug)}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.status === 404) {
    const body = await res.json().catch(() => null);
    return body?.code === "INVITATION_NOT_PUBLISHED" ? { kind: "not-published" } : { kind: "not-found" };
  }
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return { kind: "found", invitation: await res.json() };
}

export interface PaymentInstructions {
  /** What the couple writes in the transfer description, e.g. "ZRF-4K7Q"
   * — its own short code, not the slug. */
  reference: string;
  bankName: string | null;
  accountHolder: string;
  iban: string;
  amountTry: number;
}

/** Bank-transfer details for one of the owner's pending invitations. */
export async function getPaymentInstructions(token: string, invitationId: string): Promise<PaymentInstructions> {
  const res = await fetch(`${API_URL}/api/invitations/${invitationId}/payment`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

export type RsvpAttendance = "yes" | "maybe" | "no";

export interface RsvpDto {
  id: string;
  guestName: string;
  attendance: RsvpAttendance;
  /** Headcount including the guest; always 0 for "no". */
  guestCount: number;
  message: string | null;
  createdAtUtc: string;
  /** Set when the guest replied again and this reply was overwritten. */
  updatedAtUtc: string | null;
}

export interface RsvpSummary {
  attendingResponses: number;
  attendingGuests: number;
  maybeResponses: number;
  maybeGuests: number;
  notAttendingResponses: number;
}

export interface MyInvitation {
  invitation: InvitationDto;
  rsvp: RsvpSummary;
}

/** The signed-in owner's invitations with their RSVP tallies, newest first. */
export async function getMyInvitations(token: string): Promise<MyInvitation[]> {
  const res = await fetch(`${API_URL}/api/invitations/mine`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

/** Every guest reply to one of the owner's invitations, newest first. */
export async function getInvitationRsvps(token: string, invitationId: string): Promise<RsvpDto[]> {
  const res = await fetch(`${API_URL}/api/invitations/${invitationId}/rsvps`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

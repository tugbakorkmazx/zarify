import { ApiError } from "@/lib/auth";

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
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

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

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
    if (data?.errors && typeof data.errors === "object") {
      const first = Object.values(data.errors).flat()[0];
      if (typeof first === "string") return first;
    }
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return fallback;
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
    throw new ApiError(res.status, await parseErrorMessage(res, "Davetiye oluşturulamadı."));
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
    throw new ApiError(res.status, await parseErrorMessage(res, "Davetiye güncellenemedi."));
  }
  return res.json();
}

/** Public lookup by slug — used by the guest-facing /davetiye/[slug] page,
 * no auth. Returns null for an unknown slug instead of throwing, since "not
 * found" is an expected, distinct outcome from a network/server failure. */
export async function getInvitationBySlug(slug: string): Promise<InvitationDto | null> {
  const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessage(res, "Davetiye yüklenemedi."));
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
    throw new ApiError(res.status, await parseErrorMessage(res, "Davetiyeler yüklenemedi."));
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
    throw new ApiError(res.status, await parseErrorMessage(res, "Yanıtlar yüklenemedi."));
  }
  return res.json();
}

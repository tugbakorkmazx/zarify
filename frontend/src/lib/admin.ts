import { apiErrorFrom } from "@/lib/apiErrors";
import type { InvitationDto, InvitationStatus, SalesAgreement } from "@/lib/invitations";

import { API_URL } from "@/lib/apiUrl";

export interface InvitationOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  suspendedAtUtc: string | null;
}

export interface AdminInvitation {
  invitation: InvitationDto;
  owner: InvitationOwner;
  /** "ZRF-4K7Q" — what the couple was told to write in the transfer
   * description. Null only for invitations that predate payments. */
  paymentReference: string | null;
  /** The price fixed on the order when it was placed. */
  amountTry: number | null;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditEntry {
  id: string;
  adminEmail: string;
  /** One of the AUDIT_ACTION_LABEL keys. */
  action: string;
  targetType: "invitation" | "user";
  targetId: string;
  /** "ZRF-4K7Q · Ayşe & Mehmet" or an email address. */
  targetLabel: string;
  note: string | null;
  createdAtUtc: string;
}

export const AUDIT_ACTION_LABEL: Record<string, string> = {
  "payment.approved": "Ödeme onaylandı",
  "payment.rejected": "Ödeme reddedildi",
  "invitation.removed": "Yayından kaldırıldı",
  "invitation.republished": "Yeniden yayına alındı",
  "invitation.names-corrected": "Çift adları düzeltildi",
  "user.suspended": "Hesap askıya alındı",
  "user.reinstated": "Hesap yeniden açıldı",
};

export interface AdminInvitationDetail {
  row: AdminInvitation;
  rsvps: {
    attendingResponses: number;
    attendingGuests: number;
    maybeResponses: number;
    notAttendingResponses: number;
  };
  agreements: SalesAgreement[];
  history: AuditEntry[];
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAtUtc: string;
  suspendedAtUtc: string | null;
  suspensionNote: string | null;
  invitationCount: number;
}

export interface AdminUserDetail {
  user: AdminUser;
  invitations: AdminInvitation[];
  history: AuditEntry[];
}

export interface AdminSummary {
  users: number;
  suspendedUsers: number;
  invitationsByStatus: Record<InvitationStatus, number>;
  pendingPayments: number;
  rejectedAwaitingFix: number;
  approvedThisMonth: number;
  approvedThisMonthTry: number;
  /** "Ekim 2026" */
  monthLabel: string;
}

async function adminGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

async function adminSend<T>(token: string, method: "POST" | "PUT", path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  return res.json();
}

function query(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "" && value !== false) search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const getAdminSummary = (token: string) => adminGet<AdminSummary>(token, "summary");

/** Invitations whose bank transfer hasn't been confirmed yet, oldest first. */
export const getPendingPayments = (token: string) =>
  adminGet<AdminInvitation[]>(token, "invitations/pending-payment");

/** Confirms the transfer arrived — the invitation goes live. */
export const approvePayment = (token: string, invitationId: string) =>
  adminSend<InvitationDto>(token, "POST", `invitations/${invitationId}/approve-payment`);

/** The transfer couldn't be confirmed: the order stays pending with the
 * note, which is emailed to the couple and shown on their payment page. */
export const rejectPayment = (token: string, invitationId: string, note: string) =>
  adminSend<InvitationDto>(token, "POST", `invitations/${invitationId}/reject-payment`, { note });

/** Orders their owners cancelled before publishing, newest first. */
export const getCancelledOrders = (token: string) => adminGet<SalesAgreement[]>(token, "orders/cancelled");

export const getAdminInvitations = (
  token: string,
  params: { status?: InvitationStatus | null; q?: string; page?: number },
) => adminGet<Paged<AdminInvitation>>(token, `invitations${query(params)}`);

export const getAdminInvitation = (token: string, id: string) =>
  adminGet<AdminInvitationDetail>(token, `invitations/${id}`);

/** Takes a published invitation offline; the note is emailed to the owner. */
export const removeInvitation = (token: string, id: string, note: string) =>
  adminSend<AdminInvitation>(token, "POST", `invitations/${id}/remove`, { note });

export const republishInvitation = (token: string, id: string) =>
  adminSend<AdminInvitation>(token, "POST", `invitations/${id}/republish`);

export const correctInvitationNames = (token: string, id: string, brideName: string, groomName: string) =>
  adminSend<AdminInvitation>(token, "PUT", `invitations/${id}/names`, { brideName, groomName });

export const getAdminUsers = (token: string, params: { q?: string; suspended?: boolean; page?: number }) =>
  adminGet<Paged<AdminUser>>(token, `users${query(params)}`);

export const getAdminUser = (token: string, id: string) => adminGet<AdminUserDetail>(token, `users/${id}`);

/** Signs the account out everywhere and blocks sign-in. */
export const suspendUser = (token: string, id: string, note: string) =>
  adminSend<AdminUser>(token, "POST", `users/${id}/suspend`, { note });

export const reinstateUser = (token: string, id: string) =>
  adminSend<AdminUser>(token, "POST", `users/${id}/reinstate`);

export const getAuditLog = (token: string, page: number) =>
  adminGet<Paged<AuditEntry>>(token, `audit${query({ page })}`);

/** Approved orders between two Turkish calendar days (inclusive) as a CSV
 * file for the accountant, saved through a temporary link (the request
 * needs the Authorization header, so a plain <a href> can't fetch it). */
export async function downloadApprovedOrdersCsv(token: string, from: string, to: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/orders/approved.csv${query({ from, to })}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `zarify-onaylanan-siparisler-${from}-${to}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

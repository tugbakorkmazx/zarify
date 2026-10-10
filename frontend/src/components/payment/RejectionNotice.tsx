import type { InvitationDto } from "@/lib/invitations";

const DATE_TIME = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" });

/** The admin's note when a transfer couldn't be confirmed. The order is
 * still pending; this says what to fix. Renders nothing otherwise. */
export function RejectionNotice({ invitation }: { invitation: InvitationDto }) {
  if (invitation.status === "published" || !invitation.paymentRejectionNote) return null;
  return (
    <div role="alert" className="border border-wine/60 bg-wine/5 px-5 py-4 text-left">
      <p className="apparatus text-sm text-wine">
        Ödemeniz onaylanamadı
        {invitation.paymentRejectedAtUtc && ` · ${DATE_TIME.format(new Date(invitation.paymentRejectedAtUtc))}`}
      </p>
      <p className="mt-2 font-body text-lg leading-relaxed text-soot">{invitation.paymentRejectionNote}</p>
      <p className="mt-2 font-body text-base text-soot-soft">
        Siparişiniz ödeme bekliyor olarak duruyor; nottaki konuyu düzelttiğinizde ödemenizi yeniden
        inceleyeceğiz.
      </p>
    </div>
  );
}

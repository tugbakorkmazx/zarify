"use client";

import { useState } from "react";
import Link from "next/link";
import { BUTTON_PRIMARY_SM, FIELD_LABEL, LINE_INPUT, TEXT_LINK } from "@/lib/ui";
import { downloadApprovedOrdersCsv, getAdminSummary } from "@/lib/admin";
import type { InvitationStatus } from "@/lib/invitations";
import { formatPrice } from "@/lib/pricing";
import { describeError } from "@/lib/apiErrors";
import { ErrorLine, LoadState, STATUS_LABEL, SectionTitle, adminHref, useAdminData } from "./shared";

/** One figure: small-caps label over a large wine numeral. */
function Figure({ label, value, note, href }: { label: string; value: string | number; note?: string; href?: string }) {
  const body = (
    <>
      <span className="apparatus text-sm text-soot-soft">{label}</span>
      <span className="font-display numerals text-4xl leading-none text-wine sm:text-5xl">{value}</span>
      {note && <span className="font-body text-sm text-soot-soft">{note}</span>}
    </>
  );
  const className = "flex flex-col items-center gap-2 px-3 py-6 text-center";
  return href ? (
    <Link href={href} className={`${className} transition-colors hover:bg-paper-deep`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

const STATUS_ORDER: InvitationStatus[] = ["pendingPayment", "published", "removed", "draft"];

/** "yyyy-mm-dd" for a date input, in Türkiye. */
function isoDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(date);
}

export function SummaryTab({ token }: { token: string }) {
  const { status, data, reload } = useAdminData("summary", getAdminSummary);

  if (status !== "ready" || !data) return <LoadState status={status} onRetry={reload} />;

  return (
    <div className="flex flex-col gap-16">
      <section aria-label="Bu ay">
        <SectionTitle note={`${data.monthLabel} içinde ödemesi onaylanan siparişler.`}>Bu Ay</SectionTitle>
        <div className="mx-auto grid max-w-2xl grid-cols-2 divide-x divide-soot/20 border-y border-soot">
          <Figure label="Onaylanan sipariş" value={data.approvedThisMonth} />
          <Figure label="Toplam tutar" value={formatPrice(data.approvedThisMonthTry, "tr")} />
        </div>
      </section>

      <section aria-label="Genel durum">
        <SectionTitle>Genel Durum</SectionTitle>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center border-y border-soot [&>*]:basis-1/2 sm:[&>*]:basis-1/3">
          <Figure
            label="Bekleyen ödeme"
            value={data.pendingPayments}
            note={data.rejectedAwaitingFix > 0 ? `${data.rejectedAwaitingFix} tanesi reddedildi, düzeltme bekliyor` : undefined}
            href={adminHref("odemeler")}
          />
          <Figure
            label="Kullanıcı"
            value={data.users}
            note={data.suspendedUsers > 0 ? `${data.suspendedUsers} askıda` : undefined}
            href={adminHref("kullanicilar")}
          />
          {STATUS_ORDER.filter((s) => s !== "pendingPayment" && (s !== "draft" || data.invitationsByStatus.draft > 0)).map(
            (s) => (
              <Figure
                key={s}
                label={`Davetiye · ${STATUS_LABEL[s].toLocaleLowerCase("tr")}`}
                value={data.invitationsByStatus[s] ?? 0}
                href={`${adminHref("davetiyeler")}&durum=${s}`}
              />
            ),
          )}
        </div>
      </section>

      <CsvExport token={token} />
    </div>
  );
}

/** The accountant's file: approved orders in a date range, as CSV. */
function CsvExport({ token }: { token: string }) {
  const today = new Date();
  const [from, setFrom] = useState(() => isoDay(new Date(today.getFullYear(), today.getMonth(), 1, 12)));
  const [to, setTo] = useState(() => isoDay(today));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);
    setBusy(true);
    try {
      await downloadApprovedOrdersCsv(token, from, to);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="csv-export">
      <SectionTitle
        note={
          <>
            Fatura süreci şimdilik elle yürüyor: seçtiğiniz tarihler arasında ödemesi onaylanan siparişler
            (onay tarihi, referans, ad, e-posta, tutar) Excel&apos;de açılan bir CSV dosyası olarak iner. Bu dosyayı
            müşavirinize verin.
          </>
        }
      >
        <span id="csv-export">Muhasebe Dışa Aktarımı</span>
      </SectionTitle>
      <form
        className="mx-auto flex max-w-xl flex-wrap items-end justify-center gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleDownload();
        }}
      >
        <label className="flex flex-col gap-1 text-left">
          <span className={FIELD_LABEL}>Başlangıç</span>
          <input type="date" required value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={LINE_INPUT} />
        </label>
        <label className="flex flex-col gap-1 text-left">
          <span className={FIELD_LABEL}>Bitiş</span>
          <input type="date" required value={to} min={from} onChange={(e) => setTo(e.target.value)} className={LINE_INPUT} />
        </label>
        <button type="submit" disabled={busy} className={BUTTON_PRIMARY_SM}>
          {busy ? "Hazırlanıyor…" : "CSV İndir"}
        </button>
      </form>
      <div className="mt-4">
        <ErrorLine error={error} />
      </div>
      <p className="mt-4 text-center font-body text-sm text-soot-soft">
        Tek tek işlemler için{" "}
        <Link href={adminHref("gecmis")} className={TEXT_LINK}>
          İşlem Geçmişi
        </Link>
        &apos;ne bakın.
      </p>
    </section>
  );
}

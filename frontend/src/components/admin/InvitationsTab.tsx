"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { BUTTON_PRIMARY_SM, BUTTON_SECONDARY_SM, FIELD_LABEL, LINE_INPUT, TEXT_LINK } from "@/lib/ui";
import {
  AUDIT_ACTION_LABEL,
  correctInvitationNames,
  getAdminInvitation,
  getAdminInvitations,
  removeInvitation,
  republishInvitation,
  type AdminInvitation,
  type AdminInvitationDetail,
  type AuditEntry,
} from "@/lib/admin";
import type { InvitationStatus } from "@/lib/invitations";
import { formatPrice } from "@/lib/pricing";
import { formatDateLine } from "@/lib/formatDateLine";
import { describeError } from "@/lib/apiErrors";
import {
  ConfirmBox,
  EmptyNote,
  ErrorLine,
  Fact,
  LoadState,
  NoteForm,
  Pager,
  STATUS_LABEL,
  SearchBox,
  SectionTitle,
  StatusBadge,
  adminHref,
  formatMoment,
  useAdminData,
} from "./shared";

const FILTERS: (InvitationStatus | null)[] = [null, "pendingPayment", "published", "removed"];

function listHref(status: InvitationStatus | null, q: string, page: number) {
  return `${adminHref("davetiyeler")}${status ? `&durum=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${page > 1 ? `&sayfa=${page}` : ""}`;
}

/** Every invitation in every status: filter by status, search by
 * reference, slug, the couple's names or the owner's email; open one for
 * its details and the admin actions. */
export function InvitationsTab({
  token,
  id,
  status,
  q,
  page,
}: {
  token: string;
  id: string | null;
  status: InvitationStatus | null;
  q: string;
  page: number;
}) {
  if (id) return <InvitationDetail key={id} token={token} id={id} />;
  return <InvitationList status={status} q={q} page={page} />;
}

function InvitationList({ status, q, page }: { status: InvitationStatus | null; q: string; page: number }) {
  const router = useRouter();
  const { status: load, data, reload } = useAdminData(`invitations|${status}|${q}|${page}`, (token) =>
    getAdminInvitations(token, { status, q, page }),
  );

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-6">
        <SearchBox
          key={q}
          initial={q}
          label="Ara"
          placeholder="ZRF kodu, link, çift adı veya e-posta"
          onSearch={(next) => router.push(listHref(status, next, 1), { scroll: false })}
        />
        <div role="group" aria-label="Durum" className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f ?? "all"}
              href={listHref(f, q, 1)}
              scroll={false}
              aria-current={f === status ? "true" : undefined}
              className={`apparatus min-h-11 content-center border px-4 text-sm transition-colors ${
                f === status ? "border-wine bg-wine text-paper" : "border-soot/40 text-soot hover:border-wine hover:text-wine"
              }`}
            >
              {f ? STATUS_LABEL[f] : "Tümü"}
            </Link>
          ))}
        </div>
      </div>

      {load !== "ready" || !data ? (
        <LoadState status={load} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyNote>{q || status ? "Bu aramaya uyan davetiye yok." : "Henüz davetiye yok."}</EmptyNote>
      ) : (
        <>
          <p className="mb-4 text-center font-body text-base text-soot-soft">{data.total} davetiye</p>
          <InvitationRows items={data.items} />
          <Pager
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPage={(p) => router.push(listHref(status, q, p), { scroll: false })}
          />
        </>
      )}
    </>
  );
}

/** A table on wide screens, a stack of centred cards on narrow ones. Also
 * used for a user's invitations. */
export function InvitationRows({ items }: { items: AdminInvitation[] }) {
  return (
    <>
      <table className="hidden w-full border-y border-soot text-center lg:table">
        <thead>
          <tr className="apparatus border-b border-soot/30 text-xs text-soot-soft">
            <th scope="col" className="py-3 font-medium">Referans</th>
            <th scope="col" className="py-3 font-medium">Çift</th>
            <th scope="col" className="py-3 font-medium">Sahibi</th>
            <th scope="col" className="py-3 font-medium">Durum</th>
            <th scope="col" className="py-3 font-medium">Oluşturulma</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-soot/15">
          {items.map((item) => (
            <tr key={item.invitation.id} className="transition-colors hover:bg-paper-deep">
              <td className="py-4 font-display numerals text-lg text-wine">{item.paymentReference ?? "—"}</td>
              <td className="py-4 font-body text-lg text-soot">
                <Link href={adminHref("davetiyeler", item.invitation.id)} className={TEXT_LINK}>
                  <CoupleNames names={`${item.invitation.brideName} & ${item.invitation.groomName}`} />
                </Link>
              </td>
              <td className="max-w-[16rem] truncate py-4 font-body text-base text-soot-soft">{item.owner.email}</td>
              <td className="py-4">
                <StatusBadge status={item.invitation.status} />
              </td>
              <td className="py-4 font-body text-sm text-soot-soft">{formatMoment(item.invitation.createdAtUtc)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-soot/20 border-y border-soot lg:hidden">
        {items.map((item) => (
          <li key={item.invitation.id}>
            <Link
              href={adminHref("davetiyeler", item.invitation.id)}
              className="flex flex-col items-center gap-1 py-5 text-center transition-colors hover:bg-paper-deep"
            >
              <StatusBadge status={item.invitation.status} />
              <span className="font-display text-2xl leading-tight text-soot">
                <CoupleNames names={`${item.invitation.brideName} & ${item.invitation.groomName}`} />
              </span>
              <span className="font-display numerals text-lg text-wine">{item.paymentReference ?? "—"}</span>
              <span className="break-all font-body text-base text-soot-soft">{item.owner.email}</span>
              <span className="font-body text-sm text-soot-soft">{formatMoment(item.invitation.createdAtUtc)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function InvitationDetail({ token, id }: { token: string; id: string }) {
  const { status, data, setData, reload } = useAdminData(`invitation|${id}`, (t) => getAdminInvitation(t, id));

  return (
    <>
      <p className="mb-8 text-center">
        <Link href={adminHref("davetiyeler")} className={`apparatus text-sm ${TEXT_LINK}`}>
          ← Tüm davetiyeler
        </Link>
      </p>
      {status !== "ready" || !data ? (
        <LoadState status={status} onRetry={reload} />
      ) : (
        <DetailBody token={token} detail={data} onChanged={setData} onReload={reload} />
      )}
    </>
  );
}

function DetailBody({
  token,
  detail,
  onChanged,
  onReload,
}: {
  token: string;
  detail: AdminInvitationDetail;
  onChanged: (detail: AdminInvitationDetail) => void;
  onReload: () => void;
}) {
  const { row, rsvps, agreements, history } = detail;
  const inv = row.invitation;
  const [mode, setMode] = useState<"idle" | "remove" | "republish" | "names">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<AdminInvitation>) {
    setError(null);
    setBusy(true);
    try {
      const updated = await action();
      onChanged({ ...detail, row: updated });
      setMode("idle");
      // The new log entry comes with a fresh load.
      onReload();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  const names = `${inv.brideName} & ${inv.groomName}`;

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-3 text-center">
        <StatusBadge status={inv.status} />
        <h2 className="font-display text-4xl leading-tight text-soot">
          <CoupleNames names={names} />
        </h2>
        <p className="font-display numerals text-2xl text-wine">{row.paymentReference ?? "—"}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href={`/davetiye/${inv.slug}`} target="_blank" rel="noopener" className={`apparatus min-h-11 content-center text-sm ${TEXT_LINK}`}>
            Davetiyeyi aç ↗
          </a>
          <Link href={adminHref("kullanicilar", row.owner.id)} className={`apparatus min-h-11 content-center text-sm ${TEXT_LINK}`}>
            Sahibinin hesabı
          </Link>
        </div>
      </section>

      {inv.status === "removed" && inv.removalNote && (
        <p className="mx-auto max-w-xl border-l-2 border-wine/60 pl-4 text-left font-body text-base text-soot">
          <span className="apparatus text-xs text-wine">Yayından kaldırıldı · {formatMoment(inv.removedAtUtc)}</span>
          <br />
          {inv.removalNote}
        </p>
      )}
      {inv.status === "pendingPayment" && inv.paymentRejectionNote && (
        <p className="mx-auto max-w-xl border-l-2 border-wine/60 pl-4 text-left font-body text-base text-soot">
          <span className="apparatus text-xs text-wine">Ödeme reddedildi · {formatMoment(inv.paymentRejectedAtUtc)}</span>
          <br />
          {inv.paymentRejectionNote}
        </p>
      )}

      <section className="flex flex-col items-center gap-4">
        {mode === "remove" ? (
          <NoteForm
            label="Yayından kaldırma gerekçesi"
            placeholder="Ör. Hikâye metninde Kullanım Şartları'na aykırı ifadeler var."
            hint="Davetiye silinmez. Misafirler “Bu davetiye yayında değil” görür; gerekçe sahibine e-postayla gider. İstediğiniz zaman yeniden yayına alabilirsiniz."
            submitLabel="Yayından kaldır"
            busyLabel="Kaldırılıyor…"
            busy={busy}
            onSubmit={(note) => run(() => removeInvitation(token, inv.id, note))}
            onCancel={() => setMode("idle")}
          />
        ) : mode === "republish" ? (
          <ConfirmBox
            text="Davetiye aynı linkle yeniden misafirlere açılacak ve sahibine e-posta gidecek."
            confirmLabel="Evet, yayına al"
            busyLabel="Yayına alınıyor…"
            busy={busy}
            onConfirm={() => run(() => republishInvitation(token, inv.id))}
            onCancel={() => setMode("idle")}
          />
        ) : mode === "names" ? (
          <NamesForm
            bride={inv.brideName}
            groom={inv.groomName}
            busy={busy}
            onSubmit={(bride, groom) => run(() => correctInvitationNames(token, inv.id, bride, groom))}
            onCancel={() => setMode("idle")}
          />
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {inv.status === "published" && (
              <button type="button" onClick={() => setMode("remove")} className={BUTTON_PRIMARY_SM}>
                Yayından Kaldır
              </button>
            )}
            {inv.status === "removed" && (
              <button type="button" onClick={() => setMode("republish")} className={BUTTON_PRIMARY_SM}>
                Yeniden Yayına Al
              </button>
            )}
            <button type="button" onClick={() => setMode("names")} className={BUTTON_SECONDARY_SM}>
              Çift Adlarını Düzelt
            </button>
          </div>
        )}
        <ErrorLine error={error} />
      </section>

      <section>
        <SectionTitle>Bilgiler</SectionTitle>
        <dl className="mx-auto grid max-w-3xl grid-cols-1 gap-x-10 gap-y-5 text-center sm:grid-cols-2">
          <Fact label="Düğün">
            {formatDateLine(inv.weddingDate)} · {inv.weddingTime.slice(0, 5)}
          </Fact>
          <Fact label="Mekân">
            {inv.venueName}
            <span className="block text-base text-soot-soft">{inv.venueAddress}</span>
          </Fact>
          <Fact label="Sahibi">
            {row.owner.firstName} {row.owner.lastName}
            <span className="block break-all text-base text-soot-soft">{row.owner.email}</span>
            {row.owner.suspendedAtUtc && <span className="apparatus block text-xs text-wine">Hesap askıda</span>}
          </Fact>
          <Fact label="Link">/{inv.slug}</Fact>
          <Fact label="Tutar">{row.amountTry != null ? formatPrice(row.amountTry, "tr") : "—"}</Fact>
          <Fact label="Oluşturulma">{formatMoment(inv.createdAtUtc)}</Fact>
          <Fact label="Yayına alınma">{formatMoment(inv.publishedAtUtc)}</Fact>
          <Fact label="Son düzenleme">{formatMoment(inv.updatedAtUtc)}</Fact>
          <Fact label="Katılım bildirimi">
            {inv.rsvpEnabled
              ? `${rsvps.attendingGuests} kişi geliyor (${rsvps.attendingResponses} yanıt) · ${rsvps.maybeResponses} belirsiz · ${rsvps.notAttendingResponses} gelmiyor`
              : "Kapalı"}
          </Fact>
        </dl>
      </section>

      <section>
        <SectionTitle note="Sipariş anında kaydedilen onay: kim, ne zaman, hangi sürüm ve tutarla.">
          Sözleşme Kaydı
        </SectionTitle>
        {agreements.length === 0 ? (
          <EmptyNote>Bu davetiye için sözleşme kaydı yok (sözleşme onayı eklenmeden önce oluşturulmuş).</EmptyNote>
        ) : (
          <ul className="mx-auto max-w-2xl divide-y divide-soot/20 border-y border-soot">
            {agreements.map((a) => (
              <li key={a.id} className="flex flex-col items-center gap-1 py-4 text-center">
                <p className="font-body text-lg text-soot">
                  {a.userFirstName} {a.userLastName} · <span className="break-all">{a.userEmail}</span>
                </p>
                <p className="font-body text-base text-soot-soft">
                  Onay: {formatMoment(a.acceptedAtUtc)} · Sürüm {a.version ?? "—"} · {formatPrice(a.amountTry, "tr")}
                </p>
                <p className="font-body text-sm text-soot-soft">
                  Kayıttaki çift: {a.coupleNames}
                  {a.cancelledAtUtc && ` · İptal: ${formatMoment(a.cancelledAtUtc)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionTitle>İşlem Geçmişi</SectionTitle>
        <HistoryList entries={history} />
      </section>
    </div>
  );
}

function NamesForm({
  bride,
  groom,
  busy,
  onSubmit,
  onCancel,
}: {
  bride: string;
  groom: string;
  busy: boolean;
  onSubmit: (bride: string, groom: string) => void;
  onCancel: () => void;
}) {
  const [b, setB] = useState(bride);
  const [g, setG] = useState(groom);
  const unchanged = b.trim() === bride && g.trim() === groom;
  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-4 bg-paper-deep p-4 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(b.trim(), g.trim());
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className={FIELD_LABEL}>Gelin adı</span>
          <input required maxLength={100} value={b} onChange={(e) => setB(e.target.value)} className={LINE_INPUT} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={FIELD_LABEL}>Damat adı</span>
          <input required maxLength={100} value={g} onChange={(e) => setG(e.target.value)} className={LINE_INPUT} />
        </label>
      </div>
      <p className="font-body text-sm text-soot-soft">
        Yalnızca yazım hatası düzeltmesi için. Link değişmez; eski ve yeni ad işlem geçmişine yazılır.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || unchanged || !b.trim() || !g.trim()} className={BUTTON_PRIMARY_SM}>
          {busy ? "Kaydediliyor…" : "Düzeltmeyi kaydet"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={`apparatus min-h-11 text-sm ${TEXT_LINK}`}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}

/** Audit entries for one record, newest first. */
export function HistoryList({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) return <EmptyNote>Henüz yönetici işlemi yok.</EmptyNote>;
  return (
    <ul className="mx-auto max-w-2xl divide-y divide-soot/20 border-y border-soot">
      {entries.map((e) => (
        <li key={e.id} className="flex flex-col items-center gap-1 py-4 text-center">
          <p className="apparatus text-sm text-wine">{AUDIT_ACTION_LABEL[e.action] ?? e.action}</p>
          {e.note && <p className="break-words font-body text-base text-soot">{e.note}</p>}
          <p className="font-body text-sm text-soot-soft">
            {formatMoment(e.createdAtUtc)} · <span className="break-all">{e.adminEmail}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BUTTON_PRIMARY_SM, TEXT_LINK } from "@/lib/ui";
import {
  getAdminUser,
  getAdminUsers,
  reinstateUser,
  suspendUser,
  type AdminUser,
  type AdminUserDetail,
} from "@/lib/admin";
import { describeError } from "@/lib/apiErrors";
import { HistoryList, InvitationRows } from "./InvitationsTab";
import {
  ConfirmBox,
  EmptyNote,
  ErrorLine,
  Fact,
  LoadState,
  NoteForm,
  Pager,
  SearchBox,
  SectionTitle,
  adminHref,
  formatMoment,
  useAdminData,
} from "./shared";

function listHref(q: string, suspended: boolean, page: number) {
  return `${adminHref("kullanicilar")}${q ? `&q=${encodeURIComponent(q)}` : ""}${suspended ? "&askida=1" : ""}${page > 1 ? `&sayfa=${page}` : ""}`;
}

export function UsersTab({
  token,
  id,
  q,
  suspended,
  page,
}: {
  token: string;
  id: string | null;
  q: string;
  suspended: boolean;
  page: number;
}) {
  if (id) return <UserDetail key={id} token={token} id={id} />;
  return <UserList q={q} suspended={suspended} page={page} />;
}

function UserState({ user }: { user: AdminUser }) {
  if (user.suspendedAtUtc) return <span className="apparatus text-sm text-wine">Askıda</span>;
  if (user.role === "admin") return <span className="apparatus text-sm text-olive">Yönetici</span>;
  return <span className="apparatus text-sm text-soot-soft">Aktif</span>;
}

function UserList({ q, suspended, page }: { q: string; suspended: boolean; page: number }) {
  const router = useRouter();
  const { status, data, reload } = useAdminData(`users|${q}|${suspended}|${page}`, (token) =>
    getAdminUsers(token, { q, suspended, page }),
  );

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-5">
        <SearchBox
          key={q}
          initial={q}
          label="Ara"
          placeholder="E-posta veya ad soyad"
          onSearch={(next) => router.push(listHref(next, suspended, 1), { scroll: false })}
        />
        <Link href={listHref(q, !suspended, 1)} scroll={false} className={`apparatus min-h-11 content-center text-sm ${TEXT_LINK}`}>
          {suspended ? "Tüm kullanıcıları göster" : "Yalnızca askıdakiler"}
        </Link>
      </div>

      {status !== "ready" || !data ? (
        <LoadState status={status} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyNote>{q || suspended ? "Bu aramaya uyan kullanıcı yok." : "Henüz kullanıcı yok."}</EmptyNote>
      ) : (
        <>
          <p className="mb-4 text-center font-body text-base text-soot-soft">{data.total} kullanıcı</p>
          <table className="hidden w-full border-y border-soot text-center lg:table">
            <thead>
              <tr className="apparatus border-b border-soot/30 text-xs text-soot-soft">
                <th scope="col" className="py-3 font-medium">Ad soyad</th>
                <th scope="col" className="py-3 font-medium">E-posta</th>
                <th scope="col" className="py-3 font-medium">Davetiye</th>
                <th scope="col" className="py-3 font-medium">Durum</th>
                <th scope="col" className="py-3 font-medium">Kayıt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soot/15">
              {data.items.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-paper-deep">
                  <td className="py-4 font-body text-lg text-soot">
                    <Link href={adminHref("kullanicilar", u.id)} className={TEXT_LINK}>
                      {u.firstName} {u.lastName}
                    </Link>
                  </td>
                  <td className="max-w-[18rem] truncate py-4 font-body text-base text-soot-soft">{u.email}</td>
                  <td className="py-4 font-display numerals text-lg text-wine">{u.invitationCount}</td>
                  <td className="py-4">
                    <UserState user={u} />
                  </td>
                  <td className="py-4 font-body text-sm text-soot-soft">{formatMoment(u.createdAtUtc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-soot/20 border-y border-soot lg:hidden">
            {data.items.map((u) => (
              <li key={u.id}>
                <Link
                  href={adminHref("kullanicilar", u.id)}
                  className="flex flex-col items-center gap-1 py-5 text-center transition-colors hover:bg-paper-deep"
                >
                  <UserState user={u} />
                  <span className="font-display text-2xl leading-tight text-soot">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="break-all font-body text-base text-soot-soft">{u.email}</span>
                  <span className="font-body text-sm text-soot-soft">
                    {u.invitationCount} davetiye · Kayıt {formatMoment(u.createdAtUtc)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Pager
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPage={(p) => router.push(listHref(q, suspended, p), { scroll: false })}
          />
        </>
      )}
    </>
  );
}

function UserDetail({ token, id }: { token: string; id: string }) {
  const { status, data, setData, reload } = useAdminData(`user|${id}`, (t) => getAdminUser(t, id));
  return (
    <>
      <p className="mb-8 text-center">
        <Link href={adminHref("kullanicilar")} className={`apparatus text-sm ${TEXT_LINK}`}>
          ← Tüm kullanıcılar
        </Link>
      </p>
      {status !== "ready" || !data ? (
        <LoadState status={status} onRetry={reload} />
      ) : (
        <UserBody token={token} detail={data} onChanged={setData} onReload={reload} />
      )}
    </>
  );
}

function UserBody({
  token,
  detail,
  onChanged,
  onReload,
}: {
  token: string;
  detail: AdminUserDetail;
  onChanged: (detail: AdminUserDetail) => void;
  onReload: () => void;
}) {
  const { user, invitations, history } = detail;
  const [mode, setMode] = useState<"idle" | "suspend" | "reinstate">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<AdminUser>) {
    setError(null);
    setBusy(true);
    try {
      onChanged({ ...detail, user: await action() });
      setMode("idle");
      onReload();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-3 text-center">
        <UserState user={user} />
        <h2 className="font-display text-4xl leading-tight text-soot">
          {user.firstName} {user.lastName}
        </h2>
        <p className="break-all font-body text-lg text-soot-soft">{user.email}</p>
      </section>

      {user.suspendedAtUtc && (
        <p className="mx-auto max-w-xl border-l-2 border-wine/60 pl-4 text-left font-body text-base text-soot">
          <span className="apparatus text-xs text-wine">Askıya alındı · {formatMoment(user.suspendedAtUtc)}</span>
          <br />
          {user.suspensionNote}
        </p>
      )}

      {user.role !== "admin" && (
        <section className="flex flex-col items-center gap-4">
          {mode === "suspend" ? (
            <NoteForm
              label="Askıya alma gerekçesi"
              placeholder="Ör. Birden fazla şikâyet; kimlik doğrulanana kadar."
              hint="Kullanıcı giriş yapamaz, açık oturumları hemen kapanır. Yayındaki davetiyeleri yayında kalır; kaldırmak için davetiyeyi ayrıca yayından kaldırın. Gerekçe yalnızca işlem geçmişine yazılır."
              submitLabel="Askıya al"
              busyLabel="Askıya alınıyor…"
              busy={busy}
              onSubmit={(note) => run(() => suspendUser(token, user.id, note))}
              onCancel={() => setMode("idle")}
            />
          ) : mode === "reinstate" ? (
            <ConfirmBox
              text="Kullanıcı yeniden giriş yapabilecek."
              confirmLabel="Evet, hesabı aç"
              busyLabel="Açılıyor…"
              busy={busy}
              onConfirm={() => run(() => reinstateUser(token, user.id))}
              onCancel={() => setMode("idle")}
            />
          ) : user.suspendedAtUtc ? (
            <button type="button" onClick={() => setMode("reinstate")} className={BUTTON_PRIMARY_SM}>
              Hesabı Yeniden Aç
            </button>
          ) : (
            <button type="button" onClick={() => setMode("suspend")} className={BUTTON_PRIMARY_SM}>
              Askıya Al
            </button>
          )}
          <ErrorLine error={error} />
        </section>
      )}

      <section>
        <SectionTitle>Bilgiler</SectionTitle>
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-10 gap-y-5 text-center sm:grid-cols-3">
          <Fact label="Kayıt">{formatMoment(user.createdAtUtc)}</Fact>
          <Fact label="Rol">{user.role === "admin" ? "Yönetici" : "Kullanıcı"}</Fact>
          <Fact label="Davetiye">{user.invitationCount}</Fact>
        </dl>
      </section>

      <section>
        <SectionTitle>Davetiyeleri</SectionTitle>
        {invitations.length === 0 ? <EmptyNote>Bu kullanıcının davetiyesi yok.</EmptyNote> : <InvitationRows items={invitations} />}
      </section>

      <section>
        <SectionTitle>İşlem Geçmişi</SectionTitle>
        <HistoryList entries={history} />
      </section>
    </div>
  );
}

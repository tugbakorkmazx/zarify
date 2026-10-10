"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, loginHref } from "@/lib/auth";
import { OwnerShell } from "@/components/owner/OwnerShell";
import type { InvitationStatus } from "@/lib/invitations";
import { adminHref, type AdminTab } from "./shared";
import { SummaryTab } from "./SummaryTab";
import { PaymentsTab } from "./PaymentsTab";
import { InvitationsTab } from "./InvitationsTab";
import { UsersTab } from "./UsersTab";
import { CancelledTab } from "./CancelledTab";
import { AuditTab } from "./AuditTab";

const TABS: { key: AdminTab; label: string }[] = [
  { key: "ozet", label: "Özet" },
  { key: "odemeler", label: "Ödemeler" },
  { key: "davetiyeler", label: "Davetiyeler" },
  { key: "kullanicilar", label: "Kullanıcılar" },
  { key: "iptaller", label: "İptal Edilenler" },
  { key: "gecmis", label: "İşlem Geçmişi" },
];

export interface AdminParams {
  tab: AdminTab;
  id: string | null;
  status: InvitationStatus | null;
  q: string;
  suspended: boolean;
  page: number;
}

/** The operator's panel at /yonetim, in tabs. Admin only — the API enforces
 * the role on every call; a non-admin just sees the "no access" line. The
 * tab, the open record, filters and page all come from the URL
 * (app/yonetim/page.tsx reads them). */
export function AdminPanel({ params }: { params: AdminParams }) {
  const { ready, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !token) router.replace(loginHref());
  }, [ready, token, router]);

  if (!token) return null;

  const current = TABS.find((t) => t.key === params.tab) ?? TABS[0];

  return (
    <OwnerShell section="Yönetim" title={current.label} current="admin">
      <nav aria-label="Yönetim bölümleri" className="-mt-4 mb-12 border-y border-soot/25">
        <ul className="flex flex-wrap justify-center gap-x-1 sm:gap-x-4">
          {TABS.map((t) => {
            const active = t.key === current.key;
            return (
              <li key={t.key}>
                <Link
                  href={adminHref(t.key)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`apparatus -mb-px inline-block min-h-11 border-b-2 px-2 py-3 text-sm transition-colors sm:px-3 ${
                    active ? "border-wine text-wine" : "border-transparent text-soot-soft hover:text-soot"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {current.key === "ozet" && <SummaryTab token={token} />}
      {current.key === "odemeler" && <PaymentsTab token={token} />}
      {current.key === "davetiyeler" && (
        <InvitationsTab token={token} id={params.id} status={params.status} q={params.q} page={params.page} />
      )}
      {current.key === "kullanicilar" && (
        <UsersTab token={token} id={params.id} q={params.q} suspended={params.suspended} page={params.page} />
      )}
      {current.key === "iptaller" && <CancelledTab />}
      {current.key === "gecmis" && <AuditTab page={params.page} />}
    </OwnerShell>
  );
}

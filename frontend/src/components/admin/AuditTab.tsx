"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUDIT_ACTION_LABEL, getAuditLog } from "@/lib/admin";
import { TEXT_LINK } from "@/lib/ui";
import { EmptyNote, LoadState, Pager, adminHref, formatMoment, useAdminData } from "./shared";

/** Everything admins did, newest first: approvals, rejections, removals,
 * republishing, name corrections, suspensions. */
export function AuditTab({ page }: { page: number }) {
  const router = useRouter();
  const { status, data, reload } = useAdminData(`audit|${page}`, (token) => getAuditLog(token, page));

  if (status !== "ready" || !data) return <LoadState status={status} onRetry={reload} />;
  if (data.items.length === 0) return <EmptyNote>Henüz kayıtlı bir yönetici işlemi yok.</EmptyNote>;

  return (
    <>
      <ul className="mx-auto max-w-3xl divide-y divide-soot/20 border-y border-soot">
        {data.items.map((e) => (
          <li key={e.id} className="flex flex-col items-center gap-1 py-5 text-center">
            <p className="apparatus text-sm text-wine">{AUDIT_ACTION_LABEL[e.action] ?? e.action}</p>
            <p className="font-body text-lg text-soot">
              <Link
                href={adminHref(e.targetType === "user" ? "kullanicilar" : "davetiyeler", e.targetId)}
                className={`break-words ${TEXT_LINK}`}
              >
                {e.targetLabel}
              </Link>
            </p>
            {e.note && <p className="max-w-xl break-words font-body text-base text-soot-soft">{e.note}</p>}
            <p className="font-body text-sm text-soot-soft">
              {formatMoment(e.createdAtUtc)} · <span className="break-all">{e.adminEmail}</span>
            </p>
          </li>
        ))}
      </ul>
      <Pager
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        onPage={(p) => router.push(`${adminHref("gecmis")}${p > 1 ? `&sayfa=${p}` : ""}`, { scroll: false })}
      />
    </>
  );
}

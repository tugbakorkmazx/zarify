import type { Metadata } from "next";
import { AdminPanel, type AdminParams } from "@/components/admin/AdminPanel";
import type { AdminTab } from "@/components/admin/shared";
import type { InvitationStatus } from "@/lib/invitations";

export const metadata: Metadata = {
  title: "Yönetim — Zarify",
  robots: { index: false, follow: false },
};

const TABS: AdminTab[] = ["ozet", "odemeler", "davetiyeler", "kullanicilar", "iptaller", "gecmis"];
const STATUSES: InvitationStatus[] = ["draft", "pendingPayment", "published", "removed"];

function one(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

/** /yonetim?sekme=davetiyeler&durum=published&q=…&sayfa=2&id=… */
export default async function AdminPage({ searchParams }: PageProps<"/yonetim">) {
  const sp = await searchParams;
  const tab = one(sp.sekme) as AdminTab;
  const status = one(sp.durum) as InvitationStatus;
  const page = Number.parseInt(one(sp.sayfa), 10);
  const params: AdminParams = {
    tab: TABS.includes(tab) ? tab : "ozet",
    id: one(sp.id) || null,
    status: STATUSES.includes(status) ? status : null,
    q: one(sp.q).slice(0, 100),
    suspended: one(sp.askida) === "1",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
  return <AdminPanel params={params} />;
}

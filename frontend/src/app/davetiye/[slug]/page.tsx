import type { Metadata } from "next";
import { PublicInvitationView } from "@/components/invitation/PublicInvitationView";
import { getPublishedInvitation } from "@/lib/publicInvitation";
import { formatDateLine } from "@/lib/formatDateLine";

// Guests' pages carry a couple's names, date and venue: kept out of search
// engines (next.config.ts also sends X-Robots-Tag for the whole path).
const robots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/** What a shared link shows in WhatsApp, iMessage, X…: the couple's names,
 * the date and the venue, with the cover image (./opengraph-image.tsx).
 * Only for a Published invitation — anything else gets a generic preview
 * that names nobody. */
export async function generateMetadata({ params }: PageProps<"/davetiye/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);

  if (!invitation) {
    return {
      title: "Davetiye — Zarify",
      description: "Bir düğün davetiyesi.",
      robots,
    };
  }

  const names = `${invitation.brideName} & ${invitation.groomName}`;
  const title = `${names} — Düğün Davetiyesi`;
  const description = `${formatDateLine(invitation.weddingDate)} · ${invitation.venueName}. Davetiyeyi açmak için dokunun.`;

  return {
    title,
    description,
    robots,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: "Zarify",
      url: `/davetiye/${slug}`,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicInvitationPage({ params }: PageProps<"/davetiye/[slug]">) {
  const { slug } = await params;
  return <PublicInvitationView slug={slug} />;
}

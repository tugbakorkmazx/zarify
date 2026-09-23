import { Hero } from "@/components/invitation/Hero";
import { StorySection } from "@/components/invitation/StorySection";
import { ScheduleSection } from "@/components/invitation/ScheduleSection";
import { VenueSection } from "@/components/invitation/VenueSection";
import { InfoBlocks } from "@/components/invitation/InfoBlocks";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { SiteFooter } from "@/components/invitation/SiteFooter";

/** The "Nikâh Tezhibi" template's content, decoupled from where the content
 * comes from — a local unpublished draft (see the /sablonlar preview) or a
 * real invitation fetched from the backend by slug (see /davetiye/[slug]).
 * Both pages render this with the same shape of props. */
export function NikahTezhibiTemplate({
  eventDate,
  names,
  dateLine,
  venueLine,
  venueName,
  venueAddress,
  mapUrl,
  includePhotoAlbum = true,
  includeDressCode = true,
  rsvpEnabled = true,
  invitationSlug,
}: {
  eventDate: Date;
  names?: string;
  dateLine?: string;
  venueLine?: string;
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  includePhotoAlbum?: boolean;
  includeDressCode?: boolean;
  rsvpEnabled?: boolean;
  /** Set only for a published invitation — the local draft preview has
   * nothing on the backend to attach RSVP replies to. */
  invitationSlug?: string;
}) {
  return (
    <>
      <Hero eventDate={eventDate} names={names} dateLine={dateLine} venueLine={venueLine} />
      {includePhotoAlbum && <StorySection />}
      <ScheduleSection />
      <VenueSection mapUrl={mapUrl} name={venueName} address={venueAddress} />
      <InfoBlocks includeDressCode={includeDressCode} />
      <RsvpSection enabled={rsvpEnabled} names={names} invitationSlug={invitationSlug} />
      <SiteFooter names={names} />
    </>
  );
}

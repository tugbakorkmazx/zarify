"use client";

import { Hero } from "@/components/invitation/Hero";
import { StorySection } from "@/components/invitation/StorySection";
import { ScheduleSection } from "@/components/invitation/ScheduleSection";
import { VenueSection } from "@/components/invitation/VenueSection";
import { InfoBlocks } from "@/components/invitation/InfoBlocks";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { SiteFooter } from "@/components/invitation/SiteFooter";
import { useI18n } from "@/lib/i18n";
import type { InvitationContent } from "@/lib/invitationForm";

/** The "Herbaryum" template (slug `nikah-tezhibi`, kept so existing invitations still resolve)'s content, decoupled from where the content
 * comes from — a local unpublished draft (see the /sablonlar preview) or a
 * real invitation fetched from the backend by slug (see /davetiye/[slug]).
 *
 * `content` decides which of two modes the page is in:
 * - omitted: gallery showcase, for someone browsing templates before filling
 *   anything in — every optional section shows the template's sample text.
 * - given: the couple's own invitation (draft preview or published) — an
 *   optional section renders only if the couple filled it in. Sample text
 *   never leaks onto a real invitation. */
export function HerbaryumTemplate({
  eventDate,
  names,
  dateLine,
  venueLine,
  venueName,
  venueAddress,
  mapUrl,
  content,
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
  content?: InvitationContent;
  rsvpEnabled?: boolean;
  /** Set only for a published invitation — the local draft preview has
   * nothing on the backend to attach RSVP replies to. */
  invitationSlug?: string;
}) {
  const { t } = useI18n();
  const showcase = content === undefined;

  const story = showcase ? t.story.paragraph : content.storyText;
  const schedule = showcase ? t.schedule.items : content.schedule;
  const info = showcase
    ? {
        dressCode: t.info.dressCode.body,
        giftNote: t.info.giftList.body,
        accommodationNote: t.info.accommodation.body,
      }
    : content;

  return (
    <>
      <Hero eventDate={eventDate} names={names} dateLine={dateLine} venueLine={venueLine} />
      {story && <StorySection text={story} />}
      {schedule.length > 0 && <ScheduleSection items={schedule} />}
      <VenueSection mapUrl={mapUrl} name={venueName} address={venueAddress} />
      <InfoBlocks
        dressCode={info.dressCode}
        giftNote={info.giftNote}
        accommodationNote={info.accommodationNote}
      />
      <RsvpSection
        enabled={rsvpEnabled}
        names={names}
        invitationSlug={invitationSlug}
        deadline={showcase ? null : content.rsvpDeadline}
      />
      <SiteFooter names={names} />
    </>
  );
}

"use client";

import Image from "next/image";
import { useState, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { coupleInitials } from "@/lib/coupleInitials";
import { venueDirectionsUrl } from "@/lib/mapUrl";
import { useCountdown } from "@/lib/useCountdown";
import type { InvitationContent } from "@/lib/invitationForm";
import type { HerbaryumTemplate } from "./HerbaryumTemplate";
import { StorybookCover, STORYBOOK_SAMPLE_NAMES } from "./StorybookCover";
import styles from "./StorybookPreview.module.css";

const PAGE_ACTION = "apparatus mt-5 inline-flex min-h-11 items-center rounded-sm bg-[#53402d] px-4 text-sm text-[#fff6e5] hover:bg-[#392615] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#53402d]";
const sampleSchedule: InvitationContent["schedule"] = [
  { time: "18:30", title: "Karşılama", description: null },
  { time: "19:00", title: "Nikâh töreni", description: null },
  { time: "20:00", title: "Yemek ve kutlama", description: null },
];

const sampleChapters: Chapter[] = [
  { eyebrow: "İTHAF", heading: STORYBOOK_SAMPLE_NAMES, text: "Bazı hikâyeler bir bakışla başlar, bir ömür sürer.", dedication: true },
  { eyebrow: "DAVET", heading: "Birlikte bir ömre", text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız." },
  { eyebrow: "TARİH", heading: "En güzel günümüz", text: "12 Haziran 2027 · Cumartesi · 19.00", extra: <Countdown date={new Date("2027-06-12T19:00:00+03:00")} /> },
  { eyebrow: "MEKÂN", heading: "Buluşma yeri", text: "Örnek konum · Üsküdar, İstanbul", extra: <Directions href={venueDirectionsUrl(null, "Üsküdar, İstanbul")} /> },
  { eyebrow: "PROGRAM", heading: "Günün programı", text: "Örnek akış", extra: <DaySchedule items={sampleSchedule} /> },
];

type Chapter = { eyebrow: string; heading: string; text?: string | null; extra?: ReactNode; dedication?: boolean; form?: boolean };

function LeftPageArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Image src="/storybook/flower.png" alt="" width={160} height={160} loading="eager" className="absolute top-[12%] left-1/2 size-[36%] -translate-x-1/2 object-contain opacity-80" />
      <Image src="/storybook/rings.png" alt="" width={96} height={96} loading="eager" className="absolute top-1/2 left-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-85" />
    </div>
  );
}

function Countdown({ date }: { date: Date }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  return (
    <dl aria-label="Düğüne kalan süre" className="mt-5 grid w-full max-w-60 grid-cols-4 gap-2 text-[#725632]">
      {([[days, "Gün"], [hours, "Saat"], [minutes, "Dakika"], [seconds, "Saniye"]] as const).map(([value, label]) => (
        <div key={label} className="flex flex-col-reverse">
          <dt className="apparatus text-[10px]">{label}</dt>
          <dd className="font-body text-xl leading-tight tabular-nums">{String(value).padStart(2, "0")}</dd>
        </div>
      ))}
    </dl>
  );
}

function Directions({ href }: { href?: string }) {
  return href && (
    <a href={href} target="_blank" rel="noreferrer" className={PAGE_ACTION}>
      Yol tarifi al
    </a>
  );
}

function DaySchedule({ items }: { items: InvitationContent["schedule"] }) {
  if (items.length === 0) {
    return <p className="font-body text-lg italic text-[#725632]">Program henüz paylaşılmadı.</p>;
  }

  return (
    <ol className="mt-2 w-full max-w-64 divide-y divide-[#a28b6a]/45 text-left">
      {items.map(({ time, title, description }, index) => (
        <li key={index} className="grid grid-cols-[auto_1fr] items-baseline gap-3 py-2">
          <time dateTime={time.slice(0, 5)} className="font-body text-lg tabular-nums text-[#725632]">{time.slice(0, 5)}</time>
          <div className="min-w-0 font-body text-lg leading-snug">
            <p className="font-semibold">{title}</p>
            {description && <p className="text-base text-[#725632]">{description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ChapterPage({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <div className={`relative isolate flex min-w-0 flex-1 flex-col items-center justify-center wrap-anywhere text-center ${chapter.form ? "px-5 py-5" : "px-7 py-10"}`}>
      {chapter.form ? null : chapter.dedication ? (
        <>
          <Image src="/storybook/lily.png" alt="" width={112} height={112} loading="eager" className="pointer-events-none absolute right-2 bottom-2 -z-10 size-24 object-contain opacity-60 sm:size-28" />
          <span aria-hidden="true" className="grid size-16 shrink-0 place-items-center whitespace-nowrap rounded-full border border-[#a28b6a]/70 font-body text-lg italic text-[#725632]">
            {coupleInitials(chapter.heading)}
          </span>
        </>
      ) : (
        <Image src="/storybook/lily.png" alt="" width={80} height={80} loading="eager" className="h-20 w-20 shrink-0 object-contain opacity-85" />
      )}
      <span className={`apparatus text-xs tracking-[0.22em] text-[#725632] ${chapter.form ? "" : "mt-4"}`}>{chapter.eyebrow}</span>
      <h2 className={`text-balance font-display leading-tight ${chapter.form ? "mt-2 text-2xl" : chapter.dedication ? "mt-4 text-4xl sm:text-5xl" : "mt-4 text-3xl sm:text-4xl"}`}>{chapter.heading}</h2>
      <div className={`h-px w-16 shrink-0 bg-[#a28b6a] ${chapter.form ? "my-3" : "my-5"}`} />
      {chapter.text && <p className={`max-w-[30ch] whitespace-pre-line font-body text-xl leading-snug ${chapter.dedication ? "italic" : ""}`}>{chapter.text}</p>}
      {chapter.extra}
      <span className={`text-xs text-[#927a5c] ${chapter.form ? "mt-3" : "mt-8"}`}>{index + 1}</span>
    </div>
  );
}

type StorybookProps = Pick<ComponentProps<typeof HerbaryumTemplate>,
  "eventDate" | "names" | "dateLine" | "venueName" | "venueAddress" | "content" |
  "rsvpEnabled" | "invitationSlug" | "rsvpClosesAtUtc"
> & { timeLine?: string };

export function StorybookPreview({
  eventDate, names, dateLine, timeLine, venueName, venueAddress, content,
  rsvpEnabled = true, invitationSlug, rsvpClosesAtUtc,
}: StorybookProps) {
  const coverNames = names?.trim() || STORYBOOK_SAMPLE_NAMES;
  const chapters: Chapter[] = content ? [
    { eyebrow: "İTHAF", heading: names ?? "", text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.", dedication: true },
    ...(content.storyText ? [{ eyebrow: "HİKÂYEMİZ", heading: "Birlikte bir ömre", text: content.storyText }] : []),
    {
      eyebrow: "TARİH", heading: "En güzel günümüz", text: [dateLine, timeLine].filter(Boolean).join(" · "),
      extra: Number.isFinite(eventDate.getTime()) && <Countdown date={eventDate} />,
    },
    {
      eyebrow: "MEKÂN", heading: venueName ?? "", text: venueAddress,
      extra: <Directions href={venueDirectionsUrl(venueName, venueAddress)} />,
    },
    { eyebrow: "PROGRAM", heading: "Günün programı", extra: <DaySchedule items={content.schedule} /> },
    ...(content.dressCode ? [{ eyebrow: "DAVET NOTU", heading: "Kıyafet", text: content.dressCode }] : []),
    ...(content.giftNote ? [{ eyebrow: "DAVET NOTU", heading: "Hediye", text: content.giftNote }] : []),
    ...(content.accommodationNote ? [{ eyebrow: "DAVET NOTU", heading: "Konaklama", text: content.accommodationNote }] : []),
  ] : [...sampleChapters];
  if (rsvpEnabled) {
    chapters.push({
      eyebrow: "RSVP",
      heading: "Katılım bildirimi",
      form: true,
      extra: <RsvpSection bookPage names={names} invitationSlug={invitationSlug}
        deadline={content?.rsvpDeadline} closesAtUtc={rsvpClosesAtUtc} />,
    });
  }
  const [opened, setOpened] = useState(false);
  const [pageIndex, setPage] = useState(0);
  const [turnTarget, setTurnTarget] = useState<number | null>(null);
  const page = Math.min(pageIndex, chapters.length - 1);
  const target = turnTarget === null ? null : Math.min(turnTarget, chapters.length - 1);
  const forward = target !== null && target > page;
  const standingPage = forward ? target : page;
  const leafPage = forward ? page : target;

  function openBook() {
    if (opened) return;
    setOpened(true);
  }

  function nextPage(direction: number) {
    const next = Math.max(0, Math.min(chapters.length - 1, page + direction));
    if (next === page || target !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPage(next);
      return;
    }
    setTurnTarget(next);
  }

  function turnFromPage(event: MouseEvent<HTMLDivElement>) {
    if (!opened || (event.target as Element).closest("a, button, form") || window.getSelection()?.isCollapsed === false) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const mobileBack = !window.matchMedia("(min-width: 40rem)").matches &&
      event.clientX < bounds.left + bounds.width / 2;
    nextPage(mobileBack ? -1 : 1);
  }

  return (
    <>
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 text-[#463D30]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25"
          style={{ backgroundImage: "linear-gradient(#5c4e3b12,#5c4e3b12)" }} />
        <div className="relative z-10 mb-5 flex w-full max-w-3xl items-center justify-between gap-3">
          <span className="text-xs tracking-[0.2em] text-[#fff8e8]">ZARIFY · HİKÂYE KİTABI</span>
        </div>
        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
          <div className="flex w-full max-w-[760px] justify-center [perspective:1500px]">
            <div data-open={opened} className={`${styles.book} relative grid w-full max-w-[380px] [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none sm:w-1/2 ${opened ? "sm:translate-x-1/2" : ""}`}>
              <div aria-hidden="true" className={styles.paperSpread} />
              <div inert={!opened || target !== null} className={`${styles.pageContent} transition-opacity duration-150 motion-reduce:transition-none ${opened ? "opacity-100" : "opacity-0"}`}>
                <div key={standingPage} onClick={turnFromPage} className={`${styles.pageBody} touch-manipulation ${opened && !chapters[standingPage].form ? "cursor-pointer" : ""}`}>
                  <ChapterPage chapter={chapters[standingPage]} index={standingPage} />
                </div>
              </div>

              {opened && (
                <>
                  <button type="button" aria-label="Önceki sayfa" onClick={() => nextPage(-1)}
                    disabled={page === 0} aria-disabled={target !== null || undefined}
                    className="pointer-events-none absolute inset-y-4 left-2 z-10 w-[calc(50%-0.5rem)] focus-visible:outline-2 focus-visible:outline-[#725632] sm:left-auto sm:right-full sm:w-full" />
                  <button type="button" aria-label="Sonraki sayfa" onClick={() => nextPage(1)}
                    disabled={page === chapters.length - 1} aria-disabled={target !== null || undefined}
                    className="pointer-events-none absolute inset-y-4 right-2 z-10 w-[calc(50%-0.5rem)] focus-visible:outline-2 focus-visible:outline-[#725632] sm:inset-x-2 sm:w-auto" />
                </>
              )}

              {target !== null && <div aria-hidden="true" className={styles.pageShadow} />}
              {target !== null && leafPage !== null && (
                <div
                  aria-hidden="true"
                  inert
                  className={`${styles.leaf} ${forward ? "" : styles.reverse} pointer-events-none absolute`}
                  onAnimationEnd={() => {
                    setPage(target);
                    setTurnTarget(null);
                  }}
                >
                  <div className={`${styles.rightPaper} absolute inset-0 [backface-visibility:hidden]`}>
                    <div className="flex h-full flex-col">
                      <ChapterPage chapter={chapters[leafPage]} index={leafPage} />
                    </div>
                  </div>
                  <div className={`${styles.leftPaper} absolute inset-0 hidden [backface-visibility:hidden] [transform:rotateY(180deg)] sm:block`}>
                    <LeftPageArt />
                  </div>
                </div>
              )}

              {/* The left page is the reverse of the cover and shares its hinge. */}
              <div className={`pointer-events-none absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none ${opened ? "[transform:translateZ(1px)_rotateY(-180deg)]" : "[transform:translateZ(1px)_rotateY(0deg)]"}`}>
                <button type="button" onClick={openBook} inert={opened} aria-label={`${coverNames} — kitabı aç`}
                  className="pointer-events-auto absolute inset-0 [backface-visibility:hidden] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <StorybookCover names={coverNames} />
                </button>
                <div inert={!opened} className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-opacity delay-[1200ms] duration-300 motion-reduce:transition-none sm:opacity-100 sm:transition-none ${opened ? "opacity-0" : ""}`}>
                  <div aria-hidden="true" className={`${styles.leftPaper} ${styles.coverPaper} absolute`} />
                  <div className={`${styles.coverArt} absolute hidden sm:block`}>
                    <LeftPageArt />
                  </div>
                  <div aria-hidden="true" onClick={() => nextPage(-1)} className={`absolute inset-0 hidden touch-manipulation sm:block ${opened ? "pointer-events-auto" : ""} ${page > 0 ? "cursor-pointer" : ""}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid min-h-12 place-items-center">
            {opened ? (
              <span aria-live="polite" className="text-xs tracking-widest text-[#fff8e8]">{page + 1} / {chapters.length}</span>
            ) : (
              <button type="button" onClick={openBook} className="border-b border-[#fff6e5] px-6 py-2 font-body text-2xl italic text-[#fff6e5]">Aç</button>
            )}
          </div>
        </div>
        {!content && <p className="relative z-10 mt-8 max-w-md text-center text-xs leading-relaxed text-[#f5efdf]">
          Tasarım önizlemesi · Örnek davetiye bilgileri kullanılmıştır.
        </p>}
      </section>
    </>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { coupleInitials } from "@/lib/coupleInitials";
import cover from "../../../public/storybook/cover.png";
import type { HerbaryumTemplate } from "./HerbaryumTemplate";
import styles from "./StorybookPreview.module.css";

const sampleChapters: Chapter[] = [
  { eyebrow: "İTHAF", heading: "Elif & Kerem", text: "Bazı hikâyeler bir bakışla başlar, bir ömür sürer.", dedication: true },
  { eyebrow: "DAVET", heading: "Birlikte bir ömre", text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız." },
  { eyebrow: "TARİH", heading: "En güzel günümüz", text: "12 Haziran 2027 · Cumartesi · 19.00" },
  { eyebrow: "MEKÂN", heading: "Buluşma yeri", text: "Mekân bilgileri burada yer alacak." },
  { eyebrow: "SON SAYFA", heading: "Sizi bekliyoruz", text: "Bu güzel günü sizinle paylaşmak dileğiyle." },
];

type Chapter = { eyebrow: string; heading: string; text?: ReactNode; dedication?: boolean };

function ChapterPage({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <div className="relative isolate flex min-h-full min-w-0 flex-col items-center justify-center wrap-anywhere px-7 py-10 text-center">
      {chapter.dedication ? (
        <>
          <Image src="/storybook/lily.png" alt="" width={112} height={112} loading="eager" className="pointer-events-none absolute right-2 bottom-2 -z-10 size-24 object-contain opacity-60 sm:size-28" />
          <span aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-full border border-[#a28b6a]/70 font-serif text-lg text-[#725632]">
            {coupleInitials(chapter.heading)}
          </span>
        </>
      ) : (
        <Image src="/storybook/lily.png" alt="" width={80} height={80} loading="eager" className="h-20 w-20 shrink-0 object-contain opacity-85" />
      )}
      <span className="mt-4 text-[10px] tracking-[0.25em] text-[#806a51]">{chapter.eyebrow}</span>
      <h2 className={`mt-4 text-balance font-serif leading-tight ${chapter.dedication ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>{chapter.heading}</h2>
      <div className="my-5 h-px w-16 shrink-0 bg-[#a28b6a]" />
      <p className="max-w-[28ch] whitespace-pre-line font-serif text-lg leading-relaxed">{chapter.text}</p>
      <span className="mt-8 text-xs text-[#927a5c]">{index + 1}</span>
    </div>
  );
}

type StorybookProps = Pick<ComponentProps<typeof HerbaryumTemplate>,
  "names" | "dateLine" | "venueName" | "venueAddress" | "mapUrl" | "content" |
  "rsvpEnabled" | "invitationSlug" | "rsvpClosesAtUtc"
> & { timeLine?: string };

export function StorybookPreview({
  names, dateLine, timeLine, venueName, venueAddress, mapUrl, content,
  rsvpEnabled, invitationSlug, rsvpClosesAtUtc,
}: StorybookProps) {
  const chapters: Chapter[] = content ? [
    { eyebrow: "İTHAF", heading: names ?? "", text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.", dedication: true },
    ...(content.storyText ? [{ eyebrow: "HİKÂYEMİZ", heading: "Birlikte bir ömre", text: content.storyText }] : []),
    { eyebrow: "TARİH", heading: "En güzel günümüz", text: [dateLine, timeLine].filter(Boolean).join(" · ") },
    {
      eyebrow: "MEKÂN", heading: venueName ?? "", text: (
        <>
          {venueAddress}
          {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 block underline underline-offset-4">Haritada aç</a>}
        </>
      ),
    },
    ...content.schedule.map((item) => ({
      eyebrow: `PROGRAM · ${item.time.slice(0, 5)}`, heading: item.title, text: item.description,
    })),
    ...(content.dressCode ? [{ eyebrow: "DAVET NOTU", heading: "Kıyafet", text: content.dressCode }] : []),
    ...(content.giftNote ? [{ eyebrow: "DAVET NOTU", heading: "Hediye", text: content.giftNote }] : []),
    ...(content.accommodationNote ? [{ eyebrow: "DAVET NOTU", heading: "Konaklama", text: content.accommodationNote }] : []),
  ] : sampleChapters;
  const [opened, setOpened] = useState(false);
  const [pageIndex, setPage] = useState(0);
  const [turnTarget, setTurnTarget] = useState<number | null>(null);
  const pageScroll = useRef<HTMLDivElement>(null);
  const leavingScrollTop = useRef(0);
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
    leavingScrollTop.current = pageScroll.current?.scrollTop ?? 0;
    setTurnTarget(next);
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
            <div className={`relative grid w-full max-w-[380px] [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none sm:w-1/2 ${opened ? "sm:translate-x-1/2" : ""}`}>
              <div inert={!opened || target !== null} className={`grid aspect-[12/17] min-h-[440px] grid-rows-[minmax(0,1fr)] border-8 border-[#4a593f] bg-[#eee0bd] bg-[url(/storybook/pages.jpg)] bg-[length:200%_100%] bg-right shadow-[12px_20px_45px_#242b2599] transition-opacity duration-150 motion-reduce:transition-none ${opened ? "opacity-100" : "opacity-0"}`}>
                <div key={standingPage} ref={pageScroll} className="overflow-y-auto bg-[#f8eed5]/25">
                  <ChapterPage chapter={chapters[standingPage]} index={standingPage} />
                </div>
              </div>

              {target !== null && <div aria-hidden="true" className={styles.pageShadow} />}
              {target !== null && leafPage !== null && (
                <div
                  aria-hidden="true"
                  inert
                  className={`${styles.leaf} ${forward ? "" : styles.reverse} pointer-events-none absolute inset-2`}
                  onAnimationEnd={() => {
                    setPage(target);
                    setTurnTarget(null);
                  }}
                >
                  <div className="absolute inset-0 bg-[#eee0bd] bg-[url(/storybook/pages.jpg)] bg-[length:200%_100%] bg-right [backface-visibility:hidden]">
                    <div
                      ref={(element) => {
                        if (element && forward) element.scrollTop = leavingScrollTop.current;
                      }}
                      className="h-full overflow-hidden bg-[#f8eed5]/25"
                    >
                      <ChapterPage chapter={chapters[leafPage]} index={leafPage} />
                    </div>
                  </div>
                  <div className="absolute inset-0 hidden bg-[#eee0bd] bg-[url(/storybook/pages.jpg)] bg-[length:200%_100%] bg-left [backface-visibility:hidden] [transform:rotateY(180deg)] sm:block" />
                </div>
              )}

              {/* The left page is the reverse of the cover and shares its hinge. */}
              <div className={`pointer-events-none absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none ${opened ? "[transform:translateZ(1px)_rotateY(-180deg)]" : "[transform:translateZ(1px)_rotateY(0deg)]"}`}>
                <button type="button" onClick={openBook} inert={opened} aria-label="Kitabı aç"
                  className="pointer-events-auto absolute inset-0 [backface-visibility:hidden] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <Image src={cover} alt="Yeşil, altın işlemeli kitap kapağı" fill sizes="(min-width: 640px) 380px, 100vw" loading="eager" unoptimized className="object-contain drop-shadow-[10px_15px_18px_#2d302880]" />
                </button>
                <div inert={!opened} className={`absolute inset-0 flex flex-col items-center justify-center border-8 border-r-0 border-[#4a593f] bg-[#eee0bd] bg-[url(/storybook/pages.jpg)] bg-[length:200%_100%] bg-left px-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition-opacity delay-[1200ms] duration-300 motion-reduce:transition-none sm:opacity-100 ${opened ? "opacity-0" : ""}`}>
                  <div className="hidden flex-col items-center sm:flex">
                    <Image src="/storybook/flower.png" alt="" width={160} height={160} loading="eager" className="h-40 w-40 object-contain opacity-80" />
                    <span className="mt-6 font-serif text-2xl italic text-[#6b5d4a]">Hikâyemiz</span>
                    <Image src="/storybook/rings.png" alt="" width={64} height={64} loading="eager" className="mt-4 h-16 w-16 object-contain opacity-80" />
                    <span className="mt-4 text-xs tracking-[0.22em] text-[#8b795c]">ZARIFY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid w-full max-w-[360px] place-items-center">
            <button type="button" onClick={openBook} className={`col-start-1 row-start-1 border-b border-[#fff6e5] px-6 py-2 font-serif text-2xl text-[#fff6e5] ${opened ? "invisible" : ""}`}>Aç</button>
            <div className={`col-start-1 row-start-1 flex w-full items-center justify-between ${opened ? "visible" : "invisible"}`}>
              <button type="button" onClick={() => nextPage(-1)} disabled={page === 0} aria-disabled={target !== null || undefined} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">← Önceki</button>
              <span aria-live="polite" className="text-xs tracking-widest text-[#fff8e8]">{page + 1} / {chapters.length}</span>
              <button type="button" onClick={() => nextPage(1)} disabled={page === chapters.length - 1} aria-disabled={target !== null || undefined} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">Sonraki →</button>
            </div>
          </div>
        </div>
        {!content && <p className="relative z-10 mt-8 max-w-md text-center text-xs leading-relaxed text-[#f5efdf]">
          Tasarım önizlemesi · Örnek davetiye bilgileri kullanılmıştır.
        </p>}
      </section>
      {content && opened && (
        <RsvpSection enabled={rsvpEnabled} names={names} invitationSlug={invitationSlug}
          deadline={content.rsvpDeadline} closesAtUtc={rsvpClosesAtUtc} />
      )}
    </>
  );
}

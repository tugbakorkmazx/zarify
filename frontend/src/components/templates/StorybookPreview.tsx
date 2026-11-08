"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const chapters = [
  { eyebrow: "BİRİNCİ BÖLÜM", heading: "Bir hikâye başlıyor", text: "Bazı hikâyeler bir bakışla başlar, bir ömür sürer." },
  { eyebrow: "DAVET", heading: "Birlikte bir ömre", text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız." },
  { eyebrow: "TARİH", heading: "En güzel günümüz", text: "12 Haziran 2027 · Cumartesi · 19.00" },
  { eyebrow: "MEKÂN", heading: "Buluşma yeri", text: "Mekân bilgileri burada yer alacak." },
  { eyebrow: "SON SAYFA", heading: "Sizi bekliyoruz", text: "Katılım bildirimi, gerçek davetiyeye bağlandığında burada görünecek." },
];

export function StorybookPreview() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function toggleSound() {
    if (!audio.current) return;
    if (sound) {
      audio.current.pause();
      setSound(false);
    } else {
      try {
        await audio.current.play();
        setSound(true);
      } catch {
        setSound(false);
      }
    }
  }

  function openBook() {
    if (opened) return;
    setOpened(true);
    void audio.current?.play().then(() => setSound(true)).catch(() => setSound(false));
  }

  function nextPage(direction: number) {
    const next = Math.max(0, Math.min(chapters.length - 1, page + direction));
    if (next === page || turning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPage(next);
      return;
    }
    setTurning(true);
    timer.current = setTimeout(() => {
      setPage(next);
      setTurning(false);
    }, 440);
  }

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 text-[#463D30]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25"
        style={{ backgroundImage: "linear-gradient(#5c4e3b12,#5c4e3b12)" }} />
      <div className="relative z-10 mb-5 flex w-full max-w-3xl items-center justify-between gap-3">
        <span className="text-xs tracking-[0.2em] text-[#fff8e8]">ZARIFY · HİKÂYE KİTABI</span>
        <button type="button" onClick={toggleSound} aria-pressed={sound}
          className="border border-[#f6eed8]/60 bg-[#334234]/60 px-4 py-2 text-xs text-[#fff8e8] transition hover:bg-[#334234]/85">
          {sound ? "♪ Sesi kapat" : "♪ Müziği aç"}
        </button>
      </div>
      {/* Audio asset will be added after a commercially licensed recording is selected. */}
      <audio ref={audio} loop preload="none" src="/audio/storybook-theme.mp3" />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="flex w-full max-w-[760px] justify-center [perspective:1500px]">
          <div className={`relative grid w-full max-w-[380px] [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none sm:w-1/2 ${opened ? "sm:translate-x-1/2" : ""}`}>
            <div inert={!opened} className="grid aspect-[12/17] min-h-[440px] border-8 border-[#4a593f] bg-[#eee0bd] bg-[url(/storybook/pages.jpg)] bg-[length:200%_100%] bg-right shadow-[12px_20px_45px_#242b2599]">
              <div className="pointer-events-none absolute inset-2 bg-[#f8eed5]/25" />
              <div className={`relative flex flex-col items-center justify-center overflow-hidden px-7 py-10 text-center transition duration-[440ms] ${turning ? "opacity-20 [transform:rotateY(-14deg)]" : "opacity-100"}`}>
                <Image src="/storybook/lily.png" alt="" width={80} height={80} loading="eager" className="h-20 w-20 object-contain opacity-85" />
                <span className="mt-4 text-[10px] tracking-[0.25em] text-[#806a51]">{chapters[page].eyebrow}</span>
                <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">{chapters[page].heading}</h2>
                <div className="my-5 h-px w-16 bg-[#a28b6a]" />
                <p className="max-w-[28ch] font-serif text-lg leading-relaxed">{chapters[page].text}</p>
                <span className="mt-8 text-xs text-[#927a5c]">{page + 1}</span>
              </div>
            </div>

            {/* The left page is the reverse of the cover and shares its hinge. */}
            <div className={`pointer-events-none absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none ${opened ? "[transform:translateZ(1px)_rotateY(-180deg)]" : "[transform:translateZ(1px)_rotateY(0deg)]"}`}>
              <button type="button" onClick={openBook} inert={opened} aria-label="Kitabı aç"
                className="pointer-events-auto absolute inset-0 bg-[#394630] shadow-[10px_15px_25px_#2d302880] [backface-visibility:hidden] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <Image src="/storybook/cover.jpg" alt="Yeşil, altın işlemeli kitap kapağı" fill sizes="(min-width: 640px) 380px, 100vw" loading="eager" unoptimized className="object-contain" />
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
            <button type="button" onClick={() => nextPage(-1)} disabled={page === 0 || turning} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">← Önceki</button>
            <span className="text-xs tracking-widest text-[#fff8e8]">{page + 1} / {chapters.length}</span>
            <button type="button" onClick={() => nextPage(1)} disabled={page === chapters.length - 1 || turning} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">Sonraki →</button>
          </div>
        </div>
      </div>
      <p className="relative z-10 mt-8 max-w-md text-center text-xs leading-relaxed text-[#f5efdf]">
        Tasarım önizlemesi · Örnek davetiye bilgileri kullanılmıştır.
      </p>
    </section>
  );
}

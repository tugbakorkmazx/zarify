"use client";

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
  const [opening, setOpening] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMotionReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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
    if (opening || opened) return;
    setOpening(true);
    void audio.current?.play().then(() => setSound(true)).catch(() => setSound(false));
    timer.current = setTimeout(() => {
      setOpened(true);
      setOpening(false);
    }, motionReduced ? 0 : 1600);
  }

  function nextPage(direction: number) {
    const next = Math.max(0, Math.min(chapters.length - 1, page + direction));
    if (next === page || turning) return;
    setTurning(true);
    timer.current = setTimeout(() => {
      setPage(next);
      setTurning(false);
    }, 440);
  }

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-4 py-12 text-[#463D30]"
      style={{ background: "linear-gradient(#4d4a3c3d,#4d4a3c3d), url(/storybook/background.webp) center / cover, #a5a28b" }}>
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
        {!opened ? (
          <div className="flex w-full flex-col items-center">
            <div className="relative flex w-full max-w-[760px] items-center justify-center" style={{ perspective: "1500px" }}>
              <div className="relative aspect-[3/4] w-[min(70vw,330px)]"
                style={{ transformStyle: "preserve-3d", transform: opening ? "translateX(22%) scale(.92)" : "translateX(0) scale(1)", transition: motionReduced ? "none" : "transform 1400ms cubic-bezier(.22,.8,.25,1)" }}>
                <div aria-hidden="true" className="absolute inset-0 border-[10px] border-[#4a593f] bg-[#eee1c5] shadow-[12px_20px_45px_#242b2599]">
                  <div className="absolute inset-0 bg-[url(/storybook/pages.webp)] bg-[length:200%_100%] bg-left opacity-75" />
                  <div className="absolute inset-3 border border-[#b59b73]/60" />
                  <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-[#8a7558]">❦</span>
                </div>
                <button type="button" onClick={openBook} disabled={opening} aria-label="Kitabı aç"
                  className="absolute inset-0 flex flex-col items-center justify-center border-[12px] border-[#394630] bg-[#536348] px-7 text-center shadow-[10px_15px_25px_#2d302880,inset_0_0_0_2px_#b7a881,inset_0_0_0_15px_#536348,inset_0_0_0_16px_#b7a881] focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-white"
                  style={{ transformOrigin: "left center", backfaceVisibility: "hidden", transform: opening ? "rotateY(-155deg)" : "rotateY(0deg)", transition: motionReduced ? "none" : "transform 1500ms cubic-bezier(.28,.62,.18,1)", transformStyle: "preserve-3d" }}>
                  <span className="absolute inset-y-0 left-1 w-2 border-r border-[#b7a881]/50 bg-[#36452f]/30" />
                  <span className="text-4xl text-[#d7c69e] drop-shadow-md">❦</span>
                  <span className="mt-7 font-serif text-3xl leading-tight text-[#efe3c6] sm:text-4xl">Birlikte<br />Bir Ömür</span>
                  <span className="mt-7 text-sm tracking-[0.25em] text-[#d7c69e]">✦ ✦ ✦</span>
                </button>
              </div>
            </div>
            <button type="button" onClick={openBook} disabled={opening} className="mt-8 border-b border-[#fff6e5] px-6 py-2 font-serif text-2xl text-[#fff6e5] disabled:opacity-50">{opening ? "Açılıyor…" : "Aç"}</button>
          </div>
        ) : (
          <div className="w-full">
            <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[420px] overflow-hidden border-[8px] border-[#4a593f] bg-[#eee0bd] bg-[url(/storybook/pages.webp)] bg-cover bg-center shadow-[12px_20px_45px_#242b2599] sm:aspect-[1.55/1] sm:max-w-[760px]">
              <div className="absolute inset-0 bg-[#f8eed5]/25" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-5 -translate-x-1/2 bg-gradient-to-r from-[#aa967a]/10 via-[#8b745d]/35 to-[#fff6dc]/10 sm:block" />
              <div className={`relative flex w-full flex-col items-center justify-center px-7 py-10 text-center transition duration-[440ms] sm:w-1/2 ${turning ? "opacity-20 [transform:rotateY(-14deg)]" : "opacity-100"}`}>
                <img src="/storybook/lily.webp" alt="" className="h-20 w-20 object-contain opacity-85" />
                <span className="mt-4 text-[10px] tracking-[0.25em] text-[#806a51]">{chapters[page].eyebrow}</span>
                <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">{chapters[page].heading}</h2>
                <div className="my-5 h-px w-16 bg-[#a28b6a]" />
                <p className="max-w-[28ch] font-serif text-lg leading-relaxed">{chapters[page].text}</p>
                <span className="mt-8 text-xs text-[#927a5c]">{page + 1}</span>
              </div>
              <div className="relative hidden w-1/2 flex-col items-center justify-center border-l border-[#ad9a7b]/40 px-8 text-center sm:flex">
                <img src="/storybook/flower.webp" alt="" className="h-40 w-40 object-contain opacity-80" />
                <span className="mt-6 font-serif text-2xl italic text-[#6b5d4a]">Hikâyemiz</span>
                <span className="mt-4 text-xs tracking-[0.22em] text-[#8b795c]">ZARIFY</span>
              </div>
            </div>
            <div className="mx-auto mt-7 flex max-w-[360px] items-center justify-between">
              <button type="button" onClick={() => nextPage(-1)} disabled={page === 0 || turning} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">← Önceki</button>
              <span className="text-xs tracking-widest text-[#fff8e8]">{page + 1} / {chapters.length}</span>
              <button type="button" onClick={() => nextPage(1)} disabled={page === chapters.length - 1 || turning} className="border border-[#f9f0dd]/60 px-5 py-2 text-sm text-[#fff8e8] disabled:opacity-30">Sonraki →</button>
            </div>
          </div>
        )}
      </div>
      <p className="relative z-10 mt-8 max-w-md text-center text-xs leading-relaxed text-[#f5efdf]">
        Tasarım önizlemesi · Örnek davetiye bilgileri kullanılmıştır.
      </p>
    </section>
  );
}

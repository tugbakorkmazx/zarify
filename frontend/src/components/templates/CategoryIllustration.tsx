import type { SVGProps } from "react";

/** Small editorial line illustrations for the invitation category cards. */
export function CategoryIllustration({ category, ...props }: { category: string } & SVGProps<SVGSVGElement>) {
  const illustrations: Record<string, React.ReactNode> = {
    "dugun": <g><circle cx="9" cy="15" r="5"/><circle cx="17" cy="15" r="5"/><path d="m5 7 4-4 4 4-4 4z"/></g>,
    "nisan": <g><path d="M4 11 8 5h8l4 6-8 10z"/><path d="M4 11h16M8 5l4 6 4-6m-4 6v10"/></g>,
    "soz": <g><path d="M5 18c3-1 5-1 7 1 2-2 4-2 7-1"/><path d="M6 15V7l6-3 6 3v8"/><path d="M9 11h6m-3-3v6"/></g>,
    "isteme": <g><path d="M4 13c2-3 4-4 8-4s6 1 8 4"/><path d="M4 13c2 4 5 6 8 6s6-2 8-6"/><path d="M8 9V5m8 4V5"/><path d="M10 5h4"/></g>,
    "kina-gecesi": <g><path d="M8 21V11c0-2 2-2 2 0V6c0-2 2-2 2 0v4-5c0-2 2-2 2 0v5-3c0-2 2-2 2 0v6l1-2c1-2 3-1 2 1l-3 9"/><path d="M8 13 6 11c-2-1-3 1-2 3l4 7"/><circle cx="12" cy="15" r="1.5"/></g>,
    "sunnet": <g><path d="M12 3c3 3 6 5 6 10a6 6 0 0 1-12 0c0-5 3-7 6-10Z"/><path d="M9 14h6m-3-3v6"/><path d="m5 4 1 2m12-2-1 2"/></g>,
    "dogum-gunu": <g><path d="M4 12h16v9H4z"/><path d="M4 16h16M12 8v4M8 8v4m8-4v4"/><path d="M8 5c-2 2 2 3 0 3m4-5c-2 2 2 3 0 3m4-1c-2 2 2 3 0 3"/></g>,
    "baby-shower": <g><path d="M4 12a8 8 0 0 1 16 0H4Z"/><path d="M12 4v8m-8 0 2 7h12l2-7"/><circle cx="8" cy="21" r="1"/><circle cx="16" cy="21" r="1"/></g>,
    "cinsiyet-partisi": <g><path d="M12 3c5 0 8 4 8 9s-3 8-8 8-8-3-8-8 3-9 8-9Z"/><path d="M12 20v3m-4-11h8m-4-4v8"/><path d="m5 4-2-2m16 2 2-2"/></g>,
    "mevlit": <g><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/><path d="m18 3 .7 2.3L21 6l-2.3.7L18 9l-.7-2.3L14 6l3.3-.7z"/></g>,
    "kurumsal": <g><path d="M4 21V7l8-4 8 4v14H4Z"/><path d="M9 21v-6h6v6M8 9h2m4 0h2m-8 3h2m4 0h2"/></g>,
    "yildonumu": <g><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 6-8 11-8 11Z"/><path d="m10 12 2 2 3-4"/></g>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#D6B7AF" fillOpacity=".25" stroke="none" />
      <circle cx="12" cy="12" r="8.6" fill="#F5EDE3" fillOpacity=".7" stroke="none" />
      {illustrations[category] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

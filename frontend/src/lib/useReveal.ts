"use client";

import { useEffect, useRef, useState } from "react";

/** Fires once when the element first enters the viewport, then stops
 * observing — used to trigger a one-shot scroll-reveal transition rather
 * than re-triggering on every scroll back into view. */
export function useReveal<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Also reveal anything already scrolled past (a jump link, a
        // restored scroll position) so it's never left invisible above.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

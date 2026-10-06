"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Tell ScrollTrigger to use our wrapper div as the default scroller.
    // This must be set before any ScrollTrigger instances are created.
    ScrollTrigger.defaults({ scroller: wrapper });

    const lenis = new Lenis({
      // Scope Lenis to our wrapper div, NOT window/html.
      // This prevents Lenis from setting overflow:clip on <html>,
      // which would silently break position:sticky on any descendant.
      wrapper,
      content: wrapper,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
      // Reset default scroller on cleanup
      ScrollTrigger.defaults({ scroller: window });
    };
  }, []);

  return (
    // overflow-y-auto makes this div the scroll container Lenis attaches to.
    // height: 100dvh + overflow-y-auto = scrollable viewport-sized box.
    // position:sticky children work because <html> is never touched.
    <div
      ref={wrapperRef}
      style={{ height: "100dvh", overflowY: "auto", overflowX: "hidden" }}
    >
      {children}
    </div>
  );
}

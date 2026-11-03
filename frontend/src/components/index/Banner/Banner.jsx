"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Walk up the DOM to find the Lenis scroll wrapper — same helper used across the project
function getScroller(el) {
  let parent = el?.parentElement;
  while (parent) {
    const oy = window.getComputedStyle(parent).overflowY;
    if (
      (oy === "auto" || oy === "scroll") &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

const Banner = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const scroller = getScroller(section);

    // Scale the bg slightly so the parallax shift never reveals edges
    gsap.set(bg, { scale: 1.2 });

    const tween = gsap.fromTo(
      bg,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-svh lg:h-[120svh] overflow-hidden"
    >
      {/* Background image — parallax layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundImage: "url(/hero/banner-bg.avif)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/30 z-1" />

      {/* Content */}
      <div className="relative z-2 w-full h-full p-4 md:p-8 max-w-[2000px] mx-auto flex flex-col justify-between text-white">
        <div>
          <h2 className="w-full md:w-[90%] lg:w-[70%] text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] 2xl:text-[5rem] tracking-wide leading-none lg:leading-[0.9] uppercase">
            NO TEMPLATES. NO SHORTCUTS. <br className=" lg:block" />{" "}
            ONE SIZE FITS NONE. <br className="hidden md:block" />
            EVERY STRATEGY IS CUSTOM.
          </h2>
        </div>

        <div className="space-y-0">
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            D2C &amp; E-commerce
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            Startups &amp; SaaS
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            Fashion Brands
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            Real estate &amp; healthcare
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            Personal brands
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            E-shops Design and Integration
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            Local businesses
          </p>
          <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            B2B Connections
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <p className="text-[0.9rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
            We create for the ecosystem of the modern mind, where attention is
            won and memory is made.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;

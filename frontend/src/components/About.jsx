"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const About = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    // Find the nearest scrollable ancestor (the Lenis wrapper div)
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
    const scroller = getScroller(rootRef.current);

    const ctx = gsap.context(() => {
      // ── 1. Tagline lines — line-by-line clip from bottom ──
      const taglineSplit = SplitText.create(".about-tagline p", {
        type: "lines",
        mask: "lines",
      });

      gsap.from(taglineSplit.lines, {
        scrollTrigger: {
          trigger: ".about-tagline",
          scroller,
          start: "top 88%",
          once: true,
        },
        yPercent: 100,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });

      // ── 2. Big headline — word-by-word clip from bottom ──
      const headlineSplit = SplitText.create(".about-headline", {
        type: "words",
        mask: "words",
      });

      gsap.from(headlineSplit.words, {
        scrollTrigger: {
          trigger: ".about-headline",
          scroller,
          start: "top 82%",
          once: true,
        },
        yPercent: 100,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      });

      // ── 3. Subheading — line-by-line clip from bottom ──
      const subSplit = SplitText.create(".about-subhead", {
        type: "lines",
        mask: "lines",
      });

      gsap.from(subSplit.lines, {
        scrollTrigger: {
          trigger: ".about-subhead",
          scroller,
          start: "top 85%",
          once: true,
        },
        yPercent: 100,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });

      // ── 4. CTA link — clip from bottom ──
      const linkSplit = SplitText.create(".about-link", {
        type: "lines",
        mask: "lines",
      });

      gsap.from(linkSplit.lines, {
        scrollTrigger: {
          trigger: ".about-link",
          scroller,
          start: "top 92%",
          once: true,
        },
        yPercent: 100,
        duration: 0.9,
        ease: "power3.out",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#edeee8]" ref={rootRef}>
      {/* ── Tagline ── */}
      <section className="relative flex flex-col justify-center items-center mx-auto! pt-14! 2xl:pt-20! text-center lg:w-[85%]">
        <div className="about-tagline max-w-400 mx-auto! md:px-8!">
          <p className="text-lg md:text-2xl font-medium leading-tight">
            Smart Data. Creative Ideas. Sharper Ads. Higher Performance
          </p>
        </div>
      </section>

      {/* ── Big headline ── */}
      <section className="relative w-full h-full flex justify-center items-center p-8! pb-16! text-center font-medium leading-[0.9] lg:leading-[0.85] lg:pt-10!">
        <h1 className="about-headline relative tracking-tight z-10 w-full pt-5! text-[#331C4F] lg:p-8! text-[18vw] lg:text-[10vw] 2xl:text-[8vw] pointer-events-none">
          {/* GROWTH THAT SCALES */}
          Content Prompts
        </h1>
      </section>

      {/* ── Subheading + CTA ── */}
      <section className="w-full lg:pt-0!">
        <div className="max-w-400 mx-auto! px-5! lg:px-8! flex flex-col gap-3 lg:gap-10 2xl:gap-16">
          <div className="about-subhead lg:w-[90%] 2xl:w-full mx-auto! text-center text-[6vw] md:text-[4vw] lg:text-[2.2rem] font2 leading-none ">
            FULL-FUNNEL DIGITAL MARKETING FOR STARTUPS, D2C BRANDS AND
            BUSINESSES THAT REFUSE TO STAY SMALL.
          </div>

          {/* <div className="about-subhead uppercase lg:w-[90%] 2xl:w-[80%] mx-auto! text-center text-[5.8vw] md:text-[4vw] lg:text-[2rem] font2 leading-none mt-5 lg:-mt-5">
            Compelling Narratives. Unstoppable Growth. Customized Strategies.
            Turn your Brand into Market Success. START WITH SMALLER BUDGET
          </div> */}

          <div className="flex flex-col gap-16 mx-auto! text-center lg:w-[90%]">
            <a
              href="/"
              className="about-link text-lg md:text-xl tracking-wide w-max mx-auto! font2 text-[#331C4F] hover:opacity-70 transition-opacity"
            >
              [ &nbsp;Discover Our Services&nbsp; ]
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

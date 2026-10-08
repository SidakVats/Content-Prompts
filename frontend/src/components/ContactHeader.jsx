"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

const ContactHeader = () => {
  const leftIrisRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightIrisRef = useRef(null);
  const rightPupilRef = useRef(null);
  const linksWrapperRef = useRef(null);

  const OUTER_PATH_RADIUS = 60;
  const INNER_PATH_RADIUS = 26;

  // ── Eye tracking ─────────────────────────────────────────────────────────
  const animateEye = useCallback((irisEl, pupilEl, cx, cy, angle) => {
    const bx = cx + OUTER_PATH_RADIUS * Math.cos(angle);
    const by = cy + OUTER_PATH_RADIUS * Math.sin(angle);
    const wx = bx + INNER_PATH_RADIUS * Math.cos(angle);
    const wy = by + INNER_PATH_RADIUS * Math.sin(angle);
    gsap.to(irisEl, {
      attr: { cx: bx, cy: by },
      duration: 0.12,
      ease: "power1.out",
      overwrite: true,
    });
    gsap.to(pupilEl, {
      attr: { cx: wx, cy: wy },
      duration: 0.12,
      ease: "power1.out",
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    gsap.set(leftIrisRef.current, { attr: { cx: 400, cy: 500 } });
    gsap.set(leftPupilRef.current, { attr: { cx: 426, cy: 500 } });
    gsap.set(rightIrisRef.current, { attr: { cx: 600, cy: 500 } });
    gsap.set(rightPupilRef.current, { attr: { cx: 626, cy: 500 } });

    let raf = null;
    const handleMouseMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const angle = Math.atan2(
          e.clientY - window.innerHeight / 2,
          e.clientX - window.innerWidth / 2,
        );
        animateEye(leftIrisRef.current, leftPupilRef.current, 400, 500, angle);
        animateEye(
          rightIrisRef.current,
          rightPupilRef.current,
          600,
          500,
          angle,
        );
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animateEye]);

  // ── Letter hover ─────────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = linksWrapperRef.current;
    if (!wrapper) return;
    const anchors = Array.from(wrapper.querySelectorAll("a"));
    const cleanups = [];

    anchors.forEach((anchor) => {
      const tops = anchor.querySelectorAll(".letter-top");
      const bottoms = anchor.querySelectorAll(".letter-bottom");
      gsap.set(bottoms, { y: "105%" });

      const onEnter = () => {
        gsap.to(tops, {
          y: "-105%",
          duration: 0.4,
          ease: "power2.inOut",
          stagger: 0.03,
          overwrite: true,
        });
        gsap.to(bottoms, {
          y: "0%",
          duration: 0.4,
          ease: "power2.inOut",
          stagger: 0.03,
          overwrite: true,
        });
      };
      const onLeave = () => {
        gsap.to(tops, {
          y: "0%",
          duration: 0.4,
          ease: "power2.inOut",
          stagger: 0.03,
          overwrite: true,
        });
        gsap.to(bottoms, {
          y: "105%",
          duration: 0.4,
          ease: "power2.inOut",
          stagger: 0.03,
          overwrite: true,
        });
      };

      anchor.addEventListener("mouseenter", onEnter);
      anchor.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        anchor.removeEventListener("mouseenter", onEnter);
        anchor.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const splitText = useCallback((text) => {
    return text.split("").map((letter, index) => (
      <span key={index} className="letter">
        <span className="letter-top">{letter === " " ? "\u00A0" : letter}</span>
        <span className="letter-bottom" aria-hidden="true">
          {letter === " " ? "\u00A0" : letter}
        </span>
      </span>
    ));
  }, []);

  const socialLinks = [
    { name: "Instagram", url: "#" },
    [
      { name: "Facebook", url: "#" },
      { name: "Youtube", url: "#" },
    ],
    { name: "LinkedIn", url: "#" },
  ];

  return (
    <div className="w-screen h-dvh bg-[#edf1e8] flex flex-col overflow-hidden">
      {/* ── Main: eyes ON TOP of text via z-index ── */}
      <div className="flex-1 relative flex items-center justify-center mt-30 min-h-0">
        {/* Text — z-0, renders first */}
        <div
          ref={linksWrapperRef}
          className="relative z-0 w-full flex flex-col items-center gap-0"
        >
          {socialLinks.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-6 lg:gap-40"
            >
              {Array.isArray(item) ? (
                item.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="inline-flex flex-nowrap items-center font-normal text-[9.5vw] lg:text-[8vw] leading-[1.05] h-[9vw]  lg:h-[8vw] text-[#0f0f0f] uppercase tracking-[-0.04em] cursor-pointer no-underline"
                  >
                    {splitText(link.name)}
                  </a>
                ))
              ) : (
                <a
                  href={item.url}
                  className="inline-flex flex-nowrap items-center font-normal text-[9.5vw] lg:text-[8vw] leading-[1.05] h-[9vw] lg:h-[8vw] text-[#0f0f0f] uppercase tracking-[-0.04em] cursor-pointer no-underline"
                >
                  {splitText(item.name)}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Eyes — z-10, floats above text */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 scale-[0.6] lg:scale-[1.75] 2xl:scale-[1.2] origin-center"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            <circle
              strokeWidth="2"
              fill="#fff"
              cx="400"
              cy="500"
              r="100"
              stroke="#0f0f0f"
            />
            <circle
              ref={leftIrisRef}
              strokeWidth="2"
              fill="#0f0f0f"
              r="40"
              stroke="#0f0f0f"
              cx="400"
              cy="500"
            />
            <circle ref={leftPupilRef} fill="#fff" r="12" cx="426" cy="500" />
          </g>
          <g>
            <circle
              strokeWidth="2"
              fill="#fff"
              cx="600"
              cy="500"
              r="100"
              stroke="#0f0f0f"
            />
            <circle
              ref={rightIrisRef}
              strokeWidth="2"
              fill="#0f0f0f"
              r="40"
              stroke="#0f0f0f"
              cx="600"
              cy="500"
            />
            <circle ref={rightPupilRef} fill="#fff" r="12" cx="626" cy="500" />
          </g>
        </svg>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-6 md:px-9 pb-7 pt-2 flex flex-col gap-3">
        {/* Big listening headline */}
        <p className="text-[1.6rem] md:text-[2.5rem] font-medium leading-none tracking-tight text-[#0f0f0f]">
          Content Prompts is{" "}
          <em className="not-italic text-[#c4d600]">listening.</em>
        </p>

        {/* Supporting line */}
        <p className="text-[0.8rem] md:text-[0.85rem] text-[#0f0f0f]/80 leading-relaxed max-w-lg">
          Got a bold idea? Need content that actually converts? Or just want to
          talk strategy — we're all ears. The inbox is open, the team is sharp,
          and we're very much{" "}
          <span className="text-[#0f0f0f] font-medium tracking-tighter uppercase">
            ready.
          </span>{" "}
          Drop us a line at{" "}
          <a
            href="mailto:contentprompts@gmail.com"
            className="text-[#0f0f0f] font-semibold underline underline-offset-3 decoration-[#0f0f0f]/20 hover:decoration-[#0f0f0f] transition-all"
          >
            contentprompts@gmail.com
          </a>
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-6 mt-1">
          <a
            href="mailto:contentprompts@gmail.com"
            className="no-underline font2 text-[0.85rem] md:text-[1rem] tracking-wide text-[#0f0f0f] hover:opacity-60 transition-opacity duration-300"
          >
            [&nbsp;&nbsp;Start a Project&nbsp;&nbsp;]
          </a>

          <span className="text-[#0f0f0f]/20 text-sm">—</span>

          <a
            href="callto:+919910449552"
            className="no-underline font2 text-[0.85rem] md:text-[1rem] tracking-wide text-[#0f0f0f]/40 hover:text-[#0f0f0f] hover:opacity-60 transition-all duration-300"
          >
            [&nbsp;&nbsp;Call Us&nbsp;&nbsp;]
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactHeader;

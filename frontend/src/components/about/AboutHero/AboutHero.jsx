"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

/* --- marquee items ------------------------------------------------ */
const MARQUEE_IMGS = [
  { src: "/services/SEO Strategy.avif", label: "SEO Strategy" },
  { src: "/services/Content Writing.avif", label: "Content Writing" },
  { src: "/services/YouTube Marketing.avif", label: "YouTube Marketing" },
  { src: "/services/LinkedIn Marketing.avif", label: "LinkedIn Marketing" },
  { src: "/services/Facebook Marketing.avif", label: "Facebook Marketing" },
  { src: "/services/Instagram Marketing.avif", label: "Instagram Marketing" },
  {
    src: "/services/Social Media Management.avif",
    label: "Social Media Management",
  },
  {
    src: "/services/Social Media Ad Design.avif",
    label: "Social Media Ad Design",
  },
  {
    src: "/services/Amazon Account Management.avif",
    label: "Amazon Account Management",
  },
  {
    src: "/services/E-Commerce Management.avif",
    label: "E-Commerce Management",
  },
  { src: "/services/Website Design.avif", label: "Website Design" },
  { src: "/services/Web Development.avif", label: "Web Development" },
];

/* --- copy blocks -------------------------------------------------- */
const COPY_BLOCKS = [
  "We are a digital marketing partner obsessed with building growth engines that keep working long after launch. Our team blends data-driven strategy, bold storytelling, and sharp analytics to deliver results that are precise, transparent, and accountable from day one.",
  "We work with D2C brands, funded startups, and businesses that have been stuck at the same number for too long. We map the path, build the funnel, and execute relentlessly — performance marketing, content, SEO, paid ads, social.",
  "The brands we work with don't stay small. They scale. We make sure of it by obsessing over the details that most agencies skip — the targeting, the creative, the copy, the conversion rate, the follow-up.",
];

export default function AboutHero() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const trackRef = useRef(null);
  const block0Ref = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const fill0Ref = useRef(null);
  const fill1Ref = useRef(null);
  const fill2Ref = useRef(null);
  const scrollHintRef = useRef(null); // scroll indicator wrapper

  useEffect(() => {
    const container = containerRef.current;
    const hero = heroRef.current;
    const track = trackRef.current;
    const scrollHint = scrollHintRef.current;
    const blockEls = [block0Ref.current, block1Ref.current, block2Ref.current];
    const fills = [fill0Ref.current, fill1Ref.current, fill2Ref.current];
    if (!container || !hero || !track) return;

    function getScroller(el) {
      let p = el?.parentElement;
      while (p) {
        const oy = window.getComputedStyle(p).overflowY;
        if (
          (oy === "auto" || oy === "scroll") &&
          p.scrollHeight > p.clientHeight
        )
          return p;
        p = p.parentElement;
      }
      return window;
    }
    const scroller = getScroller(container);

    const splits = blockEls.map((el) =>
      SplitText.create(el, { type: "words", mask: "words" }),
    );
    gsap.set(splits[1].words, { yPercent: 100 });
    gsap.set(splits[2].words, { yPercent: 100 });

    const OVERLAP = 3;

    function getWordProgress(phaseProgress, wordIndex, totalWords) {
      const totalLength = 1 + OVERLAP / totalWords;
      const scale =
        1 /
        Math.min(
          totalLength,
          1 + (totalWords - 1) / totalWords + OVERLAP / totalWords,
        );
      const startTime = (wordIndex / totalWords) * scale;
      const endTime = startTime + (OVERLAP / totalWords) * scale;
      if (phaseProgress <= startTime) return 0;
      if (phaseProgress >= endTime) return 1;
      return (phaseProgress - startTime) / (endTime - startTime);
    }

    function animateBlock(outSplit, inSplit, phaseProgress) {
      outSplit.words.forEach((word, i) => {
        const p = getWordProgress(phaseProgress, i, outSplit.words.length);
        gsap.set(word, { yPercent: p * 100 });
      });
      inSplit.words.forEach((word, i) => {
        const p = getWordProgress(phaseProgress, i, inSplit.words.length);
        gsap.set(word, { yPercent: 100 - p * 100 });
      });
    }

    /* --- dot bounce animation inside mouse icon --- */
    const dot = scrollHint?.querySelector(".scroll-dot");
    let dotAnim = null;
    if (dot) {
      dotAnim = gsap.to(dot, {
        y: 6,
        duration: 0.9,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    const st = ScrollTrigger.create({
      trigger: container,
      scroller,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const prog = self.progress;

        /* fade out scroll hint as soon as user starts scrolling */
        if (scrollHint) {
          scrollHint.style.opacity = String(Math.max(0, 1 - prog * 8));
        }

        /* story-bar fills */
        fills.forEach((fill, i) => {
          if (!fill) return;
          const start  = i / 3;
          const end    = (i + 1) / 3;
          const scaleX = Math.min(1, Math.max(0, (prog - start) / (end - start)));
          fill.style.transform = `scaleX(${scaleX})`;
        });

        /* text transitions */
        if (prog <= 0.5) {
          animateBlock(splits[0], splits[1], prog / 0.5);
        } else {
          gsap.set(splits[0].words, { yPercent: 100 });
          animateBlock(splits[1], splits[2], (prog - 0.5) / 0.5);
        }
      },
    });

    /* velocity-boosted marquee */
    let marqueePos = 0;
    let lastScroll = scroller === window ? window.scrollY : scroller.scrollTop;
    let rawVel = 0;
    let smoothVel = 0;

    const getScrollTop = () =>
      scroller === window ? window.scrollY : scroller.scrollTop;

    const tickerId = gsap.ticker.add(() => {
      const current = getScrollTop();
      rawVel = Math.abs(current - lastScroll);
      lastScroll = current;
      smoothVel += (rawVel - smoothVel) * 0.12;
      marqueePos -= 0.55 + smoothVel * 0.35;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && marqueePos <= -halfWidth) marqueePos = 0;

      gsap.set(track, { x: marqueePos });
    });

    return () => {
      st.kill();
      splits.forEach((s) => s.revert());
      gsap.ticker.remove(tickerId);
      dotAnim?.kill();
    };
  }, []);

  const blockRefList = [block0Ref, block1Ref, block2Ref];
  const doubled = [...MARQUEE_IMGS, ...MARQUEE_IMGS];

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "800vh" }}
    >
      <div
        ref={heroRef}
        className="fixed top-0 left-0 w-full h-svh overflow-hidden bg-[#edeee8]"
      >
        {/* copy blocks */}
        <div
          className="absolute left-0 top-[40%] -translate-y-1/2 w-full
                     px-8 flex flex-col lg:flex-row gap-8 2xl:gap-16"
        >
          {COPY_BLOCKS.map((text, i) => (
            <div key={i} className="flex-1">
              <p
                ref={blockRefList[i]}
                className="text-[1.2rem] md:text-[1.2rem] 2xl:text-[1.5rem]
                          leading-snug 2xl:tracking-tighter text-black"
              >
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* paragraph progress bars — top-center, unchanged */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[40%] px-8 flex items-center gap-1.5 z-20">
          {[fill0Ref, fill1Ref, fill2Ref].map((fillRef, i) => (
            <div
              key={i}
              className="relative flex-1 h-0.75 rounded-full overflow-hidden bg-[#0f0f0f]/15"
            >
              <div
                ref={fillRef}
                className="absolute inset-0 bg-[#331C4F] origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          ))}
        </div>
        <div
          ref={scrollHintRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-75 2xl:bottom-80
                     flex flex-col items-center gap-2 z-20 pointer-events-none will-change-[opacity]"
          style={{ opacity: 1 }}
        >
          {/* Mouse outline */}
          <div className="w-5.5 h-8.5 rounded-[11px] border border-[#0f0f0f]/30 flex justify-center pt-1.5">
            <div className="scroll-dot w-1.25 h-1.5 rounded-full bg-[#331C4F]/50 will-change-transform" />
          </div>
          {/* Label */}
          <span
            className="font2 uppercase text-[#353333]/40"
            style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
          >
            Scroll
          </span>
        </div>

        {/* marquee */}
        <div className="absolute left-0 bottom-2 2xl:bottom-5 w-full h-70 overflow-hidden flex items-center">
          <div ref={trackRef} className="flex gap-4 will-change-transform">
            {doubled.map(({ src, label }, i) => (
              <div
                key={i}
                className="relative w-50 2xl:w-60 h-60 2xl:h-70 rounded-md overflow-hidden shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover"
                  loading={i < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
                  <span
                    className="text-white 2xl:tracking-wider leading-none"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

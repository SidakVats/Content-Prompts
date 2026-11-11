"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { SERVICES_MARQUEE_IMGS } from "@/data/services";
import { ABOUT_COPY_BLOCKS } from "@/data/about";
gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Mobile static layout ────────────────────────────────────────────────────
function AboutHeroMobile() {
  const trackRef = useRef(null);
  const doubled = [...SERVICES_MARQUEE_IMGS, ...SERVICES_MARQUEE_IMGS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let marqueePos = 0;
    const tickerId = gsap.ticker.add(() => {
      marqueePos -= 0.4;
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && marqueePos <= -halfWidth) marqueePos = 0;
      gsap.set(track, { x: marqueePos });
    });

    return () => gsap.ticker.remove(tickerId);
  }, []);

  return (
    <div
      className="w-full bg-[#edeee8] flex flex-col"
      style={{ height: "100svh" }}
    >
      {/* Text — grows to fill remaining space, scrolls internally if needed */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-24 pb-4 flex flex-col justify-center gap-5">
        <p className="text-[1rem] tracking-wide font2 leading-snug text-black">
          {ABOUT_COPY_BLOCKS[0]}
        </p>
        <p className="text-[1rem] leading-snug tracking-wide font2 text-black">
          {ABOUT_COPY_BLOCKS[1]}
        </p>
      </div>

      {/* Piano marquee — fixed height, always pinned to bottom */}
      <div className="w-full overflow-hidden shrink-0 pb-5" style={{ height: "12rem" }}>
        <div
          ref={trackRef}
          className="flex gap-2 items-end h-full will-change-transform"
        >
          {doubled.map(({ src, label, size }, i) => {
            const heightClass =
              size === "tall"   ? "h-40" :
              size === "normal" ? "h-30" :
                                  "h-23";
            return (
              <div
                key={i}
                className={`${heightClass} rounded-md overflow-hidden shrink-0`}
              >
                <Image
                  src={src}
                  alt={label}
                  width={1122}
                  height={1402}
                  className="h-full w-auto object-cover"
                  sizes="120px"
                  loading={i < 16 ? "eager" : "lazy"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop scroll-pinned layout ────────────────────────────────────────────
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
  const scrollHintRef = useRef(null);
  const mobileRef = useRef(null);
  const desktopRef = useRef(null);

  useEffect(() => {
    // Only run scroll animation on md+ screens
    if (window.innerWidth < 768) return;

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

        if (scrollHint) {
          scrollHint.style.opacity = String(Math.max(0, 1 - prog * 8));
        }

        fills.forEach((fill, i) => {
          if (!fill) return;
          const start  = i / 3;
          const end    = (i + 1) / 3;
          const scaleX = Math.min(1, Math.max(0, (prog - start) / (end - start)));
          fill.style.transform = `scaleX(${scaleX})`;
        });

        if (prog <= 0.5) {
          animateBlock(splits[0], splits[1], prog / 0.5);
        } else {
          gsap.set(splits[0].words, { yPercent: 100 });
          animateBlock(splits[1], splits[2], (prog - 0.5) / 0.5);
        }
      },
    });

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
  const doubled = [...SERVICES_MARQUEE_IMGS, ...SERVICES_MARQUEE_IMGS];

  return (
    <>
      {/* ── Mobile: static, no scroll pinning ── */}
      <div className="block md:hidden">
        <AboutHeroMobile />
      </div>

      {/* ── Desktop: scroll-pinned animation ── */}
      <div
        ref={containerRef}
        className="relative w-full hidden md:block"
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
            {ABOUT_COPY_BLOCKS.map((text, i) => (
              <div key={i} className="flex-1">
                {/* Visually-hidden accessible label — SplitText mangles the DOM */}
                <span className="sr-only">{text}</span>
                <p
                  ref={blockRefList[i]}
                  aria-hidden="true"
                  className="text-[1.2rem] md:text-[1.2rem] 2xl:text-[1.5rem]
                            leading-snug 2xl:tracking-tighter text-black"
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* paragraph progress bars */}
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
            <div className="w-5.5 h-8.5 rounded-[11px] border border-[#0f0f0f]/30 flex justify-center pt-1.5">
              <div className="scroll-dot w-1.25 h-1.5 rounded-full bg-[#331C4F]/50 will-change-transform" />
            </div>
            <span
              className="font2 uppercase text-[#353333]/40"
              style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
            >
              Scroll
            </span>
          </div>

          {/* marquee */}
          <div className="absolute left-0 bottom-2 2xl:bottom-5 w-full overflow-hidden" style={{ height: "17rem" }}>
            <div ref={trackRef} className="flex gap-3 items-end h-full will-change-transform">
              {doubled.map(({ src, label, size }, i) => {
                const heightClass =
                  size === "tall"   ? "h-64 2xl:h-[17rem]" :
                  size === "normal" ? "h-48 2xl:h-56"      :
                                      "h-36 2xl:h-40";
                return (
                  <div
                    key={i}
                    className={`${heightClass} rounded-md overflow-hidden shrink-0`}
                  >
                    <Image
                      src={src}
                      alt={label}
                      width={1122}
                      height={1402}
                      className="h-full w-auto object-cover"
                      sizes="(max-width: 1280px) 192px, 256px"
                      loading={i < 16 ? "eager" : "lazy"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

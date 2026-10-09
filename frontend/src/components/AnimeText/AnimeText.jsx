"use client";

import { useEffect, useRef } from "react";

export default function AnimeText({
  paragraphs = [],
  keywords = [],
  keywordColors = {},
  highlightBg = "237, 235, 231",
  pinDuration = 4,
}) {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    const words = Array.from(sticky.querySelectorAll(".at-word"));
    const totalWords = words.length;

    // ── Progress: how far the user has scrolled through the outer div ────────
    function getProgress() {
      const rect = outer.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    }

    // ── Apply progress to every word ─────────────────────────────────────────
    function applyProgress(progress) {
      words.forEach((word, index) => {
        const wordText = word.querySelector("span");
        if (!wordText) return;

        if (progress <= 0.7) {
          const revealProgress = Math.min(1, progress / 0.7);
          const overlapWords = 15;
          const wordStart = index / totalWords;
          const wordEnd = wordStart + overlapWords / totalWords;
          const timelineScale =
            1 /
            Math.min(
              1 + overlapWords / totalWords,
              1 + (totalWords - 1) / totalWords + overlapWords / totalWords,
            );
          const adjStart = wordStart * timelineScale;
          const adjEnd = wordEnd * timelineScale;
          const duration = adjEnd - adjStart;
          const wordProgress =
            revealProgress <= adjStart
              ? 0
              : revealProgress >= adjEnd
                ? 1
                : (revealProgress - adjStart) / duration;

          word.style.opacity = wordProgress;
          const bgFade = wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
          word.style.backgroundColor = `rgba(${highlightBg}, ${Math.max(0, 1 - bgFade)})`;
          const textReveal = wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
          wordText.style.opacity = Math.pow(textReveal, 0.5);
        } else {
          const reverseProgress = (progress - 0.7) / 0.3;
          word.style.opacity = 1;

          const reverseOverlap = 5;
          const rStart = index / totalWords;
          const rEnd = rStart + reverseOverlap / totalWords;
          const rScale =
            1 /
            Math.max(
              1,
              (totalWords - 1) / totalWords + reverseOverlap / totalWords,
            );
          const rAdjStart = rStart * rScale;
          const rAdjEnd = rEnd * rScale;
          const rDur = rAdjEnd - rAdjStart;
          const rProgress =
            reverseProgress <= rAdjStart
              ? 0
              : reverseProgress >= rAdjEnd
                ? 1
                : (reverseProgress - rAdjStart) / rDur;

          if (rProgress > 0) {
            wordText.style.opacity = 1 - rProgress;
            word.style.backgroundColor = `rgba(${highlightBg}, ${rProgress})`;
          } else {
            wordText.style.opacity = 1;
            word.style.backgroundColor = `rgba(${highlightBg}, 0)`;
          }
        }
      });
    }

    // ── Scroll listener + RAF throttle ───────────────────────────────────────
    let rafId = null;

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyProgress(getProgress());
      });
    }

    // Seed on mount, then listen
    applyProgress(getProgress());
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [paragraphs, keywords, highlightBg, pinDuration]);

  const normalise = (w) => w.toLowerCase().replace(/[.,!?;:"]/g, "");

  return (
    <div
      ref={outerRef}
      style={{ height: `${(pinDuration + 1) * 100}vh` }}
    >
      <section
        ref={stickyRef}
        className="sticky top-0 w-full p-8 overflow-hidden bg-[#0f0f0f]"
        style={{ height: "100svh", minHeight: "-webkit-fill-available" }}
      >
        <div className="w-full h-full flex justify-center items-center text-center">
          <div className="w-full">
            <div className="w-[95%] lg:w-[60%] mx-auto">
              {paragraphs.map((para, pi) => (
                <p
                  key={pi}
                  className="mb-6 text-center text-[clamp(1.25rem,2.5vw,4.5rem)] tracking-tight leading-[1.15] text-[#f5f5f5]"
                >
                  {para
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((word, wi) => {
                      const norm = normalise(word);
                      const isKeyword = keywords.includes(norm);
                      const color = keywordColors[norm];

                      return (
                        <span
                          key={wi}
                          className={[
                            "at-word",
                            "inline-block relative will-change-[background-color,opacity] opacity-0",
                            "mx-[0.15rem] mb-[0.15rem] px-[0.15rem] py-0 rounded-lg",
                            isKeyword ? "mx-[0.35rem]" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <span
                            className={[
                              "relative opacity-0",
                              isKeyword
                                ? "at-keyword inline-block w-full h-full py-0 px-0 rounded-lg text-[#0f0f0f]"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={
                              isKeyword
                                ? { "--kw-color": color ?? "#f5f5f5" }
                                : undefined
                            }
                          >
                            {word}
                          </span>
                        </span>
                      );
                    })}
                </p>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .at-keyword::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% + 0.8rem);
            height: calc(100% + 0.1rem);
            background-color: var(--kw-color, #f5f5f5);
            border-radius: 0.4rem;
            z-index: -1;
          }
        `}</style>
      </section>
    </div>
  );
}

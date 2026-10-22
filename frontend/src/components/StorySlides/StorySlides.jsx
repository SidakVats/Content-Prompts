"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useViewTransition } from "@/hooks/useViewTransition";
import { stories } from "./stories.js";

gsap.registerPlugin(SplitText);

const STORY_DURATION = 4000;
const CONTENT_DELAY = 0.4;

/* ── Lightning icon ─────────────────────────────────────────────────────── */
function LightningIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.8 1L2 7h4.2L5.2 11 10 5H5.8L6.8 1Z" />
    </svg>
  );
}

/* ── StoryButton ─────────────────────────────────────────────────────────── */
function StoryButton({ href, children, delay = 0 }) {
  const { navigateWithTransition } = useViewTransition();
  const labelRef = useRef(null);
  const iconRef = useRef(null);
  const splitRef = useRef(null);

  useEffect(() => {
    if (!labelRef.current) return;
    let alive = true;

    const init = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 100));
      if (!alive || !labelRef.current) return;

      splitRef.current?.revert();
      const split = SplitText.create(labelRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line++",
        lineThreshold: 0.1,
      });
      splitRef.current = split;

      gsap.set(split.lines, { y: "100%" });
      if (iconRef.current) gsap.set(iconRef.current, { scale: 0 });

      gsap.to(split.lines, {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay,
      });
      if (iconRef.current)
        gsap.to(iconRef.current, {
          scale: 1,
          duration: 0.8,
          ease: "power4.out",
          delay,
        });
    };

    init();
    return () => {
      alive = false;
      splitRef.current?.revert();
    };
  }, [delay]);

  return (
    <a
      href={href}
      onClick={(e) => {
        if (!href) return;
        e.preventDefault();
        navigateWithTransition(href);
      }}
      className="story-btn group relative inline-flex items-center gap-2 no-underline uppercase w-max"
    >
      {/* Label — story-btn-label targeted by ::after in globals.css */}
      <span
        ref={labelRef}
        className="story-btn-label relative inline-block text-white text-base ms-1 tracking-tight antialiased translate-y-0.5"
      >
        {children}
      </span>

      {/* Icon — story-btn-icon targeted by flip keyframes in globals.css */}
      <span className="story-btn-icon flex items-center justify-center perspective-[1000px] transform-3d will-change-transform">
        <span
          ref={iconRef}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-neutral-900"
        >
          <LightningIcon />
        </span>
      </span>
    </a>
  );
}

/* ── StorySlides ─────────────────────────────────────────────────────────── */
export default function StorySlides() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const el = containerRef.current;
    let activeStory = 0;
    let storyTimeout;
    let isAnimating = false;

    const getHighlight = (i) => {
      // Grab all highlights across both desktop + mobile bar sets
      const all = el.querySelectorAll(".story-index .story-index-highlight");
      const count = stories.length;
      // Return an array of the matching index from each set
      const result = [];
      for (let set = 0; set * count < all.length; set++) {
        if (all[set * count + i]) result.push(all[set * count + i]);
      }
      return result;
    };

    function resetIndexHighlight(i) {
      const highlights = getHighlight(i);
      if (!highlights.length) return;
      gsap.killTweensOf(highlights);
      gsap.to(highlights, {
        width: "100%",
        duration: 0.3,
        onStart: () =>
          gsap.to(highlights, {
            transformOrigin: "right center",
            scaleX: 0,
            duration: 0.3,
          }),
      });
    }

    function animateIndexHighlight(i) {
      const highlights = getHighlight(i);
      if (!highlights.length) return;
      gsap.set(highlights, { width: "0%", scaleX: 1, transformOrigin: "right center" });
      gsap.to(highlights, {
        width: "100%",
        duration: STORY_DURATION / 1000,
        ease: "none",
      });
    }

    function animateNewImage(imgContainer) {
      gsap.set(imgContainer, {
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      });
      gsap.to(imgContainer, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power4.out",
      });
    }

    function animateImageScale(currentImg, upcomingImg) {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        },
      });
      tl.fromTo(
        currentImg,
        { scale: 1, rotate: 0 },
        {
          scale: 2,
          rotate: -25,
          duration: 1,
          ease: "power4.out",
          onComplete: () => currentImg.parentElement?.remove(),
        },
      );
      tl.fromTo(
        upcomingImg,
        { scale: 2, rotate: 25 },
        { scale: 1, rotate: 0, duration: 1, ease: "power4.out" },
        "<",
      );
    }

    function cleanUp() {
      const nameDiv = el.querySelector(".story-profile-name");
      if (nameDiv) {
        while (nameDiv.childElementCount > 2)
          nameDiv.removeChild(nameDiv.firstChild);
      }
      el.querySelectorAll(".story-title-row").forEach((row) => {
        while (row.childElementCount > 2) row.removeChild(row.firstChild);
      });
    }

    function changeStory() {
      if (isAnimating) return;
      isAnimating = true;

      const prev = activeStory;
      activeStory = (activeStory + 1) % stories.length;
      const story = stories[activeStory];

      const profilePs = el.querySelectorAll(".story-profile-name p");
      if (profilePs.length)
        gsap.to(profilePs, {
          y: -24,
          duration: 0.75,
          delay: CONTENT_DELAY,
          ease: "power3.out",
        });

      const titleH1s = el.querySelectorAll(".story-title-row h1");
      if (titleH1s.length)
        gsap.to(titleH1s, {
          y: -64,
          duration: 0.75,
          delay: CONTENT_DELAY,
          ease: "power3.out",
        });

      const currentInner = el.querySelector(".story-img-wrap .story-img-inner");
      if (!currentInner) {
        isAnimating = false;
        return;
      }
      const currentImg = currentInner.querySelector("img");
      if (!currentImg) {
        isAnimating = false;
        return;
      }

      setTimeout(() => {
        /* profile name */
        const nameDiv = el.querySelector(".story-profile-name");
        if (nameDiv) {
          const p = document.createElement("p");
          p.innerText = story.profileName;
          p.style.cssText =
            "font-weight:400;font-family:inherit;font-size:1rem;line-height:1.15;color:white;position:absolute;top:0;will-change:transform;";
          nameDiv.appendChild(p);
          gsap.set(p, { y: 24 });
          gsap.to(p, {
            y: 0,
            duration: 0.5,
            delay: CONTENT_DELAY,
            ease: "power3.out",
          });
        }

        /* title lines */
        el.querySelectorAll(".story-title-row").forEach((row, i) => {
          if (!story.title[i]) return;
          const h = document.createElement("h1");
          h.innerText = story.title[i];
          h.style.cssText =
            "font-family:inherit;line-height:1;font-size:3.75rem;color:white;position:absolute;top:0;will-change:transform;";
          row.appendChild(h);
          gsap.set(h, { y: 64 });
          gsap.to(h, {
            y: 0,
            duration: 0.75,
            delay: CONTENT_DELAY,
            ease: "power3.out",
          });
        });

        /* new image */
        const imgWrap = el.querySelector(".story-img-wrap");
        if (imgWrap) {
          const newInner = document.createElement("div");
          newInner.className = "story-img-inner absolute inset-0";
          const newImg = document.createElement("img");
          newImg.src = story.storyImg;
          newImg.alt = story.profileName;
          newImg.className = "w-full h-full object-cover will-change-transform";
          newInner.appendChild(newImg);
          imgWrap.appendChild(newInner);
          animateNewImage(newInner);
          animateImageScale(currentImg, newImg);
        }

        resetIndexHighlight(prev);
        animateIndexHighlight(activeStory);
        cleanUp();

        clearTimeout(storyTimeout);
        storyTimeout = setTimeout(changeStory, STORY_DURATION);
      }, 500);

      setTimeout(() => {
        const icon = el.querySelector(".story-profile-icon img");
        if (icon) icon.src = story.profileImg;
      }, 600);
    }

    function handleClick() {
      if (isAnimating) return;
      clearTimeout(storyTimeout);
      resetIndexHighlight(activeStory);
      changeStory();
    }

    el.addEventListener("click", handleClick);
    storyTimeout = setTimeout(changeStory, STORY_DURATION);
    animateIndexHighlight(0);

    return () => {
      el.removeEventListener("click", handleClick);
      clearTimeout(storyTimeout);
      gsap.killTweensOf(el.querySelectorAll("*"));
    };
  }, []);

  return (
    <>
      
      <style>{`
        .story-btn-label::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -6px;
          left: 0;
          background: white;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.25s ease-out;
        }
        .story-btn:hover .story-btn-label::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        @media (max-width: 1023px) {
          .story-btn-label::after { display: none; }
        }
        @keyframes ss-flip-in  { from { transform: rotateY(0deg); }   to { transform: rotateY(720deg); } }
        @keyframes ss-flip-out { from { transform: rotateY(720deg); } to { transform: rotateY(0deg); } }
        .story-btn:hover .story-btn-icon       { animation: ss-flip-in  0.8s ease-out forwards; }
        .story-btn:not(:hover) .story-btn-icon { animation: ss-flip-out 0.8s ease-out forwards; }
        @media (max-width: 1023px) {
          .story-btn:hover .story-btn-icon,
          .story-btn:not(:hover) .story-btn-icon { animation: none; }
        }
        @media (max-width: 1023px) {
          .story-title-row h1 { font-size: 2.25rem !important; }
          .story-title-row    { height: 2.5rem !important; }
        }
        .story-btn-label .line {
          position: relative;
          transform: translateY(100%);
          will-change: transform;
          padding-bottom: 0.2em;
          margin-bottom: -0.2em;
        }
      `}</style>

      {/* Root */}
      <div
        ref={containerRef}
        className="relative w-full h-svh overflow-hidden cursor-pointer select-none"
      >
        {/* Background image */}
        <div className="story-img-wrap absolute inset-0 overflow-hidden opacity-75">
          <div className="story-img-inner absolute inset-0">
            <img
              src="/stories/story-1.jpg"
              alt=""
              className="w-full h-full object-cover will-change-transform"
            />
          </div>
        </div>

        {/* Footer */}
        {/* <div className="absolute bottom-0 left-0 w-full px-6 pb-5 md:px-8 md:pb-7">
          <div className="flex justify-between items-end">
            <p className="uppercase text-white text-sm font-medium tracking-widest leading-tight">
              Creative Index
            </p>
            <p className="uppercase text-white text-sm font-medium tracking-widest leading-tight">
              ( Since 2025 )
            </p>
          </div>
        </div> */}

        {/* Content panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between h-full py-8 w-full px-5 pb-6 lg:w-[50%] lg:px-0 lg:pb-8">

          {/* Spacer — pushes title down on mobile so it sits mid-screen */}
          <div className="flex-1 lg:hidden" />

          {/* Top — profile row: order-2 on desktop (below bars), order-3 on mobile (below bars at bottom) */}
          <div className="w-full order-3 lg:order-1">
            {/* Index bars — desktop only (mobile/tablet has its own set below) */}
            <div className="hidden lg:flex w-full items-center gap-1 h-2 mb-3">
              {stories.map((_, i) => (
                <div
                  key={`idx-${i}`}
                  className="story-index relative flex-1 h-1 rounded-full overflow-hidden bg-white/30"
                >
                  <div className="story-index-highlight absolute top-0 left-0 h-full w-0 bg-white will-change-transform" />
                </div>
              ))}
            </div>
            <div className="w-full flex items-center gap-4 h-15">
              <div className="story-profile-icon relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img
                  src={stories[0].profileImg}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="story-profile-name relative w-50 h-4.5 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
                <p className="absolute top-0 text-white text-base font-normal leading-tight will-change-transform">
                  {stories[0].profileName}
                </p>
              </div>
            </div>
          </div>

          {/* Title + CTA — order-1 on mobile (top), order-2 on desktop */}
          <div className="w-full order-1 lg:order-2">
            {/* Title lines */}
            <div className="mb-8">
              {stories[0].title.map((line, i) => (
                <div
                  key={`title-${i}`}
                  className="story-title-row relative w-full h-10 overflow-hidden lg:h-16"
                >
                  <h1 className="absolute top-0 text-white text-4xl leading-none will-change-transform lg:text-6xl">
                    {line}
                  </h1>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="story-btn w-max my-4 py-1 lg:my-8">
              <StoryButton href={stories[0].linkSrc}>
                {stories[0].linkLabel}
              </StoryButton>
            </div>
          </div>

          {/* Progress bars — mobile + tablet, order-2 (between title and profile) */}
          <div className="w-full flex items-center gap-1 h-2 order-2 lg:hidden">
            {stories.map((_, i) => (
              <div
                key={`idx-mobile-${i}`}
                className="story-index relative flex-1 h-1 rounded-full overflow-hidden bg-white/30"
              >
                <div className="story-index-highlight absolute top-0 left-0 h-full w-0 bg-white will-change-transform" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

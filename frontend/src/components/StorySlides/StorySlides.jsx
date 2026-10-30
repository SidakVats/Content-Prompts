"use client";

import { useEffect, useRef, useState } from "react";
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

/* ── Profile SVG Icons ───────────────────────────────────────────────────── */
function ProfileIcon({ name, className = "" }) {
  const n = (name || "").toLowerCase();

  if (n.includes("seo")) {
    // Magnifying glass / search
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a1a2e" />
        <circle cx="17.5" cy="17.5" r="7" stroke="#a78bfa" strokeWidth="2.5" />
        <line x1="22.5" y1="22.5" x2="29" y2="29" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="17.5" x2="21" y2="17.5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        <line x1="17.5" y1="14" x2="17.5" y2="21" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes("instagram")) {
    // Instagram camera outline
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a0533" />
        <rect x="10" y="12" width="20" height="16" rx="4" stroke="url(#ig-grad)" strokeWidth="2.2" />
        <circle cx="20" cy="20" r="4.5" stroke="url(#ig-grad)" strokeWidth="2" />
        <circle cx="26.5" cy="13.5" r="1.2" fill="#f472b6" />
        <defs>
          <linearGradient id="ig-grad" x1="10" y1="12" x2="30" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f9a825" />
            <stop offset="50%" stopColor="#e91e8c" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("paid") || n.includes("ads")) {
    // Target / bullseye
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1b2a" />
        <circle cx="20" cy="20" r="9" stroke="#60a5fa" strokeWidth="2.2" />
        <circle cx="20" cy="20" r="5" stroke="#3b82f6" strokeWidth="2.2" />
        <circle cx="20" cy="20" r="2" fill="#93c5fd" />
        <line x1="20" y1="8" x2="20" y2="11" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="29" x2="20" y2="32" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="20" x2="11" y2="20" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        <line x1="29" y1="20" x2="32" y2="20" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes("b2b")) {
    // Handshake / deal icon
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0a1628" />
        <path d="M10 22 L15 17 L19 19 L21 17 L25 19 L30 22" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 17 L15 14 M25 19 L25 16" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="13" r="2" fill="#0ea5e9" />
        <circle cx="25" cy="15" r="2" fill="#38bdf8" />
        <path d="M10 22 C10 26 14 28 20 28 C26 28 30 26 30 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes("phygital")) {
    // QR code / bridge icon
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1a0d" />
        <rect x="10" y="10" width="8" height="8" rx="1.5" stroke="#4ade80" strokeWidth="2" />
        <rect x="22" y="10" width="8" height="8" rx="1.5" stroke="#4ade80" strokeWidth="2" />
        <rect x="10" y="22" width="8" height="8" rx="1.5" stroke="#4ade80" strokeWidth="2" />
        <rect x="12.5" y="12.5" width="3" height="3" rx="0.5" fill="#4ade80" />
        <rect x="24.5" y="12.5" width="3" height="3" rx="0.5" fill="#4ade80" />
        <rect x="12.5" y="24.5" width="3" height="3" rx="0.5" fill="#4ade80" />
        <path d="M22 22 L25 22 L25 25 L28 25 L28 22 M25 25 L25 28 L28 28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (n.includes("social commerce") || n.includes("commerce")) {
    // Shopping bag with play arrow
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a0533" />
        <path d="M14 16 L12 28 L28 28 L26 16 Z" stroke="url(#sc-grad)" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M16 16 C16 12 24 12 24 16" stroke="url(#sc-grad)" strokeWidth="2.2" strokeLinecap="round" />
        <polygon points="17,20 17,25 23,22.5" fill="#f472b6" />
        <defs>
          <linearGradient id="sc-grad" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f9a825" />
            <stop offset="100%" stopColor="#e91e8c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("small business") || n.includes("service business") || n.includes("service")) {
    // Storefront / shop icon
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a1000" />
        <rect x="11" y="20" width="18" height="10" rx="1" stroke="#fbbf24" strokeWidth="2" />
        <path d="M9 20 L11 14 L29 14 L31 20 Z" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 20 C9 22.5 11.5 24 13.5 22 C15.5 20 16.5 20 18.5 22 C20.5 24 21.5 24 23.5 22 C25.5 20 27.5 20.5 31 20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="17" y="23" width="6" height="7" rx="1" fill="#fbbf24" />
      </svg>
    );
  }

  if (n.includes("linkedin")) {
    // LinkedIn "in" mark
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0a1628" />
        <rect x="11" y="17" width="4" height="12" rx="1" fill="#0ea5e9" />
        <circle cx="13" cy="13" r="2.2" fill="#0ea5e9" />
        <path d="M19 17h3.5v2s1-2.5 4-2.5c3.5 0 3.5 3 3.5 5v7h-4v-6c0-1.5-.5-2.5-1.8-2.5-1.5 0-2.2 1-2.2 2.5v6H19V17Z" fill="#38bdf8" />
      </svg>
    );
  }

  if (n.includes("content")) {
    // Pen / feather
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a1a0d" />
        <path d="M28 11C28 11 22 14 18 18C14 22 13 27 13 27L16 28L17 25L20 24L21 27L22 24C22 24 27 21 29 15C31 9 28 11 28 11Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="13" y1="27" x2="11" y2="29" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="21.5" cy="18.5" r="1.5" fill="#fbbf24" />
      </svg>
    );
  }

  if (n.includes("email")) {
    // Envelope
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0f1f0f" />
        <rect x="9" y="13" width="22" height="14" rx="3" stroke="#4ade80" strokeWidth="2" />
        <path d="M9 15L20 22L31 15" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes("video") || n.includes("youtube")) {
    // Play button
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1a0000" />
        <circle cx="20" cy="20" r="10" fill="#ef4444" />
        <polygon points="17,15 28,20 17,25" fill="white" />
      </svg>
    );
  }

  // Default: generic sparkle / brand icon
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#1a1a1a" />
      <path d="M20 10 L21.5 18.5 L30 20 L21.5 21.5 L20 30 L18.5 21.5 L10 20 L18.5 18.5 Z" fill="#e5e5e5" />
    </svg>
  );
}

/* ── StoryButton ─────────────────────────────────────────────────────────── */
function StoryButton({ hrefRef, children, delay = 0 }) {
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
      href={hrefRef?.current}
      onClick={(e) => {
        e.stopPropagation();
        const href = hrefRef?.current;
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
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  // Always holds the href of the CURRENTLY DISPLAYED story
  const currentLinkRef = useRef(stories[0].linkSrc);

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
      // Note: setActiveStoryIndex and currentLinkRef are updated AFTER
      // the transition (inside the setTimeout) so the button href stays
      // correct for the story that is visually displayed.

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

        // Update React state and the link ref AFTER the visual swap —
        // this keeps the button href in sync with what's actually shown.
        setActiveStoryIndex(activeStory);
        currentLinkRef.current = story.linkSrc;

        cleanUp();

        clearTimeout(storyTimeout);
        storyTimeout = setTimeout(changeStory, STORY_DURATION);
      }, 500);
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
                <ProfileIcon
                  name={stories[activeStoryIndex].profileName}
                  className="w-full h-full"
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
              <StoryButton hrefRef={currentLinkRef}>
                {stories[activeStoryIndex].linkLabel}
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

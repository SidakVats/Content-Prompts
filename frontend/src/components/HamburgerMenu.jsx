"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

// ─── Data ────────────────────────────────────────────────────────────────────

const links = [
  { title: "Projects", href: "/" },
  { title: "Agency", href: "/" },
  { title: "Expertise", href: "/" },
  { title: "Careers", href: "/" },
  { title: "Contact", href: "/" },
];

const footerLinks = [
  { title: "Facebook", href: "/" },
  { title: "LinkedIn", href: "/" },
  { title: "Instagram", href: "/" },
  { title: "Twitter", href: "/" },
];

// ─── Animation configs ───────────────────────────────────────────────────────

const perspective = {
  initial: { opacity: 0, rotateX: 90, y: 80, x: -20 },
  enter: (i = 0) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    x: 0,
    duration: 0.65,
    delay: 0.5 + i * 0.1,
    ease: "power2.out",
  }),
};

const slideIn = {
  initial: { opacity: 0, y: 20 },
  enter: (i = 0) => ({
    opacity: 1,
    y: 0,
    duration: 0.5,
    delay: 0.75 + i * 0.1,
    ease: "power2.out",
  }),
};

// ─── Panel dimensions ────────────────────────────────────────────────────────

const OPEN_H = 560;
const CLOSE_W = 160;
const CLOSE_H = 44;
const EASE = "power3.inOut";

// Returns open width capped to viewport width minus a small margin
function getOpenWidth() {
  if (typeof window === "undefined") return 480;
  return Math.min(480, window.innerWidth - 46);
}

// ─── Nav (inner content) ─────────────────────────────────────────────────────

function Nav() {
  const linkRefs = useRef([]);
  const footerRefs = useRef([]);
  const dividerRef = useRef(null);

  useEffect(() => {
    gsap.set(dividerRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 0,
    });

    linkRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, perspective.initial, perspective.enter(i));
    });

    gsap.to(dividerRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 0.4,
      ease: "expo.out",
      delay: 0.5,
    });

    footerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, slideIn.initial, slideIn.enter(i));
    });

    return () => {
      linkRefs.current.forEach((el) => el && gsap.killTweensOf(el));
      footerRefs.current.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, []);

  return (
    <div
      className="flex flex-col justify-between box-border"
      style={{ height: "100%", padding: "56px 16px 16px" }}
    >
      <nav>
        <ul className="list-none mt-8 p-0">
          {links.map(({ title, href }, i) => (
            <li
              key={title}
              ref={(el) => (linkRefs.current[i] = el)}
              className="will-change-transform overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                href={href}
                className="block no-underline py-1 text-4xl sm:text-5xl
                           text-white/70 hover:text-white transition-colors duration-300"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div
        ref={dividerRef}
        className="mt-3 will-change-transform"
        style={{ height: 1, background: "rgba(255,255,255,0.08)" }}
      />

      <footer>
        <ul className="list-none m-0 p-0 flex flex-wrap gap-x-4 gap-y-1.5">
          {footerLinks.map(({ title, href }, i) => (
            <li
              key={title}
              ref={(el) => (footerRefs.current[i] = el)}
              className="will-change-transform"
            >
              <Link
                href={href}
                className="no-underline font-medium tracking-wide
                           text-white/35 hover:text-white/80 transition-colors duration-250"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────

function Button({ isActive, toggleMenu }) {
  const labelRef = useRef(null);
  const labelWrapRef = useRef(null);
  const plusRef = useRef(null);

  const handleClick = () => {
    const opening = !isActive;

    gsap.to(labelRef.current, {
      yPercent: -110,
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        if (!labelRef.current) return;
        labelRef.current.textContent = opening ? "Close" : "Menu";
        gsap.fromTo(
          labelRef.current,
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
        );
      },
    });

    gsap.to(labelWrapRef.current, {
      x: opening ? 58 : 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(plusRef.current, {
      rotation: opening ? 45 : 0,
      duration: 0.4,
      ease: "power3.out",
    });

    toggleMenu();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between cursor-pointer bg-transparent border-none outline-none"
      style={{ width: CLOSE_W, height: CLOSE_H, padding: "0 16px" }}
    >
      <span
        ref={labelWrapRef}
        className="overflow-hidden flex items-center will-change-transform"
        style={{ height: "1rem", lineHeight: 0 }}
      >
        <span
          ref={labelRef}
          className="menu-label block text-xs font-medium text-white uppercase will-change-transform"
          style={{ letterSpacing: "0.12em", lineHeight: 1 }}
        >
          Menu
        </span>
      </span>

      <span
        ref={plusRef}
        className="text-white select-none inline-block will-change-transform"
        style={{
          fontSize: 18,
          fontWeight: 300,
          lineHeight: 1,
          transformOrigin: "center",
        }}
      >
        +
      </span>
    </button>
  );
}

// ─── HamburgerMenu (default export) ─────────────────────────────────────────

export default function HamburgerMenu() {
  const [isActive, setIsActive] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const panelRef = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    gsap.set(panelRef.current, { width: CLOSE_W, height: CLOSE_H });
  }, []);

  const openMenu = () => {
    isAnimating.current = true;
    setNavMounted(true);
    setIsActive(true);
    gsap.to(panelRef.current, {
      width: getOpenWidth(),
      height: OPEN_H,
      duration: 0.75,
      ease: EASE,
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  const closeMenu = () => {
    isAnimating.current = true;
    setIsActive(false);
    gsap.to(panelRef.current, {
      width: CLOSE_W,
      height: CLOSE_H,
      duration: 0.75,
      delay: 0.35,
      ease: EASE,
      onComplete: () => {
        setNavMounted(false);
        isAnimating.current = false;
      },
    });
  };

  const toggle = () => {
    if (isAnimating.current) return;
    isActive ? closeMenu() : openMenu();
  };

  return (
    <div className="fixed top-3 right-3 md:top-6 md:right-6 z-50">
      {/* Gradient border shell */}
      <div
        className="p-1 rounded-[7px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 100%)",
        }}
      >
        {/* Animated panel */}
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-[5px] will-change-transform shadow-2xl"
          style={{
            background: "rgba(6,6,6,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            width: CLOSE_W,
            height: CLOSE_H,
          }}
        >
          {/* Button pinned top-right */}
          <div className="absolute top-0 right-0 z-10">
            <Button isActive={isActive} toggleMenu={toggle} />
          </div>

          {navMounted && <Nav />}
        </div>
      </div>
    </div>
  );
}

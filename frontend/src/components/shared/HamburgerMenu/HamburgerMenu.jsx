"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { animateTransition } from "@/components/shared/Transition/Transition";
import { NAV_LINKS, SOCIAL_LINKS } from "@/data/navigation";

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
const BTN_H = 44;
const EASE = "power3.inOut";

// Responsive closed dimensions (used for GSAP initial set on mobile)
function getCloseW() {
  if (typeof window === "undefined") return CLOSE_W;
  return window.innerWidth < 768 ? 120 : CLOSE_W;
}
function getCloseH() {
  if (typeof window === "undefined") return CLOSE_H;
  return window.innerWidth < 768 ? 36 : CLOSE_H;
}

function getOpenWidth() {
  if (typeof window === "undefined") return 480;
  return Math.min(480, window.innerWidth - 46);
}

// ─── Nav (inner content) ─────────────────────────────────────────────────────

function Nav({ onNavigate }) {
  const linkRefs = useRef([]);
  const footerRefs = useRef([]);
  const dividerRef = useRef(null);
  const router = useRouter();

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    onNavigate(); // close menu

    // If already on this page, skip the transition — pathname won't change
    // so the reveal useEffect in Transition.jsx would never fire.
    const currentPath = window.location.pathname;
    if (currentPath === href) return;

    // Pass click coordinates so the ripple originates from where the user clicked
    animateTransition(e.clientX, e.clientY).then(() => router.push(href));
  };

  return (
    <div
      className="flex flex-col box-border"
      style={{ height: "100%", padding: "56px 0 16px" }}
    >
      <nav className="px-4">
        <ul className="list-none mt-8 p-0">
          {NAV_LINKS.map(({ title, href }, i) => (
            <li
              key={title}
              ref={(el) => (linkRefs.current[i] = el)}
              className="will-change-transform overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="block no-underline py-1 text-4xl sm:text-5xl
                           text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer pushes divider + footer to bottom */}
      <div className="flex-1" />

      <div
        ref={dividerRef}
        className="will-change-transform"
        style={{ height: 1, background: "rgba(255,255,255,0.08)" }}
      />

      <footer className="px-4 pt-4">
        <ul className="list-none m-0 p-0 flex flex-wrap gap-x-4 gap-y-1.5">
          {SOCIAL_LINKS.map(({ title, href }, i) => (
            <li
              key={title}
              ref={(el) => (footerRefs.current[i] = el)}
              className="will-change-transform"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline font-medium tracking-wide
                           text-white/35 hover:text-white/80 transition-colors duration-250 cursor-pointer"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────

function Button({ isActive, toggleMenu, resetRef }) {
  const menuLabelRef = useRef(null);
  const closeLabelRef = useRef(null);
  const plusRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    gsap.set(btnRef.current, { backgroundColor: "transparent" });
    gsap.set(menuLabelRef.current, { y: 0, opacity: 1 });
    gsap.set(closeLabelRef.current, { y: 20, opacity: 0 });
    gsap.set(plusRef.current, { rotation: 0, color: "#ffffff" });

    if (resetRef) {
      resetRef.current = () => {
        gsap.killTweensOf(menuLabelRef.current);
        gsap.killTweensOf(closeLabelRef.current);
        gsap.killTweensOf(plusRef.current);
        gsap.killTweensOf(btnRef.current);
        gsap.to(btnRef.current, {
          backgroundColor: "transparent",
          duration: 0.5,
          ease: "power3.inOut",
        });
        gsap.to(menuLabelRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(closeLabelRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(plusRef.current, {
          rotation: 0,
          color: "#ffffff",
          duration: 0.4,
          ease: "power3.out",
        });
      };
    }
  }, [resetRef]);

  const handleClick = () => {
    const opening = !isActive;
    if (opening) {
      gsap.to(menuLabelRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(closeLabelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.to(plusRef.current, {
        rotation: 45,
        color: "#0f0f0f",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(btnRef.current, {
        backgroundColor: "#ffffff",
        duration: 0.6,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(closeLabelRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(menuLabelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.to(plusRef.current, {
        rotation: 0,
        color: "#ffffff",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(btnRef.current, {
        backgroundColor: "transparent",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
    toggleMenu();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="cursor-pointer border-none outline-none rounded-[5px] hamburger-btn"
      style={{
        width: CLOSE_W,
        height: CLOSE_H,
        padding: "0 16px",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Label area */}
      <span
        style={{
          position: "relative",
          overflow: "hidden",
          height: CLOSE_H,
          display: "flex",
          alignItems: "center",
        }}
        className="hamburger-label-wrap"
      >
        <span
          ref={menuLabelRef}
          className="menu-label text-xs font-medium uppercase"
          style={{
            letterSpacing: "0.12em",
            color: "#ffffff",
            position: "absolute",
            whiteSpace: "nowrap",
          }}
        >
          Menu
        </span>
        <span
          ref={closeLabelRef}
          className="text-xs font-medium uppercase"
          style={{
            letterSpacing: "0.12em",
            color: "#0f0f0f",
            position: "absolute",
            whiteSpace: "nowrap",
          }}
        >
          Close
        </span>
        {/* Invisible spacer — keeps container wide enough for "Close" */}
        <span
          className="text-xs font-medium uppercase invisible"
          style={{ letterSpacing: "0.12em", whiteSpace: "nowrap" }}
        >
          Close
        </span>
      </span>

      <span
        ref={plusRef}
        style={{
          fontSize: 18,
          fontWeight: 300,
          lineHeight: 1,
          transformOrigin: "center",
          color: "#ffffff",
          display: "inline-block",
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
  const wrapperRef = useRef(null);
  const btnWrapperRef = useRef(null);
  const isAnimating = useRef(false);
  const buttonResetRef = useRef(null);

  useEffect(() => {
    gsap.set(panelRef.current, { width: getCloseW(), height: getCloseH() });
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        closeMenu();
    };
    const timer = setTimeout(
      () => document.addEventListener("mousedown", handleOutsideClick),
      0,
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActive]);

  const openMenu = () => {
    isAnimating.current = true;
    setNavMounted(true);
    setIsActive(true);
    // Slide button inward as panel opens
    gsap.to(btnWrapperRef.current, {
      top: 6,
      right: 6,
      duration: 0.75,
      ease: EASE,
    });
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
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsActive(false);
    if (buttonResetRef.current) buttonResetRef.current();
    // Slide button back to flush position as panel closes
    gsap.to(btnWrapperRef.current, {
      top: 0,
      right: 0,
      duration: 0.75,
      delay: 0.35,
      ease: EASE,
    });
    gsap.to(panelRef.current, {
      width: getCloseW(),
      height: getCloseH(),
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
    <>
      {/* Menu — fixed top-right, always visible */}
      <div
        ref={wrapperRef}
        className="fixed top-3 right-3 md:top-6 md:right-6 z-50"
      >
        <div
          className="p-0.75 rounded-[7px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 100%)",
          }}
        >
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
            {/* Button — at top:0,right:0 when closed; GSAP moves to top:6,right:6 when open */}
            <div
              ref={btnWrapperRef}
              style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
            >
              <Button
                isActive={isActive}
                toggleMenu={toggle}
                resetRef={buttonResetRef}
              />
            </div>

            {navMounted && <Nav onNavigate={closeMenu} />}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const links = [
  { label: "About Us", href: "/about" },
  { label: "The Good Stuff", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Slide In", href: "/contact" },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    // Unique geometric camera-iris style icon
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.015 2.25H8.2l4.265 5.637 5.779-6.387Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    // Custom hand-drawn style
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function MenuNav() {
  const plusRef = useRef(null);
  const overlayRef = useRef(null);
  const linkRefs = useRef([]);
  const socialRef = useRef(null);
  const dividerRef = useRef(null);
  const labelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const isAnimating = useRef(false);
  const splitRefs = useRef([]); // holds SplitText instances for cleanup

  useEffect(() => {
    // Overlay hidden via clip-path from top-right corner
    gsap.set(overlayRef.current, {
      clipPath: "inset(0% 0% 100% 100% round 12px)",
      pointerEvents: "none",
    });
    gsap.set(dividerRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 0,
    });
    gsap.set(socialRef.current, { opacity: 0 });

    return () => {
      // Cleanup SplitText instances on unmount
      splitRefs.current.forEach((st) => st?.revert());
    };
  }, []);

  const openMenu = () => {
    isAnimating.current = true;

    // Rotate + → ×  and swap label "Menu" → "Close"
    gsap.to(plusRef.current, {
      rotation: 45,
      duration: 0.4,
      ease: "power3.out",
    });
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        y: "-110%",
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (labelRef.current) labelRef.current.textContent = "Close";
          gsap.fromTo(
            labelRef.current,
            { y: "60%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.25, ease: "power2.out" },
          );
        },
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    // 1. Panel wipes open from top-right corner → full rect
    tl.to(overlayRef.current, {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      duration: 0.55,
      ease: "power4.inOut",
    });

    // 2. Divider line draws in left → right
    tl.to(
      dividerRef.current,
      { scaleX: 1, opacity: 1, duration: 0.4, ease: "expo.out" },
      "-=0.25",
    );

    // 3. Each link's characters stagger in — revert old splits first
    splitRefs.current.forEach((st) => st?.revert());
    splitRefs.current = [];

    linkRefs.current.forEach((el, i) => {
      if (!el) return;
      const st = SplitText.create(el.querySelector("a span"), {
        type: "chars",
        charsClass: "inline-block will-change-transform",
        mask: "chars",
      });
      splitRefs.current[i] = st;

      gsap.fromTo(
        st.chars,
        { y: "105%", rotateX: -60, opacity: 0 },
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.3 + i * 0.06,
        },
      );
    });

    // 4. Social icons fade up as a row
    tl.fromTo(
      socialRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      "-=0.1",
    );
  };

  const closeMenu = () => {
    isAnimating.current = true;

    gsap.to(plusRef.current, {
      rotation: 0,
      duration: 0.35,
      ease: "power3.out",
    });
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        y: "-110%",
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          if (labelRef.current) labelRef.current.textContent = "Menu";
          gsap.fromTo(
            labelRef.current,
            { y: "60%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.22, ease: "power2.out" },
          );
        },
      });
    }

    // Revert SplitText so text is back to normal before clip hides it
    splitRefs.current.forEach((st) => st?.revert());
    splitRefs.current = [];

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, { pointerEvents: "none" });
        // Reset children
        gsap.set(dividerRef.current, { scaleX: 0, opacity: 0 });
        gsap.set(socialRef.current, { opacity: 0 });
        isAnimating.current = false;
      },
    });

    // Social + divider vanish first
    tl.to([socialRef.current, dividerRef.current], {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
    });

    // Panel collapses back into top-right corner
    tl.to(
      overlayRef.current,
      {
        clipPath: "inset(0% 0% 100% 100% round 12px)",
        duration: 0.45,
        ease: "power4.inOut",
      },
      "-=0.05",
    );
  };

  const toggleMenu = () => {
    if (isAnimating.current) return;
    if (!isOpen) {
      gsap.set(overlayRef.current, { pointerEvents: "all" });
      openMenu();
      setIsOpen(true);
    } else {
      closeMenu();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ── Trigger button ── */}
      <nav className="fixed top-3 right-3 md:top-6 md:right-6 z-30">
        <div
          className="rounded-lg p-px md:p-0.75"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        >
          <button
            onClick={toggleMenu}
            className="flex items-center justify-between w-30 md:w-40 bg-black/80 px-4 py-2.5 rounded-[5px] cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Clip wrapper so label slides through */}
            <span
              className="overflow-hidden h-3.5 flex items-center"
              style={{ lineHeight: 0 }}
            >
              <span
                ref={labelRef}
                className="menu-label block font3 text-xs text-white uppercase will-change-transform"
                style={{ letterSpacing: "0.1em", lineHeight: 1 }}
              >
                Menu
              </span>
            </span>
            <span
              ref={plusRef}
              className="text-white select-none inline-block will-change-transform"
              style={{
                transformOrigin: "center",
                fontSize: "18px",
                fontWeight: 300,
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
        </div>
      </nav>

      {/* ── Separate floating overlay — clip-path animated ── */}
      <div
        ref={overlayRef}
        className="fixed top-14 md:top-18.75 right-3.5 md:right-6 z-50 w-65 md:w-87.5"
        style={{
          background: "rgba(6, 6, 6, 0.92)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          borderRadius: "10px",
        }}
      >
        {/* Nav links */}
        <ul className="px-5 pt-5 pb-4 flex flex-col">
          {links.map((link, i) => (
            <li
              key={link.href}
              ref={(el) => (linkRefs.current[i] = el)}
              className="overflow-hidden"
            >
              <a
                href={link.href}
                className="group flex items-center justify-between py- md:py-0.75"
              >
                <span className="font1 text-xl md:text-3xl text-white/70 group-hover:text-white transition-colors duration-300 tracking-tight">
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          ref={dividerRef}
          style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
        />

        {/* Social icons */}
        <div ref={socialRef} className="px-5 py-4 flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-white/80 transition-colors duration-250"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

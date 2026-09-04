"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { animateTransition } from "./Transition";

const navLinks = [
  { label: "Index", href: "/" },
  { label: "The Good Stuff", href: "/work" },
  { label: "Meet Us", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAnimating = useRef(false);
  const scrollYRef = useRef(0);

  const navOverlayRef = useRef(null);
  const openLabelRef = useRef(null);
  const closeLabelRef = useRef(null);
  const navItemRefs = useRef([]);
  const headerRefs = useRef([]);
  const copyRefs = useRef([]);

  const handleLinkClick = (e, href) => {
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;

    if (href === pathname) {
      e.preventDefault();
      if (isMenuOpen) closeMenu();
      return;
    }

    e.preventDefault();
    if (isMenuOpen) {
      closeMenu(() => {
        animateTransition().then(() => {
          window.location.href = href;
        });
      });
    } else {
      animateTransition().then(() => {
        window.location.href = href;
      });
    }
  };

  const openMenu = () => {
    isAnimating.current = true;
    navOverlayRef.current.style.pointerEvents = "all";

    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";

    // "Menu" slides out upward, "Close" slides in from below
    gsap.to(openLabelRef.current, {
      y: "-100%",
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(closeLabelRef.current, {
      y: "0%",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(navOverlayRef.current, {
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        isAnimating.current = false;
      },
    });
    gsap.to(
      [...navItemRefs.current, ...headerRefs.current, ...copyRefs.current],
      {
        opacity: 1,
        y: "0%",
        duration: 0.75,
        stagger: 0.075,
        ease: "power4.out",
      },
    );
  };

  const closeMenu = (onDone) => {
    isAnimating.current = true;
    navOverlayRef.current.style.pointerEvents = "none";

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollYRef.current);

    // "Close" slides out downward, "Menu" slides back in from above
    gsap.to(closeLabelRef.current, {
      y: "100%",
      duration: 0.1,
      ease: "power2.in",
    });
    gsap.to(openLabelRef.current, {
      y: "0%",
      duration: 0.1,
      ease: "power2.out",
    });

    gsap.to(navOverlayRef.current, {
      opacity: 0,
      duration: 0.1,
      onComplete: () => {
        gsap.set(
          [...navItemRefs.current, ...headerRefs.current, ...copyRefs.current],
          { opacity: 0, y: "100%" },
        );
        isAnimating.current = false;
        if (onDone) onDone();
      },
    });
  };

  const toggleMenu = () => {
    if (isAnimating.current) {
      gsap.killTweensOf([
        navOverlayRef.current,
        openLabelRef.current,
        closeLabelRef.current,
        ...navItemRefs.current,
        ...headerRefs.current,
        ...copyRefs.current,
      ]);
      isAnimating.current = false;
    }

    if (!isMenuOpen) {
      openMenu();
      setIsMenuOpen(true);
    } else {
      closeMenu();
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    gsap.set(
      [...navItemRefs.current, ...headerRefs.current, ...copyRefs.current],
      { opacity: 0, y: "100%" },
    );
    // "Close" lives below the clip window on initial load
    gsap.set(closeLabelRef.current, { y: "100%" });
    // "Menu" sits in its natural position
    gsap.set(openLabelRef.current, { y: "0%" });
  }, []);

  return (
    <>
      {/* ── Nav bar ── */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-100">
        {/* Logo */}
        <div className="px-2.5 py-1.5 bg-(--fg) rounded-md cursor-pointer">
          <p className="font-mono text-sm tracking-wide  select-none">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="text-(--bg)"
            >
              Content ✦ Prompts
            </a>
          </p>
        </div>

        {/* Menu toggle button */}
        <div
          onClick={toggleMenu}
          className={`px-2.5 py-1.5 pb-2 rounded-md cursor-pointer transition-colors duration-200 ${
            isMenuOpen ? "bg-(--fg) text-(--bg)" : "bg-(--bg2) text-(--fg)"
          }`}
        >
          {/* Clip wrapper so labels slide through */}
          <div className="label-clip relative flex flex-col items-center h-4 w-14 overflow-hidden">
            <p
              ref={openLabelRef}
              className="font-mono text-sm tracking-wide select-none absolute top-0 "
            >
              Menu
            </p>
            <p
              ref={closeLabelRef}
              className="font-mono text-sm tracking-wide select-none absolute top-0"
            >
              Close
            </p>
          </div>
        </div>
      </nav>

      {/* ── Nav overlay ── */}
      <div
        ref={navOverlayRef}
        className="fixed top-0 left-0 w-full h-svh bg-(--bg2) overflow-hidden pointer-events-none opacity-0 z-30"
      >
        {/* Nav items — centred */}
        <div className="absolute top-[47.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.href}
                ref={(el) => (navItemRefs.current[i] = el)}
                className={`relative rounded-[0.5em] will-change-transform ${
                  isActive ? "bg-(--fg)" : "bg-(--bg)"
                }`}
              >
                <p className="text-[25px] md:text-[2rem] select-none">
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`block px-[0.5em] pt-[0.5em] pb-[0.3em] ${
                      isActive ? "text-(--bg)" : "text-(--fg)"
                    }`}
                  >
                    {link.label}
                  </a>
                </p>
              </div>
            );
          })}
        </div>

        {/* Nav footer */}
        <div className="absolute left-0 bottom-0 w-full p-4 md:p-8 flex justify-between items-end gap-6 ">
          {/* Find Me */}
          <div className="flex flex-col gap-2">
            <div
              ref={(el) => (headerRefs.current[0] = el)}
              className="relative flex justify-start gap-3"
            >
              <p className="font-mono text-xs md:text-sm tracking-wide select-none bg-(--bg) text-(--fg) px-[0.65em] py-[0.5em] rounded-[0.4em]">
                Find Us On
              </p>
            </div>
            <div
              ref={(el) => (copyRefs.current[0] = el)}
              className="relative flex flex-col md:flex-row justify-start gap-0.5 md:gap-3"
            >
              <p className="font-mono tracking-wide text-sm md:text-base">
                <a href="#" target="_blank" className="select-none">
                  Instagram
                </a>
              </p>
              <p className="font-mono tracking-wide text-sm md:text-base">
                <a href="#" target="_blank" className="select-none">
                  LinkedIn
                </a>
              </p>
            </div>
          </div>

          {/* Centre credit — hidden on mobile */}
          <div className="flex flex-col gap-2 max-[1000px]:hidden">
            <div
              ref={(el) => (copyRefs.current[1] = el)}
              className="relative flex justify-center gap-3"
            >
              <p className="font-mono text-xs tracking-wide select-none">
                © Content Prompts / 2026
              </p>
            </div>
          </div>

          {/* Say Hi */}
          <div className="flex flex-col gap-2">
            <div
              ref={(el) => (headerRefs.current[1] = el)}
              className="relative flex justify-end gap-3"
            >
              <p className="font-mono text-xs md:text-sm tracking-wide select-none bg-(--bg) text-(--fg) px-[0.65em] py-[0.5em] rounded-[0.4em]">
                Say Hi
              </p>
            </div>
            <div
              ref={(el) => (copyRefs.current[2] = el)}
              className="relative flex justify-end gap-3"
            >
              <p className="font-mono tracking-wide">
                <a
                  href="mailto:contentprompts@gmail.com"
                  target="_blank"
                  className="select-none text-sm md:text-base"
                >
                  Contentprompts@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

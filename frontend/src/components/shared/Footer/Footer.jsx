"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { FOOTER_NAV_COLUMNS, SOCIAL_LINKS } from "@/data/navigation";

gsap.registerPlugin(SplitText, ScrollTrigger);

// ─── Social icons — kept here as they are JSX (not serialisable to a data file) ──

const SOCIALS = [
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.find((s) => s.name === "LinkedIn")?.href,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.987V9h3.112v1.561h.046c.433-.82 1.49-1.684 3.067-1.684 3.279 0 3.884 2.157 3.884 4.966v6.609zM5.337 7.433a1.806 1.806 0 1 1 0-3.612 1.806 1.806 0 0 1 0 3.612zM6.762 20.452H3.91V9h2.852v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: SOCIAL_LINKS.find((s) => s.name === "Facebook")?.href,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: SOCIAL_LINKS.find((s) => s.name === "Instagram")?.href,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: SOCIAL_LINKS.find((s) => s.name === "Youtube")?.href,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const watermarkRef = useRef(null);

  useEffect(() => {
    const el = watermarkRef.current;
    if (!el) return;

    const split = SplitText.create(el, {
      type: "chars",
      charsClass: "wm-char",
    });

    gsap.set(split.chars, { y: "110%", opacity: 0 });

    // Refresh ScrollTrigger after layout settles so positions are accurate
    // for bottom-of-page elements that may already be in view on load
    const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom", // fire as soon as any part enters the viewport
      once: true,
      onEnter: () => {
        gsap.to(split.chars, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power4.out",
        });
      },
    });

    return () => {
      clearTimeout(refreshTimeout);
      trigger.kill();
      split.revert();
    };
  }, []);

  return (
    <footer className="relative w-full text-[#f5f5f5] bg-[#0c0c0c] overflow-hidden pt-16 pb-5 px-4 md:px-8 lg:px-10">
      {/* ── Top row ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-20">
        {/* ── Brand + description + socials ── */}
        <div className="flex flex-col gap-5 max-w-80 2xl:max-w-90">
          {/* Logo */}
          {/* <div className="flex items-center gap-2.5">
            <span className="text-[#f5f5f5] text-6xl font-medium">
              Icollect
            </span>
          </div> */}

          <div className="w-70 md:w-70">
            <Image
              src={"/logos/logo-wordmark-light.svg"}
              width={5000}
              height={5000}
              className="object-contain"
              alt="logo"
            />
          </div>

          {/* Tagline */}
          <p className="text-sm text-[#f5f5f5]/50 leading-relaxed">
            Full-funnel digital marketing for startups, D2C brands, and
            businesses that refuse to stay small. Strategy, content, and
            performance — all under one roof.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#f5f5f5]/20 flex items-center justify-center text-[#f5f5f5]/60 hover:text-[#f5f5f5] hover:border-[#f5f5f5]/50 transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ── */}
        <nav
          className="flex flex-wrap gap-7 md:gap-10 2xl:gap-20"
          aria-label="Footer navigation"
        >
          {FOOTER_NAV_COLUMNS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-3">
              <h4 className="text-[15px] md:text-base font-semibold text-[#f5f5f5]/80 tracking-[0.15em] mb-1">
                {heading}
              </h4>
              <ul className="flex flex-col gap-1.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[#f5f5f5]/65 hover:text-[#f5f5f5] transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Contact & Legal ── */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-[#f5f5f5]/80 tracking-[0.15em] mb-1">
              Contact & Legal
            </h4>

            <a
              href={`mailto:contentprompts@gmail.com`}
              className="text-sm text-[#f5f5f5]/65 hover:text-[#f5f5f5] transition-colors duration-200 mt-1"
            >
              contentprompts@gmail.com
            </a>

            <div className="h-px bg-[#f5f5f5]/10 my-1" />
            <a
              href="/privacy-policy"
              className="text-sm text-[#f5f5f5]/65 hover:text-[#f5f5f5] transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-[#f5f5f5]/65 hover:text-[#f5f5f5] transition-colors duration-200"
            >
              Terms & Conditions
            </a>
          </div>
        </nav>
      </div>

      {/* ── Watermark ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="w-full leading-none pointer-events-none select-none mb-[-0.1em] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 65%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 65%)",
        }}
      >
        <span
          ref={watermarkRef}
          className="font-bold text-[rgba(255,255,255,0.21)] text-[12.6vw] md:text-[14vw] lg:text-[12.5vw] 2xl:text-[12.9vw] whitespace-nowrap block"
          style={{ letterSpacing: "-0.01em" }}
        >
          Content Prompts
        </span>
      </div>
    </footer>
  );
}

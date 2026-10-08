"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ─── Config — change these without touching any other code ───────────────────
const WHATSAPP_NUMBER = "919910449552"; // country code + number, no + or spaces
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about your services.";
const LABEL = "Chat";
// ─────────────────────────────────────────────────────────────────────────────

const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Minimal WhatsApp speech-bubble SVG (custom path, not the logo font)
function WhatsAppIcon({ iconRef }) {
  return (
    <svg
      ref={iconRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: 15, height: 15, display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Outer bubble */}
      <path d="M12 2C6.477 2 2 6.364 2 11.714c0 1.89.542 3.656 1.482 5.15L2.05 21.293a.5.5 0 0 0 .637.637l4.543-1.42A10.07 10.07 0 0 0 12 21.43C17.523 21.43 22 17.064 22 11.714S17.523 2 12 2Z" />
      {/* Phone handset cut-out rendered as a lighter overlay via opacity */}
      <path
        d="M8.593 7.82c.19-.433.698-.63 1.134-.44l1.27.543c.41.175.617.635.48 1.057l-.46 1.413a.52.52 0 0 0 .144.543c.52.474 1.613 1.567 2.087 2.087a.52.52 0 0 0 .543.144l1.413-.46c.422-.137.882.07 1.057.48l.543 1.27c.19.436-.007.944-.44 1.134l-.97.425c-.87.381-1.87.11-2.497-.574C11.432 13.977 9.9 12.36 9.023 11c-.654-1.008-.8-2.22-.355-3.355l-.075.175Z"
        style={{ fill: "rgba(6,6,6,0.92)", opacity: 0.85 }}
      />
    </svg>
  );
}

export default function WhatsAppButton() {
  const wrapperRef = useRef(null);
  const btnRef    = useRef(null);
  const labelRef  = useRef(null);
  const iconRef   = useRef(null);

  // ── Entry animation on mount ──────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 24, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
      }
    );
  }, []);

  // ── Hover: bg flips to white, text/icon flip to dark ─────────────────────
  const handleMouseEnter = () => {
    gsap.to(btnRef.current, {
      backgroundColor: "#ffffff",
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to([labelRef.current, iconRef.current], {
      color: "#0f0f0f",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      backgroundColor: "rgba(6,6,6,0.92)",
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to([labelRef.current, iconRef.current], {
      color: "#ffffff",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  // ── Tap pulse on click ────────────────────────────────────────────────────
  const handleClick = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 0.93 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );
  };

  return (
    /* Outer glow-border wrapper — identical to HamburgerMenu outer div */
    <div
      ref={wrapperRef}
      className="fixed bottom-6 right-6 z-40 shadow-2xl"
      style={{ opacity: 0 }} /* starts invisible; GSAP fades in */
    >
      <div
        className="p-0.75 rounded-[7px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 100%)",
        }}
      >
        <a
          ref={btnRef}
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="rounded-[5px] flex items-center gap-2.5 cursor-pointer no-underline"
          style={{
            backgroundColor: "rgba(6,6,6,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "10px 16px",
            color: "#ffffff",
          }}
          aria-label="Chat with us on WhatsApp"
        >
          {/* Icon */}
          <WhatsAppIcon iconRef={iconRef} />

          {/* Label */}
          <span
            ref={labelRef}
            className="text-xs font-medium uppercase"
            style={{ letterSpacing: "0.12em", color: "#ffffff", whiteSpace: "nowrap" }}
          >
            {LABEL}
          </span>
        </a>
      </div>
    </div>
  );
}

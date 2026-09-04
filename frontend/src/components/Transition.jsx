"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

let _animateTransition = null;

export function animateTransition() {
  if (_animateTransition) return _animateTransition();
  return Promise.resolve();
}

// Three panels — each covers the full screen but offset in timing
const PANEL_COLORS = ["#141414", "#ed6a5a", "#edf1e8"];

export default function Transition() {
  const panelsRef = useRef([]);

  useEffect(() => {
    const panels = panelsRef.current;

    // ── Mount reveal: panels are covering the screen, peel them off upward ──
    gsap.set(panels, { yPercent: 0 });

    gsap.to(panels, {
      yPercent: -100,
      duration: 0.7,
      stagger: 0.08,
      ease: "power4.inOut",
    });

    // ── Imperative trigger for link navigation ──
    _animateTransition = () =>
      new Promise((resolve) => {
        // Reset panels below the screen
        gsap.set(panels, { yPercent: 100 });

        gsap.to(panels, {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power4.inOut",
          onComplete: resolve,
        });
      });

    return () => {
      _animateTransition = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-100000 pointer-events-none overflow-hidden">
      {PANEL_COLORS.map((color, i) => (
        <div
          key={i}
          ref={(el) => (panelsRef.current[i] = el)}
          className="absolute inset-0 will-change-transform"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

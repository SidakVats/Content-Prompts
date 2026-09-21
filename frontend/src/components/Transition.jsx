"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// ─── Shared imperative trigger ────────────────────────────────────────────────
// Stores { fn, clickX, clickY } so the grid knows where the click came from
let _trigger = null;

export function animateTransition(clickX = window.innerWidth / 2, clickY = window.innerHeight / 2) {
  if (_trigger) return _trigger(clickX, clickY);
  return Promise.resolve();
}

// ─── Grid config ─────────────────────────────────────────────────────────────
const COLS = 8;
const ROWS = 6;
const TILE_COLOR = "#000"; // brand yellow from preloader
const DOT_COLOR  = "#fff";

export default function Transition() {
  const gridRef      = useRef(null);
  const tilesRef     = useRef([]);
  const pathname     = usePathname();
  const isFirstMount = useRef(true);
  const clickOrigin  = useRef({ x: 0, y: 0 });

  // Build tiles once on mount
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const tiles = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = document.createElement("div");
        tile.style.cssText = `
          position: absolute;
          top:    ${(r / ROWS) * 100}%;
          left:   ${(c / COLS) * 100}%;
          width:  ${100 / COLS}%;
          height: ${100 / ROWS}%;
          background: ${TILE_COLOR};
          transform-origin: center;
          will-change: transform, opacity;
        `;

        // Tiny dot in center of each tile for texture
        const dot = document.createElement("span");
        dot.style.cssText = `
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: ${DOT_COLOR};
          opacity: 0.25;
        `;
        tile.appendChild(dot);
        grid.appendChild(tile);
        tiles.push(tile);
      }
    }
    tilesRef.current = tiles;

    // Hide all tiles initially
    gsap.set(tiles, { scale: 0, opacity: 1 });

    // ── Register imperative trigger ──
    _trigger = (cx, cy) =>
      new Promise((resolve) => {
        clickOrigin.current = { x: cx, y: cy };

        const W = window.innerWidth;
        const H = window.innerHeight;

        // Sort tiles by distance from click origin — nearest animates first
        const sorted = [...tiles].sort((a, b) => {
          const distA = distFromClick(a, cx, cy, W, H);
          const distB = distFromClick(b, cx, cy, W, H);
          return distA - distB;
        });

        // Kill any leftover tweens
        gsap.killTweensOf(tiles);

        // Phase 1: tiles scale in from click origin outward
        gsap.set(tiles, { scale: 0, opacity: 1 });
        gsap.to(sorted, {
          scale: 1,
          duration: 0.45,
          ease: "power3.inOut",
          stagger: {
            each: 0.018,
            from: 0, // already sorted by distance
          },
          onComplete: resolve, // resolve when last tile is fully in
        });
      });

    return () => {
      _trigger = null;
      tiles.forEach((t) => t.remove());
      tilesRef.current = [];
    };
  }, []);

  // ── Reveal new page: scatter tiles outward from origin ──
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const tiles = tilesRef.current;
    if (!tiles.length) return;

    const { x: cx, y: cy } = clickOrigin.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const sorted = [...tiles].sort((a, b) => {
      const distA = distFromClick(a, cx, cy, W, H);
      const distB = distFromClick(b, cx, cy, W, H);
      return distA - distB;
    });

    // Short pause so new page has time to mount, then scatter outward
    gsap.delayedCall(0.05, () => {
      gsap.to(sorted, {
        scale: 0,
        duration: 0.4,
        ease: "power3.inOut",
        stagger: {
          each: 0.015,
          from: sorted.length - 1, // reverse — furthest first on exit
        },
      });
    });
  }, [pathname]);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999 }}
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function distFromClick(tileEl, cx, cy, W, H) {
  const rect = tileEl.getBoundingClientRect();
  // Tile center in viewport coords
  const tx = rect.left + rect.width  / 2;
  const ty = rect.top  + rect.height / 2;
  return Math.hypot(tx - cx, ty - cy);
}

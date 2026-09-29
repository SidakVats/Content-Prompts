"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// ─── Shared imperative trigger ────────────────────────────────────────────────
let _trigger = null;

export function animateTransition(
  clickX = window.innerWidth / 2,
  clickY = window.innerHeight / 2
) {
  if (_trigger) return _trigger(clickX, clickY);
  return Promise.resolve();
}

// ─── Grid config ─────────────────────────────────────────────────────────────
const COLS = 8;
const ROWS = 6;
const TILE_COLOR = "#000";
const OVERLAP = 2; // px overlap to kill sub-pixel gaps

export default function Transition() {
  const gridRef      = useRef(null);
  const tilesRef     = useRef([]);
  const pathname     = usePathname();
  const isFirstMount = useRef(true);
  const clickOrigin  = useRef({ x: 0, y: 0 });

  // ── Build tile grid once ──────────────────────────────────────────────────
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const buildTiles = () => {
      // Remove old tiles if rebuilding on resize
      tilesRef.current.forEach((t) => t.remove());
      tilesRef.current = [];

      const W = window.innerWidth;
      const H = window.innerHeight;
      // Use ceil + overlap so tiles fully cover without gaps
      const tileW = Math.ceil(W / COLS) + OVERLAP;
      const tileH = Math.ceil(H / ROWS) + OVERLAP;

      const tiles = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tile = document.createElement("div");
          tile.style.cssText = `
            position: absolute;
            top:    ${r * Math.ceil(H / ROWS)}px;
            left:   ${c * Math.ceil(W / COLS)}px;
            width:  ${tileW}px;
            height: ${tileH}px;
            background: ${TILE_COLOR};
            will-change: transform, opacity;
          `;
          // Small dot for texture
          const dot = document.createElement("span");
          dot.style.cssText = `
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%,-50%);
            width: 3px; height: 3px;
            border-radius: 50%;
            background: rgba(0,0,0,0.2);
          `;
          tile.appendChild(dot);
          grid.appendChild(tile);
          tiles.push(tile);
        }
      }

      tilesRef.current = tiles;
      gsap.set(tiles, { scale: 0, opacity: 1 });
    };

    buildTiles();

    // Rebuild on resize so pixel sizes stay accurate
    const onResize = () => buildTiles();
    window.addEventListener("resize", onResize);

    // ── Imperative trigger — called by nav links ──
    _trigger = (cx, cy) =>
      new Promise((resolve) => {
        clickOrigin.current = { x: cx, y: cy };

        const tiles = tilesRef.current;
        const W = window.innerWidth;
        const H = window.innerHeight;

        // Sort by distance from click — nearest first
        const withDist = tiles.map((tile, idx) => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          const tx  = col * Math.ceil(W / COLS) + Math.ceil(W / COLS) / 2;
          const ty  = row * Math.ceil(H / ROWS) + Math.ceil(H / ROWS) / 2;
          return { tile, dist: Math.hypot(tx - cx, ty - cy) };
        });
        withDist.sort((a, b) => a.dist - b.dist);
        const sorted = withDist.map((d) => d.tile);

        gsap.killTweensOf(tiles);
        gsap.set(tiles, { scale: 0, opacity: 1, transformOrigin: "center center" });

        gsap.to(sorted, {
          scale: 1,
          duration: 0.5,
          ease: "power3.inOut",
          stagger: { each: 0.016, from: 0 },
          onComplete: resolve,
        });
      });

    return () => {
      _trigger = null;
      window.removeEventListener("resize", onResize);
      tilesRef.current.forEach((t) => t.remove());
      tilesRef.current = [];
    };
  }, []);

  // ── Reveal new page: collapse tiles outward from origin ──────────────────
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

    const withDist = tiles.map((tile, idx) => {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const tx  = col * Math.ceil(W / COLS) + Math.ceil(W / COLS) / 2;
      const ty  = row * Math.ceil(H / ROWS) + Math.ceil(H / ROWS) / 2;
      return { tile, dist: Math.hypot(tx - cx, ty - cy) };
    });
    withDist.sort((a, b) => a.dist - b.dist);
    // Reverse: furthest tiles disappear first on exit
    const sorted = withDist.map((d) => d.tile).reverse();

    gsap.delayedCall(0.05, () => {
      gsap.to(sorted, {
        scale: 0,
        duration: 0.45,
        ease: "power3.inOut",
        stagger: { each: 0.014, from: 0 },
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

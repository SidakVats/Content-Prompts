"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import GrowthSection from "@/components/index/GrowthSection/GrowthSection";

gsap.registerPlugin(Flip, SplitText);

export default function PreloaderHero() {
  const preloaderRef = useRef(null);
  const preloaderBgRef = useRef(null);
  const preloaderGridRef = useRef(null);
  const progressMarkerRef = useRef(null);
  // Controls React unmount of preloader — never call .remove() on the node directly
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Force video playback — autoplay can silently fail on new devices
  useEffect(() => {
    const video = document.querySelector(".hero-video");
    if (video) {
      video.play().catch(() => {
        // Autoplay was blocked — attempt play on first user interaction
        const playOnInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener("click", playOnInteraction);
          document.removeEventListener("touchstart", playOnInteraction);
        };
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("touchstart", playOnInteraction, { once: true });
      });
    }
  }, []);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const preloaderBg = preloaderBgRef.current;
    const preloaderGrid = preloaderGridRef.current;
    const progressMarker = progressMarkerRef.current;

    // ── Once-per-session: skip preloader if already seen ──
    const hasSeenPreloader = sessionStorage.getItem("preloader-done");
    if (hasSeenPreloader) {
      // Already seen — skip preloader entirely via React state
      setPreloaderDone(true);
      // Defer SplitText calls until after React has committed the DOM
      const raf = requestAnimationFrame(() => {
        const titleEl = document.querySelector(".hero-title h1");
        const subtitleEl = document.querySelector(".hero-subtitle h3");
        const menuEl = document.querySelector(".menu-label");

        const splitCopy = (el, type, className) => {
          if (!el) return { [type]: [] };
          return SplitText.create(el, {
            type,
            [`${type}Class`]: className,
            mask: type,
          });
        };

        const titleChars = splitCopy(titleEl, "chars", "char").chars;
        const subtitleLines = splitCopy(subtitleEl, "lines", "line").lines;
        const menuWord = menuEl ? splitCopy(menuEl, "words", "word").words : [];

        const targets = [...titleChars, ...subtitleLines, ...menuWord].filter(
          Boolean,
        );
        if (targets.length) gsap.set(targets, { y: "0%" });
      });
      return () => cancelAnimationFrame(raf);
    }

    const isDesktop = window.innerWidth >= 1000;
    const maxTileSize = isDesktop ? 85 : 50;

    const snapToOdd = (value) => (value % 2 === 0 ? value - 1 : value);
    const columnCount = snapToOdd(Math.floor(window.innerWidth / maxTileSize));
    const rowCount = snapToOdd(Math.floor(window.innerHeight / maxTileSize));

    const tileSize = Math.min(
      window.innerWidth / columnCount,
      window.innerHeight / rowCount,
    );

    const totalColumns = columnCount + 2;
    const totalRows = rowCount + 2;

    preloaderGrid.style.width = `${totalColumns * tileSize}px`;
    preloaderGrid.style.height = `${totalRows * tileSize}px`;

    const tiles = [];
    for (let i = 0; i < totalColumns * totalRows; i++) {
      const tile = document.createElement("div");
      tile.style.width = `${tileSize}px`;
      tile.style.height = `${tileSize}px`;
      tile.style.backgroundColor = "#EFD2AC";
      tile.style.outline = "0.05px solid #EFD2AC";
      tile.style.willChange = "transform, opacity";
      preloaderGrid.appendChild(tile);
      tiles.push(tile);
    }

    const middleRow = Math.floor(totalRows / 2);
    const centerColumn = Math.floor(totalColumns / 2);
    const tileAtColumn = (column) => tiles[middleRow * totalColumns + column];

    const firstStop = tileAtColumn(centerColumn - (isDesktop ? 5 : 2));
    const secondStop = tileAtColumn(centerColumn + (isDesktop ? 3 : 1));
    const thirdStop = tileAtColumn(centerColumn + (isDesktop ? 5 : 2));
    const finalStop = tileAtColumn(centerColumn);

    const markerStops = [firstStop, secondStop, thirdStop, finalStop];
    markerStops.forEach((tile) => {
      tile.style.backgroundColor = "#fff";
      tile.style.outline = "none";
    });

    const fadeInTiles = tiles.filter((tile) => !markerStops.includes(tile));
    gsap.set(fadeInTiles, { opacity: 0 });
    gsap.set(markerStops, { opacity: 0 });
    gsap.set(progressMarker, { width: tileSize, height: tileSize });

    const gridWidth = totalColumns * tileSize;
    const gridHeight = totalRows * tileSize;
    const gridLeft = (preloader.offsetWidth - gridWidth) / 2;
    const gridTop = (preloader.offsetHeight - gridHeight) / 2;

    const getTileOffset = (tile) => {
      const tileIndex = tiles.indexOf(tile);
      const tileCol = tileIndex % totalColumns;
      const tileRow = Math.floor(tileIndex / totalColumns);
      return {
        left: gridLeft + tileCol * tileSize,
        top: gridTop + tileRow * tileSize,
      };
    };

    gsap.set(progressMarker, getTileOffset(firstStop));

    // Collect all Flip animations so we can kill them on cleanup
    const flipAnimations = [];
    const isDev = process.env.NODE_ENV === "development";

    // moveMarkerTo uses Flip — in dev mode skip Flip.from() entirely so
    // HMR remounts never trigger the insertBefore crash.
    function moveMarkerTo(tile, html) {
      if (!document.body.contains(progressMarker)) return;
      if (!document.body.contains(tile)) return;
      const startState = isDev ? null : Flip.getState(progressMarker);
      gsap.set(progressMarker, getTileOffset(tile));
      const child = progressMarker.querySelector("p, img");
      if (child) child.outerHTML = html;
      if (!isDev) {
        const flipAnim = Flip.from(startState, {
          duration: 1,
          ease: "power1.out",
        });
        flipAnimations.push(flipAnim);
      }
    }

    const splitCopy = (selector, type, className) => {
      const el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!el) return { chars: [], lines: [], words: [] };
      return SplitText.create(el, {
        type,
        [`${type}Class`]: className,
        mask: type,
      });
    };

    const titleChars = splitCopy(".hero-title h1", "chars", "char").chars;
    const subtitleLines = splitCopy(".hero-subtitle h3", "lines", "line").lines;
    const menuWord = splitCopy(".menu-label", "words", "word").words;

    const splitTargets = [...titleChars, ...subtitleLines, ...menuWord].filter(
      Boolean,
    );
    if (splitTargets.length) gsap.set(splitTargets, { y: "100%" });

    const timeline = gsap.timeline({ delay: 1 });

    // Phase 1 — tiles fade in
    timeline.to(
      fadeInTiles,
      {
        opacity: 1,
        duration: 0.125,
        stagger: { each: 2.5 / fadeInTiles.length, from: "random" },
      },
      0,
    );

    // Reveal firstStop immediately (marker starts there)
    timeline.set(firstStop, { opacity: 1 }, 0);
    // Reveal the progress marker at the same moment as firstStop
    timeline.set(progressMarker, { opacity: 1 }, 0);
    // Reveal secondStop just before marker moves to it
    timeline.set(secondStop, { opacity: 1 }, 0.24);
    // Reveal thirdStop just before marker moves to it
    timeline.set(thirdStop, { opacity: 1 }, 1.49);
    // Reveal finalStop just before marker moves to it
    timeline.set(finalStop, { opacity: 1 }, 2.74);

    // Phase 2 — marker stops fade back to tile color
    timeline.to(
      [firstStop, secondStop, thirdStop],
      {
        backgroundColor: "#EFD2AC",
        duration: 0.125,
        stagger: 0.25,
      },
      2.75,
    );

    // Phase 3 — progress marker moves (Flip — nodes must still be in DOM)
    timeline.add(() => moveMarkerTo(secondStop, "<p>50</p>"), 0.25);
    timeline.add(() => moveMarkerTo(thirdStop, "<p>75</p>"), 1.5);
    timeline.add(
      () =>
        moveMarkerTo(
          finalStop,
          `<img src="/logos/logo-preloader.png" alt="" style="width:50%;height:50%;object-fit:contain;" />`,
        ),
      2.75,
    );

    // Phase 4 — hide background rect via style, don't remove (React owns the node)
    timeline.add(() => {
      if (preloaderBg) preloaderBg.style.display = "none";
    }, "+=0.1");

    // Phase 5 — tiles collapse
    const collapsingTiles = tiles.filter((tile) => tile !== finalStop);
    timeline.to(
      collapsingTiles,
      {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.75,
        stagger: { each: 0.0035, from: "random" },
        ease: "power3.out",
      },
      "+=0.5",
    );

    timeline.to(
      [finalStop, progressMarker],
      { scaleY: 0, transformOrigin: "top", duration: 0.75, ease: "power3.out" },
      "<",
    );

    // Phase 6 — hero text reveals (preloader still in DOM so z-index stacks correctly)
    timeline.to(
      titleChars,
      {
        y: "0%",
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.05, from: "random" },
      },
      "<1",
    );
    timeline.to(
      subtitleLines,
      { y: "0%", duration: 1, ease: "power3.out", stagger: 0.1 },
      "<0.5",
    );
    timeline.to(
      menuWord,
      { y: "0%", duration: 1, ease: "power3.out", stagger: 0.075 },
      "<0.25",
    );

    // Phase 7 — let React unmount the preloader shell (never call .remove() on React nodes)
    timeline.add(() => {
      sessionStorage.setItem("preloader-done", "1");
      setPreloaderDone(true);
    });

    return () => {
      timeline.kill();
      flipAnimations.forEach((anim) => anim && anim.kill());
      gsap.killTweensOf(progressMarker);
      gsap.killTweensOf(tiles);
      while (preloaderGrid.firstChild) {
        preloaderGrid.removeChild(preloaderGrid.firstChild);
      }
    };
  }, []);

  return (
    <>
      {/* Preloader — rendered by React, removed by React via state */}
      {!preloaderDone && (
        <div
          ref={preloaderRef}
          className="preloader fixed top-0 left-0 w-full h-svh overflow-hidden z-100"
        >
          <div
            ref={preloaderBgRef}
            className="absolute w-full h-full bg-[#e1e1e1] z-0"
          />
          <div
            ref={preloaderGridRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap z-1"
          />
          <div
            ref={progressMarkerRef}
            className="progress-marker absolute top-0 left-0 z-2 flex items-center justify-center bg-white font-mono font-medium text-[0.85rem] text-black will-change-transform"
            style={{ opacity: 0 }}
          >
            <p>25</p>
          </div>
        </div>
      )}

      {/* ── Menu button ── */}
      {/* <MenuNav /> */}

      {/* Hero */}
      <section className="relative w-full h-svh p-10 max-md:p-4 flex justify-between items-end max-md:flex-col max-md:justify-end max-md:items-start max-md:gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-video w-full h-full object-cover"
          >
            <source src="/hero/hero-footage.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-title relative z-1">
          <h1 className="text-[#e9e8e8] uppercase leading-[0.8] font-medium text-[10.5vw] md:text-[7vw] tracking-tight">
            Content
          </h1>
          <h1 className="text-[#e9e8e8] uppercase leading-[0.8] font-medium text-[15vw] md:text-[10vw] tracking-tight">
            Prompts
          </h1>
        </div>

        <div className="hero-subtitle relative z-1">
          <h3 className="text-white font1 leading-[0.9] uppercase tracking-tighter lg:w-90 lg:text-[3vw] 2xl:w-100 text-[9vw] 2xl:text-[2vw]">
            Prompted by Strategy. Powered by Creativity.
          </h3>
        </div>
      </section>

      {/* <Brands /> */}
      <GrowthSection />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Flip, SplitText);

export default function PreloaderHero() {
  const preloaderRef = useRef(null);
  const preloaderBgRef = useRef(null);
  const preloaderGridRef = useRef(null);
  const progressMarkerRef = useRef(null);
  const plusRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const next = !prev;
      gsap.to(plusRef.current, {
        rotation: next ? 45 : 0,
        duration: 0.4,
        ease: "power3.out",
      });
      return next;
    });
  };

  useEffect(() => {
    const preloader = preloaderRef.current;
    const preloaderBg = preloaderBgRef.current;
    const preloaderGrid = preloaderGridRef.current;
    const progressMarker = progressMarkerRef.current;

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
      tile.style.backgroundColor = "#c4d600";
      tile.style.outline = "0.05px solid #c4d600";
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
      tile.style.outline = "0.05px solid #fff";
    });

    const fadeInTiles = tiles.filter((tile) => !markerStops.includes(tile));
    gsap.set(fadeInTiles, { opacity: 0 });
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

    function moveMarkerTo(tile, html) {
      const startState = Flip.getState(progressMarker);
      gsap.set(progressMarker, getTileOffset(tile));
      const child = progressMarker.querySelector("p, img");
      if (child) child.outerHTML = html;
      Flip.from(startState, { duration: 1, ease: "power1.out" });
    }

    const splitCopy = (selector, type, className) =>
      SplitText.create(selector, {
        type,
        [`${type}Class`]: className,
        mask: type,
      });

    const titleChars = splitCopy(".hero-title h1", "chars", "char").chars;
    const subtitleLines = splitCopy(".hero-subtitle h3", "lines", "line").lines;
    const menuWord = splitCopy(".menu-label", "words", "word").words;

    gsap.set([titleChars, subtitleLines, menuWord], { y: "100%" });

    const timeline = gsap.timeline({ delay: 1 });

    timeline.to(
      fadeInTiles,
      {
        opacity: 1,
        duration: 0.125,
        stagger: { each: 2.5 / fadeInTiles.length, from: "random" },
      },
      0,
    );

    timeline.fromTo(
      [firstStop, secondStop, thirdStop],
      { backgroundColor: "#ffffff" },
      {
        backgroundColor: "#C4D600",
        duration: 0.125,
        stagger: 0.25,
      },
      2.75,
    );

    timeline.add(() => moveMarkerTo(secondStop, "<p>50</p>"), 0.25);
    timeline.add(() => moveMarkerTo(thirdStop, "<p>75</p>"), 1.5);
    timeline.add(
      () =>
        moveMarkerTo(
          finalStop,
          `<img src="/logo.png" alt="" style="width:50%;height:50%;object-fit:contain;" />`,
        ),
      2.75,
    );

    timeline.add(() => preloaderBg.remove());

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

    return () => {
      timeline.kill();
      while (preloaderGrid.firstChild) {
        preloaderGrid.removeChild(preloaderGrid.firstChild);
      }
    };
  }, []);

  return (
    <>
      {/* Preloader */}
      <div
        ref={preloaderRef}
        className="preloader fixed top-0 left-0 w-full h-svh overflow-hidden z-2"
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
        >
          <p>25</p>
        </div>
      </div>

      {/* ── Menu button ── */}
      <nav className="fixed top-6 right-6 z-50">
        {/* Outer ring */}
        <div
          className="rounded-lg p-1"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        >
          {/* Inner button */}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-between bg-black/80 px-4 py-2.5 rounded-[5px] cursor-pointer"
            style={{
              width: "160px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span className="overflow-hidden" style={{ lineHeight: 0 }}>
              <span
                className="menu-label block font3 text-xs text-white uppercase"
                style={{
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                }}
              >
                Menu
              </span>
            </span>
            <span
              ref={plusRef}
              className="text-white select-none inline-block"
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

      {/* Hero */}
      <section className="relative w-full h-svh p-10 max-md:p-8 flex justify-between items-end max-md:flex-col max-md:justify-end max-md:items-start max-md:gap-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            src="/hero-video.mp4"
            width="100%"
            height="auto"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <div className="hero-title relative z-1">
          <h1 className="text-[#c4d600] font-extrabold uppercase leading-[0.8] text-[clamp(3rem,6.5vw,25rem)] tracking-tight">
            Content
          </h1>
          <h1 className="text-[#c4d600] font-extrabold uppercase leading-[0.8] text-[clamp(3rem,9.5vw,25rem)] tracking-tight">
            Prompts
          </h1>
        </div>

        <div className="hero-subtitle relative z-1">
          <h3 className="text-white font1 leading-tight tracking-wide w-120 text-[clamp(2rem,1vw,4rem)]">
            Prompted by Strategy. Powered by Creativity.
          </h3>
        </div>
      </section>
    </>
  );
}

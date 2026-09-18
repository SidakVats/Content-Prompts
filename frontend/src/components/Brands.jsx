"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const BRANDS_BASE = [
  {
    grayscaleImage: "/clientLogos/aditya birla _b&W.png",
    colorImage: "/clientLogos/aditya birla.png",
    name: "Aditya Birla",
  },
  {
    grayscaleImage: "/clientLogos/cred_b&w.png",
    colorImage: "/clientLogos/cred.png",
    name: "CRED",
  },
  {
    grayscaleImage: "/clientLogos/EVALUESERVE_b&w.png",
    colorImage: "/clientLogos/EVALUESERVE.png",
    name: "EValueServe",
  },
  {
    grayscaleImage: "/clientLogos/indiabulls_b&w.png",
    colorImage: "/clientLogos/indiabulls.png",
    name: "Indiabulls",
  },
  {
    grayscaleImage: "/clientLogos/intercell_b&w.png",
    colorImage: "/clientLogos/intercell.png",
    name: "Intercell",
  },
  {
    grayscaleImage: "/clientLogos/luxofy_B&w.png",
    colorImage: "/clientLogos/luxofy.png",
    name: "Luxofy",
  },
  {
    grayscaleImage: "/clientLogos/stasfin_B&W.png",
    colorImage: "/clientLogos/stasfin.png",
    name: "Stasfin",
  },
  {
    grayscaleImage: "/clientLogos/tide_b&w.png",
    colorImage: "/clientLogos/tide.png",
    name: "Tide",
  },
];

// Duplicate so the seamless loop always fills wide screens
const BRANDS = [...BRANDS_BASE, ...BRANDS_BASE];

function BrandLogo({ item }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer flex items-center justify-center"
      style={{ width: "200px", height: "100px" }}
    >
      {/* Grayscale */}
      <img
        src={item.grayscaleImage}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-contain opacity-50 transition-opacity duration-300 group-hover:opacity-0"
      />
      {/* Colour on hover */}
      <img
        src={item.colorImage}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}

function InfiniteMarquee({ items, speed = "slow", pauseOnHover = true }) {
  const scrollerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const durations = { fast: "30s", normal: "60s", slow: "120s" };
    el.style.setProperty("--marquee-duration", durations[speed] ?? "120s");

    setReady(true);
  }, [speed]);

  const pause = () => {
    if (pauseOnHover && scrollerRef.current)
      scrollerRef.current.style.animationPlayState = "paused";
  };
  const resume = () => {
    if (pauseOnHover && scrollerRef.current)
      scrollerRef.current.style.animationPlayState = "running";
  };

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        ref={scrollerRef}
        className={`flex items-center gap-10 md:gap-14 w-max ${ready ? "animate-marquee" : ""}`}
      >
        {/* Render the list twice inside the scroller for seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <BrandLogo key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Brands() {
  return (
    <section className="w-full text-center bg-black px-5 pb-16 md:pb-24">
      <p className="text-xl md:text-5xl tracking-wide text-white mb-2">
        Trusted by leading enterprises
      </p>
      <p className="text-xs md:text-lg tracking-widest text-white mb-12">
        Powering mission-critical workflows for global teams that demand
        reliability, security, and scale
      </p>
      <InfiniteMarquee items={BRANDS_BASE} speed="slow" />
    </section>
  );
}

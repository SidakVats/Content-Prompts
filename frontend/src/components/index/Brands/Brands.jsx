"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BRANDS } from "@/data/brands";

function BrandLogo({ item }) {
  return (
    <div className="group shrink-0 cursor-pointer flex items-center justify-center w-40 h-14 2xl:w-50 2xl:h-18">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
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
        className={`flex items-center gap-5 md:gap-20 w-max ${ready ? "animate-marquee" : ""}`}
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
      <InfiniteMarquee items={BRANDS} speed="slow" />
    </section>
  );
}

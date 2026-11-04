"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES_CARDS } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_STRENGTH = 40;

// Card dimensions — desktop
const W = 370; // card width  (px)
const H = 430; // card height (px)
const D = 340; // card depth  (px)

// Card dimensions — mobile (compact)
const W_M = 300;
const H_M = 340;
const D_M = 260;

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 640;
}

function FaceContent({ tag, title, description, price, thumbImg, compact }) {
  // Derive a clean name from the image filename for the alt text
  const imgName = thumbImg.split("/").pop().replace(/\.[^/.]+$/, "");

  return (
    <>
      {/* Thumbnail — fixed height, never grows */}
      <img
        src={thumbImg}
        alt={imgName}
        className={
          compact
            ? "self-end w-[50%] h-40 mb-1 object-cover block rounded-lg shrink-0"
            : "self-end w-40 h-44 mb-2 object-cover block rounded-xl shrink-0"
        }
      />

      {/* Tag */}
      <span
        className={`font-medium tracking-[0.15em] text-neutral-400 mb-1 block shrink-0 ${
          compact ? "text-[0.55rem]" : "text-[0.6rem]"
        }`}
      >
        {tag}
      </span>

      {/* Title */}
      <h2
        className={`font-bold leading-tight shrink-0 ${
          compact ? "text-[1.25rem] mb-1" : "text-[1.5rem] mb-1.5"
        }`}
      >
        {title}
      </h2>

      {/* Description — clamp so it never overflows the card */}
      <p
        className={`text-neutral-600 leading-relaxed flex-1 overflow-hidden ${
          compact
            ? "mb-2 line-clamp-3 text-[0.72rem]"
            : "text-[0.78rem] mb-3 line-clamp-4"
        }`}
      >
        {description}
      </p>

      {/* Divider — always visible, never pushed off */}
      <div
        className={`h-px bg-neutral-200 shrink-0 ${compact ? "mb-2" : "mb-3"}`}
      />

      {/* Price row */}
      <div className="flex items-end justify-between shrink-0">
        <div>
          <p
            className={`tracking-widest text-neutral-400 mb-0.5 ${
              compact ? "text-[0.6rem]" : "text-[0.7rem]"
            }`}
          >
            Starting from
          </p>
          <p
            className={`font-semibold tracking-tight text-black ${
              compact ? "text-[0.82rem]" : "text-[0.95rem]"
            }`}
          >
            {price}
          </p>
        </div>
        {/* Arrow */}
        <div
          className={`rounded bg-black text-white flex gap-1.5 items-center justify-center shrink-0 w-24 text-sm ${
            compact ? "h-6" : "h-7"
          }`}
        >
          Reach Us
          <svg
            className={
              compact
                ? "w-2.5 h-2.5 text-white"
                : "w-3 h-3 text-white -rotate-40"
            }
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="0" y1="12" x2="20" y2="12" />
            <polyline points="14 6 20 12 14 18" />
          </svg>
        </div>
      </div>
    </>
  );
}

function Card({
  tag,
  title,
  description,
  price,
  thumbImg,
  index,
  sideGradient,
}) {
  const cubeRef = useRef(null);
  const wrapperRef = useRef(null);
  const isMobile = useRef(false);
  const [mobile, setMobile] = useState(false);

  // ── Reveal animation ──────────────────────────────────
  useEffect(() => {
    const m = getIsMobile();
    isMobile.current = m;
    setMobile(m);
    const el = wrapperRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: (index % 4) * 0.08,
        scrollTrigger: {
          trigger: el,
          scroller: (() => {
            let p = el.parentElement;
            while (p) {
              const oy = window.getComputedStyle(p).overflowY;
              if (
                (oy === "auto" || oy === "scroll") &&
                p.scrollHeight > p.clientHeight
              )
                return p;
              p = p.parentElement;
            }
            return window;
          })(),
          start: "top 88%",
          once: true,
        },
      },
    );

    // Only kill this card's own trigger — never all triggers globally
    return () => tween.scrollTrigger?.kill();
  }, [index]);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const mobile = getIsMobile();
    const cardD = mobile ? D_M : D;
    const cardW = mobile ? W_M : W;
    const cardH = mobile ? H_M : H;

    const rotation = { flip: 0, tiltX: 0, tiltY: 0 };
    let isFlipped = false;

    function render() {
      gsap.set(cube, {
        rotationX: rotation.flip + rotation.tiltX,
        rotationY: rotation.tiltY,
        z: -cardD / 2,
      });
    }
    render();

    function onEnter() {
      isFlipped = false;
      gsap.killTweensOf(rotation);
      gsap.to(rotation, {
        flip: 180,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete() {
          isFlipped = true;
        },
      });
    }

    function onLeave() {
      isFlipped = false;
      gsap.killTweensOf(rotation);
      gsap.to(rotation, {
        flip: 0,
        tiltX: 0,
        tiltY: 0,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: render,
      });
    }

    function onMove(e) {
      if (!isFlipped) return;
      const bounds = cube.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const ox = (e.clientX - cx) / bounds.width;
      const oy = (e.clientY - cy) / bounds.height;

      gsap.to(rotation, {
        tiltY: ox * PARALLAX_STRENGTH,
        tiltX: -oy * PARALLAX_STRENGTH,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
        onUpdate: render,
      });
    }

    cube.addEventListener("mouseenter", onEnter);
    cube.addEventListener("mouseleave", onLeave);
    cube.addEventListener("mousemove", onMove);

    return () => {
      cube.removeEventListener("mouseenter", onEnter);
      cube.removeEventListener("mouseleave", onLeave);
      cube.removeEventListener("mousemove", onMove);
      gsap.killTweensOf(rotation);
    };
  }, []);

  const cardW = mobile ? W_M : W;
  const cardH = mobile ? H_M : H;
  const cardD = mobile ? D_M : D;

  return (
    /* Perspective wrapper */
    <div
      ref={wrapperRef}
      className="w-full"
      style={{
        maxWidth: mobile ? "100%" : cardW,
        height: cardH,
        perspective: "2000px",
      }}
    >
      {/* Cube */}
      <div
        ref={cubeRef}
        className="otsuka-cube relative w-full h-full cursor-pointer"
      >
        {/* Front */}
        <div
          className="otsuka-face absolute bg-white flex flex-col rounded-2xl border border-slate-200 overflow-hidden"
          style={{
            width: "100%",
            height: cardH,
            padding: mobile ? "8px" : "16px",
            transform: `translateZ(${cardD / 2}px)`,
          }}
        >
          <FaceContent
            tag={tag}
            title={title}
            description={description}
            price={price}
            thumbImg={thumbImg}
            compact={mobile}
          />
        </div>

        {/* Back — backface-visibility:hidden (set in globals.css via .otsuka-face)
            keeps this invisible until the cube flips to show it */}
        <div
          className="otsuka-face absolute bg-white flex flex-col rounded-2xl border border-slate-200 overflow-hidden"
          style={{
            width: "100%",
            height: cardH,
            padding: mobile ? "8px" : "16px",
            transform: `rotateX(180deg) translateZ(${cardD / 2}px)`,
          }}
        >
          <FaceContent
            tag={tag}
            title={title}
            description={description}
            price={price}
            thumbImg={thumbImg}
            compact={mobile}
          />
        </div>

        {/* Right */}
        <div
          className="otsuka-face absolute rounded-2xl"
          style={{
            width: cardD,
            height: cardH,
            left: (cardW - cardD) / 2,
            background: sideGradient,
            transform: `rotateY(90deg) translateZ(${cardW / 2}px)`,
          }}
        />

        {/* Left */}
        <div
          className="otsuka-face absolute rounded-2xl"
          style={{
            width: cardD,
            height: cardH,
            left: (cardW - cardD) / 2,
            background: sideGradient,
            transform: `rotateY(-90deg) translateZ(${cardW / 2}px)`,
          }}
        />

        {/* Top */}
        <div
          className="otsuka-face absolute rounded-2xl"
          style={{
            width: cardW,
            height: cardD,
            top: (cardH - cardD) / 2,
            background: sideGradient,
            transform: `rotateX(90deg) translateZ(${cardH / 2}px)`,
          }}
        />

        {/* Bottom */}
        <div
          className="otsuka-face absolute rounded-2xl"
          style={{
            width: cardW,
            height: cardD,
            top: (cardH - cardD) / 2,
            background: sideGradient,
            transform: `rotateX(-90deg) translateZ(${cardH / 2}px)`,
          }}
        />
      </div>
    </div>
  );
}

export default function ServiceCards() {
  return (
    <section className="relative w-full bg-[#edeee8] py-16 sm:py-24 px-5 sm:px-16 2xl:px-32 overflow-hidden">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-10 justify-items-center sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {SERVICES_CARDS.map((card, i) => (
          <Card key={i} index={i} {...card} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
  {
    tag: "High ROI",
    title: "SEO Strategy",
    description:
      "Dominate search rankings with data-driven SEO strategies tailored to your industry. Keyword research, on-page optimisation, technical audits, and back-link building to drive organic traffic.",
    price: "₹8,000 – ₹15,000/mo",
    thumbImg: "/OtsukaCards/SEO Strategy.avif",
    // Forest green → teal — SEO growth feel
    sideGradient:
      "linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)",
  },
  {
    tag: "Evergreen",
    title: "Content Writing",
    description:
      "Words that inform, engage, and convert. SEO-optimised blogs, website copy, product descriptions, and long-form articles that speak your brand voice.",
    price: "₹500 – ₹2,000",
    thumbImg: "/OtsukaCards/Content Writing.avif",
    // Warm amber → ochre — editorial, warmth
    sideGradient:
      "linear-gradient(135deg, #b5451b 0%, #d4793a 50%, #e8a45a 100%)",
  },
  {
    tag: "Video Growth",
    title: "YouTube Marketing",
    description:
      "From channel setup and optimisation to scripting, thumbnail strategy, and growth tactics. We manage your YouTube presence end to end.",
    price: "₹10,000 – ₹50,000/mo",
    thumbImg: "/OtsukaCards/YouTube Marketing.avif",
    // YouTube red gradient
    sideGradient:
      "linear-gradient(135deg, #9b0000 0%, #cc0000 45%, #ff4444 100%)",
  },
  {
    tag: "B2B Leads",
    title: "LinkedIn Marketing",
    description:
      "Build a powerful professional brand on LinkedIn. Thought leadership posts, company pages, targeted B2B campaigns, and high-quality lead generation.",
    price: "₹8,000 – ₹20,000/mo",
    thumbImg: "/OtsukaCards/LinkedIn Marketing.avif",
    // LinkedIn blue gradient
    sideGradient:
      "linear-gradient(135deg, #003f72 0%, #0077b5 50%, #00a0dc 100%)",
  },
  {
    tag: "Most Reach",
    title: "Facebook Marketing",
    description:
      "Reach billions of potential customers with precision-targeted Facebook campaigns — page management, content calendars, audience research, and paid ad creatives.",
    price: "₹8,000 – ₹18,000/mo",
    thumbImg: "/OtsukaCards/Facebook Marketing.avif",
    // Facebook deep blue gradient
    sideGradient:
      "linear-gradient(135deg, #1a3a6b 0%, #1877f2 50%, #4298f5 100%)",
  },
  {
    tag: "Visual Brand",
    title: "Instagram Marketing",
    description:
      "Trending Reels, Stories, carousels, and feed posts aligned with your brand aesthetic — driving engagement, discoverability, and conversions.",
    price: "₹7,000 – ₹18,000/mo",
    thumbImg: "/OtsukaCards/Instagram Marketing.avif",
    // Instagram purple → pink → orange
    sideGradient:
      "linear-gradient(135deg, #833ab4 0%, #c13584 35%, #e1306c 65%, #fd5949 100%)",
  },
  {
    tag: "Done For You",
    title: "Social Media Management",
    description:
      "Full-service management across all platforms — content planning, scheduling, community engagement, comment moderation, and monthly performance reporting.",
    price: "₹12,000 – ₹35,000/mo",
    thumbImg: "/OtsukaCards/Social Media Management.avif",
    // Indigo → violet — all-in-one, depth
    sideGradient:
      "linear-gradient(135deg, #2b2d7e 0%, #5b4fcf 50%, #8b7ff0 100%)",
  },
  {
    tag: "Ad Creatives",
    title: "Social Media Ad Design",
    description:
      "Thumb-stopping static banners, animated ads, and video creatives sized for all platforms — Meta, Google Display, YouTube, and LinkedIn.",
    price: "₹5,000 – ₹10,000/mo",
    thumbImg: "/OtsukaCards/Social Media Ad Design.avif",
    // Magenta → coral — creative energy
    sideGradient:
      "linear-gradient(135deg, #9d0063 0%, #d4006c 45%, #f4527a 100%)",
  },
  {
    tag: "Marketplace",
    title: "Amazon Account Management",
    description:
      "Listing optimisation, A+ content, keyword targeting, sponsored ads, inventory management, and account health monitoring to grow your sales.",
    price: "₹15,000 – ₹50,000/mo",
    thumbImg: "/OtsukaCards/Amazon Account Management.avif",
    // Amazon orange gradient
    sideGradient:
      "linear-gradient(135deg, #8a4800 0%, #e47911 50%, #f7a940 100%)",
  },
  {
    tag: "Full Store",
    title: "E-Commerce Management",
    description:
      "End-to-end management of your online store across Shopify, WooCommerce, Meesho, or Flipkart — uploads, pricing, reviews, and promotional campaigns.",
    price: "₹12,000 – ₹35,000/mo",
    thumbImg: "/OtsukaCards/E-Commerce Management.avif",
    // Shopify green gradient
    sideGradient:
      "linear-gradient(135deg, #1b4332 0%, #2d6a4f 45%, #40916c 100%)",
  },
  {
    tag: "Custom UI",
    title: "Website Design",
    description:
      "Beautiful, responsive websites that reflect your brand identity and convert visitors into customers — landing pages, business sites, and portfolios.",
    price: "₹5,000 – ₹60,000",
    thumbImg: "/OtsukaCards/Website Design.avif",
    // Slate blue → periwinkle — clean, digital craft
    sideGradient:
      "linear-gradient(135deg, #1e3a5f 0%, #2d6096 50%, #5b9bd5 100%)",
  },
  {
    tag: "Custom Build",
    title: "Web Development",
    description:
      "From WordPress and Shopify builds to custom React or full-stack development — clean code, solid backends, and seamless integrations to power your digital business.",
    price: "₹15,000 – ₹1,50,000",
    thumbImg: "/OtsukaCards/Web Development.avif",
    // Dark charcoal → cool graphite — technical precision
    sideGradient:
      "linear-gradient(135deg, #1a1a2e 0%, #2d3561 50%, #4a5494 100%)",
  },
];

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

export default function OtsukaCards() {
  return (
    <section className="relative w-full bg-[#edeee8] py-16 sm:py-24 px-5 sm:px-16 2xl:px-32 overflow-hidden">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-10 justify-items-center sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cardsData.map((card, i) => (
          <Card key={i} index={i} {...card} />
        ))}
      </div>
    </section>
  );
}

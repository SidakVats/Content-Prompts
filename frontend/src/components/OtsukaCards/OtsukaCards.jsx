"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const cardsData = [
  {
    tag: "High ROI",
    title: "SEO Strategy",
    description:
      "Dominate search rankings with data-driven SEO strategies tailored to your industry. Keyword research, on-page optimisation, technical audits, and back-link building to drive organic traffic.",
    price: "₹8,000 – ₹15,000/mo",
    thumbImg: "/img1.jpg",
  },
  {
    tag: "Evergreen",
    title: "Content Writing",
    description:
      "Words that inform, engage, and convert. SEO-optimised blogs, website copy, product descriptions, and long-form articles that speak your brand voice.",
    price: "₹500 – ₹2,000",
    thumbImg: "/img2.jpg",
  },
  {
    tag: "Video Growth",
    title: "YouTube Marketing",
    description:
      "From channel setup and optimisation to scripting, thumbnail strategy, and growth tactics. We manage your YouTube presence end to end.",
    price: "₹10,000 – ₹50,000/mo",
    thumbImg: "/img3.jpg",
  },
  {
    tag: "B2B Leads",
    title: "LinkedIn Marketing",
    description:
      "Build a powerful professional brand on LinkedIn. Thought leadership posts, company pages, targeted B2B campaigns, and high-quality lead generation.",
    price: "₹8,000 – ₹20,000/mo",
    thumbImg: "/img4.jpg",
  },
  {
    tag: "Most Reach",
    title: "Facebook Marketing",
    description:
      "Reach billions of potential customers with precision-targeted Facebook campaigns — page management, content calendars, audience research, and paid ad creatives.",
    price: "₹8,000 – ₹18,000/mo",
    thumbImg: "/img1.jpg",
  },
  {
    tag: "Visual Brand",
    title: "Instagram Marketing",
    description:
      "Trending Reels, Stories, carousels, and feed posts aligned with your brand aesthetic — driving engagement, discoverability, and conversions.",
    price: "₹7,000 – ₹18,000/mo",
    thumbImg: "/img2.jpg",
  },
  {
    tag: "Done For You",
    title: "Social Media Management",
    description:
      "Full-service management across all platforms — content planning, scheduling, community engagement, comment moderation, and monthly performance reporting.",
    price: "₹12,000 – ₹35,000/mo",
    thumbImg: "/img3.jpg",
  },
  {
    tag: "Ad Creatives",
    title: "Social Media Ad Design",
    description:
      "Thumb-stopping static banners, animated ads, and video creatives sized for all platforms — Meta, Google Display, YouTube, and LinkedIn.",
    price: "₹5,000 – ₹10,000/mo",
    thumbImg: "/img4.jpg",
  },
  {
    tag: "Marketplace",
    title: "Amazon Account Management",
    description:
      "Listing optimisation, A+ content, keyword targeting, sponsored ads, inventory management, and account health monitoring to grow your sales.",
    price: "₹15,000 – ₹50,000/mo",
    thumbImg: "/img1.jpg",
  },
  {
    tag: "Full Store",
    title: "E-Commerce Management",
    description:
      "End-to-end management of your online store across Shopify, WooCommerce, Meesho, or Flipkart — uploads, pricing, reviews, and promotional campaigns.",
    price: "₹12,000 – ₹35,000/mo",
    thumbImg: "/img2.jpg",
  },
  {
    tag: "Custom UI",
    title: "Website Design",
    description:
      "Beautiful, responsive websites that reflect your brand identity and convert visitors into customers — landing pages, business sites, and portfolios.",
    price: "₹5,000 – ₹60,000",
    thumbImg: "/img3.jpg",
  },
  {
    tag: "Custom Build",
    title: "Web Development",
    description:
      "From WordPress and Shopify builds to custom React or full-stack development — clean code, solid backends, and seamless integrations to power your digital business.",
    price: "₹15,000 – ₹1,50,000",
    thumbImg: "/img4.jpg",
  },
];

const PARALLAX_STRENGTH = 40;

// Card dimensions — single source of truth used for both styles and GSAP math
const W = 370; // card width  (px)
const H = 430; // card height (px)
const D = 340; // card depth  (px)

function FaceContent({ tag, title, description, price, thumbImg }) {
  return (
    <>
      {/* Thumbnail — original position preserved */}
      <img
        src={thumbImg}
        alt={title}
        className="self-end w-40 h-50 mb-auto object-cover block rounded-xl"
      />

      {/* Tag */}
      <span className="text-[0.6rem] font-medium tracking-[0.15em] text-neutral-400 mb-1 block">
        {tag}
      </span>

      {/* Title */}
      <h2 className="text-[1.7rem] font-bold leading-tight mb-1.5">
        {title}
      </h2>

      {/* Description */}
      <p className="text-[0.8rem] text-neutral-600 leading-relaxed mb-3">
        {description}
      </p>

      {/* Divider */}
      <div className="h-px bg-neutral-200 mb-3" />

      {/* Price row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.7rem]  tracking-widest text-neutral-400 mb-0.5">
            Starting from
          </p>
          <p className="text-[0.95rem] font-semibold tracking-tight text-black">
            {price}
          </p>
        </div>
        {/* Arrow */}
        <div className="w-7 h-7 rounded bg-black flex items-center justify-center shrink-0">
          <svg
            className="w-3 h-3 text-white"
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

function Card({ tag, title, description, price, thumbImg }) {
  const cubeRef = useRef(null);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const rotation = { flip: 0, tiltX: 0, tiltY: 0 };
    let isFlipped = false;

    function render() {
      gsap.set(cube, {
        rotationX: rotation.flip + rotation.tiltX,
        rotationY: rotation.tiltY,
        z: -D / 2,
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

  return (
    /* Perspective wrapper */
    <div className="" style={{ width: W, height: H, perspective: "2000px" }}>
      {/* Cube — preserve-3d via .otsuka-cube in globals.css */}
      <div
        ref={cubeRef}
        className="otsuka-cube relative w-full h-full cursor-pointer"
      >
        {/* Front */}
        <div
          className="otsuka-face absolute bg-white flex flex-col p-4 rounded-2xl border border-slate-200"
          style={{ width: W, height: H, transform: `translateZ(${D / 2}px)` }}
        >
          <FaceContent
            tag={tag}
            title={title}
            description={description}
            price={price}
            thumbImg={thumbImg}
          />
        </div>

        {/* Back */}
        <div
          className="otsuka-face absolute bg-white flex flex-col p-6 rounded-2xl border border-slate-200"
          style={{
            width: W,
            height: H,
            transform: `rotateX(180deg) translateZ(${D / 2}px)`,
          }}
        >
          <FaceContent
            tag={tag}
            title={title}
            description={description}
            price={price}
            thumbImg={thumbImg}
          />
        </div>

        {/* Right */}
        <div
          className="otsuka-face absolute bg-[#bcbcbc] rounded-2xl"
          style={{
            width: D,
            height: H,
            left: (W - D) / 2,
            transform: `rotateY(90deg) translateZ(${W / 2}px)`,
          }}
        />

        {/* Left */}
        <div
          className="otsuka-face absolute bg-[#bcbcbc] rounded-2xl"
          style={{
            width: D,
            height: H,
            left: (W - D) / 2,
            transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
          }}
        />

        {/* Top */}
        <div
          className="otsuka-face absolute bg-[#999999] rounded-2xl"
          style={{
            width: W,
            height: D,
            top: (H - D) / 2,
            transform: `rotateX(90deg) translateZ(${H / 2}px)`,
          }}
        />

        {/* Bottom */}
        <div
          className="otsuka-face absolute bg-[#999999] rounded-2xl"
          style={{
            width: W,
            height: D,
            top: (H - D) / 2,
            transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
          }}
        />
      </div>
    </div>
  );
}

export default function OtsukaCards() {
  return (
    <section className="relative w-full bg-[#edeee8] py-20 px-8 2xl:px-30 overflow-hidden">
      <div className="grid grid-cols-1 gap-y-8 justify-items-center sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {cardsData.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </section>
  );
}

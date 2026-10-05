"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Data ─────────────────────────────────────────────────────────────────────

const DESKTOP_MIN = 1024;

const REST = [
  { x: -470, y: 20, r: -12 },
  { x: -230, y: -16, r: 7 },
  { x: 10, y: 12, r: -4 },
  { x: 250, y: -12, r: 5 },
  { x: 490, y: 18, r: -8 },
];

const BIAS = [
  { x: 1.05, y: 6, r: -2 },
  { x: 0.9, y: -5, r: 3 },
  { x: 1.1, y: 7, r: -3 },
  { x: 0.95, y: -4, r: 2 },
  { x: 1.0, y: 5, r: -2.5 },
];

const TESTIMONIALS = [
  {
    quote:
      "Content Prompts transformed our brand voice completely. Sharp, strategic, and delivered ahead of schedule.",
    name: "Ravi Menon",
    role: "Crumb, Founder",
    avatar: "/images/testimonials/testimonial_img_1.jpg",
    tone: "light",
  },
  {
    quote:
      "They gave our campaigns a personality. Every piece of content feels alive and on-brand, always.",
    name: "Cleo Baptiste",
    role: "Nettle, Head of Product",
    avatar: "/images/testimonials/testimonial_img_2.jpg",
    tone: "dark",
  },
  {
    quote:
      "We came in with scattered ideas and left with a clear content strategy. Fast, fun, and genuinely effective.",
    name: "Otto Lindqvist",
    role: "Sludge, Co-Founder",
    avatar: "/images/testimonials/testimonial_img_3.jpg",
    tone: "light",
  },
  {
    quote:
      "From scripts to social, they nailed every format. Smooth process, loud results, would do it all again.",
    name: "Nadia Karim",
    role: "Bramble, CMO",
    avatar: "/images/testimonials/testimonial_img_4.jpg",
    tone: "dark",
  },
  {
    quote:
      "Our LinkedIn presence went from invisible to industry-leading in three months. The copy just clicks every single time.",
    name: "Arjun Sethi",
    role: "Vantage, Growth Lead",
    avatar: "/images/testimonials/testimonial_img_1.jpg",
    tone: "light",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPoses(activeIndex) {
  if (activeIndex === null) return REST;
  return REST.map((pose, i) => {
    if (i === activeIndex) return { x: pose.x, y: pose.y, r: pose.r * 0.35 };
    const dir = i < activeIndex ? -1 : 1;
    const dist = Math.abs(i - activeIndex);
    const bias = BIAS[i];
    const push = (38 + dist * 28) * bias.x;
    return {
      x: pose.x + dir * push,
      y: pose.y + bias.y * dist * 0.55,
      r: pose.r + bias.r * dist * 1.15,
    };
  });
}

function isDesktop() {
  return window.innerWidth >= DESKTOP_MIN;
}

// ─── SectionNav ───────────────────────────────────────────────────────────────

function SectionNav({ left, right }) {
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-9 lg:py-9">
      <div className="flex justify-between items-start w-full">
        <p className="mono sm">{left}</p>
        <p className="mono sm">{right}</p>
      </div>
    </div>
  );
}

// ─── SectionFooter ────────────────────────────────────────────────────────────

function SectionFooter({ left, right }) {
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-9 lg:py-9">
      <div className="flex justify-between items-end w-full">
        <p className="mono sm">{left}</p>
        <p className="mono sm">{right}</p>
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardElsRef = useRef([]);

  // Heading SplitText reveal
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    let split;
    let trigger;

    document.fonts.ready.then(() => {
      if (!headingRef.current) return;
      split = SplitText.create(el, { type: "words", mask: "words" });
      gsap.set(split.words, { yPercent: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(split.words, {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
      });

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => tl.play(),
      });
    });

    return () => {
      trigger?.kill();
      split?.revert();
    };
  }, []);

  // Card fan + hover
  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardElsRef.current.filter(Boolean);
    if (!section || !cards.length) return;

    let activeIndex = null;
    let desktopBound = false;
    let introDone = false;
    const onEnter = [];
    let onCardLeave = null;
    let introTrigger = null;

    const clearHover = () => {
      cards.forEach((el, i) => {
        if (onEnter[i]) el.removeEventListener("mouseenter", onEnter[i]);
        if (onCardLeave) el.removeEventListener("mouseleave", onCardLeave);
      });
      onEnter.length = 0;
      onCardLeave = null;
      activeIndex = null;
      desktopBound = false;
    };

    const moveTo = (poses) => {
      if (!introDone) return;
      cards.forEach((el, i) => {
        gsap.to(el, {
          x: poses[i].x,
          y: poses[i].y,
          rotation: poses[i].r,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
          force3D: true,
        });
      });
    };

    const scatter = (index) => {
      if (!desktopBound || !introDone || index === activeIndex) return;
      activeIndex = index;
      moveTo(getPoses(index));
    };

    const bindDesktopHover = () => {
      if (desktopBound || !introDone || !isDesktop()) return;
      const isOverCard = (node) =>
        node instanceof Element &&
        cards.some((c) => c === node || c.contains(node));
      onCardLeave = (e) => {
        if (isOverCard(e.relatedTarget)) return;
        scatter(null);
      };
      cards.forEach((el, i) => {
        onEnter[i] = () => scatter(i);
        el.addEventListener("mouseenter", onEnter[i]);
        el.addEventListener("mouseleave", onCardLeave);
      });
      desktopBound = true;
    };

    const setRestPose = (el, i) => {
      if (isDesktop()) {
        gsap.set(el, {
          x: REST[i].x,
          y: REST[i].y,
          rotation: REST[i].r,
          zIndex: i + 1,
          xPercent: -50,
          yPercent: -50,
          force3D: true,
        });
      } else {
        gsap.set(el, {
          x: 0,
          y: 0,
          rotation: 0,
          xPercent: 0,
          yPercent: 0,
          clearProps: "zIndex",
        });
      }
    };

    const INTRO_Y = Math.max(window.innerHeight * 0.75, 600);

    cards.forEach((el, i) => {
      if (isDesktop()) {
        gsap.set(el, {
          x: REST[i].x,
          y: REST[i].y + INTRO_Y,
          rotation: REST[i].r,
          zIndex: i + 1,
          xPercent: -50,
          yPercent: -50,
          force3D: true,
        });
      } else {
        gsap.set(el, {
          x: 0,
          y: INTRO_Y,
          rotation: 0,
          xPercent: 0,
          yPercent: 0,
        });
      }
    });

    const playIntro = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          introDone = true;
          bindDesktopHover();
        },
      });
      cards.forEach((el, i) => {
        tl.to(
          el,
          {
            y: isDesktop() ? REST[i].y : 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
          },
          i * 0.1,
        );
      });
      return tl;
    };

    introTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => playIntro(),
    });

    const syncMode = () => {
      clearHover();
      if (!introDone) {
        cards.forEach((el, i) => {
          if (isDesktop()) {
            gsap.set(el, {
              x: REST[i].x,
              y: REST[i].y + INTRO_Y,
              rotation: REST[i].r,
              zIndex: i + 1,
              xPercent: -50,
              yPercent: -50,
              force3D: true,
            });
          } else {
            gsap.set(el, {
              x: 0,
              y: INTRO_Y,
              rotation: 0,
              xPercent: 0,
              yPercent: 0,
            });
          }
        });
        return;
      }
      cards.forEach((el, i) => {
        gsap.killTweensOf(el);
        setRestPose(el, i);
      });
      if (isDesktop()) bindDesktopHover();
    };

    window.addEventListener("resize", syncMode);

    return () => {
      window.removeEventListener("resize", syncMode);
      clearHover();
      introTrigger?.kill();
      cards.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#e8e8e2] text-[#0f0f0f]
                 h-auto min-h-svh py-32 px-4 flex flex-col items-center gap-10
                 md:py-36 md:px-6
                 lg:h-[110vh] lg:min-h-175 lg:py-0 lg:px-0 lg:block lg:overflow-hidden"
    >
      {/* Heading */}
      <h2
        ref={headingRef}
        className="w-full text-center text-[clamp(2rem,5vw,5.5rem)] tracking-tight leading-[0.9] z-10
                  md:text-[4vh] lg:text-[6vh]
                   lg:absolute lg:top-[15%] lg:left-1/2 lg:-translate-x-1/2 lg:w-max lg:max-w-[calc(100%-2rem)] lg:pointer-events-none uppercase"
      >
        Proof We Play Well With Others
      </h2>

      {/* Cards — stacked on mobile, 2-col grid on tablet, fan on desktop */}
      <div
        className="w-full flex flex-col items-center gap-4
                   md:grid md:grid-cols-2 md:items-start md:gap-5 lg:-mt-15
                   lg:absolute lg:block! lg:top-[60%] lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-0 lg:h-0 lg:gap-20"
      >
        {TESTIMONIALS.map((item, i) => (
          <article
            key={item.name}
            ref={(el) => {
              cardElsRef.current[i] = el;
            }}
            className={[
              // mobile base
              "relative w-full min-h-80 flex flex-col justify-between gap-5 p-5 rounded-xl cursor-default will-change-transform",
              // md — full width inside 2-col grid cell
              "md:w-full md:min-h-85 md:p-6",
              // lg — absolute positioning for fan layout
              "lg:absolute lg:top-0 lg:left-0 lg:w-75 lg:h-105 lg:min-h-0 lg:p-[1.6rem] lg:rounded-[0.6rem] lg:cursor-pointer lg:gap-[1.35rem]",
              // 2xl
              "2xl:w-85 2xl:h-115",
              // color
              item.tone === "light"
                ? "bg-[#f5f5f5] text-[#0f0f0f]"
                : "bg-[#0f0f0f] text-[#f5f5f5]",
              // shadow
              "shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:shadow-[0_12px_40px_rgba(0,0,0,0.1)]",
            ].join(" ")}
          >
            {/* Stars */}
            <div className="flex gap-1 text-[#888]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg
                  key={s}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFB343"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <p className="flex-1 font1 leading-snug text-sm md:text-base lg:text-lg">
              {item.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#e8e8e2]">
                <img
                  src={item.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[0.15rem] min-w-0">
                <h6 className="text-lg lg:text-[1.5rem] tracking-normal leading-none">
                  {item.name}
                </h6>
                <p className="mono sm opacity-60">{item.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="w-full lg:absolute lg:bottom-0 lg:left-0 lg:z-10 lg:pointer-events-none uppercase font3 tracking-tight">
        <SectionFooter left="Unfiltered Praise" right="Proof In Ink" />
      </div>
    </section>
  );
}

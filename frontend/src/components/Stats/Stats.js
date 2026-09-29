"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PARTNERS = [
  "Adult Swim",
  "Vans",
  "Mailchimp",
  "Bandcamp",
  "Spotify",
  "RedBull",
];

// ─── Callout ──────────────────────────────────────────────────────────────────
function Callout({
  label,
  rotation = 0,
  top,
  right,
  bottom,
  left,
  className = "",
}) {
  return (
    <div
      data-callout=""
      data-rotation={rotation}
      aria-hidden="true"
      className={`hidden lg:inline-flex absolute z-10 items-center justify-center px-3 py-1.5 rounded-[0.2rem] pointer-events-none whitespace-nowrap leading-none will-change-transform ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        backgroundColor: "#ffbab4",
        color: "#000",
        top,
        right,
        bottom,
        left,
      }}
    >
      <span className="text-base lg:text-[1.1rem] font-normal tracking-[0.5px]">
        {label}
      </span>
    </div>
  );
}

// ─── SectionFooter ────────────────────────────────────────────────────────────
function SectionFooter({ left, right }) {
  return (
    <div className="w-full px-6 py-6 lg:px-9 lg:py-9">
      <div className="flex justify-between items-end w-full">
        <p className="mono sm">{left}</p>
        <p className="mono sm">{right}</p>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export default function Stats() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  // Heading SplitText reveal
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    let split;
    let trigger;

    document.fonts.ready.then(() => {
      if (!headingRef.current) return;

      const callouts = [];
      el.querySelectorAll("[data-callout]").forEach((node) => {
        callouts.push({ node, parent: node.parentNode });
        node.remove();
      });

      split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { yPercent: 100 });

      callouts.forEach(({ node, parent }) => parent?.appendChild(node));
      callouts.forEach(({ node }) =>
        gsap.set(node, { scale: 0, transformOrigin: "center center" }),
      );

      const tl = gsap.timeline({ paused: true });
      tl.to(split.lines, {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
      });
      if (callouts.length) {
        tl.to(
          callouts.map(({ node }) => node),
          { scale: 1, duration: 1, ease: "elastic.out(1,0.45)" },
          "-=0.55",
        );
      }

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

  // Card 3D flip-in
  useEffect(() => {
    const grid = gridRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!grid || !cards.length) return;

    gsap.set(cards, {
      rotationX: -90,
      transformOrigin: "50% 0%",
      transformPerspective: 1200,
      force3D: true,
    });

    const tween = gsap.to(cards, {
      rotationX: 0,
      duration: 1.05,
      ease: "power3.out",
      stagger: { each: 0.12, from: "start" },
      overwrite: "auto",
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: "top 95%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, []);

  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-between w-full bg-[#0f0f0f] text-[#f5f5f5]"
    >
      <div className="w-full max-w-6xl 2xl:max-w-380 mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-24 lg:py-28 2xl:py-32 flex flex-col gap-10 md:gap-16 lg:gap-24">
        {/* Header */}
        <header className="w-full flex flex-col gap-4">
          <h4
            ref={headingRef}
            className="relative max-w-[15ch] text-4xl lg:text-7xl 2xl:text-7xl"
          >
            Blunt In Numbers And Receipts
            <Callout
              label="No fluff"
              rotation={-20}
              top="0.75em"
              left="-0.25em"
            />
          </h4>
        </header>

        {/* Grid */}
        <div
          ref={gridRef}
          className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-[0.85rem] items-start perspective-[1600px] perspective-origin-[50%_0%] max-w-sm md:max-w-176 2xl:max-w-208"
        >
          {/* Left col */}
          <div className="flex flex-col gap-[0.85rem] min-w-0 transform-3d md:pt-11">
            <article
              ref={setCardRef(0)}
              className="relative rounded-2xl overflow-hidden transform-3d backface-hidden will-change-transform aspect-3/2 flex flex-col justify-end px-3 py-1 text-[#f5f5f5]"
            >
              <img
                src="/img1.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <p className="mono text-lg tracking-wide">
                  Things we&apos;ve drawn
                </p>
                <h4 className="text-6xl lg:text-7xl font5">340+</h4>
              </div>
            </article>

            <article
              ref={setCardRef(1)}
              className="relative rounded-2xl overflow-hidden transform-3d backface-hidden will-change-transform aspect-square w-full md:w-[85%] md:self-end flex flex-col justify-between px-3 md:py-1 bg-[#f5f5f5] text-[#0f0f0f]"
            >
              <h4 className="text-[25vw] lg:text-[7vw] font5 tracking-tight">
                60+
              </h4>
              <p className="mono text-lg tracking-tight self-end text-right p-3 md:p-2">
                Brands we&apos;ve drawn for
              </p>
            </article>

            <article
              ref={setCardRef(2)}
              className="relative rounded-2xl overflow-hidden transform-3d backface-hidden will-change-transform aspect-[0.65/1] min-h-64 lg:min-h-88 flex flex-col p-4 lg:p-[1.15rem] bg-[#216ad1] text-white"
            >
              <p className="mono text-xl tracking-wide">
                Eyeballs reached
              </p>
              <h3 className="text-[20vw] lg:text-[7vw] 2xl:text-6xl -mt-5 md:mt-0">
                250M+
              </h3>
            </article>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-[0.85rem] min-w-0 transform-3d">
            <article
              ref={setCardRef(3)}
              className="relative rounded-2xl overflow-hidden transform-3d backface-hidden will-change-transform aspect-[1/1.85] flex flex-col justify-start p-4 lg:p-[1.15rem] text-[#f5f5f5]"
            >
              <img
                src="/img2.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,15,15,0.9)] via-[rgba(15,15,15,0.25)] to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-1 lg:gap-[0.4rem]">
                <p className="mono text-sm lg:text-base tracking-wide">
                  On the table right now
                </p>
                <h3 className="text-3xl md:text-4xl lg:text-[7vw] 2xl:text-[8vw] font5">
                  14
                </h3>
              </div>
            </article>

            <article
              ref={setCardRef(4)}
              className="relative rounded-2xl transform-3d backface-hidden will-change-transform min-h-64 w-full md:w-[82%] md:self-start flex flex-col justify-between p-4 bg-[#ff8356] text-black overflow-visible"
            >
              <h6 className="text-3xl md:text-[3rem] lg:text-[3rem] leading-[0.85]">
                Friends of the studio
              </h6>
              <ul className="list-none self-end text-right mt-6">
                {PARTNERS.map((name) => (
                  <li key={name}>
                    <p className="font5 tracking-widest text-lg uppercase">
                      {name}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>

      <SectionFooter left="Counted twice" right="Give or take" />
    </section>
  );
}

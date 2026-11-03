"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const ACCORDION_ITEMS = [
  {
    id: "01",
    title: "Compelling Narratives",
    description:
      "Customized strategies and powerful stories, creatives that resonate with your audience and build real, lasting connections. Because people don't just buy products, they buy into stories.",
    image: "/abouthero/compelling narratives.png",
  },
  {
    id: "02",
    title: "Search to Success",
    description:
      "Climb the rankings with smart SEO and performance marketing that turns every click into a customer. Be Seen. Be Heard. When customers search, your brand is the one they find.",
    image: "/abouthero/search to success.png",
  },
  {
    id: "03",
    title: "Complete Transparency",
    description:
      "No hidden fees, no confusing jargon. You get full access to your campaigns and an honest view of your results. You'll always know where your money goes and what it brings back.",
    image: "/abouthero/complete transparency.png",
  },
  {
    id: "04",
    title: "Scale Without Limits",
    description:
      "We find what works, double down on it, and keep pushing further, so your business grows faster and goes further than you expected. Your growth has no ceiling, and neither does our ambition.",
    image: "/abouthero/scale without limits.png",
  },
];

const ACCORDION_EXPANDED = 52;
const ACCORDION_COLLAPSED = 16;
const ACCORDION_DURATION = 0.6;
const ACCORDION_EASE = "power3.out";
const ACCORDION_WORD_STAGGER = 0.015;
const ACCORDION_DEFAULT_ACTIVE = 1;
const ACCORDION_MOBILE_BREAKPOINT = 1000;

const ExpandingPanels = ({ items = ACCORDION_ITEMS }) => {
  const accordionRef = useRef(null);
  const accordionPanelsRef = useRef([]);
  const accordionSplitsRef = useRef([]);
  const accordionActiveRef = useRef(ACCORDION_DEFAULT_ACTIVE);
  const accordionStackedRef = useRef(false);

  // apply horizontal flex or stacked mobile layout
  const accordionApplyLayout = useCallback((stacked) => {
    const root = accordionRef.current;
    if (!root) return;

    if (stacked) {
      root.dataset.stacked = "true";
    } else {
      delete root.dataset.stacked;
    }

    accordionPanelsRef.current.forEach((panel, i) => {
      if (!panel) return;

      if (stacked) {
        gsap.killTweensOf(panel);
        panel.style.flexGrow = "";
        panel.style.flexShrink = "";
        panel.style.flexBasis = "";

        const split = accordionSplitsRef.current[i];
        if (split?.words?.length) {
          gsap.set(split.words, { opacity: 1, y: 0 });
        }
        return;
      }

      const isActive = i === accordionActiveRef.current;
      panel.style.flexGrow = isActive
        ? ACCORDION_EXPANDED
        : ACCORDION_COLLAPSED;
      panel.style.flexShrink = "0";
      panel.style.flexBasis = "0";

      const split = accordionSplitsRef.current[i];
      if (split?.words?.length) {
        gsap.set(split.words, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 6,
        });
      }
    });
  }, []);

  // expand hovered panel and animate description words
  const accordionSetActive = useCallback((index) => {
    if (accordionStackedRef.current) return;
    if (accordionActiveRef.current === index) return;
    const prevIndex = accordionActiveRef.current;
    accordionActiveRef.current = index;

    accordionPanelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === index;
      gsap.to(panel, {
        flexGrow: isActive ? ACCORDION_EXPANDED : ACCORDION_COLLAPSED,
        duration: ACCORDION_DURATION,
        ease: ACCORDION_EASE,
      });
    });

    const prevSplit = accordionSplitsRef.current[prevIndex];
    if (prevSplit?.words?.length) {
      gsap.to(prevSplit.words, {
        opacity: 0,
        y: 6,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
      });
    }

    const activeSplit = accordionSplitsRef.current[index];
    if (activeSplit?.words?.length) {
      gsap.to(activeSplit.words, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: ACCORDION_WORD_STAGGER,
        ease: "power2.out",
        delay: 0.2,
        overwrite: true,
      });
    }
  }, []);

  // split descriptions into words and handle responsive layout
  useEffect(() => {
    accordionSplitsRef.current = accordionPanelsRef.current.map((panel) => {
      if (!panel) return null;
      const desc = panel.querySelector("[data-accordion-desc]");
      if (!desc) return null;
      const split = SplitText.create(desc, { type: "words" });
      gsap.set(split.words, { opacity: 0, y: 6 });
      return split;
    });

    accordionPanelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === ACCORDION_DEFAULT_ACTIVE;
      panel.style.flexGrow = isActive
        ? ACCORDION_EXPANDED
        : ACCORDION_COLLAPSED;
      panel.style.flexShrink = "0";
      panel.style.flexBasis = "0";
    });

    const handleResize = (initial = false) => {
      const stacked = window.innerWidth < ACCORDION_MOBILE_BREAKPOINT;
      if (!initial && stacked === accordionStackedRef.current) return;
      accordionStackedRef.current = stacked;
      accordionApplyLayout(stacked);
    };

    handleResize(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      accordionSplitsRef.current.forEach((split) => {
        if (split) split.revert();
      });
    };
  }, [accordionApplyLayout]);

  return (
    <section
      ref={accordionRef}
      className="pb-10 pt-40 md:pt-40 lg:pt-29 2xl:pt-55 bg-[#edeee8] group/accordion"
      data-stacked={undefined}
    >
      {/* Header */}
      <div className="text-center lg:px-8 pb-8 group-data-[stacked=true]/accordion:pb-12">
        <p className="mb-3 text-xs md:text-sm tracking-widest uppercase text-[#353333] font2">
          Design Pillars
        </p>
        <h6 className="text-4xl md:text-5xl font-medium text-black max-w-6xl mx-auto tracking-wide leading-9.5 md:leading-snug">
          Digital Growth That Ranks, Converts and Scales
        </h6>
      </div>

      {/* Panels */}
      <div className="w-full">
        {/* Desktop: horizontal flex | Mobile: stacked column */}
        <div
          className="
            flex gap-2 h-[60vh] min-h-125 px-4
            group-data-[stacked=true]/accordion:flex-col
            group-data-[stacked=true]/accordion:h-auto
            group-data-[stacked=true]/accordion:min-h-0
            group-data-[stacked=true]/accordion:gap-5
          "
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (accordionPanelsRef.current[index] = el)}
              onMouseEnter={() => accordionSetActive(index)}
              style={{ willChange: "flex-grow" }}
              className="
                relative h-full rounded-xl overflow-hidden cursor-pointer min-w-0
                group-data-[stacked=true]/accordion:rounded-lg
                group-data-[stacked=true]/accordion:flex-none!
                group-data-[stacked=true]/accordion:h-auto
                group-data-[stacked=true]/accordion:cursor-default
                group-data-[stacked=true]/accordion:flex
                group-data-[stacked=true]/accordion:flex-col
              "
            >
              {/* Background image */}
              <img
                className="
                  absolute inset-0 w-full h-full object-cover
                  group-data-[stacked=true]/accordion:relative
                  group-data-[stacked=true]/accordion:inset-auto
                  group-data-[stacked=true]/accordion:block
                  group-data-[stacked=true]/accordion:aspect-video
                  group-data-[stacked=true]/accordion:shrink-0
                  group-data-[stacked=true]/accordion:rounded-lg
                "
                src={item.image}
                alt={item.title}
              />

              {/* Overlay */}
              <div
                className="
                  absolute inset-0 pointer-events-none
                  bg-linear-to-b from-[rgba(11,11,11,0.15)] to-[rgba(11,11,11,0.55)]
                  group-data-[stacked=true]/accordion:inset-auto
                  group-data-[stacked=true]/accordion:top-0
                  group-data-[stacked=true]/accordion:left-0
                  group-data-[stacked=true]/accordion:w-full
                  group-data-[stacked=true]/accordion:aspect-video
                  group-data-[stacked=true]/accordion:rounded-lg
                "
              />

              {/* Number + Title — centred on desktop, left-aligned on mobile */}
              <div
                className="
                  absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  flex flex-col items-center text-center pointer-events-none
                  group-data-[stacked=true]/accordion:relative
                  group-data-[stacked=true]/accordion:top-auto
                  group-data-[stacked=true]/accordion:left-auto
                  group-data-[stacked=true]/accordion:translate-x-0
                  group-data-[stacked=true]/accordion:translate-y-0
                  group-data-[stacked=true]/accordion:items-start
                  group-data-[stacked=true]/accordion:text-left
                  group-data-[stacked=true]/accordion:px-2
                  group-data-[stacked=true]/accordion:pt-4
                  group-data-[stacked=true]/accordion:pb-1
                "
              >
                <span
                  className="
                    w-10 h-6 lg:flex items-center justify-center hidden
                    border border-white/15 bg-white/5 backdrop-blur-xl
                    rounded-[5px] mb-4 text-xs text-white
                    group-data-[stacked=true]/accordion:border-black/20
                    group-data-[stacked=true]/accordion:bg-black/8
                    group-data-[stacked=true]/accordion:backdrop-blur-none
                    group-data-[stacked=true]/accordion:text-black
                  "
                >
                  {item.id}
                </span>
                <p
                  className="text-[1.25rem] lg:text-[1rem] 2xl:text-[1.4rem] font-medium tracking-wide 2xl:tracking-wider leading-tight whitespace-nowrap text-white
                  group-data-[stacked=true]/accordion:whitespace-normal
                  group-data-[stacked=true]/accordion:text-black
                "
                >
                  {item.title}
                </p>
              </div>

              {/* Description */}
              <div
                className="
                  absolute z-10 top-[58%] left-1/2 -translate-x-1/2
                  w-96 text-center pointer-events-none
                  group-data-[stacked=true]/accordion:relative
                  group-data-[stacked=true]/accordion:top-auto
                  group-data-[stacked=true]/accordion:left-auto
                  group-data-[stacked=true]/accordion:translate-x-0
                  group-data-[stacked=true]/accordion:w-full
                  group-data-[stacked=true]/accordion:text-left
                  group-data-[stacked=true]/accordion:px-2
                  group-data-[stacked=true]/accordion:pb-5
                "
              >
                <p
                  data-accordion-desc=""
                  className="text-[1rem] 2xl:text-[0.9rem] lg:tracking-wide font1 leading-tight lg:text-white"
                  style={{ willChange: "opacity, transform" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpandingPanels;

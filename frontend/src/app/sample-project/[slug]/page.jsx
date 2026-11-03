"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stories } from "@/components/blogs/StorySlides/stories.js";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* ── Reading time ────────────────────────────────────────────────────────
   Counts words across intro + all body paragraphs + all Q&A answers.
   Standard reading speed: 200 words/min.
──────────────────────────────────────────────────────────────────────────*/
function calcReadingTime(project) {
  const texts = [
    project.intro,
    ...project.body.flatMap((s) => s.paragraphs),
    ...(project.qa ?? []).flatMap((item) => [item.q, item.a]),
  ];
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ─────────────────────────────────────────────────────────────────────────
   TextReveal — GSAP SplitText line-mask reveal
   eager  → plays on mount (above-fold header)
   scroll → fires when element enters viewport
──────────────────────────────────────────────────────────────────────────*/
function TextReveal({ children, eager = false, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let split;
    let ctx;

    const init = async () => {
      try {
        await document.fonts.ready;
      } catch {}
      if (!ref.current) return;

      split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { y: "105%" });

      if (eager) {
        gsap.to(split.lines, {
          y: "0%",
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
          delay,
        });
      } else {
        ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            onEnter: () => {
              gsap.to(split.lines, {
                y: "0%",
                duration: 1,
                stagger: 0.07,
                ease: "power4.out",
                delay,
              });
            },
            once: true,
          });
        });
      }
    };

    init();
    return () => {
      ctx?.revert();
      split?.revert();
    };
  }, [eager, delay]);

  return <div ref={ref}>{children}</div>;
}

/* ─────────────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────────────────*/
export default function ProjectPage({ params }) {
  const { slug } = use(params);
  const project = stories.find((s) => s.slug === slug);
  const bannerRef = useRef(null);

  if (!project) notFound();

  const readingTime = calcReadingTime(project);

  // Parallax: image moves up at ~30% the scroll speed of its container
  useEffect(() => {
    const img = bannerRef.current;
    if (!img) return;

    const st = ScrollTrigger.create({
      trigger: img.parentElement,   // the section
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // shift from 0% → -15% as the section scrolls through the viewport
        gsap.set(img, { y: `${self.progress * -15}%` });
      },
    });

    return () => st.kill();
  }, [slug]);

  return (
    <div style={{ backgroundColor: "var(--base-100, #edeee8)" }}>
      {/* ── 1. HEADER ────────────────────────────────────────────────────
          50svh, flex-col, justify-end, items-center, text-center
      ──────────────────────────────────────────────────────────────────── */}
      <section
        className="w-screen flex flex-col justify-end items-center gap-6 py-12 text-center"
        style={{ height: "50svh" }}
      >
        <TextReveal eager delay={0.3}>
          <p className="mb-8 uppercase text-sm md:text-base md:tracking-widest">
            {project.projectSubtitle}
          </p>
          <h1 className="text-[6vh] md:text-[8vh] tracking-wide md:tracking-normal leading-[0.95] font-medium m-0">
            {project.projectTitle}
          </h1>
        </TextReveal>

        {/* Date + reading time */}
        <TextReveal eager delay={0.55}>
          <p className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest opacity-50">
            <span>{project.publishedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
          </p>
        </TextReveal>
      </section>

      {/* ── 2. BANNER ────────────────────────────────────────────────────
          relative, 100svh, overflow-hidden
      ──────────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        <div className="absolute inset-0">
          <img
            ref={bannerRef}
            src={project.bannerImg}
            alt={project.projectTitle}
            className="w-full object-cover rounded-3xl will-change-transform"
            style={{ height: "110%", marginTop: "-5%" }}
          />
        </div>
      </section>

      {/* ── 3. CONCEPT + META ────────────────────────────────────────────
          65% wide centred column, stacked label+value pairs
      ──────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto flex flex-col items-center text-center gap-16 pt-32 pb-8 mb-16 w-full px-4 md:w-[85%] md:px-0 lg:pt-32 2xl:w-[75%]">
        {/* Concept */}
        <div className="flex flex-col gap-4 mb-16 w-full">
          <TextReveal>
            <p className=" uppercase opacity-60">Concept</p>
          </TextReveal>
          <TextReveal>
            <h3 className="text-2xl leading-snug tracking-tight md:text-4xl lg:text-[clamp(1.5rem,3vw,4rem)]">
              {project.intro}
            </h3>
          </TextReveal>
        </div>

        {/* Meta items */}
        {project.meta.map((d) => (
          <div className="flex flex-col gap-4 2xl:mb-16 w-full" key={d.label}>
            <TextReveal>
              <p className="uppercase opacity-60">{d.label}</p>
            </TextReveal>
            <TextReveal>
              <h3
                className="text-2xl leading-snug tracking md:text-4xl lg:text-[clamp(1.5rem,3vw,4rem)]"
                style={{ fontFamily: "var(--font-1)" }}
              >
                {d.value}
              </h3>
            </TextReveal>
          </div>
        ))}
      </section>

      {/* ── 4. BODY TEXT ─────────────────────────────────────────────────
          Same centred column, stacked body sections
      ──────────────────────────────────────────────────────────────────── */}
      <div className="mx-auto flex flex-col gap-20 pt-8 pb-24 w-full px-5 md:w-[75%] md:px-0 lg:gap-20 2xl:w-[65%]">
        {project.body.map((section) => (
          <div
            key={section.heading}
            className="flex flex-col gap-6 text-center"
          >
            <TextReveal>
              <p className=" uppercase tracking-[0.22em] opacity-55">
                {section.heading}
              </p>
            </TextReveal>

            {section.paragraphs.map((para, i) => (
              <TextReveal key={i} delay={i * 0.04}>
                <p className="text-base leading-normal opacity-90 md:text-lg lg:text-2xl">
                  {para}
                </p>
              </TextReveal>
            ))}
          </div>
        ))}
      </div>

      {/* ── 5. Q&A ───────────────────────────────────────────────────────
          Question shown as heading, answer as body text below
      ──────────────────────────────────────────────────────────────────── */}
      {project.qa?.length > 0 && (
        <div className="mx-auto flex flex-col pt-8 pb-24 w-full px-5 md:w-[75%] md:px-0 2xl:w-[65%]">
          {/* Section label */}
          <TextReveal>
            <p className="uppercase tracking-[0.22em] opacity-55 text-center mb-16">
              Questions
            </p>
          </TextReveal>

          {project.qa.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 text-center py-12 border-t border-current border-opacity-10 last:border-b"
            >
              {/* Question */}
              <TextReveal>
                <p className="text-lg leading-snug md:text-2xl lg:text-3xl font-medium">
                  {item.q}
                </p>
              </TextReveal>
              {/* Answer */}
              <TextReveal delay={0.05}>
                <p className="text-base leading-normal opacity-75 md:text-lg lg:text-xl">
                  {item.a}
                </p>
              </TextReveal>
            </div>
          ))}
        </div>
      )}

      {/* ── 6. NEXT PROJECT ──────────────────────────────────────────────
          100svh, flex-col, centred, 35%-wide image preview
      ──────────────────────────────────────────────────────────────────── */}
      <Link
        href={`/sample-project/${project.nextSlug}`}
        className="block no-underline text-inherit"
      >
        <section
          className="w-screen overflow-hidden flex flex-col justify-center items-center gap-6 text-center"
          style={{ height: "100svh" }}
        >
          <TextReveal>
            <p className="mb-4" style={{ fontFamily: "var(--font-3)" }}>
              {project.nextIndex}
            </p>
            <h2
              className="text-3xl tracking-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-2)" }}
            >
              Next
            </h2>
          </TextReveal>

          {/* Preview image — 35% wide on desktop, 75% on mobile */}
          <div
            className="relative overflow-hidden rounded-2xl w-3/4 md:w-2/5 lg:w-[35%]"
            style={{ height: "400px" }}
          >
            <div className="absolute inset-0">
              <img
                src={project.nextImg}
                alt={project.nextTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <TextReveal>
            <h3
              className="text-2xl leading-snug tracking-tight md:text-4xl lg:text-[clamp(1.5rem,3vw,4rem)]"
              style={{ fontFamily: "var(--font-2)" }}
            >
              {project.nextTitle}
            </h3>
          </TextReveal>
        </section>
      </Link>
    </div>
  );
}

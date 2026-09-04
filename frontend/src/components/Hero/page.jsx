"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

const Hero = () => {
  const textRef = useRef(null);
  const bottomTextRef = useRef(null);
  const linkRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const [img1Index, setImg1Index] = useState(0);
  const [img2Index, setImg2Index] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const archiveImages = Array.from(
    { length: 20 },
    (_, i) => `/archive/archive-${i + 1}.jpg`,
  );

  const animationConfig = {
    mainText: { duration: 1, stagger: 0.01, delay: 0.3 },
    image1: { duration: 1, delay: 0.8 },
    image2: { duration: 1, delay: 1.0 },
    bottomText: { duration: 0.5, stagger: 0.01, delay: 0.5 },
    link: { duration: 0.6, stagger: 0.02, delay: 1.5 },
  };

  useEffect(() => {
    const chars = textRef.current.querySelectorAll(".char");
    const bottomChars = bottomTextRef.current.querySelectorAll(".bottom-char");
    const linkChars = linkRef.current.querySelectorAll(".link-char");

    gsap.fromTo(
      chars,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: animationConfig.mainText.duration,
        stagger: animationConfig.mainText.stagger,
        ease: "power3.out",
        delay: animationConfig.mainText.delay,
      },
    );

    gsap.fromTo(
      bottomChars,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: animationConfig.bottomText.duration,
        stagger: animationConfig.bottomText.stagger,
        ease: "power3.out",
        delay: animationConfig.bottomText.delay,
      },
    );

    gsap.fromTo(
      img1Ref.current,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: animationConfig.image1.duration,
        ease: "power3.out",
        delay: animationConfig.image1.delay,
      },
    );

    gsap.fromTo(
      img2Ref.current,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: animationConfig.image2.duration,
        ease: "power3.out",
        delay: animationConfig.image2.delay,
      },
    );

    gsap.fromTo(
      linkChars,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: animationConfig.link.duration,
        stagger: animationConfig.link.stagger,
        ease: "power3.out",
        delay: animationConfig.link.delay,
      },
    );

    const interval = setInterval(() => {
      setIsInitialLoad(false);
      setImg1Index((prev) => (prev + 1) % 20);
      setImg2Index((prev) => (prev + 1) % 20);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Renders a word as individual animated chars
  const renderWord = (word) =>
    word.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <span className="char inline-block  tracking-tight font2">{char}</span>
      </span>
    ));

  return (
    <>
      <div className="relative w-full px-8! pt-32! pb-16! mt-20 flex flex-col items-center justify-center">
        <div className="relative" ref={textRef}>
          <h1 className="text-[7.5vw] 2xl:text-[8vw] font-black leading-[1.2] text-[#1a1a2e] text-center">
            {/* Row 1: Prompted [img1] by Strategy */}
            <div className="flex items-center justify-center gap-[0.2em]">
              <span>{renderWord("Prompted")}</span>

              <div
                ref={img1Ref}
                className="relative shrink-0 w-[12vw] 2xl:w-[11vw] h-[10vw] 2xl:h-[9vw] -rotate-6 rounded-lg overflow-hidden bg-[#e9e7e4] shadow will-change-transform"
              >
                <Image
                  fill
                  key={img1Index}
                  src={archiveImages[img1Index]}
                  alt="Archive"
                  className={`rounded-xl object-cover p-1.5! w-full h-full ${
                    isInitialLoad ? "initial-visible" : ""
                  }`}
                  style={
                    isInitialLoad
                      ? {}
                      : {
                          animation: "clipReveal 0.5s ease-out forwards",
                          clipPath: "inset(0 0 100% 0)",
                        }
                  }
                />
              </div>

              <span>{renderWord("by")}</span>
              <span>{renderWord("Strategy")}</span>
            </div>

            {/* Row 2: Powered by [img2] Creativity */}
            <div className="flex items-center justify-center gap-[0.4em]">
              <span>{renderWord("Powered")}</span>
              <span>{renderWord("by")}</span>

              <span>{renderWord("Creativity")}</span>

              <div
                ref={img2Ref}
                className="relative shrink-0 w-[12vw] 2xl:w-[11vw] h-[10vw] 2xl:h-[9vw] rotate-[5deg] rounded-lg overflow-hidden bg-[#e9e7e4] shadow will-change-transform -ms-5"
              >
                <Image
                  fill
                  key={img2Index}
                  src={archiveImages[img2Index]}
                  alt="Archive"
                  className={`object-cover p-1.5! rounded-xl w-full h-full ${
                    isInitialLoad ? "initial-visible" : ""
                  }`}
                  style={
                    isInitialLoad
                      ? {}
                      : {
                          animation: "clipReveal 0.5s ease-out forwards",
                          clipPath: "inset(0 0 100% 0)",
                        }
                  }
                />
              </div>
            </div>
          </h1>
        </div>

        <div
          ref={bottomTextRef}
          className="mt-12! max-w-xl text-right self-end pr-8!"
        >
          <p className="text-base 2xl:text-lg mb-4! 2xl:mb-6!">
            {"Strategy gives your brand direction. Creativity gives it a voice. We give you both. Every business has a story worth telling. We find it, shape it, and make it connect to your Audience."
              .split("")
              .map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom leading-tight"
                >
                  <span className="bottom-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              ))}
          </p>
          <a
            ref={linkRef}
            href="#"
            className="flex items-center gap-px font-bold tracking-wide hover:gap-1 transition-all text-(--fg) inline-block  px-5 py-1.5 bg-(--bg2) rounded"
          >
            {"↳  Let's Build your Brand".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom"
              >
                <span className="link-char inline-block tracking-tight">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </a>
        </div>
      </div>
    </>
  );
};

export default Hero;

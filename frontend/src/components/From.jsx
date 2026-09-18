"use client";
import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const From = () => {
    const splitTopRef = useRef(null);
    const splitBottomRef = useRef(null);
    const splitTriggerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const initSplitAnimation = () => {
            console.log('SplitText initializing...');
            if (splitTriggerRef.current) {
                splitTriggerRef.current.kill();
            }

            splitTriggerRef.current = ScrollTrigger.create({
                id: "split-text-animation",
                trigger: ".split-element",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = Math.min(self.progress / 0.65, 1);
                    const topScale = 1.5 + (1 - 1.45) * progress;
                    const bottomScale = 2 + (1 - 2) * progress;

                    gsap.set(splitTopRef.current, { scale: topScale, force3D: true });
                    gsap.set(splitBottomRef.current, { scale: bottomScale, force3D: true });
                },
            });
        };

        const handleResize = () => {
            initSplitAnimation();
            ScrollTrigger.refresh();
        };

        // Add delay for device compatibility
        setTimeout(() => {
            initSplitAnimation();
            ScrollTrigger.refresh();
        }, 300);
        
        window.addEventListener("resize", handleResize);

        return () => {
            if (splitTriggerRef.current) {
                splitTriggerRef.current.kill();
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section className="split-element relative w-full h-[40vh] overflow-hidden lg:h-screen">
            <div className="absolute top-1/2 left-1/2 w-full h-full flex justify-center items-center -translate-x-1/2 -translate-y-1/2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}>
                <img ref={splitTopRef} src="/from.png" alt="" className="w-full h-[48%] object-contain scale-150 max-md:w-[60%] " style={{ willChange: 'transform' }} />
            </div>

            <div className="absolute top-1/2 left-1/2 w-full h-full flex justify-center items-center -translate-x-1/2 -translate-y-1/2" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}>
                <img ref={splitBottomRef} src="/from.png" alt="" className="w-full h-[48%] object-contain scale-[2] max-md:w-[60%]" style={{ willChange: 'transform' }} />
            </div>

            <div className="absolute top-1/2 left-0 w-full bg-slate-700 text-white text-center -translate-y-1/2 overflow-hidden">
                <div className="w-full lg:px-5">
                    <p className="w-full flex justify-between items-center lg:text-lg uppercase max-lg:flex-wrap max-lg:justify-center gap-4 lg:gap-x-8 max-lg:text-center">
                        <span>Bold</span>
                        <span>Vibrant</span>
                        <span>Inclusive</span>
                        <span>Confidence</span>
                        <span>Playful</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default From
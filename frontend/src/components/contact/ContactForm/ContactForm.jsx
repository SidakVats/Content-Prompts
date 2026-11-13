"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const fieldsRef = useRef(null);
  const btnRef = useRef(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  // ── Entrance animation ─────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        fieldsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        btnRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // ── Handlers ──────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return;

    setStatus("loading");

    // Button micro-animation
    gsap.to(btnRef.current, {
      scale: 0.96,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="relative w-full bg-black py-24 px-4 flex flex-col items-center"
    >
      {/* ── Big title ── */}
      <div ref={titleRef} className="text-center mb-3">
        <h2
          className="font3 leading-none text-[3vh] text-[#9E9E9E] uppercase"
          
        >
          CONTENT
          <br />
          <span className="text-[6vh] tracking-tighter font2">PROMPTS</span>
        </h2>
      </div>

      {/* ── Subtitle ── */}
      <p
        ref={subtitleRef}
        className="text-[#f5f5f5]/55 text-sm md:text-base text-center mb-12 max-w-sm"
        style={{ fontFamily: "var(--font-1, sans-serif)" }}
      >
        A living record of projects, people, and process.
      </p>

      {/* ── Form ── */}
      <form
        ref={fieldsRef}
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4"
        noValidate
      >
        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          aria-label="Your name"
          className="w-full bg-[#e8e6da] text-black placeholder-[#9b6a4a]/70 text-xs md:text-sm tracking-wide px-4 py-3.5 outline-none border border-transparent focus:border-[#e8190b]/40 transition-colors duration-200 rounded font3"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          aria-label="Phone number"
          className="w-full bg-[#e8e6da] text-black placeholder-[#9b6a4a]/70 text-xs md:text-sm tracking-wide  px-4 py-3.5 outline-none border border-transparent focus:border-[#e8190b]/40 transition-colors duration-200 rounded font3"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          aria-label="Email address"
          className="w-full bg-[#e8e6da] text-black placeholder-[#9b6a4a]/70 text-xs md:text-sm tracking-wide px-4 py-3.5 outline-none border border-transparent focus:border-[#e8190b]/40 transition-colors duration-200 rounded font3"
        />

        {/* Message — optional */}
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message (optional)"
          rows={4}
          aria-label="Your message (optional)"
          className="w-full bg-[#e8e6da] text-black placeholder-[#9b6a4a]/70 text-xs md:text-sm tracking-wide px-4 py-3.5 outline-none resize-none border border-transparent focus:border-[#e8190b]/40 transition-colors duration-200 rounded font3"
        />

        {/* ── CTA button ── */}
        <div className="flex justify-center mt-4">
          <button
            ref={btnRef}
            type="submit"
            disabled={status === "loading"}
            className="group cursor-pointer relative text-[#f5f5f5] text-sm md:text-base tracking-widest uppercase px-6 py-2 transition-colors duration-200 hover:text-[#9E9E9E] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-1, monospace)" }}
          >
            {/* brackets */}
            <span className="mr-2 text-[#f5f5f5]/60 group-hover:text-[#9E9E9E]/60 transition-colors duration-200">
              [
            </span>
            {status === "loading"
              ? "Sending…"
              : status === "success"
              ? "Message Sent ✓"
              : "Start Exchange"}
            <span className="ml-2 text-[#f5f5f5]/60 group-hover:text-[#9E9E9E]/60 transition-colors duration-200">
              ]
            </span>
          </button>
        </div>

        {/* ── Status feedback ── */}
        {status === "error" && (
          <p className="text-center text-[#e8190b] text-xs tracking-wider mt-1">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}

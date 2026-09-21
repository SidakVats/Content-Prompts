"use client"

import React, { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

const ContactHeader = () => {
  // Refs for the four moving circles (iris + pupil per eye)
  const leftIrisRef  = useRef(null)
  const leftPupilRef = useRef(null)
  const rightIrisRef  = useRef(null)
  const rightPupilRef = useRef(null)

  // Eye geometry (in 1000×1000 viewBox)
  const OUTER_PATH_RADIUS = 60  // how far iris centre travels from eye centre
  const INNER_PATH_RADIUS = 26  // how far pupil travels within iris

  // ─── Eye tracking ────────────────────────────────────────────────────────────
  const animateEye = useCallback((irisEl, pupilEl, cx, cy, angle) => {
    const bx = cx + OUTER_PATH_RADIUS * Math.cos(angle)
    const by = cy + OUTER_PATH_RADIUS * Math.sin(angle)
    const wx = bx + INNER_PATH_RADIUS * Math.cos(angle)
    const wy = by + INNER_PATH_RADIUS * Math.sin(angle)

    gsap.to(irisEl,  { attr: { cx: bx, cy: by }, duration: 0.12, ease: 'power1.out', overwrite: true })
    gsap.to(pupilEl, { attr: { cx: wx, cy: wy }, duration: 0.12, ease: 'power1.out', overwrite: true })
  }, [])

  useEffect(() => {
    // Initialise positions
    gsap.set(leftIrisRef.current,   { attr: { cx: 400, cy: 500 } })
    gsap.set(leftPupilRef.current,  { attr: { cx: 426, cy: 500 } })
    gsap.set(rightIrisRef.current,  { attr: { cx: 600, cy: 500 } })
    gsap.set(rightPupilRef.current, { attr: { cx: 626, cy: 500 } })

    let raf = null
    const handleMouseMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const angle = Math.atan2(
          e.clientY - window.innerHeight / 2,
          e.clientX - window.innerWidth  / 2
        )
        animateEye(leftIrisRef.current,  leftPupilRef.current,  400, 500, angle)
        animateEye(rightIrisRef.current, rightPupilRef.current, 600, 500, angle)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [animateEye])

  // ─── Letter hover — GSAP staggered per-character slide ───────────────────────
  const linksWrapperRef = useRef(null)

  useEffect(() => {
    const wrapper = linksWrapperRef.current
    if (!wrapper) return

    const anchors = Array.from(wrapper.querySelectorAll('a'))
    const cleanups = []

    anchors.forEach((anchor) => {
      const tops    = anchor.querySelectorAll('.letter-top')
      const bottoms = anchor.querySelectorAll('.letter-bottom')

      // Set initial state for bottom spans (hidden below)
      gsap.set(bottoms, { y: '105%' })

      const onEnter = () => {
        // Slide tops out upward, bottoms in from below — staggered char by char
        gsap.to(tops, {
          y: '-105%',
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: 0.03,
          overwrite: true,
        })
        gsap.to(bottoms, {
          y: '0%',
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: 0.03,
          overwrite: true,
        })
      }

      const onLeave = () => {
        // Reverse — tops slide back in, bottoms slide back down
        gsap.to(tops, {
          y: '0%',
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: 0.03,
          overwrite: true,
        })
        gsap.to(bottoms, {
          y: '105%',
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: 0.03,
          overwrite: true,
        })
      }

      anchor.addEventListener('mouseenter', onEnter)
      anchor.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        anchor.removeEventListener('mouseenter', onEnter)
        anchor.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  // ─── Text split helper ────────────────────────────────────────────────────────
  // Each character gets two spans: .letter-top (visible) and .letter-bottom
  // (starts below, slides in on hover). GSAP staggers them char by char.
  const splitText = useCallback((text) => {
    return text.split('').map((letter, index) => (
      <span key={index} className="letter">
        <span className="letter-top">{letter === ' ' ? '\u00A0' : letter}</span>
        <span className="letter-bottom" aria-hidden="true">{letter === ' ' ? '\u00A0' : letter}</span>
      </span>
    ))
  }, [])

  // ─── Data ─────────────────────────────────────────────────────────────────────
  const socialLinks = [
    { name: 'Instagram', url: '#' },
    [
      { name: 'Facebook', url: '#' },
      { name: 'Behance',  url: '#' },
    ],
    { name: 'LinkedIn', url: '#' },
  ]

  return (
    <div className="relative min-h-screen w-full">

      

      {/* Main content */}
      <div className="w-screen h-screen flex items-center justify-center relative">

        {/* SVG Eyes */}
        <svg
          className="absolute w-full h-full pointer-events-none z-10 -top-[100px] left-0"
          viewBox="0 0 1000 1000"
        >
          {/* Left eye */}
          <g>
            <circle strokeWidth="2" fill="#fff" cx="400" cy="500" r="100" stroke="#0f0f0f" />
            <circle ref={leftIrisRef}  strokeWidth="2" fill="#0f0f0f" r="40" stroke="#0f0f0f" cx="400" cy="500" />
            <circle ref={leftPupilRef} fill="#fff" r="12" cx="426" cy="500" />
          </g>

          {/* Right eye */}
          <g>
            <circle strokeWidth="2" fill="#fff" cx="600" cy="500" r="100" stroke="#0f0f0f" />
            <circle ref={rightIrisRef}  strokeWidth="2" fill="#0f0f0f" r="40" stroke="#0f0f0f" cx="600" cy="500" />
            <circle ref={rightPupilRef} fill="#fff" r="12" cx="626" cy="500" />
          </g>
        </svg>

        {/* Social links */}
        <div
          ref={linksWrapperRef}
          className="w-full flex flex-col justify-center items-center gap-2 relative z-[1] -mt-[120px]"
        >
          {socialLinks.map((item, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center lg:gap-30 gap-0">
              {Array.isArray(item) ? (
                item.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="inline-flex flex-nowrap items-center text-[9vw] leading-[1] h-[9vw] text-[#0f0f0f] uppercase mx-[0.5vw] tracking-[-0.05em] cursor-pointer no-underline"
                  >
                    {splitText(link.name)}
                  </a>
                ))
              ) : (
                <a
                  href={item.url}
                  className="inline-flex flex-nowrap items-center text-[9vw] leading-[1] h-[9vw] text-[#0f0f0f] uppercase mx-[0.5vw] tracking-[-0.05em] cursor-pointer no-underline"
                >
                  {splitText(item.name)}
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ContactHeader

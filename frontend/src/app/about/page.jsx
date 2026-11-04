import Stats from "@/components/about/Stats/Stats";
import Testimonials from "@/components/about/Testimonials/Testimonials";
import AboutHero from "@/components/about/AboutHero/AboutHero";
import ScrollRevealText from "@/components/about/ScrollRevealText/ScrollRevealText";
import Footer from "@/components/shared/Footer/Footer";
import React from "react";
import {
  ABOUT_SCROLL_PARAGRAPHS,
  ABOUT_SCROLL_KEYWORDS,
  ABOUT_SCROLL_KEYWORD_COLORS,
} from "@/data/about";
import { SEO_ABOUT } from "@/data/seo";

export const metadata = SEO_ABOUT;

const page = () => {
  return (
    <div>
      <AboutHero />
      <ScrollRevealText
        paragraphs={ABOUT_SCROLL_PARAGRAPHS}
        keywords={ABOUT_SCROLL_KEYWORDS}
        keywordColors={ABOUT_SCROLL_KEYWORD_COLORS}
        highlightBg="245, 245, 245"
        pinDuration={4}
      />
      <Testimonials />
      <Stats />
      <Footer />
    </div>
  );
};

export default page;

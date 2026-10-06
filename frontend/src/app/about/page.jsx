import Stats from "@/components/Stats/Stats";
import Testimonials from "@/components/Testimonials/Testimonials";
import Accordion from "@/components/Accordion/Accordion";
import AnimeText from "@/components/AnimeText/AnimeText";
import React from "react";

const page = () => {
  return (
    <div>
      <Accordion />
      <AnimeText
        paragraphs={[
          "We are a creative studio obsessed with building digital experiences that leave a lasting impression.",
          "Our team blends strategy, design, and technology to craft work that is bold, precise, and purposeful.",
          "Every brand has a story worth telling. We find it, shape it, and put it in front of the right audience at the right moment.",
          "We don't do generic. Every word, every visual, every campaign is built around what makes your brand impossible to ignore.",
        ]}
        keywords={[
          "creative",
          "digital",
          "strategy",
          "design",
          "technology",
          "bold",
          "story",
          "brand",
          "campaign",
          "audience",
        ]}
        keywordColors={{
          creative: "#ff8356",
          digital: "#216ad1",
          strategy: "#ffbab4",
          design: "#f5f5f5",
          technology: "#216ad1",
          bold: "#ff8356",
          story: "#ffbab4",
          brand: "#ff8356",
          campaign: "#216ad1",
          audience: "#ffbab4",
        }}
        highlightBg="245, 245, 245"
        pinDuration={4}
      />
      <Testimonials />
      <Stats />
    </div>
  );
};

export default page;

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
          "We are a digital marketing partner obsessed with building growth engines that keep working long after launch.",
          "Our team blends strategy, storytelling, and analytics to deliver results that are bold, precise, and accountable.",
          "Every business has a vision worth chasing. We map it, plan for it, and reach the right connections or people through the right channels.",
          "We don't do generic. Every penny, every creative, every campaign is built around what moves your brand from good to unstoppable.",
        ]}
        keywords={[
          "digital",
          "growth",
          "strategy",
          "storytelling",
          "analytics",
          "bold",
          "business",
          "vision",
          "connections",
          "people",
          "campaign",
          "brand",
          "unstoppable",
        ]}
        keywordColors={{
          digital: "#216ad1",
          growth: "#ff8356",
          strategy: "#ffbab4",
          storytelling: "#ff8356",
          analytics: "#216ad1",
          bold: "#ff8356",
          business: "#ffbab4",
          vision: "#216ad1",
          connections: "#ff8356",
          people: "#ff8356",
          campaign: "#216ad1",
          brand: "#ff8356",
          unstoppable: "#ffbab4",
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

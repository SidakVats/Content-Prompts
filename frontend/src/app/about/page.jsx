import Stats from "@/components/Stats/Stats";
import Testimonials from "@/components/Testimonials/Testimonials";
import Accordion from "@/components/Accordion/Accordion";
import React from "react";

const page = () => {
  return (
    <div>
      <Accordion />
      <Stats />
      <Testimonials />
    </div>
  );
};

export default page;

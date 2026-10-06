import React from "react";

const Banner = () => {
  return (
    <>
      <section
        className="relative w-full h-svh lg:h-[120svh] overflow-hidden"
      >
        {/* Background image — fixed via absolute fill so it works inside any scroll container */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="relative w-full h-full">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div className="relative z-1 w-full h-full p-4 md:p-8 max-w-[2000px] mx-auto flex flex-col justify-between text-white">
            <div>
              <h2 className="w-full md:w-[70%] text-[2rem] md:text-[3.5rem] 2xl:text-[5rem] tracking-wide leading-none lg:leading-[0.9] uppercase">
                NO TEMPLATES. NO SHORTCUTS. ONE SIZE FITS NONE. EVERY STRATEGY
                IS CUSTOM.
              </h2>
            </div>

            <div className="space-y-0">
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                D2C & E-commerce
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                Startups & SaaS
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                Fashion Brands
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                Real estate & healthcare
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                Personal brands
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                E-shops Design and Integration
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                Local businesses
              </p>
              <p className="text-[1rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                B2B Connections
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[0.9rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                We create for the ecosystem of the modern mind, where attention
                is won and memory is made.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;

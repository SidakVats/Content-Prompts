import React from "react";

const Banner = () => {
  return (
    <>
      <section className="relative w-full h-svh lg:h-[120svh] overflow-hidden" style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundAttachment: 'fixed', backgroundPosition: 'center', backgroundSize: 'cover' }}>

        <div className="relative w-full h-full">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div className="relative z-1 w-full h-full p-4 md:p-8 max-w-[2000px] mx-auto flex flex-col justify-between text-white">
            <div>
              <h2 className="w-full md:w-3/4 text-[2rem] md:text-[5rem] 2xl:text-[7rem] tracking-wide leading-none lg:leading-[0.9] uppercase">We craft stories for the platforms you love.</h2>
            </div>

            <div className="space-y-0">
              <p className="text-[1rem] md:text-[1.25rem] font-medium leading-tight tracking-[0.1rem]">OTT platforms</p>
              <p className="text-[1rem] md:text-[1.25rem] font-medium leading-tight tracking-[0.1rem]">TV networks</p>
              <p className="text-[1rem] md:text-[1.25rem] font-medium leading-tight tracking-[0.1rem]">YouTube channels</p>
              <p className="text-[1rem] md:text-[1.25rem] font-medium leading-tight tracking-[0.1rem]">Brand campaigns</p>
              <p className="text-[1rem] md:text-[1.25rem] font-medium leading-tight tracking-[0.1rem]">Social-first formats</p>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[0.9rem] md:text-[1.25rem] leading-tight tracking-[0.1rem]">
                We create for the ecosystem of the modern mind, where attention is won and memory is made. 
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
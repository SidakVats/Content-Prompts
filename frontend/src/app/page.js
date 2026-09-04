import MobileHero from "@/components/Hero/MobileHero";
import Hero from "@/components/Hero/page";

export default function Home() {
  return (
    <>
      <div className="hidden md:block">
          <Hero />
        </div>
        <div className="block md:hidden">
          <MobileHero />
        </div>
    </>
  );
}

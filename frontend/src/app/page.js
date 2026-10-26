import PreloaderHero from "@/components/PreloaderHero";
import OtsukaCards from "@/components/OtsukaCards/OtsukaCards";
import Banner from "@/components/Banner";
import From from "@/components/From";
import Brands from "@/components/Brands";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <PreloaderHero />
      <OtsukaCards />
      <Banner/>
      <From/>
      <Brands/>
      <Footer/>
    </>
  );
}

import PreloaderHero from "@/components/index/PreloaderHero/PreloaderHero";
import ServiceCards from "@/components/index/ServiceCards/ServiceCards";
import Banner from "@/components/index/Banner/Banner";
import SplitLogoReveal from "@/components/index/SplitLogoReveal/SplitLogoReveal";
import Brands from "@/components/index/Brands/Brands";
import ContactForm from "@/components/contact/ContactForm/ContactForm";
import Footer from "@/components/shared/Footer/Footer";
import { SEO_HOME } from "@/data/seo";

export const metadata = SEO_HOME;

export default function Home() {
  return (
    <>
      <PreloaderHero />
      <ServiceCards />
      <Banner />
      <SplitLogoReveal />
      <Brands />
      <ContactForm />
      <Footer />
    </>
  );
}

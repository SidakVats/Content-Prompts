import PreloaderHero from "@/components/index/PreloaderHero/PreloaderHero";
import ServiceCards from "@/components/index/ServiceCards/ServiceCards";
import Banner from "@/components/index/Banner/Banner";
import SplitLogoReveal from "@/components/index/SplitLogoReveal/SplitLogoReveal";
import Brands from "@/components/index/Brands/Brands";
import ContactForm from "@/components/contact/ContactForm/ContactForm";
import Footer from "@/components/shared/Footer/Footer";

export const metadata = {
  title: "Home - Content Prompts",
  description:
    "Content Prompts is a full-funnel digital marketing agency helping startups, D2C brands, and businesses grow through SEO, social media, paid ads, content, and e-commerce management.",
  openGraph: {
    title: "Content Prompts — Prompted by Strategy. Powered by Creativity.",
    description:
      "Full-funnel digital marketing for startups, D2C brands, and businesses that refuse to stay small.",
    url: "https://contentprompts.pro",
  },
  alternates: {
    canonical: "https://contentprompts.pro",
  },
};

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

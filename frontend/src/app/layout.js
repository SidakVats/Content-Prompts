import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll/SmoothScroll";
import HamburgerMenu from "@/components/shared/HamburgerMenu/HamburgerMenu";
import WhatsAppButton from "@/components/shared/WhatsAppButton/WhatsAppButton";
import Transition from "@/components/shared/Transition/Transition";
import Logo from "@/components/shared/Logo/Logo";
import { GoogleAnalytics } from '@next/third-parties/google';

const font1 = localFont({
  src: "./fonts/font1.ttf",
  variable: "--font-1",
  weight: "100 900",
});

const font2 = localFont({
  src: "./fonts/font2.ttf",
  variable: "--font-2",
  weight: "100 900",
});

const font3 = localFont({
  src: "./fonts/font3.ttf",
  variable: "--font-3",
  weight: "100 900",
});

const font4 = localFont({
  src: "./fonts/font4.woff2",
  variable: "--font-4",
  weight: "100 900",
});

const font5 = localFont({
  src: "./fonts/font5.woff2",
  variable: "--font-5",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: "Content Prompts — Digital Marketing Agency",
    template: "%s | Content Prompts",
  },
  description:
    "Full-funnel digital marketing for startups, D2C brands, and businesses that refuse to stay small. Strategy, content, SEO, social media, and performance — all under one roof.",
  keywords: [
    "digital marketing agency",
    "SEO",
    "social media management",
    "content writing",
    "Web Development",
    "Website Design",
    "D2C marketing",
    "performance marketing",
    "India",
  ],
  authors: [{ name: "Content Prompts" }],
  creator: "Content Prompts",
  metadataBase: new URL("https://contentprompts.pro"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://contentprompts.pro",
    siteName: "Content Prompts",
    title: "Content Prompts — Digital Marketing Agency",
    description:
      "Full-funnel digital marketing for startups, D2C brands, and businesses that refuse to stay small.",
    images: [
      {
        url: "/logos/logo-preloader.png",
        width: 1200,
        height: 630,
        alt: "Content Prompts",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${font1.variable} ${font2.variable} ${font3.variable} ${font4.variable} ${font5.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#edeee8]">
         <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <Transition />
        <HamburgerMenu />
        <WhatsAppButton />
        <SmoothScroll>
          {/* Logo lives here so it's inside the Lenis scroll container
              and scrolls away naturally while the fixed menu button stays put */}
          <div className="relative">
            <div className="absolute top-4 left-4 md:top-7 md:left-7 z-40 pointer-events-none">
              <Logo />
            </div>
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}

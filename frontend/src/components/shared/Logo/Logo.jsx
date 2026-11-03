"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <>
        {/* Home page: light/cream logo on dark hero background */}
        <Image
          src="/logos/logo-icon-light.svg"
          alt="Content Prompts"
          width={5000}
          height={5000}
          className="object-contain w-25 md:hidden"
          priority
        />
        <Image
          src="/logos/logo-wordmark-light.svg"
          alt="Content Prompts"
          width={5000}
          height={5000}
          className="object-contain hidden md:block md:w-60"
          priority
        />
      </>
    );
  }

  return (
    <>
      {/* Other pages: dark logo on light background */}
      <Image
        src="/logos/logo-icon-dark.svg"
        alt="Content Prompts"
        width={5000}
        height={5000}
        className="object-contain w-25 md:hidden"
        priority
      />
      <Image
        src="/logos/logo-wordmark-dark.svg"
        alt="Content Prompts"
        width={5000}
        height={5000}
        className="object-contain hidden md:block md:w-60"
        priority
      />
    </>
  );
}

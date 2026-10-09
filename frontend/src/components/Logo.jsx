"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <>
        {/* Mobile: logo5, Desktop: logo3 */}
        <Image
          src="/logo4.svg"
          alt="Content Prompts"
          width={5000}
          height={5000}
          className="object-contain w-40 md:hidden"
          priority
        />
        <Image
          src="/logo1.svg"
          alt="Content Prompts"
          width={5000}
          height={5000}
          className="object-contain hidden md:block md:w-100"
          priority
        />
      </>
    );
  }

  return (
    <>
      {/* Mobile: logo6, Desktop: logo4 */}
      <Image
        src="/logo3.svg"
        alt="Content Prompts"
        width={5000}
        height={5000}
        className="object-contain w-40 md:hidden"
        priority
      />
      <Image
        src="/logo2.svg"
        alt="Content Prompts"
        width={5000}
        height={5000}
        className="object-contain hidden md:block md:w-100"
        priority
      />
    </>
  );
}

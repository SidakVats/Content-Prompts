"use client";
import { useRouter } from "next/navigation";
import { animateTransition } from "@/components/shared/Transition/Transition";

export function useViewTransition() {
  const router = useRouter();

  const navigateWithTransition = async (href) => {
    await animateTransition();
    router.push(href);
  };

  return { navigateWithTransition };
}

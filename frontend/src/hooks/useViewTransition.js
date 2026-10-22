"use client";
import { useRouter } from "next/navigation";
import { animateTransition } from "@/components/Transition";

/**
 * Returns a `navigateWithTransition(href)` helper that fires the page-exit
 * animation (Transition component) before pushing a new route.
 */
export function useViewTransition() {
  const router = useRouter();

  const navigateWithTransition = async (href) => {
    await animateTransition();
    router.push(href);
  };

  return { navigateWithTransition };
}

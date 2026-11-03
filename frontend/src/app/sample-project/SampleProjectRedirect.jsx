"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect bare /sample-project → the first project slug
export default function SampleProjectRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sample-project/gunmetal-dream");
  }, [router]);
  return null;
}

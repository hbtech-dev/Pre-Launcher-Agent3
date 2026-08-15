"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WelcomePage from "./welcome/page";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/welcome");
  }, [router]);

  return <WelcomePage />;
}

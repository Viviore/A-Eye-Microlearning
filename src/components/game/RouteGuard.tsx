"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const {
    preAssessmentCompleted,
    postAssessmentCompleted,
    level1Verdict,
    level2Verdict,
    level3Verdict,
    completedLevels,
  } = useGameStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isL1Done = completedLevels.includes(1) || level1Verdict !== null;
    const isL2Done = completedLevels.includes(2) || level2Verdict !== null;
    const isL3Done = completedLevels.includes(3) || level3Verdict !== null;

    if (pathname.startsWith("/level/1") && !preAssessmentCompleted) {
      router.replace("/pre");
    } else if (pathname.startsWith("/level/2") && !isL1Done) {
      router.replace("/level/1");
    } else if (pathname.startsWith("/level/3") && !isL2Done) {
      router.replace("/level/2");
    } else if (pathname === "/post" && !isL3Done) {
      router.replace("/level/3");
    } else if (pathname === "/results" && !postAssessmentCompleted) {
      router.replace("/post");
    }
  }, [
    isMounted,
    pathname,
    router,
    preAssessmentCompleted,
    postAssessmentCompleted,
    level1Verdict,
    level2Verdict,
    level3Verdict,
    completedLevels,
  ]);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}

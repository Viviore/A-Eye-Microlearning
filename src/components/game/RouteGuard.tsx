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
    completedLevels,
  } = useGameStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isL1Done = completedLevels.includes(1);
    const isL2Done = completedLevels.includes(2);
    const isL3Done = completedLevels.includes(3);

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
    completedLevels,
  ]);

  let isAuthorized = true;
  if (isMounted) {
    const isL1Done = completedLevels.includes(1);
    const isL2Done = completedLevels.includes(2);
    const isL3Done = completedLevels.includes(3);

    if (pathname.startsWith("/level/1") && !preAssessmentCompleted) {
      isAuthorized = false;
    } else if (pathname.startsWith("/level/2") && !isL1Done) {
      isAuthorized = false;
    } else if (pathname.startsWith("/level/3") && !isL2Done) {
      isAuthorized = false;
    } else if (pathname === "/post" && !isL3Done) {
      isAuthorized = false;
    } else if (pathname === "/results" && !postAssessmentCompleted) {
      isAuthorized = false;
    }
  }

  if (!isMounted || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

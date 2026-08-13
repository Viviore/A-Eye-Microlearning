import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export function useProgressionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  
  const preAssessmentCompleted = useGameStore(state => state.preAssessmentCompleted);
  const completedLevels = useGameStore(state => state.completedLevels);
  const postAssessmentCompleted = useGameStore(state => state.postAssessmentCompleted);

  useEffect(() => {
    let expectedRoute = '/pre';
    
    if (postAssessmentCompleted) {
      expectedRoute = '/results';
    } else if (completedLevels.includes(3)) {
      expectedRoute = '/post';
    } else if (completedLevels.includes(2)) {
      expectedRoute = '/level/3';
    } else if (completedLevels.includes(1)) {
      expectedRoute = '/level/2';
    } else if (preAssessmentCompleted) {
      expectedRoute = '/level/1';
    }

    // Only redirect if they are not on the expected route
    // and exclude the landing page which is open to all
    if (pathname !== '/' && pathname !== expectedRoute) {
      router.replace(expectedRoute);
    }
  }, [preAssessmentCompleted, completedLevels, postAssessmentCompleted, pathname, router]);
}

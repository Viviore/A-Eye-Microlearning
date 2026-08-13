import case002 from '@/data/case002.json';
import case003 from '@/data/case003.json';

export async function preloadGameAssets(onProgress?: (progress: number) => void): Promise<void> {
  const imageUrls = case002.map((c: { imageSrc: string }) => c.imageSrc);
  // To avoid massive bandwidth spikes, we preload all images but only the first few videos
  // (the rest can stream in while playing)
  const videoUrls = case003.slice(0, 3).flatMap((c: { videoA: string, videoB: string }) => [c.videoA, c.videoB]);
  
  const allUrls = [...imageUrls, ...videoUrls];
  
  let loadedCount = 0;
  
  const promises = allUrls.map(url => {
    return new Promise<void>((resolve) => {
      const finish = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / allUrls.length) * 100);
        if (onProgress) {
          onProgress(progress);
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('preload-progress', { detail: progress }));
        }
        resolve();
      };

      if (url.endsWith('.mp4')) {
        // We use fetch to prime the browser cache for the video
        fetch(url)
          .then(res => res.blob())
          .then(finish)
          .catch(finish); // Resolve anyway to avoid hanging
      } else {
        const img = new Image();
        img.src = url;
        img.onload = finish;
        img.onerror = finish;
      }
    });
  });
  
  await Promise.all(promises);
}

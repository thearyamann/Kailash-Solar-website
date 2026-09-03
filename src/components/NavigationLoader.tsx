"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Reset loader when path changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      const href = target.href;
      
      try {
        const url = new URL(href);
        // If it's an internal link to a different page (not just an anchor hash)
        if (
          url.origin === window.location.origin && 
          url.pathname !== pathname && 
          !target.hasAttribute('download') && 
          target.target !== '_blank'
        ) {
          e.preventDefault();
          e.stopPropagation();
          setIsLoading(true);
          
          // Show loader for 2 seconds before pushing the route
          setTimeout(() => {
            router.push(url.pathname + url.search + url.hash);
          }, 2000);
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    };

    // Use capture phase to intercept before Next.js Link component handles it
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname, router]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin shadow-lg"></div>
    </div>
  );
}

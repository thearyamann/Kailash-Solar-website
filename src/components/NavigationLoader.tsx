"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global navigation loader.
 * Navigation happens instantly (like a native app); the loader only appears
 * if the next page takes longer than SHOW_AFTER_MS to arrive.
 */
const SHOW_AFTER_MS = 350;
const MAX_VISIBLE_MS = 8000;

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const reset = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    setIsLoading(false);
  };

  // Hide as soon as the new route renders
  useEffect(() => {
    reset();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      try {
        const url = new URL(target.href);
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname &&
          !target.hasAttribute('download') &&
          target.target !== '_blank'
        ) {
          clearTimeout(showTimer.current);
          clearTimeout(hideTimer.current);
          showTimer.current = setTimeout(() => setIsLoading(true), SHOW_AFTER_MS);
          // Safety net so the overlay can never get stuck
          hideTimer.current = setTimeout(() => setIsLoading(false), MAX_VISIBLE_MS);
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    };

    // iOS/Android restore pages from the back-forward cache; never show a stale overlay
    const handlePageShow = () => reset();

    document.addEventListener('click', handleClick);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('pageshow', handlePageShow);
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="w-12 h-12 border-4 border-white/25 border-t-white rounded-full animate-spin shadow-lg"></div>
    </div>
  );
}

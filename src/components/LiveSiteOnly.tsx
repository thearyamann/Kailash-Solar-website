"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders its children (tracking scripts) only on the real website, never on
 * localhost / 127.0.0.1 test runs, so tests can't send fake leads to Meta or Google.
 */
export default function LiveSiteOnly({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname));
  }, []);
  return live ? <>{children}</> : null;
}

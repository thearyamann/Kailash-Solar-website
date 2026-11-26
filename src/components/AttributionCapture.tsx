"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Saves the ad click / campaign tags from the landing URL so form leads know their source. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}

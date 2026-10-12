"use client";

import { useState, useEffect, useRef } from "react";
import { isServiceablePincode } from "@/lib/pincode";

export type PincodeStatus = "idle" | "checking" | "valid" | "invalid";

export function usePincodeVerifier(pincode: string) {
  const [status, setStatus] = useState<PincodeStatus>(() => {
    const cleaned = (pincode || "").trim().replace(/\D/g, "");
    if (cleaned.length === 6) {
      return isServiceablePincode(cleaned) ? "valid" : "invalid";
    }
    return "idle";
  });

  const lastCheckedPinRef = useRef<string>("");

  useEffect(() => {
    const cleaned = (pincode || "").trim().replace(/\D/g, "").slice(0, 6);

    // If less than 6 digits, reset status
    if (cleaned.length < 6) {
      lastCheckedPinRef.current = "";
      setStatus("idle");
      return;
    }

    // If already verified this exact 6-digit pin without changes
    if (lastCheckedPinRef.current === cleaned) {
      return;
    }

    // 6 digits entered: show loading on the right side then verify
    setStatus("checking");
    const timer = setTimeout(() => {
      lastCheckedPinRef.current = cleaned;
      const isServiceable = isServiceablePincode(cleaned);
      setStatus(isServiceable ? "valid" : "invalid");
    }, 450);

    return () => clearTimeout(timer);
  }, [pincode]);

  return {
    status,
    isChecking: status === "checking",
    isValid: status === "valid",
    isInvalid: status === "invalid",
    // Blocked from submitting if currently verifying, if verified as outside region,
    // or if the user entered an incomplete (1-5 digit) PIN
    isBlocked:
      status === "checking" ||
      status === "invalid" ||
      ((pincode || "").trim().length > 0 && (pincode || "").trim().length < 6),
  };
}

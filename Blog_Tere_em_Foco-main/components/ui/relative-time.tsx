"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/utils";

interface RelativeTimeProps {
  date: string;
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    // Only update on client side to avoid hydration mismatch
    setTimeString(formatRelativeTime(date));
  }, [date]);

  if (!timeString) {
    // Placeholder during SSR
    return <span className={className} aria-hidden>--</span>;
  }

  return <span className={className}>{timeString}</span>;
}
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
    // Return empty or a placeholder during SSR
    return <span className={className} />;
  }

  return <span className={className}>{timeString}</span>;
}
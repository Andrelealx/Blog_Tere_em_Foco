"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // fallback para cópia em caso de cancelamento ou erro.
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Button intent="secondary" onClick={handleShare} className="gap-2">
      {copied ? <Copy size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
      {copied ? "Link copiado" : "Compartilhar"}
    </Button>
  );
}

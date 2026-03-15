import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Avatar com fallback de iniciais quando não houver imagem.
 */
export interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
}

export function Avatar({ name, src, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/20 bg-[var(--color-nevoa)] text-xs font-semibold text-white",
        className,
      )}
      aria-label={`Avatar de ${name}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

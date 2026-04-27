import { Badge } from "@/components/ui/badge";
import { EU_PROGRAMS, type EUProgramCode } from "@/lib/eu-programs";
import { cn } from "@/lib/utils";

interface EUBadgeProps {
  program: EUProgramCode | null;
  detail?: string | null;
  size?: "sm" | "md";
  className?: string;
}

export function EUBadge({ program, detail, size = "md", className }: EUBadgeProps) {
  const meta = program ? EU_PROGRAMS[program] : EU_PROGRAMS["OTRO"];

  return (
    <Badge
      variant="eu"
      className={cn(
        "eu-badge-glow gap-1 font-semibold",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-xs px-2.5 py-1",
        className
      )}
    >
      <span aria-hidden="true">🇪🇺</span>
      {meta.shortName}
      {detail && detail !== meta.shortName && (
        <span className="opacity-80 font-normal hidden sm:inline">
          · {detail}
        </span>
      )}
    </Badge>
  );
}

// Versión outline para contextos con fondo blanco
export function EUBadgeOutline({ program, className }: Omit<EUBadgeProps, "detail" | "size">) {
  const meta = program ? EU_PROGRAMS[program] : EU_PROGRAMS["OTRO"];
  return (
    <Badge variant="eu-outline" className={cn("gap-1", className)}>
      <span aria-hidden="true">🇪🇺</span>
      {meta.shortName}
    </Badge>
  );
}

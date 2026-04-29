"use client";

import Link from "next/link";
import type { CcaaMapItem } from "@/lib/map-data";

const DOT: Record<CcaaMapItem["color"], string> = {
  urgente: "bg-red-600",
  pronto: "bg-orange-500",
  activa: "bg-green-600",
  "sin-datos": "bg-gray-300",
};

interface CcaaCardListProps {
  data: CcaaMapItem[];
}

export function CcaaCardList({ data }: CcaaCardListProps) {
  const sorted = [...data].sort((a, b) => {
    if (a.color === "urgente" && b.color !== "urgente") return -1;
    if (b.color === "urgente" && a.color !== "urgente") return 1;
    if (a.color === "pronto" && b.color !== "pronto") return -1;
    if (b.color === "pronto" && a.color !== "pronto") return 1;
    return b.total - a.total;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {sorted.map((item) => (
        <Link
          key={item.code}
          href={`/ayudas/${item.slug}`}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
        >
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${DOT[item.color]}`} />
          <span className="truncate font-medium">{item.nombre}</span>
          {item.total > 0 && (
            <span className="ml-auto text-xs text-muted-foreground shrink-0">
              {item.total}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

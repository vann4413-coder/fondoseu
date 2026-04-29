"use client";

import type { CcaaMapItem } from "@/app/api/map-data/route";

interface MapTooltipProps {
  item: CcaaMapItem;
  x: number;
  y: number;
}

export function MapTooltip({ item, x, y }: MapTooltipProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg border bg-popover px-3 py-2 text-sm shadow-md"
      style={{ left: x + 12, top: y - 10 }}
    >
      <div className="font-semibold">{item.nombre}</div>
      <div className="text-muted-foreground">
        {item.total === 0
          ? "Sin ayudas autonómicas activas"
          : `${item.total} ayuda${item.total !== 1 ? "s" : ""} autonómica${item.total !== 1 ? "s" : ""}`}
      </div>
      {item.minDays !== null && (
        <div className="text-muted-foreground">
          Próximo cierre: {item.minDays === 0 ? "hoy" : `en ${item.minDays}d`}
        </div>
      )}
    </div>
  );
}

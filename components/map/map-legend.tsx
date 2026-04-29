"use client";

const LEGEND = [
  { color: "#dc2626", label: "Cierra en ≤14 días" },
  { color: "#f97316", label: "Cierra en ≤45 días" },
  { color: "#16a34a", label: "Abierta" },
  { color: "#e5e7eb", label: "Sin ayudas autonómicas" },
];

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {LEGEND.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-sm border border-black/10"
            style={{ background: color }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

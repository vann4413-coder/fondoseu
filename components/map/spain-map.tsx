"use client";

import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { useRouter } from "next/navigation";
import { MapTooltip } from "./map-tooltip";
import type { CcaaMapItem } from "@/app/api/map-data/route";

const GEO_URL = "/data/spain-ccaa.geojson";

const COLOR_MAP: Record<CcaaMapItem["color"], string> = {
  urgente: "#dc2626",
  pronto: "#f97316",
  activa: "#16a34a",
  "sin-datos": "#e5e7eb",
};

const HOVER_MAP: Record<CcaaMapItem["color"], string> = {
  urgente: "#b91c1c",
  pronto: "#ea580c",
  activa: "#15803d",
  "sin-datos": "#d1d5db",
};

// Map GeoJSON name values to ISO codes
const NAME_TO_CODE: Record<string, string> = {
  "Andalucia": "ES-AN",
  "Aragon": "ES-AR",
  "Asturias": "ES-AS",
  "Baleares": "ES-IB",
  "Canarias": "ES-CN",
  "Cantabria": "ES-CB",
  "Castilla-La Mancha": "ES-CM",
  "Castilla-Leon": "ES-CL",
  "Cataluna": "ES-CT",
  "Ceuta": "ES-CE",
  "Extremadura": "ES-EX",
  "Galicia": "ES-GA",
  "La Rioja": "ES-RI",
  "Madrid": "ES-MD",
  "Murcia": "ES-MC",
  "Navarra": "ES-NC",
  "Pais Vasco": "ES-PV",
  "Valencia": "ES-VC",
  "Melilla": "ES-ML",
};

function normalizeName(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N");
}

interface SpainMapProps {
  data: CcaaMapItem[];
  compact?: boolean;
}

export function SpainMap({ data, compact = false }: SpainMapProps) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    item: CcaaMapItem;
    x: number;
    y: number;
  } | null>(null);

  const byCode = Object.fromEntries(data.map((d) => [d.code, d]));

  const getItem = useCallback(
    (rawName: string): CcaaMapItem | undefined => {
      const normalized = normalizeName(rawName);
      const code = NAME_TO_CODE[normalized] ?? NAME_TO_CODE[rawName];
      return code ? byCode[code] : undefined;
    },
    [byCode]
  );

  const handleClick = useCallback(
    (rawName: string) => {
      const item = getItem(rawName);
      if (item) router.push(`/ayudas/${item.slug}`);
    },
    [getItem, router]
  );

  return (
    <div
      className="relative w-full"
      onMouseLeave={() => setTooltip(null)}
      onMouseMove={(e) =>
        setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))
      }
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: compact ? 1800 : 2400, center: [-3.5, 40] }}
        width={compact ? 600 : 800}
        height={compact ? 320 : 440}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawName: string = geo.properties.name ?? "";
              const item = getItem(rawName);
              const colorKey: CcaaMapItem["color"] = item?.color ?? "sin-datos";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={COLOR_MAP[colorKey]}
                  stroke="#fff"
                  strokeWidth={0.5}
                  tabIndex={0}
                  aria-label={item ? `${item.nombre}: ${item.total} ayudas` : rawName}
                  style={{
                    default: { fill: COLOR_MAP[colorKey], outline: "none" },
                    hover: { fill: HOVER_MAP[colorKey], outline: "none", cursor: "pointer" },
                    pressed: { fill: HOVER_MAP[colorKey], outline: "none" },
                  }}
                  onClick={() => handleClick(rawName)}
                  onMouseEnter={(e) => {
                    if (item) setTooltip({ item, x: e.clientX, y: e.clientY });
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <MapTooltip item={tooltip.item} x={tooltip.x} y={tooltip.y} />
      )}
    </div>
  );
}

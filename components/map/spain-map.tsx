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

// Spain CCAA TopoJSON (Canarias inset included)
const GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/spain/spain-communities.json";

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

// Map TopoJSON property names to our ISO codes
const NAME_TO_CODE: Record<string, string> = {
  "Andalucía": "ES-AN",
  "Aragón": "ES-AR",
  "Asturias": "ES-AS",
  "Islas Baleares": "ES-IB",
  "Canarias": "ES-CN",
  "Cantabria": "ES-CB",
  "Castilla-La Mancha": "ES-CM",
  "Castilla y León": "ES-CL",
  "Cataluña": "ES-CT",
  "Ceuta": "ES-CE",
  "Extremadura": "ES-EX",
  "Galicia": "ES-GA",
  "La Rioja": "ES-RI",
  "Madrid": "ES-MD",
  "Murcia": "ES-MC",
  "Navarra": "ES-NC",
  "País Vasco": "ES-PV",
  "Comunidad Valenciana": "ES-VC",
  "Melilla": "ES-ML",
  // alternative spellings in the TopoJSON
  "Comunitat Valenciana": "ES-VC",
  "Illes Balears": "ES-IB",
  "Principado de Asturias": "ES-AS",
  "Región de Murcia": "ES-MC",
  "Comunidad de Madrid": "ES-MD",
  "Comunidad Foral de Navarra": "ES-NC",
  "País Vasco / Euskadi": "ES-PV",
};

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

  const handleClick = useCallback(
    (geoName: string) => {
      const code = NAME_TO_CODE[geoName];
      if (!code) return;
      const item = byCode[code];
      if (!item) return;
      router.push(`/ayudas/${item.slug}`);
    },
    [byCode, router]
  );

  const handleMouseEnter = useCallback(
    (geoName: string, evt: React.MouseEvent) => {
      const code = NAME_TO_CODE[geoName];
      if (!code) return;
      const item = byCode[code];
      if (!item) return;
      setTooltip({ item, x: evt.clientX, y: evt.clientY });
    },
    [byCode]
  );

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltip((prev) => (prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null));
  }, []);

  return (
    <div
      className="relative w-full"
      onMouseLeave={() => setTooltip(null)}
      onMouseMove={handleMouseMove}
    >
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-3.5, -40, 0],
          scale: compact ? 1600 : 2000,
        }}
        width={compact ? 600 : 800}
        height={compact ? 340 : 460}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string =
                geo.properties.NAME_1 ||
                geo.properties.name ||
                geo.properties.NAME ||
                "";
              const code = NAME_TO_CODE[name];
              const item = code ? byCode[code] : undefined;
              const colorKey: CcaaMapItem["color"] = item?.color ?? "sin-datos";
              const fill = COLOR_MAP[colorKey];
              const hover = HOVER_MAP[colorKey];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={0.8}
                  tabIndex={0}
                  aria-label={
                    item
                      ? `${item.nombre}: ${item.total} ayudas`
                      : name
                  }
                  style={{
                    default: { fill, outline: "none" },
                    hover: { fill: hover, outline: "none", cursor: "pointer" },
                    pressed: { fill: hover, outline: "none" },
                  }}
                  onClick={() => handleClick(name)}
                  onMouseEnter={(evt) => handleMouseEnter(name, evt)}
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

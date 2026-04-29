"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpainMap } from "./spain-map";
import { MapLegend } from "./map-legend";
import { CcaaCardList } from "./ccaa-card-list";
import type { CcaaMapItem } from "@/app/api/map-data/route";

export function CompactMapSection() {
  const [data, setData] = useState<CcaaMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/map-data")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
        Cargando mapa…
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block">
        <SpainMap data={data} compact />
      </div>
      <div className="md:hidden">
        <CcaaCardList data={data} />
      </div>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <MapLegend />
        <Link
          href="/mapa"
          className="text-sm text-primary font-medium hover:underline"
        >
          Ver mapa completo →
        </Link>
      </div>
    </div>
  );
}

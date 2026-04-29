"use client";

import { SpainMap } from "@/components/map/spain-map";
import { MapLegend } from "@/components/map/map-legend";
import { CcaaCardList } from "@/components/map/ccaa-card-list";
import type { CcaaMapItem } from "@/app/api/map-data/route";

export function MapClient({ data }: { data: CcaaMapItem[] }) {
  return (
    <div>
      {/* Desktop map */}
      <div className="hidden md:block">
        <SpainMap data={data} />
      </div>

      {/* Mobile list */}
      <div className="md:hidden">
        <CcaaCardList data={data} />
      </div>

      <div className="mt-4">
        <MapLegend />
      </div>
    </div>
  );
}

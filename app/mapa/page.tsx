import type { Metadata } from "next";
import { MapClient } from "./map-client";
import { TopClosings } from "@/components/map/top-closings";
import { getMapData } from "@/lib/map-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mapa de ayudas por comunidad autónoma | FondosEU",
  description:
    "Descubre qué comunidades autónomas tienen más ayudas activas y qué convocatorias cierran antes. Filtra por tu región y encuentra la financiación que necesitas.",
  openGraph: {
    title: "Mapa de ayudas por CCAA | FondosEU",
    description:
      "Visualiza ayudas, subvenciones y financiación pública por comunidad autónoma en España.",
  },
};

export default async function MapaPage() {
  const data = await getMapData();

  const totalOpen = data.reduce((s, d) => s + d.total, 0);
  const urgent = data.filter((d) => d.color === "urgente").length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ayudas y subvenciones por comunidad autónoma",
    numberOfItems: data.length,
    itemListElement: data
      .filter((d) => d.total > 0)
      .map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Ayudas en ${d.nombre}`,
        url: `https://fondoseu.org/ayudas/${d.slug}`,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Ayudas por comunidad autónoma
          </h1>
          <p className="text-muted-foreground">
            {totalOpen > 0
              ? `${totalOpen} ayudas autonómicas activas ahora mismo.${urgent > 0 ? ` ${urgent} CCAA con convocatorias urgentes.` : ""}`
              : "Explora la financiación disponible en tu comunidad."}
          </p>
        </div>

        <MapClient data={data} />

        <TopClosings />
      </div>
    </>
  );
}

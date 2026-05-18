import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, Phone, Globe, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Puntos de asesoramiento gratuito para emprendedores | FondosEU",
  description:
    "Encuentra los puntos físicos de asesoramiento gratuito más cercanos a ti. Red PAE (Puntos de Atención al Emprendedor) en toda España.",
};

export default function PuntosPage() {
  return (
    <div className="container py-12 max-w-4xl">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <MapPin className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Dónde te asesoran sobre ayudas, gratis y en persona
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Más de 4.000 puntos oficiales en toda España. Pon tu código postal y encuentra los más cercanos.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-10 text-center mb-10">
        <div className="text-4xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold mb-2">Buscador en construcción</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          Estamos cargando los datos de la red PAE (Puntos de Atención al Emprendedor del Ministerio de Industria).
          Estará disponible muy pronto.
        </p>
        <p className="text-sm text-muted-foreground">
          Mientras tanto, puedes buscar directamente en{" "}
          <a
            href="https://paeelectronico.es/es-es/CreaEmpresaConAyuda/Paginas/BuscadorPAE.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            paeelectronico.es
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>

      {/* What is PAE */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">¿Qué es un punto PAE?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Search,
              title: "Asesoramiento gratuito",
              desc: "Te explican qué ayudas puedes solicitar según tu tipo de negocio, sector y ubicación.",
            },
            {
              icon: Phone,
              title: "Gestión de trámites",
              desc: "Pueden tramitar la constitución de tu empresa y acceder al sistema CIRCE en tu nombre.",
            },
            {
              icon: Globe,
              title: "Red oficial",
              desc: "Más de 4.000 puntos en cámaras de comercio, ayuntamientos, asociaciones y organismos públicos.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border p-5">
              <Icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA ayudas */}
      <div className="rounded-lg bg-primary text-primary-foreground p-6 text-center">
        <h3 className="font-semibold text-lg mb-2">
          Mientras tanto, explora las ayudas disponibles
        </h3>
        <p className="text-sm text-primary-foreground/80 mb-4">
          Encuentra subvenciones, préstamos y fondos europeos para tu proyecto ahora mismo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="secondary">
            <Link href="/buscar">Ver todas las ayudas</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/wizard">Hacer el test</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

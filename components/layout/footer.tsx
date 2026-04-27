import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Marca */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-eu-blue text-eu-gold font-bold text-sm">
                ★
              </div>
              <span className="font-bold text-base">
                Fondos<span className="text-eu-blue">EU</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              El buscador de ayudas públicas para emprendedores en España.
              Fondos europeos, subvenciones estatales, autonómicas y locales
              en un solo lugar.
            </p>
          </div>

          {/* Herramientas */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Herramientas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/buscar" className="hover:text-foreground transition-colors">Buscador de ayudas</Link></li>
              <li><Link href="/wizard" className="hover:text-foreground transition-colors">Test de financiación</Link></li>
              <li><Link href="/calendario" className="hover:text-foreground transition-colors">Calendario de plazos</Link></li>
              <li><Link href="/fondos-europeos" className="hover:text-foreground transition-colors">Fondos europeos</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Información</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sobre" className="hover:text-foreground transition-colors">Sobre el proyecto</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground transition-colors">Contacto</Link></li>
              <li>
                <a
                  href="https://www.infosubvenciones.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  BDNS — Datos oficiales ↗
                </a>
              </li>
              <li>
                <a
                  href="https://next-generation-eu.europa.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  NextGenerationEU ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            <strong>Aviso:</strong> Los datos provienen de fuentes oficiales (BDNS/SNPSAP, RAISC, CIDO). Esta web no
            constituye asesoramiento jurídico, financiero ni fiscal. Verifica siempre los requisitos y plazos en la
            convocatoria oficial antes de presentar tu solicitud. FondosEU no está afiliado a ninguna administración pública.
          </p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            © {new Date().getFullYear()} FondosEU
          </p>
        </div>
      </div>
    </footer>
  );
}

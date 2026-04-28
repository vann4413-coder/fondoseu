import Link from "next/link";

export function CtaServices() {
  return (
    <section className="bg-gradient-to-r from-eu-blue to-blue-700 text-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            ¿Necesitas presencia online?
          </p>
          <h2 className="text-2xl font-bold mb-2">
            Si eres emprendedor, autónomo o PYME y necesitas una página web…
          </h2>
          <p className="text-blue-100 text-sm max-w-xl">
            Desde FondosEU también ayudamos a negocios a crear su presencia digital. Diseño profesional, rápido y asequible. <strong className="text-white">¡Cuéntanos tu proyecto!</strong>
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/contacto"
            className="inline-block bg-eu-gold text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition whitespace-nowrap"
          >
            Contáctanos →
          </Link>
        </div>
      </div>
    </section>
  );
}

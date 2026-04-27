import { EU_PROGRAMS } from "@/lib/eu-programs";

export default function FondosEuropeosPage() {
  return (
    <div className="space-y-12">
      <section className="bg-eu-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Fondos europeos para emprender</h1>
          <p className="text-lg text-blue-100">
            Descubre los principales programas de financiacion publica de la Union Europea
            disponibles para autónomos, PYMEs y startups en Espana.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {Object.entries(EU_PROGRAMS).map(([key, program]) => (
          <section key={key} className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-2">{program.fullName}</h2>
            <p className="text-gray-600 mb-4">{program.description}</p>
            <a
              href={program.officialUrl}
              className="text-eu-blue font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mas informacion en fuentes oficiales →
            </a>
          </section>
        ))}

        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Las 10 ayudas con fondos europeos mas buscadas</h2>
          <p className="text-gray-500">
            Esta lista se actualiza diariamente con los fondos UE proximos a cerrarse.
          </p>
        </section>

        <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">Quiero encontrar financiacion europea para mi proyecto</h3>
          <a
            href="/wizard"
            className="text-eu-blue font-semibold hover:underline"
          >
            Haz el test personalizado →
          </a>
        </div>
      </div>
    </div>
  );
}

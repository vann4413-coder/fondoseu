export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-eu-blue to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fondos europeos y todas las ayudas para emprender en España
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entra buscando fondos europeos. Te enseñamos todas las ayudas públicas que puedes pedir.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/wizard"
              className="bg-eu-gold text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition inline-block"
            >
              Hacer test (2 min)
            </a>
            <a
              href="/buscar"
              className="bg-white text-eu-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Explorar ayudas
            </a>
            <a
              href="/calendario"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-eu-blue transition inline-block"
            >
              Ver plazos
            </a>
          </div>
        </div>
      </section>

      {/* EU Programs Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4 text-center">¿Qué fondos europeos hay?</h2>
        <p className="text-center text-gray-600 mb-8">
          Explora los programas principales de financiación europea para emprendedores
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "NextGenerationEU / PRTR",
              desc: "Plan de Recuperación: digitalización, transición verde, emprendimiento.",
              icon: "🚀",
            },
            {
              name: "FEDER 2021-2027",
              desc: "Cofinancia innovación, desarrollo empresarial y cohesión territorial.",
              icon: "🏭",
            },
            {
              name: "FSE+ 2021-2027",
              desc: "Empleo, formación, emprendimiento y competencias.",
              icon: "👥",
            },
            {
              name: "Horizon Europe",
              desc: "Investigación e innovación para startups tech con alto potencial.",
              icon: "🔬",
            },
            {
              name: "EIC (Accelerator)",
              desc: "Acelerador de innovación para emprendedores disruptivos.",
              icon: "⚡",
            },
            {
              name: "InvestEU",
              desc: "Instrumento de inversión para PYMEs y startups.",
              icon: "💰",
            },
          ].map((program) => (
            <div
              key={program.name}
              className="border rounded-lg p-6 hover:shadow-lg transition bg-white"
            >
              <div className="text-4xl mb-2">{program.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
              <p className="text-gray-600 text-sm">{program.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/fondos-europeos"
            className="text-eu-blue font-semibold hover:underline"
          >
            Ver todos los programas europeos →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">¿Cómo funciona?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Responde un test",
                desc: "Cuéntanos sobre tu proyecto en 2 minutos: tipo, sector, ubicación, importe.",
              },
              {
                step: "2",
                title: "Recibe recomendaciones",
                desc: "Te mostramos las ayudas que encajan con tu perfil, priorizando fondos europeos.",
              },
              {
                step: "3",
                title: "Accede a la convocatoria",
                desc: "Cada ficha enlaza directamente a la convocatoria oficial para que cumplas los pasos.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-eu-blue text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonios</h2>
        <p className="text-center text-gray-500 text-sm">
          Los testimonios de emprendedores que han encontrado financiación irán aquí (próximamente).
        </p>
      </section>
    </div>
  );
}

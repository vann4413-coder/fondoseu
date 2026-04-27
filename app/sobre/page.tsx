export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-4">Sobre FondosEU</h1>
        <p className="text-lg text-gray-600 mb-4">
          FondosEU es un buscador de ayudas publicas disenado para emprendedores que quieren encontrar
          financiacion en Espana. Nuestro objetivo es aclarar el panorama de fondos europeos y ayudas
          complementarias del Estado.
        </p>
      </section>

      <section id="fuentes">
        <h2 className="text-2xl font-bold mb-4">Fuentes de datos</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">BDNS (Base de Datos Nacional de Subvenciones)</h3>
            <p className="text-gray-600">
              <a href="https://www.infosubvenciones.es/" className="text-eu-blue hover:underline">
                https://www.infosubvenciones.es/
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Fuente oficial publica de todas las subvenciones de administraciones Espanolas.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">RAISC (Registro de Ayudas, Incentivos y Subvenciones)</h3>
            <p className="text-gray-600">
              <a
                href="https://analisi.transparenciacatalunya.cat"
                className="text-eu-blue hover:underline"
              >
                Generalitat de Catalunya
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold">CIDO (Diputacio de Barcelona)</h3>
            <p className="text-gray-600">
              <a href="https://dadesobertes.diba.cat" className="text-eu-blue hover:underline">
                https://dadesobertes.diba.cat
              </a>
            </p>
          </div>
        </div>
      </section>

      <section id="disclaimer">
        <h2 className="text-2xl font-bold mb-4">Disclaimer Legal</h2>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
          <p className="mb-2">
            <strong>FondosEU recopila informacion de fuentes oficiales publicas.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>No constituye asesoramiento legal ni financiero</li>
            <li>No reemplaza la lectura de las convocatorias oficiales</li>
            <li>Verifica siempre los requisitos exactos en la pagina oficial de cada ayuda</li>
            <li>Los datos pueden estar desactualizados. Consulta siempre la fuente original.</li>
            <li>Los autores no se hacen responsables de errores u omisiones en los datos</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Metodologia</h2>
        <p className="text-gray-600">
          Filtramos agresivamente las convocatorias para mostrar solo las relevantes para autónomos,
          PYMEs, startups y cooperativas. Detectamos automaticamente la cofinanciacion europea analizando
          los textos de las convocatorias. Si tienes sugerencias o encuentras errores,{" "}
          <a href="mailto:info@fondoseu.es" className="text-eu-blue hover:underline">
            contacta con nosotros
          </a>
          .
        </p>
      </section>
    </div>
  );
}

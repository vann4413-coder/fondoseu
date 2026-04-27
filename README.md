# FondosEU - Fondos europeos y ayudas para emprender en Espana

## Configuracion rapida

### 1. Instalar dependencias
```bash
cd fondoseu
npm install
```

### 2. Configurar base de datos PostgreSQL
- Crea una BD PostgreSQL en **Neon** (gratuito): https://neon.tech/
- O usa **Supabase** (tambien gratuito): https://supabase.com/
- Copia la connection string en `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:5432/fondoseu
```

### 3. Crear migraciones
```bash
npm run db:generate
npm run db:push
```

### 4. Ejecutar el servidor
```bash
npm run dev
```

Abre http://localhost:3000

## Estructura del proyecto (Fase 1 completada)

```
fondoseu/
├── app/
│   ├── page.tsx              # Homepage
│   ├── buscar/page.tsx       # Search page (placeholder)
│   ├── fondos-europeos/      # EU programs showcase
│   ├── wizard/               # Recommendation wizard (placeholder)
│   ├── calendario/           # Timeline view (placeholder)
│   ├── sobre/                # About page
│   └── layout.tsx            # Root layout + header/footer
├── db/
│   ├── schema.ts             # Drizzle schema with EU detection
│   └── index.ts
├── lib/
│   ├── taxonomies.ts         # Enums y vocabs controlado
│   └── eu-programs.ts        # EU program metadata
├── scripts/
│   ├── sync-bdns.ts          # Download from BDNS API
│   └── seed.ts               # 15 curated funds
└── ...

## Fase 2: Sincronizacion con BDNS

### Descargar fondos desde BDNS

El script `scripts/sync-bdns.ts` hace 3 cosas:
1. Consulta la API BDNS por convocatorias abiertas
2. Filtra por beneficiario relevante (autonomo, PYME, startup, cooperativa)
3. **Detecta cofinanciacion UE** buscando keywords en el texto (NEXTGEN, FEDER, FSE+, etc.)

```bash
npm run sync:bdns
```

### Importar fondos curados

15 fondos pre-seleccionados y bien descritos (mezcla EU + nacionales):

```bash
npm run seed
```

## Endpoints BDNS utilizados

```
GET https://www.infosubvenciones.es/bdnstrans/buscarConvocatorias
  ?estado=O          # Open (Abierta)
  &formato=json
  &rows=100
```

Documentacion: https://www.infosubvenciones.es/bdnstrans/ayuda/pdf/AYUDA_API_REST

## Deteccion de cofinanciacion UE

El script busca estos campos y keywords:
- Campo `fondo_comunitario` del JSON
- Keywords: `nextgen`, `prtr`, `feder`, `fse`, `horizon`, `eic`, `life`, `investeu`

Resultado esperado para fase 2:
- ~100-200 fondos ingested del BDNS
- ~30-50% marcados como `eu_funded=true`

## Próximos pasos (Fases 3+)

- [ ] Página de búsqueda con filtros interactivos
- [ ] Fichas de fondos con detalles
- [ ] Wizard de recomendacion (multi-step)
- [ ] Calendario de plazos
- [ ] Landing SEO para "fondos europeos"

## Stack

- Next.js 15 (App Router) + TypeScript
- PostgreSQL (Neon/Supabase) + Drizzle ORM
- Tailwind CSS + shadcn/ui
- Validacion con Zod
- Deploy: Vercel (listo)

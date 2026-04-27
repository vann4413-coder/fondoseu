# FondosEU — Arquitectura y decisiones

## Proposito del proyecto

Construir un buscador web que ayude a emprendedores en Espana a encontrar financiacion publica:
- **Gancho**: Fondos europeos (NextGenerationEU, FEDER, FSE+, Horizon, EIC)
- **Promesa**: "Entra buscando fondos europeos. Te enseñamos TODAS las ayudas que puedes pedir."
- **Entrega**: Subvenciones, prestamos blandos, garantias y capital de fuentes publicas españolas y europeas

## Stack (decisiones)

### Next.js 15 + App Router
- ISR para fichas de fondos (cache + revalidacion)
- API routes para endpoints futuros
- TypeScript strict mode forzado
- Deploy facil en Vercel

### PostgreSQL (Neon/Supabase)
- Gratuito para MVP
- JSON fields para datos brutos de APIs
- Indices para filtros rapidos

### Drizzle ORM (NO Prisma)
- Lightweight, control total del SQL
- Type-safe
- Migraciones explícitas con drizzle-kit

### Tailwind + shadcn
- Componentes accesibles pre-hechos
- Extensible si fuera necesario
- Bundle ligero

## Modelo de datos — Nota clave sobre cofinanciacion UE

La tabla `funds` tiene estos campos CRITICOS para la promesa del producto:

```typescript
eu_funded: boolean         // Solo true si CONFIRMADO de fuentes
eu_program: EUProgram      // NEXTGEN, FEDER, FSE_PLUS, HORIZON, EIC, LIFE, INVESTEU, OTRO
eu_program_detail: string  // "PRTR — Componente 13", "FEDER 2021-2027", etc.
```

### Regla: NUNCA marques `eu_funded = true` por defecto
- Solo si la fuente lo confirma explicitamente
- El script sync-bdns.ts busca en:
  1. Campo `fondo_comunitario` del payload BDNS
  2. Keywords en texto libre (descripcion, requisitos, bases reguladoras)
- La credibilidad del proyecto depende de esto

## Arquitectura de ingesta (Fase 2)

### scripts/sync-bdns.ts
1. GET `https://www.infosubvenciones.es/bdnstrans/buscarConvocatorias?estado=O`
2. Filtra por beneficiario relevante (auto-detecta de texto)
3. Para cada convocatoria, detecta programa UE
4. Upsert a BD (INSERT si nuevo, UPDATE si ya existe)

### Logica de deteccion EU (detectEUProgram function)
```
1. Busca campo fondo_comunitario (JSON)
2. Si no hay, busca keywords en texto
3. Mapea a enum EUProgram
4. Guarda detail para mostrarlo al usuario
```

## Decisiones de diseño

### 1. Lenguaje claro, NO administrativo
- BDNS says: "PYME conforme Anexo I Reg. UE 651/2014"
- FondosEU says: "Pequenas y medianas empresas (< 250 empleados)"

### 2. Filtro agresivo al ingerir
- Excluye becas individuales
- Excluye ayudas a entes locales (no son users)
- Mantiene solo beneficiarios: autonomo, PYME, startup, cooperativa

### 3. Buscador sin login
- Zero friction para MVP
- Recomendaciones compartibles por URL

### 4. Noindex en algunas paginas (futuro)
- La home SI debe rankear (SEO priority)
- Fichas individuales SI rankean (cada fondo = landing page)
- Buscador NO rankea (query específica del user)

## Instrucciones para mantener coherencia

### Cuando actualices datos:
- Si añades un nuevo campo: primero migracion DB, luego actualiza seed + sync scripts
- Si cambias EUProgram enum: verifica que sync-bdns.ts mapea correctamente
- Si cambias taxonomies: actualiza discriminantes en sync (mapBeneficiaryTypes, etc.)

### Para nuevas APIs (RAISC, CIDO):
- Mismo patrón: scripts/sync-{fuente}.ts
- Mismo output: mismo schema de Fund
- Detecta UE igual que BDNS
- Cron endpoint llama a todos en serie

### Limites/Rates:
- BDNS: API publica sin rate limit (ir con cuidado, 100 requests max)
- Vercel Cron: daily interval es bueno para MVP

## Próximas decisiones

### Fase 3 (Buscador + Fichas)
- Usar React Hook Form + Zod para validacion de filtros
- ISR en /fondos/[slug] con revalidationTime=3600 (1h)

### Fase 4 (Wizard)
- shadcn Dialog + Stepper custom
- Scoring algorithm en lib/recommendation.ts
- Guardar recomendacion = generar URL compartible

### Fase 5 (Calendario)
- React Big Calendar o simple date-based grouping
- Filtros minimos (UE toggle + beneficiario)

### Fase 6 (Landing SEO)
- Content en MDX en /content/fondos-europeos/
- Esquema JSON-LD GovernmentService en fichas
- Open Graph con imagen + descripcion

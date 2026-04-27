/**
 * Cron endpoint para sincronizar datos
 * Se ejecuta automaticamente en Vercel o puede invocarse manualmente
 */

export async function GET(request: Request) {
  // Verificar token secreto para evitar acceso publico
  const token = request.headers.get("authorization");
  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // TODO: Llamar a sync-bdns.ts
    // TODO: Llamar a sync-cido.ts (futuro)
    // TODO: Llamar a sync-raisc.ts (futuro)

    return new Response(
      JSON.stringify({ status: "ok", message: "Sync scheduled" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cron sync error:", error);
    return new Response(
      JSON.stringify({ error: "Sync failed" }),
      { status: 500 }
    );
  }
}

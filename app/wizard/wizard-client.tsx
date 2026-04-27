"use client";
import { useState } from "react";
import Link from "next/link";
import { WizardForm } from "@/components/wizard/wizard-form";
import { FundCard } from "@/components/funds/fund-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatMatchReasons } from "@/lib/recommendation";
import type { WizardAnswers, RecommendationResult } from "@/lib/recommendation";
import { Sparkles, RefreshCw, Share2 } from "lucide-react";

export function WizardClient() {
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleComplete = async (answers: WizardAnswers) => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Error al calcular recomendaciones");
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setResults(null);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Sparkles className="h-12 w-12 text-primary mx-auto animate-pulse mb-4" />
        <p className="text-lg font-semibold">Analizando tu perfil…</p>
        <p className="text-muted-foreground text-sm mt-1">
          Cruzando cientos de ayudas para encontrar las más relevantes.
        </p>
      </div>
    );
  }

  if (results !== null) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Tus{" "}
              <span className="text-primary">
                {results.length} ayudas más relevantes
              </span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Ordenadas por relevancia para tu perfil.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={reset} className="gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Repetir test
            </Button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map(({ fund, score, matchReasons }, idx) => (
              <div key={fund.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-muted-foreground italic flex-1 line-clamp-1">
                    {formatMatchReasons(matchReasons)}
                  </p>
                </div>
                <FundCard fund={fund} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No encontramos ayudas exactas para tu perfil. Prueba a ampliar
              los criterios.
            </p>
            <Button onClick={reset}>Repetir con otros criterios</Button>
          </div>
        )}

        <Separator className="my-8" />
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/buscar">Ver todas las ayudas disponibles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <WizardForm onComplete={handleComplete} />;
}

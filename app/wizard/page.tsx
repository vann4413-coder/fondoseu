import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { WizardClient } from "./wizard-client";

export default function WizardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Encuentra tu financiación en 2 minutos</h1>
        <p className="text-muted-foreground">
          Responde algunas preguntas y te mostraremos las ayudas más relevantes para tu proyecto.
        </p>
      </div>

      <Suspense>
        <WizardClient />
      </Suspense>
    </div>
  );
}

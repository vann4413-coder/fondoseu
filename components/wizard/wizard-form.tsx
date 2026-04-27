"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SECTORS, STAGES } from "@/lib/taxonomies";
import type { WizardAnswers } from "@/lib/recommendation";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

type Step = {
  id: keyof WizardAnswers;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  options: { value: string; label: string; icon?: string }[];
};

const STEPS: Step[] = [
  {
    id: "stage",
    title: "¿En qué etapa está tu proyecto?",
    subtitle: "Esto nos ayuda a filtrar ayudas según la madurez del negocio.",
    type: "single",
    options: [
      { value: "idea", label: "Tengo una idea, aún no he empezado", icon: "💡" },
      { value: "validacion", label: "Estoy desarrollando el MVP o validando", icon: "🧪" },
      { value: "lanzamiento", label: "Ya tengo producto/servicio y primeros clientes", icon: "🚀" },
      { value: "crecimiento", label: "Estoy facturando y quiero crecer", icon: "📈" },
      { value: "internacionalizacion", label: "Quiero expandirme fuera de España", icon: "🌍" },
    ],
  },
  {
    id: "entityType",
    title: "¿Cómo te constituyes o piensas hacerlo?",
    subtitle: "Algunas ayudas exigen una forma jurídica concreta.",
    type: "single",
    options: [
      { value: "autonomo", label: "Autónomo / Freelance", icon: "👤" },
      { value: "sl", label: "SL / Startup / Empresa", icon: "🏢" },
      { value: "cooperativa", label: "Cooperativa o sociedad laboral", icon: "🤝" },
      { value: "unknown", label: "Aún no lo sé", icon: "❓" },
    ],
  },
  {
    id: "sectors",
    title: "¿En qué sectores opera tu proyecto?",
    subtitle: "Puedes elegir varios.",
    type: "multi",
    options: SECTORS.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: "location",
    title: "¿Dónde desarrollas tu actividad?",
    type: "single",
    options: [
      { value: "cataluña", label: "Cataluña", icon: "🟡" },
      { value: "españa", label: "En otro punto de España", icon: "🇪🇸" },
      { value: "provincial", label: "En un municipio o área rural específica", icon: "🏘️" },
    ],
  },
  {
    id: "amountRange",
    title: "¿Cuánta financiación necesitas aproximadamente?",
    type: "single",
    options: [
      { value: "<10k", label: "Menos de 10.000 €", icon: "💶" },
      { value: "10-50k", label: "10.000 – 50.000 €", icon: "💶" },
      { value: "50-200k", label: "50.000 – 200.000 €", icon: "💰" },
      { value: ">200k", label: "Más de 200.000 €", icon: "🏦" },
    ],
  },
  {
    id: "fundingType",
    title: "¿Qué tipo de financiación prefieres?",
    type: "single",
    options: [
      { value: "subvencion", label: "Subvención (a fondo perdido)", icon: "🎁" },
      { value: "prestamo", label: "Préstamo blando (bajo interés)", icon: "🔄" },
      { value: "capital", label: "Capital o inversión", icon: "📊" },
      { value: "cualquiera", label: "Me da igual, quiero ver todo", icon: "👀" },
    ],
  },
  {
    id: "transversalThemes",
    title: "¿Hay algún tema transversal en tu proyecto?",
    subtitle: "Hay ayudas específicas para estos perfiles.",
    type: "multi",
    options: [
      { value: "digitalizacion", label: "Digitalización", icon: "💻" },
      { value: "sostenibilidad", label: "Sostenibilidad / Medio ambiente", icon: "🌱" },
      { value: "mujer_emprendedora", label: "Emprendedora mujer", icon: "👩‍💼" },
      { value: "joven_30", label: "Joven emprendedor (< 30 años)", icon: "🎓" },
      { value: "zona_rural", label: "Zona rural o despoblada", icon: "🏡" },
      { value: "internacionalizacion", label: "Internacionalización", icon: "🌐" },
      { value: "innovacion", label: "Innovación / I+D", icon: "🔬" },
    ],
  },
  {
    id: "euPreference",
    title: "¿Te interesan especialmente los fondos europeos?",
    subtitle: "Si dices que sí, los ponderamos más arriba en los resultados.",
    type: "single",
    options: [
      {
        value: "priority",
        label: "Sí, prioriza fondos europeos (NextGen, FEDER, Horizon…)",
        icon: "🇪🇺",
      },
      {
        value: "any",
        label: "Me da igual el origen, quiero las mejores opciones",
        icon: "🔍",
      },
    ],
  },
];

const DEFAULT_ANSWERS: WizardAnswers = {
  stage: "idea",
  entityType: "unknown",
  sectors: [],
  location: "españa",
  amountRange: "10-50k",
  fundingType: "cualquiera",
  transversalThemes: [],
  euPreference: "any",
};

interface WizardFormProps {
  onComplete: (answers: WizardAnswers) => void;
}

export function WizardForm({ onComplete }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(DEFAULT_ANSWERS);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLast = currentStep === STEPS.length - 1;

  const getValue = (id: keyof WizardAnswers) => answers[id];

  const isSelected = (id: keyof WizardAnswers, value: string) => {
    const val = getValue(id);
    if (Array.isArray(val)) return val.includes(value);
    return val === value;
  };

  const handleSelect = (value: string) => {
    if (step.type === "single") {
      setAnswers((prev) => ({ ...prev, [step.id]: value }));
    } else {
      const current = (answers[step.id] as string[]) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers((prev) => ({ ...prev, [step.id]: next }));
    }
  };

  const canContinue = () => {
    if (step.type === "multi") return true; // multi siempre puede continuar (0 seleccionados = cualquiera)
    return !!getValue(step.id);
  };

  const next = () => {
    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const back = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Pregunta {currentStep + 1} de {STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pregunta */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-1">{step.title}</h2>
        {step.subtitle && (
          <p className="text-muted-foreground">{step.subtitle}</p>
        )}
        {step.type === "multi" && (
          <Badge variant="secondary" className="mt-2 text-xs">
            Selección múltiple
          </Badge>
        )}
      </div>

      {/* Opciones */}
      <div
        className={cn(
          "grid gap-3 mb-8",
          step.options.length > 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {step.options.map(({ value, label, icon }) => {
          const selected = isSelected(step.id, value);
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {icon && <span className="text-xl shrink-0">{icon}</span>}
              <span className="text-sm font-medium flex-1">{label}</span>
              {selected && step.type === "single" && (
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              )}
              {selected && step.type === "multi" && (
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={back}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button onClick={next} disabled={!canContinue()} className="gap-1">
          {isLast ? (
            <>
              <Sparkles className="h-4 w-4" />
              Ver mis ayudas
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import {
  SCOPES,
  BENEFICIARY_TYPES,
  FUNDING_TYPES,
  STAGES,
  SECTORS,
} from "@/lib/taxonomies";
import { EU_PROGRAMS, type EUProgramCode } from "@/lib/eu-programs";

const EU_PROGRAM_OPTIONS = (
  Object.keys(EU_PROGRAMS) as EUProgramCode[]
).filter((k) => k !== "OTRO");

export function FundFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      values.forEach((v) => params.append(key, v));
      params.set("pagina", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleValue = (key: string, value: string) => {
    const current = searchParams.getAll(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(key, next);
  };

  const setBoolean = (key: string, value: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, "true");
    } else {
      params.delete(key);
    }
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const euOnly = searchParams.get("ue") === "true";
  const activeScopes = searchParams.getAll("scope");
  const activeBeneficiaries = searchParams.getAll("beneficiario");
  const activeFundingTypes = searchParams.getAll("tipo");
  const activePrograms = searchParams.getAll("programa");
  const activeStages = searchParams.getAll("etapa");
  const activeSectors = searchParams.getAll("sector");
  const statusFilter = searchParams.get("estado") ?? "abierta";

  const activeCount = [
    euOnly,
    activeScopes.length > 0,
    activeBeneficiaries.length > 0,
    activeFundingTypes.length > 0,
    activePrograms.length > 0,
    activeStages.length > 0,
    activeSectors.length > 0,
    statusFilter !== "abierta",
  ].filter(Boolean).length;

  return (
    <aside className="space-y-5">
      {/* Cabecera filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeCount > 0 && (
            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 text-xs text-muted-foreground gap-1"
          >
            <X className="h-3 w-3" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Toggle UE — destacado */}
      <div className="flex items-center justify-between rounded-lg border border-eu-blue/30 bg-blue-50 p-3">
        <div>
          <Label htmlFor="toggle-ue" className="font-semibold text-eu-blue cursor-pointer">
            🇪🇺 Solo fondos europeos
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cofinanciados por la UE
          </p>
        </div>
        <Switch
          id="toggle-ue"
          checked={euOnly}
          onCheckedChange={(v) => setBoolean("ue", v)}
        />
      </div>

      <Separator />

      {/* Estado */}
      <FilterSection title="Estado">
        {["abierta", "proximamente", "cerrada"].map((s) => (
          <FilterItem
            key={s}
            id={`estado-${s}`}
            label={s === "abierta" ? "Abierta" : s === "proximamente" ? "Próximamente" : "Cerrada"}
            checked={statusFilter === s}
            onChange={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("estado", s);
              params.set("pagina", "1");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
          />
        ))}
      </FilterSection>

      <Separator />

      {/* Programa europeo */}
      {euOnly && (
        <>
          <FilterSection title="Programa europeo">
            {EU_PROGRAM_OPTIONS.map((code) => (
              <FilterItem
                key={code}
                id={`prog-${code}`}
                label={EU_PROGRAMS[code].shortName}
                checked={activePrograms.includes(code)}
                onChange={() => toggleValue("programa", code)}
              />
            ))}
          </FilterSection>
          <Separator />
        </>
      )}

      {/* Ámbito */}
      <FilterSection title="Ámbito geográfico">
        {SCOPES.map(({ value, label }) => (
          <FilterItem
            key={value}
            id={`scope-${value}`}
            label={label}
            checked={activeScopes.includes(value)}
            onChange={() => toggleValue("scope", value)}
          />
        ))}
      </FilterSection>

      <Separator />

      {/* Tipo de beneficiario */}
      <FilterSection title="Tipo de beneficiario">
        {BENEFICIARY_TYPES.slice(0, 6).map(({ value, label }) => (
          <FilterItem
            key={value}
            id={`ben-${value}`}
            label={label}
            checked={activeBeneficiaries.includes(value)}
            onChange={() => toggleValue("beneficiario", value)}
          />
        ))}
      </FilterSection>

      <Separator />

      {/* Tipo de financiación */}
      <FilterSection title="Tipo de financiación">
        {FUNDING_TYPES.map(({ value, label }) => (
          <FilterItem
            key={value}
            id={`tipo-${value}`}
            label={label.replace(" (a fondo perdido)", "")}
            checked={activeFundingTypes.includes(value)}
            onChange={() => toggleValue("tipo", value)}
          />
        ))}
      </FilterSection>

      <Separator />

      {/* Etapa */}
      <FilterSection title="Etapa del proyecto">
        {STAGES.map(({ value, label }) => (
          <FilterItem
            key={value}
            id={`etapa-${value}`}
            label={label}
            checked={activeStages.includes(value)}
            onChange={() => toggleValue("etapa", value)}
          />
        ))}
      </FilterSection>

      <Separator />

      {/* Sector — top 8 */}
      <FilterSection title="Sector">
        {SECTORS.slice(0, 8).map(({ value, label }) => (
          <FilterItem
            key={value}
            id={`sector-${value}`}
            label={label}
            checked={activeSectors.includes(value)}
            onChange={() => toggleValue("sector", value)}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer leading-tight">
        {label}
      </Label>
    </div>
  );
}

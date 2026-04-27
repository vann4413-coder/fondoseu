import Link from "next/link";
import { Clock, Euro, Building2, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EUBadge } from "./eu-badge";
import type { Fund } from "@/db/schema";
import {
  formatAmountRange,
  formatDate,
  daysUntil,
  urgencyLevel,
  truncate,
} from "@/lib/utils";
import { FUNDING_TYPES, SCOPES } from "@/lib/taxonomies";
import type { EUProgramCode } from "@/lib/eu-programs";

interface FundCardProps {
  fund: Fund;
  variant?: "default" | "compact";
}

const URGENCY_STYLES = {
  critica: "text-red-700 bg-red-50 border-red-200",
  alta: "text-orange-700 bg-orange-50 border-orange-200",
  media: "text-amber-700 bg-amber-50 border-amber-200",
  baja: "text-green-700 bg-green-50 border-green-200",
};

const FUNDING_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  FUNDING_TYPES.map((f) => [f.value, f.label])
);

const SCOPE_LABELS: Record<string, string> = Object.fromEntries(
  SCOPES.map((s) => [s.value, s.label])
);

export function FundCard({ fund, variant = "default" }: FundCardProps) {
  const days = daysUntil(fund.closeDate);
  const urgency = urgencyLevel(days);

  return (
    <Card
      className={`group hover:shadow-md transition-shadow flex flex-col h-full ${
        fund.euFunded ? "border-eu-blue/20 hover:border-eu-blue/40" : ""
      }`}
    >
      <CardHeader className="pb-2">
        {/* Badges superiores */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {fund.euFunded && (
            <EUBadge program={fund.euProgram as EUProgramCode | null} size="sm" />
          )}
          <Badge variant="outline" className="text-xs">
            {SCOPE_LABELS[fund.scope] ?? fund.scope}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {FUNDING_TYPE_LABELS[fund.fundingType] ?? fund.fundingType}
          </Badge>
          {fund.status === "abierta" && (
            <Badge variant="success" className="text-xs">
              Abierta
            </Badge>
          )}
          {fund.status === "proximamente" && (
            <Badge variant="warning" className="text-xs">
              Próximamente
            </Badge>
          )}
          {fund.status === "cerrada" && (
            <Badge variant="secondary" className="text-xs opacity-60">
              Cerrada
            </Badge>
          )}
        </div>

        <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/fondos/${fund.slug}`}>{fund.title}</Link>
        </CardTitle>

        {fund.organism && (
          <CardDescription className="flex items-center gap-1 text-xs mt-0.5">
            <Building2 className="h-3 w-3 shrink-0" />
            {truncate(fund.organism, 60)}
          </CardDescription>
        )}
      </CardHeader>

      {variant === "default" && (
        <CardContent className="flex-1 pb-3">
          {fund.shortDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {fund.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-3">
            {(fund.amountMin || fund.amountMax) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Euro className="h-3.5 w-3.5 text-green-600" />
                <span className="font-medium text-foreground">
                  {formatAmountRange(fund.amountMin, fund.amountMax)}
                </span>
              </div>
            )}
            {fund.closeDate && (
              <div
                className={`flex items-center gap-1 text-xs rounded border px-2 py-0.5 ${
                  urgency ? URGENCY_STYLES[urgency] : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3 w-3" />
                {days !== null && days >= 0 ? (
                  days === 0 ? (
                    <span className="font-semibold">¡Cierra hoy!</span>
                  ) : (
                    <span>
                      {days <= 30 ? (
                        <span className="font-semibold">
                          {days}d restantes
                        </span>
                      ) : (
                        <span>Hasta {formatDate(fund.closeDate)}</span>
                      )}
                    </span>
                  )
                ) : (
                  <span>Cierra {formatDate(fund.closeDate)}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-0">
        <Button asChild variant="ghost" size="sm" className="ml-auto gap-1 text-xs">
          <Link href={`/fondos/${fund.slug}`}>
            Ver ficha
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FundCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex gap-1.5 mb-2">
          <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-5 bg-muted rounded animate-pulse mb-1" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-8 w-20 bg-muted rounded animate-pulse ml-auto" />
      </CardFooter>
    </Card>
  );
}

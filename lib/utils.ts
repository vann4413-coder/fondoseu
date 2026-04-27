import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatAmount(amount: number | string | null): string {
  if (amount === null || amount === undefined) return "Sin especificar";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Sin especificar";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M €`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K €`;
  }
  return `${num.toLocaleString("es-ES")} €`;
}

export function formatAmountRange(
  min: number | string | null,
  max: number | string | null
): string {
  if (!min && !max) return "Sin especificar";
  if (!min) return `Hasta ${formatAmount(max)}`;
  if (!max) return `Desde ${formatAmount(min)}`;
  return `${formatAmount(min)} – ${formatAmount(max)}`;
}

export function formatDate(date: string | null): string {
  if (!date) return "Sin fecha";
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function urgencyLevel(
  days: number | null
): "critica" | "alta" | "media" | "baja" | null {
  if (days === null) return null;
  if (days < 0) return null;
  if (days <= 7) return "critica";
  if (days <= 30) return "alta";
  if (days <= 90) return "media";
  return "baja";
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

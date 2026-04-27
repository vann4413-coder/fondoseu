"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
}

export function Pagination({ page, total, limit }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded border disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-muted-foreground">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
        <span className="ml-2 text-xs">({total} resultados)</span>
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded border disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

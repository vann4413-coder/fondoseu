"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";
import { Search, X } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const q = searchParams.get("q") ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={q}
          placeholder="Buscar por nombre u organismo…"
          className="w-full border rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue/30"
        />
        {q && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-eu-blue text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  );
}

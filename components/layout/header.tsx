import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Globe, Info, Sparkles, Mail } from "lucide-react";

const navLinks = [
  { href: "/buscar", label: "Buscar ayudas", icon: Search },
  { href: "/wizard", label: "Test rápido", icon: Sparkles },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/fondos-europeos", label: "Fondos europeos", icon: Globe },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/contacto", label: "Contacto", icon: Mail },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-eu-blue text-white font-bold text-sm">
            <span className="text-eu-gold">★</span>
          </div>
          <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            Fondos<span className="text-eu-blue">EU</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/wizard">
              <Sparkles className="h-3.5 w-3.5" />
              Encontrar mi ayuda
            </Link>
          </Button>
        </div>

        {/* Mobile: solo botón buscar */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/buscar" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/wizard">Test</Link>
          </Button>
        </div>
      </div>

      {/* Mobile nav — barra inferior */}
      <nav className="md:hidden border-t">
        <div className="container flex items-center justify-around py-1.5">
          {navLinks.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span className="leading-none">{label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

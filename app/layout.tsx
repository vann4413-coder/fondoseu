import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CtaServices } from "@/components/layout/cta-services";

export const metadata: Metadata = {
  title: {
    default: "FondosEU - Fondos europeos y ayudas para emprender en España",
    template: "%s | FondosEU",
  },
  description:
    "Encuentra todas las ayudas públicas, subvenciones y fondos europeos (NextGenerationEU, FEDER, FSE+, Horizon) para tu proyecto empresarial en España.",
  metadataBase: new URL("https://fondoseu.org"),
  openGraph: {
    title: "FondosEU - Fondos europeos para emprender",
    description:
      "Descubre subvenciones, préstamos y ayudas públicas de Europa y España para autónomos, PYMEs y startups.",
    url: "https://fondoseu.org",
    siteName: "FondosEU",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FondosEU - Fondos europeos para emprender en España",
    description:
      "Descubre subvenciones, préstamos y ayudas públicas de Europa y España para autónomos, PYMEs y startups.",
  },
  verification: {
    google: "LuTyXSGN0qs6j9A5EbXoDSkOTuqipfSr2OMmlTgBGiM",
  },
  alternates: {
    canonical: "https://fondoseu.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Header />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <CtaServices />
        <Footer />
      </body>
    </html>
  );
}

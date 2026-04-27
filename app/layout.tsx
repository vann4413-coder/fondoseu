import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "FondosEU - Fondos europeos y ayudas para emprender en España",
  description:
    "Encuentra todas las ayudas públicas, subvenciones y fondos europeos (NextGenerationEU, FEDER, FSE+, Horizon) para tu proyecto empresarial en España.",
  openGraph: {
    title: "FondosEU - Fondos europeos para emprender",
    description:
      "Descubre subvenciones, préstamos y ayudas públicas de Europa y España para autónomos, PYMEs y startups.",
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
        <Footer />
      </body>
    </html>
  );
}

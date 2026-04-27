"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactoPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabecera */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Contacto</h1>
        <p className="text-muted-foreground">
          ¿Tienes alguna pregunta, sugerencia o detectaste un error en algún fondo? Escríbenos.
        </p>
      </div>

      {status === "ok" ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">¡Mensaje enviado!</h2>
          <p className="text-muted-foreground mb-6">
            Hemos recibido tu mensaje. Te responderemos lo antes posible.
          </p>
          <Button variant="outline" onClick={() => setStatus("idle")}>
            Enviar otro mensaje
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="¿En qué te podemos ayudar?"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Mensaje</Label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Escribe aquí tu mensaje…"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos directamente.
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={status === "sending"}>
            <Send className="h-4 w-4" />
            {status === "sending" ? "Enviando…" : "Enviar mensaje"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            También puedes escribirnos directamente a{" "}
            <a href="mailto:hola@fondoseu.es" className="text-primary hover:underline">
              hola@fondoseu.es
            </a>
          </p>
        </form>
      )}
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error("[contact] GMAIL_USER o GMAIL_APP_PASSWORD no configurados");
      return NextResponse.json({ error: "Email no configurado" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"FondosEU Web" <${user}>`,
      to: user,
      replyTo: email,
      subject: `[FondosEU] ${subject}`,
      text: `De: ${name} <${email}>\n\n${message}`,
      html: `
        <p><strong>De:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr/>
        <p style="white-space:pre-line">${message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}

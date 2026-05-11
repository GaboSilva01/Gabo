import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, pdfData } = body;

    const SMTP_EMAIL = process.env.SMTP_EMAIL;
    const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
      return NextResponse.json(
        { error: 'Credenciales de SMTP no configuradas en .env.local' },
        { status: 500 }
      );
    }

    // Configurar Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true para 465 en Vercel
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const emailSubject = `Nueva Solicitud de Cotización - ${user.companyName}`;

    await transporter.sendMail({
      from: `"Coveplast Web" <${SMTP_EMAIL}>`, // remitente
      to: 'coveplast.comercializacion@gmail.com', // destinatario
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">📋 Nueva solicitud de cotización</h2>
          <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Empresa:</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${user.companyName}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Correo:</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${user.email}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Teléfono:</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${user.phone}</td>
            </tr>
          </table>
          <p style="color: #555;">Se adjunta el PDF de la cotización con los productos solicitados.</p>
          <hr/>
          <p style="font-size:12px; color:#aaa;">Enviado desde la plataforma web vía Nodemailer</p>
        </div>
      `,
      attachments: [
        {
          filename: `Cotizacion_${user.companyName.replace(/\s+/g, '_')}.pdf`,
          path: pdfData,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ message: 'Cotización enviada con éxito' }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error al enviar correo:', error);
    return NextResponse.json({ error: `Error al enviar correo: ${error.message || String(error)}` }, { status: 500 });
  }
}

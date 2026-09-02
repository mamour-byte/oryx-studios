import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, service, message } = body;

    if (!nom || !email || !service || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Veuillez remplir tous les champs requis avant d'envoyer votre demande.",
        },
        { status: 400 }
      );
    }

    const mailUser = process.env.MAIL_USER || process.env.mail || "oryxstudios1@gmail.com";
    const mailPass = process.env.MAIL_PASSWORD || process.env.mail_password;

    if (!mailUser || !mailPass) {
      return NextResponse.json(
        {
          success: false,
          error: "La configuration SMTP du site est incomplète. Vérifiez les variables MAIL_USER / MAIL_PASSWORD.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const mailOptions = {
      from: `"Oryx Studios" <${mailUser}>`,
      to: "contact@oryx-studios.com",
      replyTo: email,
      subject: `Nouvelle demande de devis - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h2 style="margin-bottom: 16px; color: #1d4ed8;">Nouvelle demande de devis</h2>

          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
          <p><strong>Service :</strong> ${service}</p>

          <div style="margin-top: 20px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
            <strong>Message :</strong>
            <p style="margin-top: 8px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Votre demande a bien été envoyée.",
    });
  } catch (error: any) {
    console.error("=== CONTACT FORM DEBUG ===");
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Error response:", error?.response);
    console.error("Full error:", error);
    console.error("SMTP user:", process.env.MAIL_USER || process.env.mail || "oryxstudios1@gmail.com");
    console.error("SMTP password set:", !!(process.env.MAIL_PASSWORD || process.env.mail_password));
    console.error("=== END CONTACT FORM DEBUG ===");

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Une erreur est survenue lors de l'envoi du message.",
      },
      { status: 500 }
    );
  }
}

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Données invalides.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { nom, email, date, budget, message, consent } = data;

    // Validation
    if (!nom || !email || !date || !message || !consent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Adresse email invalide.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: parseInt(import.meta.env.SMTP_PORT),
      secure: import.meta.env.SMTP_SECURE === 'true',
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: import.meta.env.SMTP_USER,
      to: import.meta.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Demande de devis - Mariage du ${date}`,
      text: `
Nouvelle demande de devis

Informations :
- Noms : ${nom}
- Email : ${email}
- Date du mariage : ${date}
- Budget envisagé : ${budget || 'Non spécifié'}

Message :
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #C2A56B; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #5E5B55; }
    .message { background-color: white; padding: 15px; margin-top: 15px; border-left: 4px solid #C2A56B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle demande de devis</h1>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">Noms :</span> ${nom}
      </div>
      <div class="info-row">
        <span class="label">Email :</span> <a href="mailto:${email}">${email}</a>
      </div>
      <div class="info-row">
        <span class="label">Date du mariage :</span> ${date}
      </div>
      <div class="info-row">
        <span class="label">Budget envisagé :</span> ${budget || 'Non spécifié'}
      </div>
      <div class="message">
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Votre demande a été envoyée avec succès !'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

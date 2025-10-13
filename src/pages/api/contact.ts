import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import he from 'he';

export const prerender = false;

// Rate limiting store (in-memory, basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 requests per hour (reasonable for contact form)
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Input size limits
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Cleanup old entries every 10 minutes
setInterval(cleanupRateLimitStore, 10 * 60 * 1000);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limiting
    const ip = clientAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Trop de requêtes. Veuillez réessayer plus tard.'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Type validation
    if (typeof nom !== 'string' || typeof email !== 'string' ||
        typeof date !== 'string' || typeof message !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Format de données invalide.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Input size limits
    if (nom.length > MAX_NAME_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères.`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `L'email ne doit pas dépasser ${MAX_EMAIL_LENGTH} caractères.`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères.`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation (improved)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Adresse email invalide.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Format de date invalide.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize all inputs (encode HTML entities to prevent XSS)
    const sanitizedNom = he.encode(nom.trim());
    const sanitizedEmail = he.encode(email.trim());
    const sanitizedDate = he.encode(date.trim());
    const sanitizedBudget = budget ? he.encode(String(budget).trim()) : 'Non spécifié';
    const sanitizedMessage = he.encode(message.trim());

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

    // Email content (using sanitized inputs)
    const mailOptions = {
      from: import.meta.env.SMTP_USER,
      to: import.meta.env.CONTACT_EMAIL,
      replyTo: sanitizedEmail,
      subject: `Demande de devis - Mariage du ${sanitizedDate}`,
      text: `
Nouvelle demande de devis

Informations :
- Noms : ${sanitizedNom}
- Email : ${sanitizedEmail}
- Date du mariage : ${sanitizedDate}
- Budget envisagé : ${sanitizedBudget}

Message :
${sanitizedMessage}
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
        <span class="label">Noms :</span> ${sanitizedNom}
      </div>
      <div class="info-row">
        <span class="label">Email :</span> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>
      </div>
      <div class="info-row">
        <span class="label">Date du mariage :</span> ${sanitizedDate}
      </div>
      <div class="info-row">
        <span class="label">Budget envisagé :</span> ${sanitizedBudget}
      </div>
      <div class="message">
        <p><strong>Message :</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
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
    // Log error without exposing details to client
    console.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

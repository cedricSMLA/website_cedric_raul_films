import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import he from 'he';
import { forfaitLabels } from '@/data/forfaits';
import {
  contientLien,
  adresseBloquee,
  lireListeBloquee,
  ressembleARobot
} from '@/lib/antispam';

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

    // `forfait` est le champ envoyé par le formulaire ; `budget` reste accepté
    // pour compatibilité avec l'ancienne version du formulaire.
    const { nom, email, date, forfait, budget, message, consent } = data;

    // Robots : champ piège rempli ou formulaire envoyé en moins de 3 secondes.
    // On répond « envoyé » sans rien envoyer, pour ne pas indiquer au robot
    // qu'il a été repéré.
    if (ressembleARobot(data.site_web, data.duree)) {
      console.warn(`Contact bloqué (robot) depuis ${ip}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Votre demande a été envoyée avec succès !'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Adresse refusée : messagerie jetable, fragment vu dans des arnaques,
    // ou entrée de la liste CONTACT_BLOCKED.
    if (adresseBloquee(email, lireListeBloquee(process.env.CONTACT_BLOCKED))) {
      console.warn(`Contact bloqué (adresse refusée) depuis ${ip}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Votre demande n'a pas pu être envoyée avec cette adresse email."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Aucun lien dans le formulaire : c'est le vecteur des tentatives de
    // hameçonnage (faux « programme du mariage » demandant un mot de passe).
    if (contientLien(nom) || contientLien(message)) {
      console.warn(`Contact bloqué (lien dans le message) depuis ${ip}`);
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Pour des raisons de sécurité, les liens et adresses de sites ne sont pas acceptés dans ce formulaire. Retirez-les de votre message : nous échangerons les documents par email ensuite."
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

    // Valeurs brutes : utilisées pour les en-têtes et la version texte de l'email
    // (he.encode transformerait les accents en entités illisibles hors HTML).
    // `email` et `date` alimentent des en-têtes (replyTo, subject) : on retire tout
    // retour à la ligne, car en JS `$` tolère un \n final et laisserait passer une
    // tentative d'injection d'en-tête.
    const stripBreaks = (value: string) => value.replace(/[\r\n]/g, '');
    const rawNom = nom.trim();
    const rawEmail = stripBreaks(email.trim());
    const rawDate = stripBreaks(date.trim());
    const forfaitCode = String(forfait ?? budget ?? '').trim();
    const rawForfait = forfaitLabels[forfaitCode] || 'Non spécifié';
    const rawMessage = message.trim();

    // Valeurs échappées : uniquement pour la version HTML de l'email (anti-XSS)
    const safeNom = he.encode(rawNom);
    const safeEmail = he.encode(rawEmail);
    const safeDate = he.encode(rawDate);
    const safeForfait = he.encode(rawForfait);
    const safeMessage = he.encode(rawMessage);

    // Garde-fou : sans identifiants SMTP valides, l'envoi échoue en 500 générique.
    // On le détecte ici pour laisser une trace explicite dans les logs serveur.
    const smtpPass = process.env.SMTP_PASS;
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPass ||
        smtpPass === 'votre_mot_de_passe' || smtpPass === 'your_smtp_password_here') {
      console.error(
        'Configuration SMTP manquante ou placeholder : vérifiez SMTP_HOST/SMTP_USER/SMTP_PASS ' +
        'dans /etc/cedric-raul/app.env (EnvironmentFile du service systemd).'
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: rawEmail,
      subject: `Demande de devis - Mariage du ${rawDate}`,
      text: `
Nouvelle demande de devis

Informations :
- Noms : ${rawNom}
- Email : ${rawEmail}
- Date du mariage : ${rawDate}
- Forfait souhaité : ${rawForfait}

Message :
${rawMessage}

--
Rappel sécurité : ce message vient du formulaire public du site.
Ne saisissez jamais votre adresse email et votre mot de passe sur un site
envoyé par un prospect, même pour « consulter un programme ».
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #26342B; color: #F5F2EA; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #586058; }
    .message { background-color: white; padding: 15px; margin-top: 15px; border: 1px solid #D6D3C6; }
    .securite { margin-top: 20px; padding: 12px 15px; border: 1px solid #A0562F; color: #7A3F20; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle demande de devis</h1>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">Noms :</span> ${safeNom}
      </div>
      <div class="info-row">
        <span class="label">Email :</span> <a href="mailto:${safeEmail}">${safeEmail}</a>
      </div>
      <div class="info-row">
        <span class="label">Date du mariage :</span> ${safeDate}
      </div>
      <div class="info-row">
        <span class="label">Forfait souhaité :</span> ${safeForfait}
      </div>
      <div class="message">
        <p><strong>Message :</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="securite">
        <strong>Rappel sécurité :</strong> ce message vient du formulaire public du site.
        Ne saisissez jamais votre adresse email et votre mot de passe sur un site envoyé
        par un prospect, même pour « consulter un programme ».
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

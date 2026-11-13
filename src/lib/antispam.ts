/**
 * Protection du formulaire de contact contre le hameçonnage et les robots.
 *
 * Le scénario visé : un faux prospect remplit le formulaire, choisit un
 * forfait, et glisse dans son message un lien vers un site qui demande
 * une adresse email et un mot de passe (« pour consulter le programme du
 * mariage »). La règle principale est donc simple : AUCUN lien n'est
 * accepté dans le formulaire. Un vrai couple n'en a pas besoin pour une
 * première prise de contact.
 *
 * Pour bloquer une adresse ou un domaine précis sans toucher au code,
 * renseigner la variable d'environnement CONTACT_BLOCKED (voir .env.example).
 */

/** Extensions de domaine reconnues quand une adresse est écrite sans « http ».
 *  Les extensions qui sont aussi des mots français courants (.de, .la, .ma,
 *  .et, .me, .co…) sont volontairement absentes pour ne pas bloquer une phrase
 *  où il manque une espace après un point. */
const EXTENSIONS =
  'com|net|org|fr|eu|io|info|biz|xyz|top|link|site|online|app|page|click|shop|store|live|club|' +
  'dev|pro|cloud|website|space|icu|ru|cn|su|tk|ml|ga|cf|gq|cc|ly|gl|gle|gg|to|ws|pw|in|uk|us|ch|be|ca';

const MOTIFS_LIEN: RegExp[] = [
  // Adresse complète
  /\b(?:https?|ftp|hxxps?)\s*:\s*\/\s*\//i,
  /\bwww\s*\.\s*[a-z0-9-]/i,
  // Domaine nu (exemple.com/chemin), sauf s'il fait partie d'une adresse email
  new RegExp(`(?<![@\\w.-])(?:[a-z0-9-]+\\.)+(?:${EXTENSIONS})(?![a-z0-9-])`, 'i'),
  // Raccourcisseurs et messageries dont l'extension n'est pas dans la liste
  /(?<![@\w.-])(?:t|wa)\.me\//i,
  // Écritures déguisées : exemple[.]com, exemple(dot)com, exemple dot com
  /\[\s*\.\s*\]|\(\s*\.\s*\)|\(\s*dot\s*\)|\[\s*dot\s*\]/i,
  new RegExp(`\\b[a-z0-9-]+\\s+(?:dot|point)\\s+(?:${EXTENSIONS})\\b`, 'i'),
  // Balises
  /<\s*a\b|\bhref\s*=|\[url\b/i
];

/** Vrai si le texte contient quelque chose qui ressemble à un lien. */
export function contientLien(texte: string): boolean {
  // Les caractères invisibles servent à couper un lien pour tromper les filtres
  const nettoye = texte.normalize('NFKC').replace(/[​-‍⁠﻿­]/g, '');
  return MOTIFS_LIEN.some((motif) => motif.test(nettoye));
}

/** Messageries jetables : aucune raison de s'en servir pour préparer un mariage. */
const DOMAINES_JETABLES = [
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'sharklasers.com',
  'yopmail.com',
  'yopmail.fr',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  '10minutemail.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
  'dispostable.com',
  'throwawaymail.com',
  'mohmal.com',
  'emailondeck.com',
  'fakeinbox.com',
  'mailnesia.com',
  'tempr.email',
  'discard.email',
  'moakt.com',
  'mail.tm',
  'tmpmail.org'
];

/** Fragments d'adresse vus dans les tentatives d'arnaque reçues.
 *  Comparés sans tenir compte des points, tirets et majuscules. */
const FRAGMENTS_BLOQUES = ['prodmail', 'mailprod'];

/** Lit CONTACT_BLOCKED : liste séparée par des virgules de domaines
 *  (exemple.com), d'adresses complètes ou de fragments (prodmail). */
export function lireListeBloquee(valeur: string | undefined): string[] {
  return (valeur ?? '')
    .split(',')
    .map((entree) => entree.trim().toLowerCase())
    .filter(Boolean);
}

const sansSeparateurs = (texte: string) => texte.replace(/[.\-_+]/g, '');

/** Vrai si l'adresse email de l'expéditeur est refusée. */
export function adresseBloquee(email: string, listeSupplementaire: string[] = []): boolean {
  const adresse = email.trim().toLowerCase();
  const domaine = adresse.split('@').pop() ?? '';

  const domaineInterdit = (interdit: string) =>
    domaine === interdit || domaine.endsWith(`.${interdit}`);

  if (DOMAINES_JETABLES.some(domaineInterdit)) return true;

  const compacte = sansSeparateurs(adresse);
  if (FRAGMENTS_BLOQUES.some((fragment) => compacte.includes(fragment))) return true;

  return listeSupplementaire.some((entree) => {
    if (entree.includes('@')) return adresse === entree;
    if (entree.includes('.')) return domaineInterdit(entree);
    return compacte.includes(sansSeparateurs(entree));
  });
}

/** Délai minimum entre l'affichage du formulaire et son envoi.
 *  Un humain met bien plus de 3 secondes à remplir cinq champs. */
export const DELAI_MINIMUM_MS = 3000;

/** Vrai si l'envoi a toutes les chances de venir d'un robot :
 *  champ piège rempli, ou formulaire envoyé trop vite. */
export function ressembleARobot(champPiege: unknown, dureeMs: unknown): boolean {
  if (typeof champPiege === 'string' && champPiege.trim() !== '') return true;
  if (typeof dureeMs === 'number' && Number.isFinite(dureeMs) && dureeMs < DELAI_MINIMUM_MS) {
    return true;
  }
  return false;
}

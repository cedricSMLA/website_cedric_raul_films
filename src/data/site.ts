/**
 * Informations communes à tout le site : coordonnées, réseaux, navigation.
 * Une valeur affichée sur plusieurs pages se modifie ICI.
 */

export const EMAIL = 'contact@cedricraulfilms.fr';
export const INSTAGRAM = 'https://www.instagram.com/cedric_raul_films/';
export const YOUTUBE = 'https://www.youtube.com/@C%C3%A9dricRa%C3%BAlFilms';

/** Délai de réponse annoncé partout (contact, services). */
export const DELAI_REPONSE = '24h';

export const TAGLINE = "Films de mariage cinématographiques qui provoquent l'émotion";
export const LOCALISATION = 'Basé à Paris • Disponible partout ailleurs';

export interface NavItem {
  href: string;
  label: string;
  /** Autres pages qui allument cette entrée du menu. */
  aussi?: string[];
}

/** Menu principal (en-tête). */
export const navPrincipale: NavItem[] = [
  { href: '/', label: 'Films' },
  { href: '/services', label: 'Services' },
  { href: '/tarifs-forfaits', label: 'Tarifs' },
  { href: '/a-propos', label: 'À propos', aussi: ['/loren', '/nos-partenaires'] }
];

/** Pages secondaires : menu mobile et pied de page. */
export const navSecondaire: NavItem[] = [
  { href: '/loren', label: "L'univers LOREN" },
  { href: '/nos-partenaires', label: 'Nos partenaires' }
];

export const temoignages = [
  {
    texte:
      "J'ai eu des frissons en regardant notre film. J'étais émue aux larmes. Cédric a capturé des moments que je pensais avoir oubliés.",
    auteur: 'Raumane & Maxime',
    date: 'Octobre 2024'
  },
  {
    texte:
      "Je savais que Cédric faisait du bon travail, mais le résultat a largement dépassé mes espérances. C'est du grand cinéma.",
    auteur: 'Thomas',
    date: 'Août 2024'
  }
];

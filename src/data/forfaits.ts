/**
 * Source unique du catalogue LOREN.
 *
 * Toute valeur commerciale (prix, heures de présence, durée du film, teaser,
 * délai de livraison, inclusions) se modifie ICI et nulle part ailleurs.
 * Les consommateurs de ce fichier sont :
 *   - src/pages/tarifs-forfaits.astro  (cartes + modales de détail)
 *   - src/pages/loren.astro            (fiches descriptives)
 *   - src/pages/contact.astro          (menu déroulant du formulaire)
 *   - src/pages/api/contact.ts         (libellé repris dans l'email de devis)
 *
 * Avant ce fichier, chaque valeur était saisie à la main dans 2 à 4 endroits,
 * ce qui avait fini par désynchroniser les pages (teaser Pure 45s vs 60s,
 * film Infinie 15 min vs 12 min).
 */

/** Délai de livraison commun à tous les forfaits. */
export const LIVRAISON = '2 à 4 semaines';

export interface Forfait {
  id: string;
  /** Nom court affiché sur la carte tarifs : « PURE ». */
  nom: string;
  /** Nom complet affiché sur la page LOREN et dans le formulaire. */
  nomComplet: string;
  /** Prix affiché. `null` pour un forfait sur devis. */
  prix: number | null;
  /** Prix formaté : « 1 700€ » ou « Sur devis ». */
  prixLabel: string;
  /** Heures de présence le jour J. `null` si non applicable. */
  heures: number | null;
  /** Formulation propre à la page LOREN : « couverture minutieuse ». */
  presenceLoren: string;
  /** Accroche de la carte tarifs. */
  tagline: string;
  /** Ligne « Idéal pour » de la carte tarifs. */
  idealPour: string;
  /** Citation en exergue sur la page LOREN. */
  citation: string;
  /** Paragraphe de clôture sur la page LOREN. */
  description: string;
  /** 3 bénéfices maximum, visibles sans ouvrir la modale. */
  beneficesCles: string[];
  /** Liste complète et identique sur les deux pages. Hors heures et livraison,
   *  que chaque page affiche à sa manière. */
  inclusions: string[];
}

const DRONE = 'Drone et drone FPV (selon lieu et conditions)';
const SON = 'Design sonore immersif et colorimétrie cinéma';
const APPEL = 'Appel découverte personnalisé';
const GALERIE = 'Galerie en ligne privée';

export const forfaits: Forfait[] = [
  {
    id: 'pure',
    nom: 'PURE',
    nomComplet: 'LOREN Pure',
    prix: 1700,
    prixLabel: '1 700€',
    heures: 8,
    presenceLoren: 'couverture minutieuse',
    tagline: "L'essence de votre journée, sans compromis sur l'émotion",
    idealPour: 'Idéal pour les cérémonies intimistes',
    citation: "L'essence de votre histoire en 6 minutes.",
    description:
      "L'essentiel capturé avec précision. Chaque instant choisi pour sa capacité à raconter l'âme de votre célébration.",
    beneficesCles: ['Film cinéma 6 min + teaser 60 sec', APPEL, 'Montage cinématographique'],
    inclusions: [
      'Film complet monté (6 min)',
      'Teaser (60 sec)',
      APPEL,
      DRONE,
      'Montage cinématographique',
      SON,
      GALERIE
    ]
  },
  {
    id: 'ame',
    nom: 'ÂME',
    nomComplet: 'LOREN Âme',
    prix: 2000,
    prixLabel: '2 000€',
    heures: 10,
    presenceLoren: 'présence discrète',
    tagline: 'Chaque émotion, chaque instant décisif immortalisé',
    idealPour: 'Idéal pour une couverture étendue et complète',
    citation: 'Chaque émotion capturée pendant 10 heures.',
    description:
      'Une amplitude émotionnelle plus large. Du premier regard aux dernières danses, une narration équilibrée qui révèle la profondeur et les nuances de votre union.',
    beneficesCles: ['Film cinéma 10 min + teaser 60 sec', APPEL, 'Montage cinématographique'],
    inclusions: [
      'Film complet monté (10 min)',
      'Teaser (60 sec)',
      APPEL,
      DRONE,
      'Montage cinématographique',
      SON,
      'Rushes bruts triés disponibles sur demande',
      GALERIE
    ]
  },
  {
    id: 'infinie',
    nom: 'INFINIE',
    nomComplet: 'LOREN Infinie',
    prix: 2500,
    prixLabel: '2 500€',
    heures: 12,
    presenceLoren: 'couverture intégrale',
    tagline: 'Votre mariage comme une œuvre cinématographique',
    idealPour: "Idéal pour l'expérience complète, de l'aube au crépuscule",
    citation: 'Une journée complète immortalisée.',
    description:
      "L'expérience totale. Du lever du soleil aux derniers pas de danse, votre histoire complète capturée en images cinématographiques. Rien n'est laissé au hasard.",
    beneficesCles: ['Film cinéma 15 min + teaser 60 sec', APPEL, 'Montage cinématographique'],
    inclusions: [
      'Film complet monté (15 min)',
      'Teaser (90 sec)',
      'Vidéo bonus : les moments clés en intégralité, non montés (interviews des invités, ouverture de bal…)',
      APPEL,
      DRONE,
      SON,
      GALERIE
    ]
  },
  {
    id: 'creation',
    nom: 'CRÉATION',
    nomComplet: 'LOREN Création',
    prix: null,
    prixLabel: 'Sur devis',
    heures: null,
    presenceLoren: '',
    tagline: "Projets d'exception conçus sur mesure",
    idealPour: 'Idéal pour destinations lointaines, multi-jours, visions uniques',
    citation: 'Votre vision, sans limites.',
    description:
      "Une expérience sur mesure où votre imagination définit les contours de l'œuvre finale. Pour les couples qui veulent repousser les limites du possible et créer quelque chose d'absolument unique.",
    beneficesCles: [
      'Mariages de plusieurs jours',
      'Destinations internationales',
      'Équipes dédiées multi-opérateurs'
    ],
    inclusions: [
      'Mariages multi-jours',
      'Destinations internationales',
      'Équipes dédiées multi-opérateurs',
      DRONE,
      'Directions artistiques uniques',
      'Collaboration avec artistes externes',
      'Formats expérimentaux (court-métrage, documentaire...)'
    ]
  }
];

/** Accès direct par identifiant, pratique dans les pages. */
export const forfaitsById = Object.fromEntries(
  forfaits.map((f) => [f.id, f])
) as Record<string, Forfait>;

/** Libellés utilisés par le formulaire de contact et l'email de devis. */
export const forfaitLabels: Record<string, string> = Object.fromEntries(
  forfaits.map((f) => [f.id, f.nomComplet])
);

/** Option du menu déroulant : « LOREN Infinie - 2 500€ ». */
export function optionLabel(f: Forfait): string {
  return f.prix === null ? `${f.nomComplet} - Sur devis` : `${f.nomComplet} - ${f.prixLabel}`;
}

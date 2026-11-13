/**
 * Films présentés sur la page d'accueil.
 * Pour ajouter un film : déposer la vidéo et son poster dans
 * public/media/video/ puis ajouter une entrée ci-dessous.
 */

export interface Film {
  id: string;
  couple: string;
  date: string;
  src: string;
  poster: string;
}

const V = '/media/video/';

/** Film mis en avant en haut de la page d'accueil. */
export const filmPrincipal: Film = {
  id: 'amelie',
  couple: 'Amelie & Cedric',
  date: '',
  src: `${V}amelie_cedric_website.mp4`,
  poster: `${V}amelie_cedric_poster.jpg`
};

/** Grille de teasers, dans l'ordre d'affichage (deux colonnes). */
export const films: Film[] = [
  {
    id: 'clemence',
    couple: 'Clémence & Aymeric',
    date: 'Juillet 2025',
    src: `${V}teaser_clemence_aymeric.mp4`,
    poster: `${V}teaser_clemence_aymeric_poster.jpg`
  },
  {
    id: 'laureen',
    couple: 'Laureen & Gauthier',
    date: 'Août 2025',
    src: `${V}teaser_laureen_gauthier_4_3.mp4`,
    poster: `${V}teaser_laureen_gauthier_poster.jpg`
  },
  {
    id: 'olivia',
    couple: 'Olivia & Thomas',
    date: 'Septembre 2025',
    src: `${V}teaser_olivia_thomas_16_9_v3.mp4`,
    poster: `${V}teaser_olivia_thomas_poster.jpg`
  },
  {
    id: 'marie-ange',
    couple: 'Marie-Ange & Mathieu',
    date: 'Octobre 2025',
    src: `${V}teaser_marie-ange_mathieu.mp4`,
    poster: `${V}teaser_marie-ange_mathieu_poster.jpg`
  },
  {
    id: 'raumane',
    couple: 'Raumane & Maxime',
    date: 'Octobre 2024',
    src: `${V}TEASER_RAUMANE_MAXIME_WEBSITE.mp4`,
    poster: `${V}raumane_maxime_poster.jpg`
  },
  {
    id: 'solene',
    couple: 'Solène & Thomas',
    date: 'Août 2024',
    src: `${V}tezase_solene_thomas_website.mp4`,
    poster: `${V}tezase_solene_thomas_poster.jpg`
  },
  {
    id: 'sarah',
    couple: 'Sarah & Thierry',
    date: 'Juillet 2025',
    src: `${V}teaser_sarah_thierry.mp4`,
    poster: `${V}teaser_sarah_thierry_poster.jpg`
  },
  {
    id: 'melissa',
    couple: 'Melissa & Daniel',
    date: 'Septembre 2025',
    src: `${V}teaser_shooting_melissa.mp4`,
    poster: `${V}teaser_shooting_melissa_poster.jpg`
  }
];

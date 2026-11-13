// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  contientLien,
  adresseBloquee,
  lireListeBloquee,
  ressembleARobot
} from '../lib/antispam';

describe('contientLien', () => {
  it.each([
    'Voici le programme : https://mariage-planning.example.com/login',
    'Programme ici http://bit.ly/abc123',
    'voir www.programme-mariage.net',
    'Tout est sur programme-mariage.com/acces',
    'allez sur drive.google.com pour le planning',
    'le lien : hxxps://exemple[.]com',
    'exemple(dot)com',
    'notre site exemple dot com',
    'contactez-nous t.me/planningmariage',
    '<a href="x">programme</a>',
    'programme​-mariage.com'
  ])('refuse : %s', (texte) => {
    expect(contientLien(texte)).toBe(true);
  });

  it.each([
    'Bonjour, nous nous marions le 12 juin au Château de Vallery. Environ 90 invités.',
    'Vous pouvez nous écrire à marie.thomas@gmail.com ou au 06.12.34.56.78',
    "Nous aimerions un film d'environ 10 min.Le lieu est en Bourgogne",
    'Budget autour de 2.000 € pour la vidéo. Cérémonie à 15h30.',
    'On hésite entre Pure et Âme... on en parle ?',
    'Marie & Thomas'
  ])('accepte : %s', (texte) => {
    expect(contientLien(texte)).toBe(false);
  });
});

describe('adresseBloquee', () => {
  it('refuse les messageries jetables', () => {
    expect(adresseBloquee('test@yopmail.com')).toBe(true);
    expect(adresseBloquee('test@sub.mailinator.com')).toBe(true);
  });

  it("refuse les adresses contenant les fragments vus dans les arnaques", () => {
    expect(adresseBloquee('wedding@prodmail.net')).toBe(true);
    expect(adresseBloquee('claire.prod-mail@outlook.com')).toBe(true);
    expect(adresseBloquee('info@mail-prod.co')).toBe(true);
  });

  it('accepte les adresses ordinaires', () => {
    expect(adresseBloquee('marie.thomas@gmail.com')).toBe(false);
    expect(adresseBloquee('contact@smleyeprod.fr')).toBe(false);
    expect(adresseBloquee('production@studio-mariage.fr')).toBe(false);
  });

  it('applique la liste CONTACT_BLOCKED', () => {
    const liste = lireListeBloquee(' Arnaque.example , escroc@gmail.com, faux-planner ');
    expect(liste).toEqual(['arnaque.example', 'escroc@gmail.com', 'faux-planner']);
    expect(adresseBloquee('x@arnaque.example', liste)).toBe(true);
    expect(adresseBloquee('Escroc@Gmail.com', liste)).toBe(true);
    expect(adresseBloquee('honnete@gmail.com', liste)).toBe(false);
    expect(adresseBloquee('faux.planner@outlook.fr', liste)).toBe(true);
  });
});

describe('ressembleARobot', () => {
  it('repère le champ piège rempli', () => {
    expect(ressembleARobot('http://spam', 20000)).toBe(true);
  });

  it('repère un envoi trop rapide', () => {
    expect(ressembleARobot('', 400)).toBe(true);
  });

  it('laisse passer un envoi normal', () => {
    expect(ressembleARobot('', 45000)).toBe(false);
    expect(ressembleARobot(undefined, undefined)).toBe(false);
  });
});

# Cédric Raúl Films - Site Web Officiel

Site web officiel de Cédric Raúl Films, vidéaste spécialisé dans les films de mariage cinématographiques et les vidéos corporate avec drone FPV sur la Côte d'Azur.

## 📋 MVP V1 - Fonctionnalités

### Pages V1
- ✅ **Accueil** - Hero vidéo, portfolio teaser, forfait LOREN, photographes partenaires
- ✅ **Portfolio** - Filtres par tags, intégration YouTube, navigation fluide
- ✅ **Services** - Timeline interactive processus créatif, carousel 3D forfaits LOREN (4 offres), livrables, partenaires (Coraline Events Flash Visual, Alexys KA)
- ✅ **À propos** - Vision, approche, innovation FPV, mention SMLEYE Prod
- ✅ **Contact** - Formulaire mailto, informations pratiques, stub réservation d'appel
- ✅ **Photographes** - Partenaires, carousel d'images, liens vers contact
- ✅ **Politique de confidentialité** - Mentions légales, RGPD, cookies

### Fonctionnalités techniques
- 🎥 Intégration vidéos YouTube avec fallback robuste
- 📱 Design responsive mobile-first
- 🚁 Mise en avant de l'expertise drone FPV
- 🎨 Identité visuelle moody cinéma + touches futuristes discrètes
- 🎭 Carousel 3D coverflow avec perspective CSS 3D, swipe/drag, animations fluides
- 📅 Timeline interactive du processus créatif avec animations scroll
- 🔍 SEO optimisé avec meta tags, JSON-LD, sitemap
- 🍪 Banner cookies conforme RGPD
- ⚡ Performance optimisée (LCP < 2.5s, CLS < 0.1)
- ♿ Accessibilité AA
- 🎨 Nouveau favicon CR cinématographique

## 🛠 Stack Technique

- **Framework** : Astro SSG + TypeScript
- **Styles** : Tailwind CSS
- **Contenu** : Markdown éditable
- **Déploiement** : systemd + Nginx + Certbot
- **Hosting** : Raspberry Pi 4 optimisé
- **Analytics** : Plausible (optionnel)
- **Tests** : Playwright + Vitest
- **Code Quality** : ESLint + Prettier

## 🚀 Développement

### Prérequis
```bash
node >= 18
npm >= 9
```

### Installation
```bash
# Cloner le repository
git clone <repo-url>
cd website

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Démarrage
```bash
# Développement
npm run dev
# => http://localhost:4321

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Vérification TypeScript
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Tests
npm run test        # Vitest
npm run test:e2e    # Playwright
```

### Structure du projet
```
src/
├── layouts/        # Layout de base avec SEO
├── components/     # Composants réutilisables
├── pages/          # Pages du site
│   └── api/        # API routes (formulaire contact)
├── content/        # Contenu Markdown
└── test/           # Tests unitaires

public/
├── media/          # Assets médias
│   ├── video/      # Vidéos (exclus git)
│   └── photo/      # Photos (exclus git)
├── favicon.svg     # Favicon
└── logo.svg        # Logo
```

## 🎬 Contenu

### Portfolio
Éditer les fichiers dans `src/content/portfolio/` :
```markdown
---
title: "Titre du projet"
description: "Description courte"
tags: ["Mariage", "Drone FPV", "Provence"]
youtubeId: "VIDEO_ID_YOUTUBE"
featured: true
date: 2024-06-15
location: "Lieu"
client: "Nom du client"
---
```

### Photographes
Éditer les fichiers dans `src/content/photographes/` :
```markdown
---
name: "Nom du photographe"
bio: "Biographie courte"
speciality: "Spécialité"
images: ["/media/photographes/photo1.jpg"]
website: "https://site.com"
instagram: "https://instagram.com/username"
featured: true
---
```

**Partenaires actuels** :
- **Coraline** - Events Flash Visual ([Instagram](https://www.instagram.com/eventsflashvisual/))
- **Alexys KA** - Photographe mariage ([Portfolio](https://alexyska.mypixieset.com/wedding/))

### Forfaits LOREN
Gamme complète de forfaits mariage présentée via carousel 3D :

- **LOREN Pure** (2 300€)
  - 6 heures de couverture
  - Film de 6 minutes
  - Teaser
  - Rushes optimisés

- **LOREN Âme** (2 900€)
  - 9 heures de couverture
  - Film de 8 minutes
  - Teaser
  - Rushes optimisés

- **LOREN Infinie** (3 500€)
  - 12 heures de couverture
  - Film de 12 minutes
  - Teaser
  - Rushes optimisés

- **LOREN Création** (Sur devis)
  - Mariages multi-jours
  - Prestation personnalisée
  - Film sur mesure

## 🚀 Déploiement

### Sur Raspberry Pi 4

#### 1. Prérequis système
```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer nginx
sudo apt install -y nginx

# Installer Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Déployer l'application
```bash
# Cloner le projet
cd /var/www/
sudo git clone <repo-url> cedricraulfilms
cd cedricraulfilms

# Installer les dépendances
npm install

# Configurer les variables d'environnement
sudo cp .env.example .env
sudo nano .env  # Éditer avec vos valeurs

# Build en mode production
npm run build

# Créer le dossier de logs
sudo mkdir -p /var/log/cedric-raul
sudo chown smleye:smleye /var/log/cedric-raul

# Copier et éditer le service systemd
sudo cp cedric-raul.service /etc/systemd/system/
sudo nano /etc/systemd/system/cedric-raul.service  # Éditer le SMTP_PASS

# Recharger systemd et activer le service
sudo systemctl daemon-reload
sudo systemctl enable cedric-raul
sudo systemctl start cedric-raul

# Vérifier le statut
sudo systemctl status cedric-raul
```

#### 3. Configurer Nginx
```bash
# Copier la configuration nginx
sudo cp nginx.conf /etc/nginx/sites-available/cedricraulfilms
sudo ln -s /etc/nginx/sites-available/cedricraulfilms /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer nginx
sudo systemctl restart nginx
```

#### 4. Configurer SSL avec Certbot
```bash
# Obtenir les certificats Let's Encrypt
sudo certbot --nginx -d cedricraulfilms.fr -d www.cedricraulfilms.fr

# Le renouvellement est automatique via cron
```

#### Service systemd

Contenu de `/etc/systemd/system/cedric-raul.service`:

```ini
[Unit]
Description=Cedric Raul Films Website
After=network.target

[Service]
Type=simple
User=smleye
WorkingDirectory=/var/www/cedricraulfilms
ExecStart=/usr/bin/node ./dist/server/entry.mjs
Restart=always
RestartSec=10

# Variables d'environnement
Environment=NODE_ENV=production
Environment=HOST=0.0.0.0
Environment=PORT=4321

# SMTP Configuration
Environment=SMTP_HOST=smtp.protonmail.ch
Environment=SMTP_PORT=587
Environment=SMTP_SECURE=false
Environment=SMTP_USER=contact@cedricraulfilms.fr
Environment=SMTP_PASS=votre_mot_de_passe

Environment=CONTACT_EMAIL=contact@cedricraulfilms.fr
Environment=SITE_URL=https://cedricraulfilms.fr

# Logs
StandardOutput=append:/var/log/cedric-raul/app.log
StandardError=append:/var/log/cedric-raul/error.log

[Install]
WantedBy=multi-user.target
```

**Note**: Créer le dossier de logs avant:
```bash
sudo mkdir -p /var/log/cedric-raul
sudo chown smleye:smleye /var/log/cedric-raul
```

### Variables d'environnement
```bash
# Obligatoires
SITE_URL=https://cedricraulfilms.fr
CONTACT_EMAIL=contact@cedricraulfilms.fr

# SMTP (pour formulaire de contact)
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@cedricraulfilms.fr
SMTP_PASS=votre_mot_de_passe

# Optionnelles
PLAUSIBLE_DOMAIN=cedricraulfilms.fr
PLAUSIBLE_SRC=https://plausible.io/js/script.js
```

### Nginx
Configuration optimisée incluse avec :
- Reverse proxy vers Node.js (port 4321)
- Cache TTL approprié selon les types de fichiers
- Headers de sécurité (HSTS, CSP, X-Frame-Options...)
- Compression gzip
- Rate limiting

## 🔧 Optimisations Raspberry Pi 4

### Swap et mémoire
```bash
# Augmenter la swap pour les builds npm
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Réseau
```bash
# Configurer port forwarding sur votre box internet:
# - Port 80 (HTTP) → IP locale de la Pi
# - Port 443 (HTTPS) → IP locale de la Pi

# IP statique recommandée pour la Pi
```

### Monitoring
```bash
# Voir les logs en temps réel
sudo journalctl -u cedric-raul -f

# Voir les dernières lignes
sudo journalctl -u cedric-raul -n 100

# Status du service
sudo systemctl status cedric-raul

# Logs applicatifs
tail -f /var/log/cedric-raul/app.log
tail -f /var/log/cedric-raul/error.log
```

## 📊 Performance

### Objectifs V1
- ✅ LCP < 2.5s
- ✅ CLS < 0.1  
- ✅ FID < 100ms
- ✅ Score Lighthouse > 90

### Optimisations
- Images lazy loading + WebP/AVIF
- Assets fingerprinting + cache immutable
- CSS critique inline
- JavaScript minimal
- Service Worker (V2)

### Animations & Interactions
**Carousel 3D Coverflow (Page Services)** :
- Perspective CSS 3D (1200px) pour profondeur cinématographique
- Slide active : face caméra (rotateY 0°, scale 1)
- Slides adjacentes : inclinées ±25°, reculées -200px, scale 0.8, opacité 40%
- Slides éloignées : inclinées ±35°, reculées -350px, scale 0.6, opacité 15%
- Navigation : swipe tactile, drag souris, clavier (←/→), flèches, dots
- Transitions : 700ms cubic-bezier(0.16, 1, 0.3, 1)
- 4 forfaits LOREN en rotation 3D fluide

**Timeline Interactive (Page Services)** :
- Scroll reveal animations avec Intersection Observer
- Étapes processus créatif avec animations décalées
- Responsive avec breakpoints adaptés

## 🔒 Sécurité

### Headers configurés
- HSTS avec includeSubDomains
- CSP restrictive pour XSS
- X-Frame-Options pour clickjacking
- X-Content-Type-Options nosniff
- Referrer-Policy strict

### RGPD
- Banner cookies localStorage uniquement
- Pas de tracking par défaut
- Plausible analytics respectueux vie privée
- Formulaire de contact sans stockage

## 📈 SEO

### Optimisations
- Meta tags Open Graph + Twitter Cards
- JSON-LD structured data
- Sitemap.xml automatique
- URLs propres et canoniques
- Schema.org ProfessionalService

### Mots-clés ciblés
- vidéaste mariage cinématographique
- film de mariage haut de gamme  
- vidéaste Côte d'Azur
- wedding filmmaker France
- drone FPV mariage
- vidéaste corporate

## 🔄 Sauvegardes

### Stratégie recommandée
- **Code source**: Git (repository distant)
- **Médias**: Backup externe (USB, NAS, cloud)
- **Config nginx**: Copie manuelle ou script personnalisé
- **Base de données**: (à venir si API avec DB)

## 🎯 Roadmap V2

### Fonctionnalités en backlog
- [ ] **Drone FPV** - Page technique et réglementaire
- [ ] **Témoignages** - Avis clients avec étoiles
- [ ] **Journal** - Blog actualités/projets
- [ ] **Réserver** - Système de réservation d'appels
- [ ] **Galerie photos** - Intégration avec photographes partenaires

### Améliorations techniques V2
- [ ] **API Node.js** - Express + SQLite pour formulaires
- [ ] **PeerTube** - Migration vidéos vers instance auto-hébergée
- [ ] **PWA** - Service Worker + app mobile
- [ ] **CMS headless** - Interface admin pour contenu
- [ ] **Tests visuels** - Regression testing automatisé

### Variables future API
```bash
# SMTP pour formulaires
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cedricraulfilms.fr
SMTP_PASS=app_password

# Database
DATABASE_URL=sqlite:///data/database.db

# PeerTube
PEERTUBE_URL=https://peertube.cedricraulfilms.fr
VIDEO_PROVIDER=peertube

# reCAPTCHA
RECAPTCHA_SITE_KEY=site_key
RECAPTCHA_SECRET=secret_key
```

## 🧪 Tests

### Tests E2E (Playwright)
```bash
npm run test:e2e
```
- Smoke tests des pages principales
- Vérification navigation mobile
- Validation meta tags SEO
- Test formulaire contact

### Tests unitaires (Vitest)
```bash
npm run test
```
- Fonctions utilitaires
- Validation email
- Formatage prix

### Checklist manuelle
- [ ] LCP < 2.5s sur 3G
- [ ] Pas de CLS visible
- [ ] Navigation clavier fonctionnelle
- [ ] Contrastes AA respectés
- [ ] sitemap.xml accessible
- [ ] robots.txt correct

## 🔧 Maintenance

### Logs
```bash
# Logs de l'application
sudo journalctl -u cedric-raul -f
tail -f /var/log/cedric-raul/app.log
tail -f /var/log/cedric-raul/error.log

# Logs nginx
sudo tail -f /var/log/nginx/cedricraul_access.log
sudo tail -f /var/log/nginx/cedricraul_error.log
```

### Mises à jour
```bash
# Mise à jour du code
cd /var/www/cedricraulfilms
git pull
npm install
npm run build

# Redémarrer l'application
sudo systemctl restart cedric-raul

# Vérifier le statut
sudo systemctl status cedric-raul
```

### Redémarrage complet
```bash
# Redémarrer nginx
sudo systemctl restart nginx

# Redémarrer l'app Node
sudo systemctl restart cedric-raul

# Voir les logs en cas de problème
sudo journalctl -u cedric-raul -n 50

# Redémarrer la Pi (si nécessaire)
sudo reboot
```

## 📞 Support

### Développement
- Lead Frontend : Configuration et développement
- SMLEYE Prod : Production et hébergement

### Contacts
- **Site** : [cedricraulfilms.fr](https://cedricraulfilms.fr)
- **Email** : contact@cedricraulfilms.fr
- **Production** : by SMLEYE Prod

---

## 📄 License

MIT License - Voir LICENSE file pour détails.

**🎬 Cédric Raúl Films - Votre mariage, une œuvre cinématographique**
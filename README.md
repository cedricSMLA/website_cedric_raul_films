# Cédric Raúl Films - Site Web Officiel

Site web officiel de Cédric Raúl Films, vidéaste spécialisé dans les films de mariage cinématographiques et les vidéos corporate avec drone FPV sur la Côte d'Azur.

## 📋 MVP V1 - Fonctionnalités

### Pages V1
- ✅ **Accueil** - Hero vidéo, portfolio teaser, forfait LOREN, photographes partenaires
- ✅ **Portfolio** - Filtres par tags, intégration YouTube, navigation fluide
- ✅ **LOREN** - Forfait signature 2900€ TTC, FAQ, call-to-action
- ✅ **À propos** - Vision, approche, innovation FPV, mention SMLEYE Prod
- ✅ **Contact** - Formulaire mailto, informations pratiques, stub réservation d'appel
- ✅ **Photographes** - Partenaires, carousel d'images, liens vers contact

### Fonctionnalités techniques
- 🎥 Intégration vidéos YouTube avec fallback robuste
- 📱 Design responsive mobile-first
- 🚁 Mise en avant de l'expertise drone FPV
- 🎨 Identité visuelle moody cinéma + touches futuristes discrètes
- 🔍 SEO optimisé avec meta tags, JSON-LD, sitemap
- 🍪 Banner cookies conforme RGPD
- ⚡ Performance optimisée (LCP < 2.5s, CLS < 0.1)
- ♿ Accessibilité AA

## 🛠 Stack Technique

- **Framework** : Astro SSG + TypeScript
- **Styles** : Tailwind CSS
- **Contenu** : Markdown éditable
- **Déploiement** : Docker + Nginx
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
├── content/        # Contenu Markdown
└── test/           # Tests unitaires

public/
├── media/          # Assets médias
├── favicon.svg     # Favicon
└── logo.svg        # Logo

scripts/
├── backup.sh       # Script de sauvegarde restic
└── rotate-logs.sh  # Rotation des logs
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

## 🐳 Déploiement

### Docker (recommandé)
```bash
# Build de l'image
docker build -t cedric-raul-films .

# Lancement avec docker-compose
docker-compose up -d

# Vérification
curl http://localhost/health
```

### Variables d'environnement
```bash
# Obligatoires
SITE_URL=https://cedricraulfilms.fr
CONTACT_EMAIL=contact@cedricraulfilms.fr

# Optionnelles
PLAUSIBLE_DOMAIN=cedricraulfilms.fr
PLAUSIBLE_SRC=https://plausible.io/js/script.js
```

### Nginx
Configuration optimisée incluse avec :
- Cache TTL approprié selon les types de fichiers
- Headers de sécurité (HSTS, CSP, X-Frame-Options...)
- Compression gzip/brotli
- Rate limiting

## 🔧 Configuration Raspberry Pi 4

### Prérequis système
```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker pi

# Docker Compose
sudo apt install docker-compose-plugin
```

### Optimisations Pi
```bash
# Augmenter la swap si nécessaire
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# Configuration réseau
# Configurer port forwarding 80/443 sur votre box internet
```

### Monitoring
```bash
# Installer Uptime Kuma (optionnel)
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
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

### Script automatique
Le script `scripts/backup.sh` utilise restic pour :
- Sauvegarder les fichiers du site
- Sauvegarder la configuration Nginx
- Nettoyer les anciennes sauvegardes
- Envoyer des notifications

### Configuration
```bash
# Variables d'environnement pour backup
export RESTIC_REPOSITORY=/mnt/backup/restic-repo
export RESTIC_PASSWORD_FILE=/etc/restic/password

# Crontab pour automatisation
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

## 🎯 Roadmap V2

### Fonctionnalités en backlog
- [ ] **Services** - Page détaillée des prestations
- [ ] **Drone FPV** - Page technique et réglementaire
- [ ] **Témoignages** - Avis clients avec étoiles
- [ ] **Journal** - Blog actualités/projets
- [ ] **Process** - Workflow client étape par étape
- [ ] **Réserver** - Système de réservation d'appels

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
# Rotation automatique
0 1 * * * /opt/scripts/rotate-logs.sh

# Consultation
docker-compose logs -f web
tail -f logs/access.log
```

### Mises à jour
```bash
# Dépendances
npm audit
npm update

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
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
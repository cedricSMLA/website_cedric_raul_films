# Guide Workflow Dev/Prod

## 📋 Vue d'ensemble

Ce guide explique comment travailler en toute sécurité entre votre environnement de **développement** (MacBook) et la **production** (Raspberry Pi 4).

---

## 🔍 Différences entre Dev et Prod

### Environnement de Développement (MacBook)
- **Mode** : `npm run dev` (Astro dev server avec hot-reload)
- **URL** : `http://localhost:4321`
- **Variables d'env** : `.env` avec `NODE_ENV=development`
- **Démarrage** : `./start-dev.sh` (charge .env automatiquement)
- **Base de données** : Aucune pour l'instant
- **HTTPS** : Non (HTTP uniquement)

### Environnement de Production (Raspberry Pi 4)
- **Mode** : `npm run dev` via service systemd
- **URL** : `https://cedricraulfilms.fr`
- **Variables d'env** : Définies dans `/etc/systemd/system/cedric-raul.service`
- **Démarrage** : Service systemd `cedric-raul.service`
- **Reverse proxy** : nginx (écoute ports 80/443, proxy vers 4321)
- **HTTPS** : Oui (Let's Encrypt via Certbot)
- **Logs** : `/var/log/cedric-raul/`

---

## ✅ Workflow Recommandé

### 1. Développer sur MacBook

```bash
# 1. S'assurer d'être sur la branche main à jour
cd ~/website_cedric_raul_films
git checkout main
git pull origin main

# 2. Créer une branche de fonctionnalité (recommandé)
git checkout -b feature/nom-de-la-feature

# 3. Installer/mettre à jour les dépendances si nécessaire
npm install

# 4. Démarrer le serveur de développement
./start-dev.sh
# OU
npm run dev

# 5. Développer et tester en local
# Le site est accessible sur http://localhost:4321
```

### 2. Tester en Local

```bash
# Tester le formulaire de contact
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Vérifier les logs dans le terminal
# Le dev server affiche tous les logs en temps réel
```

### 3. Committer les Changements

```bash
# Vérifier les modifications
git status
git diff

# Ajouter les fichiers modifiés
git add .

# OU ajouter des fichiers spécifiques
git add src/pages/nouvelle-page.astro

# Créer un commit avec un message clair
git commit -m "feat: ajout de la nouvelle fonctionnalité X

- Description du changement 1
- Description du changement 2
- Fix du bug Y"

# Pousser vers GitHub
git push origin feature/nom-de-la-feature
```

### 4. Merger dans Main (après tests)

```bash
# Revenir sur main
git checkout main

# Merger la branche de fonctionnalité
git merge feature/nom-de-la-feature

# Pousser vers GitHub
git push origin main

# Optionnel : supprimer la branche de fonctionnalité
git branch -d feature/nom-de-la-feature
```

### 5. Déployer en Production (sur Raspberry Pi)

**Option A : Déploiement manuel (SSH)**

```bash
# Depuis votre MacBook, connectez-vous à la Pi
ssh smleye@<ip-raspberry-pi>

# Sur la Raspberry Pi
cd /var/www/cedricraulfilms

# Sauvegarder l'état actuel (par précaution)
git stash

# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances si package.json a changé
npm install

# Redémarrer le service
sudo systemctl restart cedric-raul.service

# Vérifier que le service fonctionne
sudo systemctl status cedric-raul.service

# Vérifier les logs
sudo journalctl -u cedric-raul.service -n 50 -f

# Tester le site
curl -I https://cedricraulfilms.fr
```

**Option B : Script de déploiement automatique**

Créer un script `deploy-prod.sh` sur la Pi :

```bash
#!/bin/bash
set -e

echo "🚀 Déploiement en production..."

# Aller dans le répertoire
cd /var/www/cedricraulfilms

# Sauvegarder l'état
git stash

# Récupérer les modifications
echo "📥 Pull des modifications..."
git pull origin main

# Vérifier si package.json a changé
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
  echo "📦 Installation des dépendances..."
  npm install
fi

# Redémarrer le service
echo "🔄 Redémarrage du service..."
sudo systemctl restart cedric-raul.service

# Vérifier le statut
sleep 2
if sudo systemctl is-active --quiet cedric-raul.service; then
  echo "✅ Déploiement réussi !"
  echo "🌐 Site accessible sur https://cedricraulfilms.fr"
else
  echo "❌ Erreur : le service n'a pas redémarré"
  sudo systemctl status cedric-raul.service
  exit 1
fi
```

Utilisation :
```bash
ssh smleye@<ip-raspberry-pi> 'bash /var/www/cedricraulfilms/deploy-prod.sh'
```

---

## ⚠️ Ce qui se passe quand vous faites `git pull` sur MacBook

### Scénario : Vous pullez les changements que j'ai pushés

```bash
cd ~/website_cedric_raul_films
git pull origin main
```

**Résultat :**
1. ✅ Les fichiers seront mis à jour avec les nouveaux changements
2. ✅ Votre `.env` local **NE SERA PAS** affecté (il est dans `.gitignore`)
3. ⚠️ Si `package.json` a changé, vous devrez faire `npm install`
4. ✅ Votre environnement de dev continuera de fonctionner

**Ce qui ne changera PAS :**
- Votre fichier `.env` (configurations locales)
- Les fichiers média dans `public/media/video/` (exclus par .gitignore)
- Vos node_modules (vous devrez `npm install` si package.json change)

**Actions à faire après le pull :**

```bash
# 1. Vérifier les changements
git log -1 --stat

# 2. Installer les dépendances si nécessaire
npm install

# 3. Relancer le serveur de dev
./start-dev.sh
```

---

## 🔐 Gestion des Variables d'Environnement

### Sur MacBook (Dev)

Fichier `.env` à la racine du projet :
```env
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@cedricraulfilms.fr
SMTP_PASS=votre_mot_de_passe
CONTACT_EMAIL=contact@cedricraulfilms.fr

SITE_URL=http://localhost:4321
NODE_ENV=development
HOST=0.0.0.0
PORT=4321
```

**Important :** Ce fichier n'est **jamais commité** (dans `.gitignore`)

### Sur Raspberry Pi (Prod)

Les variables sont définies dans le service systemd :
```bash
sudo nano /etc/systemd/system/cedric-raul.service
```

Pour modifier une variable :
```bash
# 1. Éditer le service
sudo nano /etc/systemd/system/cedric-raul.service

# 2. Modifier la variable (ex: Environment=SITE_URL=https://cedricraulfilms.fr)

# 3. Recharger systemd
sudo systemctl daemon-reload

# 4. Redémarrer le service
sudo systemctl restart cedric-raul.service
```

---

## 📦 Gestion des Dépendances

### Ajouter une nouvelle dépendance

```bash
# Sur MacBook
npm install nouvelle-package

# Committer le package.json et package-lock.json
git add package.json package-lock.json
git commit -m "deps: ajout de nouvelle-package"
git push origin main

# Sur Raspberry Pi (après pull)
npm install  # Installe la nouvelle dépendance
```

### Mettre à jour les dépendances

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour une dépendance spécifique
npm update nom-package

# OU mettre à jour toutes les dépendances mineures
npm update

# Tester que tout fonctionne
npm run dev

# Committer
git add package.json package-lock.json
git commit -m "deps: mise à jour des dépendances"
git push origin main
```

---

## 🐛 Résolution de Problèmes

### Le site ne démarre pas après un pull

```bash
# 1. Vérifier les dépendances
rm -rf node_modules package-lock.json
npm install

# 2. Vérifier le fichier .env
cat .env

# 3. Relancer
./start-dev.sh
```

### Le formulaire de contact ne fonctionne plus

```bash
# Vérifier les variables SMTP dans .env
grep SMTP .env

# Tester l'API
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

### La prod est cassée après un déploiement

```bash
# Sur la Raspberry Pi

# 1. Vérifier les logs
sudo journalctl -u cedric-raul.service -n 100

# 2. Vérifier le statut
sudo systemctl status cedric-raul.service

# 3. Revenir en arrière (rollback)
cd /var/www/cedricraulfilms
git log --oneline -5  # Voir les derniers commits
git reset --hard <commit-hash-précédent>
sudo systemctl restart cedric-raul.service

# 4. Une fois le problème résolu en dev, redéployer
git pull origin main
sudo systemctl restart cedric-raul.service
```

---

## 📊 Commandes Utiles

### Sur MacBook (Dev)

```bash
# Voir les logs du dev server
npm run dev  # Les logs s'affichent dans le terminal

# Vérifier les types TypeScript
npm run type-check

# Linter le code
npm run lint

# Formater le code
npm run format

# Tester en local
curl http://localhost:4321
```

### Sur Raspberry Pi (Prod)

```bash
# Voir les logs en temps réel
sudo journalctl -u cedric-raul.service -f

# Voir les 100 dernières lignes
sudo journalctl -u cedric-raul.service -n 100

# Redémarrer le service
sudo systemctl restart cedric-raul.service

# Voir le statut
sudo systemctl status cedric-raul.service

# Vérifier nginx
sudo systemctl status nginx
sudo nginx -t  # Tester la config

# Voir les logs nginx
sudo tail -f /var/log/nginx/cedricraul_access.log
sudo tail -f /var/log/nginx/cedricraul_error.log

# Tester le site
curl -I https://cedricraulfilms.fr
```

---

## 🎯 Checklist Avant Déploiement

- [ ] Code testé en local sur MacBook
- [ ] Formulaire de contact fonctionne en local
- [ ] Pas d'erreurs dans les logs du dev server
- [ ] `npm run type-check` passe sans erreurs
- [ ] Changements committés et pushés sur GitHub
- [ ] Sauvegarde de l'état actuel de la prod (git stash ou commit hash noté)
- [ ] Pull sur la Raspberry Pi
- [ ] `npm install` si package.json a changé
- [ ] Redémarrage du service systemd
- [ ] Vérification des logs après redémarrage
- [ ] Test du site en production (https://cedricraulfilms.fr)
- [ ] Test du formulaire de contact en prod

---

## 🚦 Stratégie de Branches (Optionnel mais Recommandé)

### Stratégie Simple

```
main (production)
  └── feature/nom-feature (développement)
```

### Workflow avec branches

```bash
# 1. Créer une branche pour chaque nouvelle feature
git checkout -b feature/ajout-galerie-photos

# 2. Développer et committer
git add .
git commit -m "feat: ajout galerie photos"

# 3. Pousser la branche
git push origin feature/ajout-galerie-photos

# 4. Tester sur MacBook

# 5. Merger dans main quand c'est prêt
git checkout main
git merge feature/ajout-galerie-photos
git push origin main

# 6. Déployer en prod
ssh pi "cd /var/www/cedricraulfilms && git pull && sudo systemctl restart cedric-raul"
```

---

## 📝 Convention de Nommage des Commits

```bash
# Format
type: description courte

corps du message (optionnel)

# Types
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatting, point-virgule manquant, etc
refactor: # Refactoring du code
test:     # Ajout de tests
chore:    # Maintenance

# Exemples
git commit -m "feat: ajout page galerie photos"
git commit -m "fix: correction affichage mobile sur page contact"
git commit -m "docs: mise à jour README avec instructions Docker"
git commit -m "refactor: amélioration performance chargement vidéos"
```

---

## 🔄 Résumé du Workflow Complet

### Workflow Standard (Feature complète)

```bash
# === SUR MACBOOK ===

# 1. Récupérer les derniers changements
git pull origin main

# 2. Créer une branche
git checkout -b feature/nouvelle-page

# 3. Développer
npm run dev
# ... coder ...

# 4. Tester
curl http://localhost:4321/nouvelle-page

# 5. Committer
git add .
git commit -m "feat: ajout de la nouvelle page"

# 6. Pousser
git push origin feature/nouvelle-page

# 7. Merger dans main
git checkout main
git merge feature/nouvelle-page
git push origin main

# === SUR RASPBERRY PI ===

# 8. Se connecter
ssh smleye@<ip-pi>

# 9. Déployer
cd /var/www/cedricraulfilms
git pull origin main
npm install  # Si package.json a changé
sudo systemctl restart cedric-raul.service

# 10. Vérifier
sudo systemctl status cedric-raul.service
curl -I https://cedricraulfilms.fr

# 11. Vérifier les logs
sudo journalctl -u cedric-raul.service -n 50 -f
```

---

## ❓ FAQ

### Q: Que se passe-t-il si je pull alors que j'ai des modifications locales non committées ?

**R:** Git refusera le pull. Vous devez :
```bash
# Option 1 : Committer vos changements
git add .
git commit -m "wip: travail en cours"
git pull origin main

# Option 2 : Stash vos changements
git stash
git pull origin main
git stash pop  # Réappliquer vos changements
```

### Q: Comment voir ce qui a changé avant de pull ?

**R:**
```bash
git fetch origin main
git log HEAD..origin/main --oneline
git diff HEAD..origin/main
```

### Q: Comment annuler un commit déjà pushé ?

**R:**
```bash
# Créer un nouveau commit qui annule le précédent
git revert HEAD
git push origin main

# OU revenir en arrière (ATTENTION : destructif)
git reset --hard HEAD~1
git push origin main --force  # À éviter en prod !
```

### Q: Le .env doit-il être identique entre dev et prod ?

**R:** Non ! Les valeurs peuvent différer :
- `SITE_URL` : `http://localhost:4321` (dev) vs `https://cedricraulfilms.fr` (prod)
- `NODE_ENV` : `development` (dev) vs `production` (prod)
- Les credentials SMTP sont identiques

### Q: Dois-je builder l'application avant de déployer ?

**R:** Non ! Actuellement on utilise `npm run dev` même en production car :
- Le build avait des problèmes de CPU sur la Pi
- Le mode dev fonctionne bien avec nginx en reverse proxy
- Si un jour on passe en mode build, il faudra :
  ```bash
  npm run build
  # Et changer le service systemd pour pointer vers dist/server/entry.mjs
  ```

---

## 📚 Ressources

- [Guide de déploiement complet](./DEPLOY.md)
- [Guide de démarrage rapide](./QUICKSTART.md)
- [Documentation Astro](https://docs.astro.build)
- [Documentation systemd](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [Documentation nginx](https://nginx.org/en/docs/)

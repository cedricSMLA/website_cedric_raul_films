# Guide de Déploiement - Cédric Raúl Films

Ce guide décrit comment déployer et maintenir le site sur Raspberry Pi 4.

## 🚀 Premier Déploiement

### Prérequis système

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de nginx
sudo apt install -y nginx

# Installation de Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx

# Installation de git (si nécessaire)
sudo apt install -y git

# Vérification des versions
node --version  # devrait afficher v18.x ou supérieur
npm --version
nginx -v
```

### Configuration initiale

```bash
# 1. Cloner le repository
cd /var/www/
sudo git clone https://github.com/votre-username/cedric-raul-films.git cedricraulfilms
cd cedricraulfilms

# 2. Donner les permissions à votre utilisateur
sudo chown -R smleye:smleye /var/www/cedricraulfilms

# 3. Copier et configurer les variables d'environnement
cp .env.example .env
nano .env  # Éditer avec vos vraies valeurs SMTP

# 4. Lancer le script de déploiement automatique
sudo ./deploy.sh
```

Le script `deploy.sh` va automatiquement:
- Créer le dossier de logs
- Configurer le service systemd
- Installer les dépendances npm
- Build l'application
- Configurer nginx
- Démarrer les services

### Configuration SSL avec Let's Encrypt

```bash
# Une fois l'application déployée et nginx configuré
sudo certbot --nginx -d cedricraulfilms.fr -d www.cedricraulfilms.fr

# Suivre les instructions à l'écran
# Le renouvellement est automatique via cron
```

### Configuration réseau

N'oubliez pas de configurer le port forwarding sur votre box internet:
- Port 80 (HTTP) → IP locale de la Pi
- Port 443 (HTTPS) → IP locale de la Pi

Recommandé: Configurer une IP statique pour la Pi.

## 🔄 Mises à Jour

### Mise à jour du code

```bash
cd /var/www/cedricraulfilms

# 1. Sauvegarder la version actuelle (optionnel)
git stash

# 2. Récupérer les dernières modifications
git pull origin main

# 3. Installer les nouvelles dépendances
npm install

# 4. Rebuild l'application
npm run build

# 5. Redémarrer le service
sudo systemctl restart cedric-raul

# 6. Vérifier le statut
sudo systemctl status cedric-raul

# 7. Vérifier les logs
sudo journalctl -u cedric-raul -f
```

### Script de mise à jour automatique

Créer un fichier `update.sh`:

```bash
#!/bin/bash
set -e

cd /var/www/cedricraulfilms
git pull
npm install
npm run build
sudo systemctl restart cedric-raul
echo "✅ Mise à jour terminée"
```

Usage: `./update.sh`

## 📊 Maintenance

### Vérifier le statut

```bash
# Status du service
sudo systemctl status cedric-raul

# Status nginx
sudo systemctl status nginx

# Healthcheck complet
./healthcheck.sh
```

### Consulter les logs

```bash
# Logs de l'application (journalctl)
sudo journalctl -u cedric-raul -f

# Logs applicatifs (fichiers)
tail -f /var/log/cedric-raul/app.log
tail -f /var/log/cedric-raul/error.log

# Logs nginx
sudo tail -f /var/log/nginx/cedricraul_access.log
sudo tail -f /var/log/nginx/cedricraul_error.log

# Logs des 100 dernières lignes
sudo journalctl -u cedric-raul -n 100
```

### Redémarrer les services

```bash
# Redémarrer l'application
sudo systemctl restart cedric-raul

# Redémarrer nginx
sudo systemctl restart nginx

# Redémarrer les deux
sudo systemctl restart cedric-raul nginx

# Reboot complet de la Pi
sudo reboot
```

### Gérer les logs

```bash
# Nettoyer les vieux logs journalctl (garder 7 jours)
sudo journalctl --vacuum-time=7d

# Nettoyer les vieux logs applicatifs (> 30 jours)
find /var/log/cedric-raul/ -name "*.log" -mtime +30 -delete
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs d'erreur
sudo journalctl -u cedric-raul -n 50

# Vérifier que le port 4321 est libre
sudo lsof -i :4321

# Tester le build manuellement
cd /var/www/cedricraulfilms
npm run build
node ./dist/server/entry.mjs
```

### Erreur de connexion SMTP

```bash
# Vérifier les variables d'environnement du service
sudo systemctl show cedric-raul --property=Environment

# Éditer le service pour corriger
sudo nano /etc/systemd/system/cedric-raul.service
sudo systemctl daemon-reload
sudo systemctl restart cedric-raul
```

### nginx retourne 502 Bad Gateway

```bash
# Vérifier que l'application tourne
sudo systemctl status cedric-raul

# Vérifier que le port 4321 répond
curl http://localhost:4321

# Vérifier les logs nginx
sudo tail -f /var/log/nginx/cedricraul_error.log
```

### Espace disque insuffisant

```bash
# Vérifier l'espace disque
df -h

# Nettoyer les node_modules et rebuild
cd /var/www/cedricraulfilms
rm -rf node_modules package-lock.json
npm install
npm run build
sudo systemctl restart cedric-raul
```

### Certificat SSL expiré

```bash
# Renouveler manuellement
sudo certbot renew

# Tester le renouvellement
sudo certbot renew --dry-run

# Redémarrer nginx
sudo systemctl restart nginx
```

## 🔐 Sécurité

### Mettre à jour le mot de passe SMTP

```bash
# 1. Éditer le service systemd
sudo nano /etc/systemd/system/cedric-raul.service

# 2. Modifier la ligne SMTP_PASS

# 3. Recharger et redémarrer
sudo systemctl daemon-reload
sudo systemctl restart cedric-raul
```

### Permissions des fichiers

```bash
# Vérifier les permissions
ls -la /var/www/cedricraulfilms

# Corriger si nécessaire
sudo chown -R smleye:smleye /var/www/cedricraulfilms
sudo chmod 755 /var/www/cedricraulfilms
```

## 📈 Monitoring

### Monitoring manuel

```bash
# CPU et mémoire
top

# Processus Node.js
ps aux | grep node

# Connexions réseau
sudo netstat -tulpn | grep :4321

# Utilisation disque
df -h
du -sh /var/www/cedricraulfilms/*
```

### Healthcheck automatique (cron)

Ajouter au crontab pour vérifier toutes les heures:

```bash
crontab -e

# Ajouter cette ligne:
0 * * * * /var/www/cedricraulfilms/healthcheck.sh >> /var/log/cedric-raul/healthcheck.log 2>&1
```

## 🎯 Optimisations Raspberry Pi 4

### Augmenter la swap

```bash
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Changer: CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Limiter l'utilisation de la mémoire Node.js

Éditer le service systemd:

```bash
sudo nano /etc/systemd/system/cedric-raul.service

# Modifier ExecStart:
ExecStart=/usr/bin/node --max-old-space-size=512 ./dist/server/entry.mjs
```

## 📞 Support

En cas de problème, consulter:
1. Les logs: `sudo journalctl -u cedric-raul -n 100`
2. Le README.md du projet
3. La documentation Astro: https://docs.astro.build

---

**Dernière mise à jour**: 2025-10-15

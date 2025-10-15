# 🚀 Quick Start - Cédric Raúl Films

Guide rapide pour déployer le site sur Raspberry Pi 4.

## 📦 Pré-requis

- Raspberry Pi 4 (2GB RAM minimum, 4GB recommandé)
- Raspbian OS à jour
- Accès SSH
- Nom de domaine pointant vers votre IP publique
- Port forwarding 80/443 configuré sur votre box

## ⚡ Déploiement en 5 minutes

### 1. Installer les dépendances

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git
```

### 2. Cloner et configurer

```bash
cd /var/www/
sudo git clone <votre-repo> cedricraulfilms
cd cedricraulfilms
sudo chown -R $USER:$USER .
cp .env.example .env
nano .env  # Éditer avec vos vrais credentials SMTP
```

### 3. Déployer

```bash
sudo ./deploy.sh
```

Le script va tout configurer automatiquement !

### 4. Configurer SSL

```bash
sudo certbot --nginx -d cedricraulfilms.fr -d www.cedricraulfilms.fr
```

### 5. Vérifier

```bash
./healthcheck.sh
```

## ✅ C'est fait !

Votre site est maintenant en ligne sur https://cedricraulfilms.fr

## 📚 Documentation complète

- **README.md** - Vue d'ensemble du projet
- **DEPLOY.md** - Guide détaillé de déploiement et maintenance
- **Ce fichier** - Quick start

## 🔄 Mise à jour

```bash
cd /var/www/cedricraulfilms
git pull
npm install
npm run build
sudo systemctl restart cedric-raul
```

## 🆘 Problème ?

```bash
# Vérifier les logs
sudo journalctl -u cedric-raul -f

# Healthcheck
./healthcheck.sh

# Redémarrer
sudo systemctl restart cedric-raul nginx
```

## 📞 Support

Consultez DEPLOY.md pour le guide complet de dépannage.

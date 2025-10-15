#!/bin/bash

# Script de déploiement pour Cédric Raúl Films
# Usage: sudo ./deploy.sh

set -e

echo "🚀 Déploiement de Cédric Raúl Films..."

# Variables
APP_NAME="cedric-raul"
APP_DIR="/var/www/cedricraulfilms"
SERVICE_FILE="/etc/systemd/system/cedric-raul.service"
NGINX_SITE="/etc/nginx/sites-available/cedricraulfilms"
NGINX_ENABLED="/etc/nginx/sites-enabled/cedricraulfilms"
LOG_DIR="/var/log/cedric-raul"
USER="smleye"

# Vérifier si exécuté en root
if [ "$EUID" -ne 0 ]; then
   echo "❌ Ce script doit être exécuté en tant que root (sudo)"
   exit 1
fi

# 1. Créer le répertoire de l'application si nécessaire
echo "📁 Vérification du répertoire d'application..."
if [ ! -d "$APP_DIR" ]; then
    echo "  Création de $APP_DIR"
    mkdir -p "$APP_DIR"
fi

# 2. Créer le dossier de logs
echo "📝 Configuration des logs..."
mkdir -p "$LOG_DIR"
chown "$USER:$USER" "$LOG_DIR"

# 3. Copier le fichier de service systemd
echo "⚙️  Configuration du service systemd..."
if [ -f "cedric-raul.service" ]; then
    cp cedric-raul.service "$SERVICE_FILE"

    # Demander le mot de passe SMTP
    read -sp "Entrez le mot de passe SMTP: " SMTP_PASS
    echo

    # Remplacer le mot de passe dans le fichier de service
    sed -i "s/Environment=SMTP_PASS=votre_mot_de_passe/Environment=SMTP_PASS=$SMTP_PASS/" "$SERVICE_FILE"

    systemctl daemon-reload
    echo "  ✅ Service systemd configuré"
else
    echo "  ❌ Fichier cedric-raul.service introuvable"
    exit 1
fi

# 4. Configurer nginx
echo "🌐 Configuration de nginx..."
if [ -f "nginx.conf" ]; then
    cp nginx.conf "$NGINX_SITE"

    # Créer le lien symbolique si nécessaire
    if [ ! -L "$NGINX_ENABLED" ]; then
        ln -s "$NGINX_SITE" "$NGINX_ENABLED"
    fi

    # Ajouter la zone de rate limiting dans nginx.conf principal si pas présente
    if ! grep -q "limit_req_zone.*zone=contact" /etc/nginx/nginx.conf; then
        echo "  Ajout de la zone de rate limiting..."
        sed -i '/http {/a \    limit_req_zone $binary_remote_addr zone=contact:10m rate=3r/h;' /etc/nginx/nginx.conf
    fi

    # Tester la configuration nginx
    nginx -t
    echo "  ✅ Configuration nginx validée"
else
    echo "  ❌ Fichier nginx.conf introuvable"
    exit 1
fi

# 5. Installer les dépendances et build
echo "📦 Installation des dépendances..."
cd "$APP_DIR"
sudo -u "$USER" npm install

echo "🔨 Build de l'application..."
sudo -u "$USER" npm run build

# 6. Démarrer les services
echo "🎬 Démarrage des services..."

# Activer et démarrer le service
systemctl enable "$APP_NAME"
systemctl restart "$APP_NAME"

# Redémarrer nginx
systemctl restart nginx

# 7. Vérifier le statut
echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📊 Status des services:"
systemctl status "$APP_NAME" --no-pager -l
echo ""
systemctl status nginx --no-pager -l
echo ""

# 8. Instructions pour SSL
echo "🔐 Pour configurer SSL avec Let's Encrypt:"
echo "   sudo certbot --nginx -d cedricraulfilms.fr -d www.cedricraulfilms.fr"
echo ""
echo "📝 Logs de l'application:"
echo "   sudo journalctl -u $APP_NAME -f"
echo "   tail -f $LOG_DIR/app.log"
echo ""
echo "🌐 L'application devrait être accessible sur http://localhost:4321"

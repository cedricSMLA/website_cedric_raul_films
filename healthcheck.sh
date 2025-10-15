#!/bin/bash

# Script de healthcheck pour Cédric Raúl Films
# Vérifie que l'application est en ligne et répond correctement

set -e

APP_URL="http://localhost:4321"
TIMEOUT=5
EXIT_CODE=0

echo "🏥 Healthcheck de Cédric Raúl Films"
echo "=================================="
echo ""

# Fonction pour vérifier un endpoint
check_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3

    echo -n "Vérification: $description... "

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" || echo "000")

    if [ "$HTTP_CODE" = "$expected_status" ]; then
        echo "✅ OK ($HTTP_CODE)"
    else
        echo "❌ ERREUR (attendu: $expected_status, reçu: $HTTP_CODE)"
        EXIT_CODE=1
    fi
}

# 1. Vérifier le service systemd
echo "1. Service systemd"
if systemctl is-active --quiet cedric-raul; then
    echo "   ✅ Service actif"
else
    echo "   ❌ Service inactif"
    EXIT_CODE=1
fi
echo ""

# 2. Vérifier que l'application répond
echo "2. Application Node.js"
check_endpoint "$APP_URL" "200" "Page d'accueil"
check_endpoint "$APP_URL/health" "200" "Endpoint health"
echo ""

# 3. Vérifier nginx
echo "3. Service nginx"
if systemctl is-active --quiet nginx; then
    echo "   ✅ nginx actif"
else
    echo "   ❌ nginx inactif"
    EXIT_CODE=1
fi
echo ""

# 4. Vérifier les logs récents pour des erreurs
echo "4. Erreurs récentes"
ERROR_COUNT=$(journalctl -u cedric-raul --since "5 minutes ago" | grep -ci "error" || echo "0")
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo "   ✅ Aucune erreur dans les 5 dernières minutes"
else
    echo "   ⚠️  $ERROR_COUNT erreur(s) détectée(s) dans les logs"
    # Ne pas considérer comme critique
fi
echo ""

# 5. Utilisation mémoire
echo "5. Ressources système"
MEM_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
echo "   Mémoire utilisée: ${MEM_USAGE}%"

if [ "$(echo "$MEM_USAGE > 90" | bc)" -eq 1 ]; then
    echo "   ⚠️  Utilisation mémoire élevée"
fi
echo ""

# Résultat final
echo "=================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Tous les checks ont réussi"
else
    echo "❌ Certains checks ont échoué"
fi
echo ""

exit $EXIT_CODE

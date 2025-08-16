#!/bin/bash

# Backup script using restic for Cédric Raúl Films website
# Backup website files, database (if any), and configurations to external storage

set -euo pipefail

# Configuration
BACKUP_NAME="cedric-raul-films"
RESTIC_REPOSITORY="${RESTIC_REPOSITORY:-/mnt/backup/restic-repo}"
RESTIC_PASSWORD_FILE="${RESTIC_PASSWORD_FILE:-/etc/restic/password}"
WEBSITE_DIR="/var/www/cedricraulfilms"
DATABASE_DIR="/var/lib/database"  # Future API database
CONFIG_DIR="/etc/nginx"
DOCKER_COMPOSE_DIR="/opt/cedric-raul-films"
LOG_FILE="/var/log/backup.log"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
RETENTION_WEEKS="${RETENTION_WEEKS:-12}"
RETENTION_MONTHS="${RETENTION_MONTHS:-12}"

# Functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_dependencies() {
    if ! command -v restic &> /dev/null; then
        log "ERROR: restic is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log "ERROR: docker is not installed"
        exit 1
    fi
}

initialize_repo() {
    if ! restic snapshots &> /dev/null; then
        log "Initializing restic repository..."
        restic init
        log "Repository initialized"
    fi
}

backup_files() {
    log "Starting backup of website files..."
    
    # Create temporary directory for backup
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    # Copy website files
    if [ -d "$WEBSITE_DIR" ]; then
        cp -r "$WEBSITE_DIR" "$TEMP_DIR/website"
        log "Website files copied"
    fi
    
    # Copy nginx configuration
    if [ -d "$CONFIG_DIR" ]; then
        cp -r "$CONFIG_DIR" "$TEMP_DIR/nginx"
        log "Nginx config copied"
    fi
    
    # Copy docker-compose and related files
    if [ -d "$DOCKER_COMPOSE_DIR" ]; then
        cp -r "$DOCKER_COMPOSE_DIR" "$TEMP_DIR/docker"
        log "Docker files copied"
    fi
    
    # Export Docker images (optional)
    # docker save cedric-raul-films:latest > "$TEMP_DIR/docker-image.tar"
    
    # Backup database (if exists)
    # if [ -d "$DATABASE_DIR" ]; then
    #     cp -r "$DATABASE_DIR" "$TEMP_DIR/database"
    #     log "Database copied"
    # fi
    
    # Create backup with restic
    restic backup "$TEMP_DIR" \
        --tag "website" \
        --tag "$(date +%Y-%m-%d)" \
        --exclude "*.log" \
        --exclude "node_modules" \
        --exclude ".git"
    
    log "Backup completed successfully"
}

cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    restic forget \
        --keep-daily "$RETENTION_DAYS" \
        --keep-weekly "$RETENTION_WEEKS" \
        --keep-monthly "$RETENTION_MONTHS" \
        --prune
    
    log "Old backups cleaned up"
}

check_backup_health() {
    log "Checking backup repository health..."
    restic check
    log "Repository health check completed"
}

send_notification() {
    local status=$1
    local message=$2
    
    # Send notification (email, webhook, etc.)
    # Example with curl webhook:
    # if [ -n "${WEBHOOK_URL:-}" ]; then
    #     curl -X POST "$WEBHOOK_URL" \
    #         -H "Content-Type: application/json" \
    #         -d "{\"text\":\"Backup $status: $message\"}"
    # fi
    
    log "Notification sent: $status - $message"
}

main() {
    log "Starting backup process for $BACKUP_NAME"
    
    check_dependencies
    
    # Set restic environment
    export RESTIC_REPOSITORY
    export RESTIC_PASSWORD_FILE
    
    # Check if repository exists, create if not
    initialize_repo
    
    # Perform backup
    if backup_files; then
        cleanup_old_backups
        check_backup_health
        send_notification "SUCCESS" "Backup completed successfully"
        log "Backup process completed successfully"
    else
        send_notification "FAILED" "Backup process failed"
        log "ERROR: Backup process failed"
        exit 1
    fi
}

# Run main function
main "$@"

# Example crontab entry:
# 0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
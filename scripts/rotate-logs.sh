#!/bin/bash

# Log rotation script for Cédric Raúl Films website
# Rotates nginx logs and application logs

set -euo pipefail

# Configuration
LOG_DIR="/var/log/nginx"
BACKUP_LOG_DIR="/var/log/backup"
MAX_LOG_AGE_DAYS=30
COMPRESS_AFTER_DAYS=7
DOCKER_CONTAINER="cedric-raul-films"

# Functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

rotate_nginx_logs() {
    log "Rotating nginx logs..."
    
    if [ ! -d "$LOG_DIR" ]; then
        log "Log directory $LOG_DIR does not exist"
        return 1
    fi
    
    cd "$LOG_DIR"
    
    # Rotate access log
    if [ -f "access.log" ]; then
        mv "access.log" "access.log.$(date +%Y%m%d-%H%M%S)"
        log "Rotated access.log"
    fi
    
    # Rotate error log
    if [ -f "error.log" ]; then
        mv "error.log" "error.log.$(date +%Y%m%d-%H%M%S)"
        log "Rotated error.log"
    fi
    
    # Send signal to nginx to reopen log files
    if docker ps | grep -q "$DOCKER_CONTAINER"; then
        docker exec "$DOCKER_CONTAINER" nginx -s reopen
        log "Sent reopen signal to nginx"
    else
        log "Container $DOCKER_CONTAINER is not running"
    fi
}

compress_old_logs() {
    log "Compressing old logs..."
    
    # Compress logs older than COMPRESS_AFTER_DAYS
    find "$LOG_DIR" -name "*.log.*" -type f -mtime +$COMPRESS_AFTER_DAYS ! -name "*.gz" -exec gzip {} \;
    
    # Also compress backup logs if they exist
    if [ -d "$BACKUP_LOG_DIR" ]; then
        find "$BACKUP_LOG_DIR" -name "*.log" -type f -mtime +$COMPRESS_AFTER_DAYS ! -name "*.gz" -exec gzip {} \;
    fi
    
    log "Old logs compressed"
}

cleanup_old_logs() {
    log "Cleaning up old logs..."
    
    # Remove logs older than MAX_LOG_AGE_DAYS
    find "$LOG_DIR" -name "*.log.*" -type f -mtime +$MAX_LOG_AGE_DAYS -delete
    find "$LOG_DIR" -name "*.gz" -type f -mtime +$MAX_LOG_AGE_DAYS -delete
    
    # Clean backup logs too
    if [ -d "$BACKUP_LOG_DIR" ]; then
        find "$BACKUP_LOG_DIR" -name "*.log*" -type f -mtime +$MAX_LOG_AGE_DAYS -delete
    fi
    
    log "Old logs cleaned up"
}

get_log_stats() {
    log "Log statistics:"
    
    if [ -d "$LOG_DIR" ]; then
        local log_count=$(find "$LOG_DIR" -name "*.log*" -type f | wc -l)
        local log_size=$(du -sh "$LOG_DIR" 2>/dev/null | cut -f1 || echo "unknown")
        log "  - Total log files: $log_count"
        log "  - Total log size: $log_size"
    fi
}

main() {
    log "Starting log rotation process"
    
    # Create log directories if they don't exist
    mkdir -p "$LOG_DIR"
    mkdir -p "$BACKUP_LOG_DIR"
    
    # Rotate logs
    rotate_nginx_logs
    
    # Compress old logs
    compress_old_logs
    
    # Clean up very old logs
    cleanup_old_logs
    
    # Show statistics
    get_log_stats
    
    log "Log rotation completed"
}

# Run main function
main "$@"

# Example crontab entry:
# 0 1 * * * /opt/scripts/rotate-logs.sh >> /var/log/cron.log 2>&1
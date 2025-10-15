#!/bin/bash
cd "$(dirname "$0")/dist/server"
ln -sf ../client/_assets _assets
echo "✓ Symbolic link created: dist/server/_assets -> ../client/_assets"

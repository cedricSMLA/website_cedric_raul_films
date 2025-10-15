#!/bin/bash
set -a
source .env
set +a
exec npm run dev -- --host 0.0.0.0 --port 4321

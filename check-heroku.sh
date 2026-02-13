#!/bin/bash
# Diagnostic: what does Heroku actually have?
# Run: bash check-heroku.sh
cd "$(dirname "$0")"
OUT="$PWD/heroku-check.txt"
exec > "$OUT" 2>&1

echo "=== Git remotes ==="
git remote -v

echo ""
echo "=== Local main branch (last commit) ==="
git log main -1 --oneline

echo ""
echo "=== Heroku releases (did any deploy succeed?) ==="
heroku releases -a slack-vibeface-simulator 2>&1 | head -15

echo ""
echo "=== Heroku builds ==="
heroku builds -a slack-vibeface-simulator 2>&1 | head -10

echo ""
echo "=== Dyno status ==="
heroku ps -a slack-vibeface-simulator 2>&1

echo ""
echo "Output saved to: $OUT"

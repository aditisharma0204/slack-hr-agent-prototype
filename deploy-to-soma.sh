#!/bin/bash
# Deploy Vibeface simulator to Soma Git
set -e
cd "$(dirname "$0")"

echo "Staging all changes..."
git add -A

echo "Checking status..."
git status

echo "Committing..."
git commit -m "Add Vibeface right panel (Reactive + Proactive tabs)" || echo "Nothing to commit (working tree clean)"

echo "Pushing to soma..."
git push -u soma main

echo "Done! Deploy from: https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator"

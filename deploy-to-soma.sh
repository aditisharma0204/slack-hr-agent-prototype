#!/bin/bash
# Deploy Vibeface simulator to Soma Git
set -e
cd "$(dirname "$0")"

echo "Staging all changes..."
git add -A

echo "Checking status..."
git status

echo "Committing..."
git commit -m "Add static Vibeface demo for Soma Pages" || echo "Nothing to commit (working tree clean)"

echo "Pushing to soma..."
git push -u soma main

echo "Done!"
echo "Repo: https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator"
echo "Pages: Set Source Directory to /docs in repo Settings → Pages"
echo "Live: https://git.soma.salesforce.com/pages/prantik-banerjee/slack-vibeface-simulator/"

#!/bin/bash
# Deploy slack-vibeface-simulator to Heroku
set -e

cd "$(dirname "$0")"

echo "=== 1. Setting Heroku config (devDependencies for build) ==="
heroku config:set NPM_CONFIG_PRODUCTION=false -a slack-vibeface-simulator

echo ""
echo "=== 2. Ensuring Heroku remote exists ==="
if ! git remote get-url heroku 2>/dev/null; then
  heroku git:remote -a slack-vibeface-simulator
else
  echo "Heroku remote already configured"
fi

echo ""
echo "=== 3. Triggering deploy (empty commit if nothing to push) ==="
git commit --allow-empty -m "Heroku deploy $(date +%Y%m%d-%H%M)" 2>/dev/null || true
echo "=== 4. Pushing to Heroku (2-5 min - watch for build output) ==="
git push heroku main

echo ""
echo "=== 5. Ensuring web dyno is running ==="
heroku ps:scale web=1 -a slack-vibeface-simulator

echo ""
echo "=== Done! Open: https://slack-vibeface-simulator.herokuapp.com ==="
echo ""
echo "If the app still shows 'There's nothing here', run: heroku logs --tail -a slack-vibeface-simulator"

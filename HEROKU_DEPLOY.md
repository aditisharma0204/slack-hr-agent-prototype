# Deploy to Heroku (Slack Demo + Slackbot)

Deploy the **demo** Slack clone with Slackbot panel to Heroku. Uses Next.js standalone output for reliable deployment.

## Demo mode (no Convex required)

The app redirects `/` to `/demo`. The demo uses hardcoded data — no Convex or auth needed.

## Deploy

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false -a slack-vibeface-simulator
heroku git:remote -a slack-vibeface-simulator
git commit --allow-empty -m "Deploy"   # triggers new build if nothing to commit
git push heroku main
heroku ps:scale web=1 -a slack-vibeface-simulator
```

Or run `bash deploy.sh` from the project root.

Your app: https://slack-vibeface-simulator.herokuapp.com

---

## Full app (with Convex + auth)

For the full Slack clone with real-time data and auth:

```bash
heroku config:set NEXT_PUBLIC_CONVEX_URL="https://YOUR_CONVEX_ID.convex.cloud"
heroku config:set AUTH_SECRET="$(openssl rand -base64 32)"
heroku config:set AUTH_GITHUB_ID="your_github_client_id"
heroku config:set AUTH_GITHUB_SECRET="your_github_client_secret"
```

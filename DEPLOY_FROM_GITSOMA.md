# Deploy from git.soma (your existing project)

**Do NOT run `heroku git:clone`** — that creates an empty folder. You already have your code.

## From your project directory:

```bash
cd /Users/prantik.banerjee/Documents/projects/slack-vibeface-simulator

# 1. Add Heroku remote (if not already)
heroku git:remote -a slack-vibeface-simulator

# 2. Force a new deploy (creates empty commit so Heroku actually builds)
git commit --allow-empty -m "Deploy $(date +%Y%m%d)"
git push heroku main

# 3. Ensure web dyno is on
heroku ps:scale web=1 -a slack-vibeface-simulator
```

## Check if it worked:

```bash
# See release history
heroku releases -a slack-vibeface-simulator

# See live logs (build + runtime)
heroku logs --tail -a slack-vibeface-simulator
```

If you see "Everything up-to-date" when pushing, the empty commit forces a new build.

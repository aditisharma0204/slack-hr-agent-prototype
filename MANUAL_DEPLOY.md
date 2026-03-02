# Manual Deployment to GitSoma Pages

Since GitHub Actions requires special permissions, here's how to deploy manually:

## Step 1: Build Locally

```bash
npm run build
```

This creates an `out/` folder with static files.

## Step 2: Push the `out/` folder to GitSoma

**Option A: Add `out/` to git and push**

```bash
# Add out folder to git
git add out/
git commit -m "Add static build output"
git push origin master
```

**Option B: Use a separate branch for deployment**

```bash
# Create a deployment branch
git checkout -b gh-pages

# Add out folder
git add out/
git commit -m "Deploy static build"

# Push to gh-pages branch
git push origin gh-pages
```

## Step 3: Configure GitSoma Pages

1. Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template/settings/pages`
2. Under **Source**, select:
   - **Branch**: `master` (or `gh-pages` if you used Option B)
   - **Folder**: `/out`
3. Click **Save**

## Step 4: Access Your Site

Your site will be available at:
```
https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/
```

---

## Troubleshooting

### If you see "Server Actions are not supported"

The build might fail with this error. This is a Next.js limitation. Options:

1. **Use Vercel** (recommended): Deploy to Vercel instead - it handles Next.js apps perfectly
2. **Manual workaround**: Comment out `output: 'export'` in `next.config.mjs`, build normally, then manually copy the `.next` folder (not recommended)

### If Pages shows README instead of app

Make sure:
- The `out/` folder exists and contains `index.html`
- GitSoma Pages is configured to use `/out` folder, not root
- You've pushed the `out/` folder to the repository

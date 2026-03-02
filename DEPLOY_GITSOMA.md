# Deploy from GitSoma (GitHub Pages)

This guide shows how to deploy directly from GitSoma using GitHub Pages.

## Option 1: GitHub Pages (Static Export)

### Step 1: Configure Next.js for Static Export

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static export for GitHub Pages
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || "https://demo-disabled.convex.cloud",
    },
    images: {
        unoptimized: true, // Required for static export
        remotePatterns: [
            { protocol: "https", hostname: "randomuser.me", pathname: "/**" },
            { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
        ],
    },
    basePath: '/slack-app-shell-template', // If deploying to /repository-name path
    assetPrefix: '/slack-app-shell-template', // If deploying to /repository-name path
};

export default nextConfig;
```

**Note:** If your GitSoma Pages URL is at the root (not `/repository-name`), remove the `basePath` and `assetPrefix` lines.

### Step 2: Build Static Files

```bash
npm run build
```

This creates an `out/` folder with static files.

### Step 3: Enable GitHub Pages in GitSoma

1. Go to your repository: `https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template`
2. Click **Settings** (top right)
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `master` (or `main`)
   - Folder: `/out` (the static export folder)
5. Click **Save**

### Step 4: Access Your Deployed Site

Your site will be available at:
```
https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/
```

Or if configured at root:
```
https://prantik-banerjee.git.soma.salesforce.com/slack-app-shell-template/
```

---

## Option 2: GitHub Actions (Automated Deployment)

Create a workflow that builds and deploys automatically on every push.

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master, main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CONVEX_URL: "https://demo-disabled.convex.cloud"
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 2: Enable Pages in Settings

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select: **GitHub Actions**
3. Save

### Step 3: Push and Deploy

```bash
git add .github/workflows/deploy-pages.yml
git add next.config.mjs
git commit -m "Add GitHub Pages deployment"
git push origin master
```

The workflow will automatically build and deploy!

---

## Option 3: Manual Upload to GitSoma Pages

If you prefer manual control:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Go to GitSoma repository** → **Settings** → **Pages**

3. **Upload the `out/` folder** (if GitSoma supports file uploads)

   Or use Git LFS if files are large:
   ```bash
   git lfs track "out/**"
   git add .gitattributes
   git add out/
   git commit -m "Add static build"
   git push origin master
   ```

---

## Sharing Your Deployed Site

Once deployed, share the GitHub Pages URL with your team:

```
https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/
```

**Or add to your README.md:**

```markdown
## 🌐 Live Demo

👉 [View Live Template](https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/)
```

---

## Troubleshooting

**Build fails?**
- Check that `output: 'export'` is in `next.config.mjs`
- Ensure `images.unoptimized: true` is set
- Run `npm run build` locally first to catch errors

**Pages not updating?**
- Wait 1-2 minutes after push
- Check Actions tab for build status
- Clear browser cache

**404 errors?**
- Check `basePath` in `next.config.mjs` matches your Pages URL structure
- If Pages URL is `/repository-name/`, keep `basePath`
- If Pages URL is root, remove `basePath`

**Need help?** Check GitSoma Pages documentation or contact your GitSoma admin.

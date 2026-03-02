# Deploy to GitSoma Pages - Instructions

✅ **Static export is now working!** The build creates an `out/` folder with all static files.

## Quick Deploy Steps

### Option 1: Manual Upload (Easiest)

1. **Build locally:**
   ```bash
   npm run build
   ```
   This creates the `out/` folder.

2. **Add `out/` folder to git:**
   ```bash
   git add out/
   git commit -m "Add static build for Pages"
   git push origin master
   ```

3. **Configure GitSoma Pages:**
   - Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template/settings/pages`
   - Under **Source**, select:
     - **Branch**: `master`
     - **Folder**: `/out`
   - Click **Save**

4. **Access your site:**
   ```
   https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/
   ```

### Option 2: Automated with GitHub Actions (Requires Permissions)

If you have workflow permissions, you can use the GitHub Actions workflow:

1. **Add the workflow file manually via GitSoma UI:**
   - Go to your repository
   - Click "Add file" → "Create new file"
   - Path: `.github/workflows/deploy.yml`
   - Copy the content from `.github/workflows/deploy.yml` in your local repo
   - Commit

2. **The workflow will automatically:**
   - Build on every push to `master`
   - Deploy to GitHub Pages
   - Update your site automatically

## What Was Fixed

- ✅ Disabled `middleware.ts` (renamed to `.disabled`) - middleware doesn't work with static export
- ✅ Removed `ConvexAuthNextjsServerProvider` import - was triggering Server Actions error
- ✅ Removed `NuqsAdapter` temporarily - can be re-enabled if needed
- ✅ Static export now works perfectly!

## Troubleshooting

**If Pages still shows README:**
- Make sure Pages is configured to use `/out` folder, not root
- Verify `out/index.html` exists in your repository
- Wait 1-2 minutes for Pages to rebuild

**To rebuild after code changes:**
```bash
npm run build
git add out/
git commit -m "Rebuild static site"
git push origin master
```

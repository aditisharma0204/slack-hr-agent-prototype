# Deployment Guide for Slack App Shell Template

This guide shows you how to deploy the template so your team can access it via a live URL.

## Option 1: Deploy to Vercel (Recommended - Easiest for Next.js)

Vercel is made by the creators of Next.js and offers free hosting with automatic deployments from Git.

### Steps:

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account (or email)

2. **Import Your GitSoma Repository:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - If GitSoma isn't connected:
     - Click "Configure Git Provider"
     - Add GitSoma (you may need to add it as a custom Git provider)
     - Or use "Import" → "Other Git Provider" and enter:
       ```
       Repository URL: https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template.git
       ```

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

5. **Get Your Live URL:**
   - Vercel will give you a URL like: `https://slack-app-shell-template.vercel.app`
   - This URL is live and accessible to anyone!

6. **Share with Your Team:**
   - Send them the Vercel URL
   - Every time you push to GitSoma, Vercel auto-deploys updates

---

## Option 2: Deploy to Netlify (Alternative)

1. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/login

2. **Import from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect GitSoma (or use manual deploy)
   - Select your repository

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Deploy:**
   - Click "Deploy site"
   - Get your URL: `https://your-site-name.netlify.app`

---

## Option 3: Self-Hosted (If you have a server)

If your company has internal hosting:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Configure your server** to run `npm start` on port 3000 (or your preferred port)

---

## Option 4: GitHub Pages (If GitSoma supports it)

GitHub Pages typically requires static export. For Next.js:

1. **Update `next.config.js`** to enable static export:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
   }
   module.exports = nextConfig
   ```

2. **Build static files:**
   ```bash
   npm run build
   ```

3. **Enable Pages in GitSoma:**
   - Go to repository Settings → Pages
   - Select source branch (usually `main` or `master`)
   - Select folder: `/out` (Next.js static export folder)
   - Save

4. **Access via:**
   - `https://git.soma.salesforce.com/pages/prantik-banerjee/slack-app-shell-template/`

---

## Recommended: Vercel (Fastest & Easiest)

**Why Vercel?**
- ✅ Free tier (perfect for prototypes)
- ✅ Automatic deployments from GitSoma
- ✅ HTTPS included
- ✅ Custom domains available
- ✅ Built specifically for Next.js
- ✅ Preview deployments for pull requests

**Time to deploy:** ~5 minutes

**Share link format:**
```
https://slack-app-shell-template.vercel.app
```

---

## After Deployment: Sharing with Your Team

1. **Send them the live URL** (e.g., Vercel URL)
2. **Optional:** Add to README.md:
   ```markdown
   ## Live Demo
   👉 [View Live Template](https://your-deployment-url.com)
   ```
3. **For developers:** They can still clone from GitSoma:
   ```bash
   git clone https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template.git
   cd slack-app-shell-template
   npm install
   npm run dev
   ```

---

## Troubleshooting

**Build fails?**
- Check build logs in Vercel/Netlify dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally first

**Can't connect GitSoma to Vercel?**
- Use manual deployment: Vercel → "Deploy" → "Upload" → zip your project folder
- Or use Netlify Drop (drag & drop)

**Need help?** Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)

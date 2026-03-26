# How to use Slack-app-shell-template

## Github

### Step 1: Create a Personal Access Token on GitSoma -- this is very important

1. Go to https://git.soma.salesforce.com/settings/tokens
2. Click "Generate new token"
3. Give it a name (something like `slack-template-clone`)
4. Check the `repo` scope (full control of private repositories)
5. Click Generate token
6. Copy the token immediately — it only shows once

### Step 2: Clone the Template Using the Token

```bash
git clone https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template.git
```

When prompted for credentials:
- **Username:** your SSO username (e.g. `aditi.sharma2`)
- **Password:** paste the Personal Access Token (not your actual password)

### Step 3: Install Dependencies & Run

```bash
cd slack-app-shell-template
npm install
npm run dev
```

Open http://localhost:3000 — the Slack shell loads.

### Step 4: Create Your Own Repo & Push

Create a new repo on GitHub (e.g. `aditisharma0204/slack-hr-agent-prototype`) and re-point the origin:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 5: Customize with Cursor

From there, use Cursor Agent to build on top of the template (workflow engine, chat UI, starter chips, etc.).

---

## Troubleshooting

### 404 — "This page could not be found"

Make sure you're going to **http://localhost:3000** (with the port), not just `http://localhost`.

### `removeChild` hydration error

```
NotFoundError: Failed to execute 'removeChild' on 'Node':
The node to be removed is not a child of this node.
```

This is a React hydration mismatch. Try these fixes in order:

**1. Disable browser extensions**

Browser extensions like Grammarly, Google Translate, LastPass, and ad blockers inject DOM nodes into `<body>`, which breaks React's hydration. Try opening **http://localhost:3000** in an **incognito/private window** (with extensions disabled).

**2. Comment out `output: 'export'` for local dev**

The template ships with static export enabled (for GitHub Pages). This can cause hydration issues in dev mode. Open `next.config.mjs` and comment it out:

```js
const nextConfig = {
    // output: 'export',  // comment this out for local dev
    ...
};
```

Then restart the server (`Ctrl+C`, then `npm run dev`).

**3. Verify Node version**

The template requires Node 18+. Check your version:

```bash
node -v
```

If you're below v18, update via [nvm](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org/).

**4. Clean install**

If all else fails, nuke `node_modules` and the Next.js cache and reinstall:

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Still stuck?

Reach out in the team channel with:
- Your Node version (`node -v`)
- Your OS (macOS / Windows / Linux)
- The full error from your terminal

---

## Project Structure

```
src/
├── app/
│   └── page.tsx              # Main entry — renders SlackAppShell
├── components/
│   ├── presentation/
│   │   ├── SlackAppShell.tsx  # Core shell component
│   │   ├── SlackTodayView.tsx # Today view with focus prompts & agenda
│   │   └── TemplateViews.tsx  # Generic template views (Home, Activity, Files, etc.)
│   └── shared/
│       ├── UniversalChatSurface.tsx  # Reusable chat interface
│       └── ChatMessage.tsx           # Message component
└── context/
    └── DemoDataContext.tsx   # Mock data for channels, DMs, files
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React** (with hooks)
- **Framer Motion** (animations)

# Slack App Shell Boilerplate

A clean, reusable Slack App Shell template for designers to build new Slack integration concepts.

> **⚠️ This is a read-only template repository.** To make changes, please **fork** this repository and work in your own fork.

## 🎯 What This Is

This is a **boilerplate template** that provides a fully functional Slack-like UI shell with:
- ✅ Complete sidebar navigation (Today, Home, DMs, Activity, Files, Later, Agentforce)
- ✅ Interactive chat surfaces with message input
- ✅ Today view with focus prompts, agenda, highlights, and replies
- ✅ Generic placeholder data ready for your concepts
- ✅ All interactions working (sidebar clicks, hover states, animations)

**Perfect for:** Designers who want to prototype new Slack app experiences without building the shell from scratch.

## 🚀 Quick Start

**Prerequisites:**
- Node.js 18+ 
- npm or yarn

### For Designers (GitSoma)

**Step 1: Fork the repository**
- Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-app-shell-template`
- Click the **"Fork"** button (top right)
- This creates your own copy

**Step 2: Clone your fork**
```bash
git clone https://git.soma.salesforce.com/YOUR-USERNAME/slack-app-shell-template.git
cd slack-app-shell-template
```

**Step 3: Install & Run**
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the Slack App Shell with Today view loaded.

**Step 4: Make changes**
- Edit files in `src/` folder
- Changes appear instantly in your browser
- Commit and push to your fork when ready

### 🚀 Quick Cursor Prompts for Concept Creation

**Use these prompts in Cursor AI to quickly customize the template:**

**Customize Today View:**
```
Update the focus prompts in SlackTodayView to show [your concept idea]. 
Change the agenda items to reflect [your use case]. 
Update highlights and replies to match [your narrative].
```

**Add New Sidebar View:**
```
Add a new sidebar navigation item called "[Your View]" that shows [description]. 
Create a new view component and wire it up to the sidebar navigation.
```

**Update Chat Content:**
```
Replace the channel messages in TemplateViews with conversations about [your topic]. 
Update DM previews to show [your scenario].
```

**Customize Data:**
```
Update DemoDataContext to include [your channels/DMs/files]. 
Change contact names and channel names to match [your concept].
```

**Change Styling:**
```
Update the color scheme to [your brand colors]. 
Modify the Today view layout to [your design preference].
```

**Add Interactive Features:**
```
Add a [button/modal/form] that [does something specific] when clicked. 
Make the [component] respond to [user action] with [desired behavior].
```

## 🌐 Deploy & Share

**Want to deploy so your team can access it via a live URL?**

👉 See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions.

**Quick option:** Deploy to [Vercel](https://vercel.com) (free, ~5 minutes):
1. Sign up at vercel.com
2. Import your GitSoma repository
3. Click "Deploy"
4. Share the live URL with your team!

## 📁 Project Structure

```
src/
├── app/
│   └── page.tsx              # Main entry point - renders SlackAppShell
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

## 🎨 Customizing for Your Concept

### 1. Replace Today View Content

Edit `src/components/presentation/SlackTodayView.tsx`:
- Modify focus prompt pills (top 3 cards)
- Update agenda items
- Change highlights and replies sections

### 2. Add Your Own Views

In `src/app/page.tsx`, add new cases to `renderContent()`:

```tsx
case "your-view":
  return <YourCustomView />;
```

### 3. Update Sidebar Data

Edit `src/context/DemoDataContext.tsx` to change:
- Channel names and previews
- DM contacts
- File lists
- Activity items

### 4. Customize Chat Content

In `src/components/presentation/TemplateViews.tsx`, modify `CHANNEL_MESSAGES` and `DM_MESSAGES` to add your own conversation data.

## 🎯 Key Features

- **Today View:** Focus prompts with animated gradient borders, agenda with hover "Prep"/"Ask" buttons, highlights, replies
- **Sidebar Navigation:** Fully functional with click handlers that update main content
- **Chat Surfaces:** Universal chat component with message input (consistent across all views)
- **Responsive:** Works on different screen sizes
- **Type-Safe:** Full TypeScript support

## 📝 Notes

- All narrative-specific content has been removed — this is a clean slate
- The shell uses generic placeholder data (`GENERIC_GLOBAL_DMS`, mock channels)
- Sidebar clicks automatically update the main chat content
- Hover states work on focus prompts (animated gradients) and agenda items (button swaps)

## 🤝 Sharing with Your Team

Once you've customized it for your concept:

1. **Initialize git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Slack App Shell boilerplate"
   ```

2. **Create a GitHub repository** and push:
   ```bash
   git remote add origin https://github.com/your-org/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

3. **Share the repo URL** with your design team — they can clone and start building!

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React** (with hooks)
- **Framer Motion** (animations)

## 📄 License

This is a template for internal use. Customize as needed for your projects.

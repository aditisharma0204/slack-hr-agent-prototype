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


## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React** (with hooks)
- **Framer Motion** (animations)

## 📄 License

This is a template for internal use. Customize as needed for your projects.

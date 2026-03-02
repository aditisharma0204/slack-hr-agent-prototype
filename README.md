# Slack App Shell Boilerplate

A clean, reusable Slack App Shell template for designers to build new Slack integration concepts.

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

**Installation:**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the Slack App Shell with Today view loaded.

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

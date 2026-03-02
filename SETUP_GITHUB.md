# Setting Up GitHub Repository

Follow these steps to push this boilerplate to GitHub so other designers can access it.

## Step 1: Accept Xcode License (if needed)

If git commands fail, run:
```bash
sudo xcodebuild -license accept
```

## Step 2: Initialize Git Repository

```bash
cd /Users/prantik.banerjee/Documents/Projects/slack-app-shell-template
git init
git add .
git commit -m "Initial commit: Slack App Shell boilerplate template"
```

## Step 3: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `slack-app-shell-template`)
3. **Don't** initialize with README (we already have one)
4. Copy the repository URL (e.g., `https://github.com/your-org/slack-app-shell-template.git`)

## Step 4: Connect and Push

```bash
git remote add origin https://github.com/your-org/slack-app-shell-template.git
git branch -M main
git push -u origin main
```

## Step 5: Share with Your Team

Share the GitHub URL with your designers. They can clone it with:

```bash
git clone https://github.com/your-org/slack-app-shell-template.git
cd slack-app-shell-template
npm install
npm run dev
```

## Optional: Add Collaborators

1. Go to your GitHub repo → Settings → Collaborators
2. Add team members by their GitHub usernames
3. They'll receive an invitation email

That's it! Your team can now clone and use the boilerplate.

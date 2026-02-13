# Vibeface Static Demo (Soma Pages)

This folder contains a static demo of the Vibeface panel for **Soma Git Pages**.

## Pages configuration

1. Go to your repo: https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator
2. **Settings** → **Pages**
3. Set **Source**:
   - **Branch:** `main`
   - **Directory:** `/docs` ← **Important:** change from root to `/docs`
4. Click **Save**

Your site will be published at:
**https://git.soma.salesforce.com/pages/prantik-banerjee/slack-vibeface-simulator/**

## Local preview

```bash
cd docs
python3 -m http.server 8080
# Open http://localhost:8080
```

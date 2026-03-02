# Setting Default Narrative

This app supports setting a default narrative that persists for all users when deployed to Heroku.

## Available Narratives

- `default` - "01 : Quarter Closing Story"
- `leadership` - "02 : AE JTBDs in Slack"

## Methods to Set Default

### 1. Environment Variable (Recommended for Heroku)

Set the `NEXT_PUBLIC_DEFAULT_NARRATIVE` environment variable:

**Via Heroku CLI:**
```bash
heroku config:set NEXT_PUBLIC_DEFAULT_NARRATIVE=leadership
```

**Via Heroku Dashboard:**
1. Go to your app's Settings
2. Click "Reveal Config Vars"
3. Add: `NEXT_PUBLIC_DEFAULT_NARRATIVE` = `leadership`
4. Restart the app

**For Local Development:**
Create `.env.local` file:
```
NEXT_PUBLIC_DEFAULT_NARRATIVE=leadership
```

### 2. URL Parameter (For Sharing Specific Narratives)

Add `?narrative=` to any URL to share a specific narrative:

```
https://your-app.herokuapp.com/?narrative=leadership
https://your-app.herokuapp.com/?narrative=default
```

**Priority:** URL parameter > Environment variable > "default"

### 3. How It Works

- When a user visits without a URL parameter, the app uses the environment variable default
- If no environment variable is set, it defaults to "default" narrative
- URL parameters always override the default
- The narrative persists in the URL, so sharing the link preserves the narrative choice

## Example Usage

**To make "02 : AE JTBDs in Slack" the default for all users:**
```bash
heroku config:set NEXT_PUBLIC_DEFAULT_NARRATIVE=leadership
```

**To share a link with a specific narrative:**
```
https://your-app.herokuapp.com/?narrative=leadership
```

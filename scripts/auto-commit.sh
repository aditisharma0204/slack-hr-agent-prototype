#!/bin/bash

REPO_DIR="/Users/aditi.sharma2/Documents/Cursor/Slack-HR-Agents/HRSM-Agent-Prototype"
LOG_FILE="$HOME/Library/Logs/slack-hr-auto-commit.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

log() {
  echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
}

cd "$REPO_DIR" || { log "ERROR: Could not cd to $REPO_DIR"; exit 1; }

CHANGES=$(git status --porcelain 2>&1)

if [ -z "$CHANGES" ]; then
  log "No changes detected. Skipping."
  exit 0
fi

FILE_COUNT=$(echo "$CHANGES" | wc -l | tr -d ' ')
FILE_LIST=$(echo "$CHANGES" | head -8 | awk '{print $2}' | tr '\n' ', ' | sed 's/,$//')

if [ "$FILE_COUNT" -gt 8 ]; then
  FILE_LIST="$FILE_LIST, ... and $((FILE_COUNT - 8)) more"
fi

RESPONSE=$(osascript -e "
  display dialog \"Auto-commit: $FILE_COUNT file(s) changed in HRSM-Agent-Prototype.

Files: $FILE_LIST

Commit and push to GitHub?\" buttons {\"Skip\", \"Commit\"} default button \"Commit\" with title \"Slack HR Agent — Auto Commit\" giving up after 300
" 2>&1)

if echo "$RESPONSE" | grep -q "Commit"; then
  git add -A
  git commit -m "Auto-commit: $TIMESTAMP"
  PUSH_OUTPUT=$(git push origin main 2>&1)
  PUSH_EXIT=$?

  if [ $PUSH_EXIT -eq 0 ]; then
    log "SUCCESS: Committed and pushed $FILE_COUNT file(s)."
  else
    log "ERROR: Commit succeeded but push failed: $PUSH_OUTPUT"
  fi
else
  log "User skipped auto-commit ($FILE_COUNT file(s) unchanged)."
fi

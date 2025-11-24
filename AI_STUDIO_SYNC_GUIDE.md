# How to Sync AI Studio with GitHub

## Current Issue
AI Studio isn't syncing changes to the GitHub repository.

## Solution: Configure Git in AI Studio

### Step 1: Open Terminal in AI Studio
Look for the Terminal tab at the bottom of AI Studio

### Step 2: Configure Git Credentials

Run these commands in the AI Studio terminal:

```bash
# Set your git username
git config --global user.name "biblicalman1611"

# Set your git email
git config --global user.email "arevx1611@gmail.com"

# Set the remote URL with authentication token
git remote set-url origin https://biblicalman1611:YOUR_GITHUB_TOKEN@github.com/biblicalman1611/The-Alpha-Biblical-Man-App.git
```

### Step 3: Pull Latest Changes

```bash
# Make sure you have the latest code
git pull origin main
```

### Step 4: Test Push

```bash
# Make a small test change
echo "# Test from AI Studio" >> test-sync.md

# Add the file
git add test-sync.md

# Commit the change
git commit -m "test: Verify AI Studio sync"

# Push to GitHub
git push origin main
```

### Step 5: Verify

After pushing, check:
- GitHub: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App
- GitHub Actions: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions

You should see the new commit and a deployment workflow running.

## Going Forward

Every time you make changes in AI Studio:

1. **Make your code changes**
2. **Commit**:
   ```bash
   git add .
   git commit -m "describe your changes"
   ```
3. **Push**:
   ```bash
   git push origin main
   ```
4. **Wait 2-3 minutes** for automatic deployment
5. **Check live site**: https://thebiblicalmantruth.com

## Troubleshooting

### If you get "Permission denied":
The token might have expired. Let me know and I'll generate a new one.

### If you get "Nothing to commit":
Your changes are already committed. Just run:
```bash
git push origin main
```

### If you get merge conflicts:
```bash
git pull origin main --rebase
# Fix any conflicts
git add .
git rebase --continue
git push origin main
```

## Alternative: Use AI Studio's Git UI

1. Look for the **Source Control** icon in the left sidebar (looks like a branch)
2. Click it to see changed files
3. Type a commit message at the top
4. Click the checkmark ✓ to commit
5. Click the "..." menu → Push

This is easier than using terminal commands!

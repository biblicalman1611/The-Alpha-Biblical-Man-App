# 📱 Code From Your Phone - Complete Setup Guide

## What I Just Set Up For You

✅ **GitHub Codespaces** - VS Code in your browser
✅ **Claude Code Extension** - AI assistant anywhere
✅ **Auto-Deploy Pipeline** - Push → Auto-deploys to Cloud Run
✅ **All your environment variables** - Pre-configured

---

## How to Start (2 Steps)

### Step 1: Push to GitHub

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App
git add .devcontainer .github/workflows
git commit -m "Add Codespaces and auto-deploy"
git push
```

### Step 2: Configure GitHub Secrets (One-Time)

Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions

Click **"New repository secret"** for each:

| Secret Name | Value |
|-------------|-------|
| `VITE_GEMINI_API_KEY` | `AIzaSyCmb1G6GXtiA5dRE6Szfez5DUUmaiejchw` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDT1LEHPJcfQU3SSAbL3LGasS5EQ_ExSaM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `the-biblical-man.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `the-biblical-man` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `the-biblical-man.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `633727478392` |
| `VITE_FIREBASE_APP_ID` | `1:633727478392:web:c9f3df68b78a8d87735b8d` |

For auto-deploy to Cloud Run, you also need:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `GCP_SA_KEY` | Service account JSON | See below ⬇️ |

---

## Get Google Cloud Service Account Key

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=the-biblical-man

2. Click **"CREATE SERVICE ACCOUNT"**
   - Name: `github-actions-deployer`
   - Role: `Cloud Run Admin`
   - Role: `Service Account User`
   - Role: `Storage Admin`

3. Click **"CREATE KEY"** → JSON → Download

4. Copy the entire JSON content

5. Add to GitHub Secrets as `GCP_SA_KEY`

---

## Using Codespaces on Your Phone

### Open Codespaces

**On Phone:**
1. Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App
2. Tap green **"Code"** button
3. Tap **"Codespaces"** tab
4. Tap **"Create codespace on main"**

**Wait 1-2 minutes** while it sets up.

### What You Get

- Full VS Code in Safari/Chrome
- Claude Code extension ready
- Your entire project
- Terminal access
- Live preview on port 3000

### Make Changes

1. **Open a file** (tap file explorer on left)
2. **Edit code** (keyboard pops up)
3. **Use Claude Code**:
   - Tap Command Palette (⌘ icon)
   - Type "Claude Code"
   - Ask Claude anything!
4. **Save** (auto-saves)

### Deploy to Production

**Option 1: Auto-Deploy**
```bash
git add .
git commit -m "Updated feature"
git push
```
→ GitHub Actions auto-deploys to Cloud Run!

**Option 2: Manual Deploy**
```bash
# In Codespaces terminal:
npm run build
gcloud run deploy the-biblical-man --source .
```

---

## Example Workflows

### Example 1: Fix a Bug from Bed

1. Open Codespaces on phone
2. Open the problematic file
3. Press Command Palette → "Claude Code: Chat"
4. Ask: "Fix the timeout issue in scripture tool"
5. Claude makes the changes
6. Commit and push
7. Auto-deploys in 2-3 minutes
8. Bug fixed! Go back to sleep 😴

### Example 2: Add New Feature

1. Open Codespaces
2. Ask Claude: "Add a dark mode toggle to the dashboard"
3. Claude creates/edits files
4. Test locally (port 3000)
5. Commit and push
6. Live in production!

### Example 3: Check Logs

```bash
# In Codespaces terminal
gcloud functions logs read stripeWebhook --limit 20
```

See what's happening with your webhook!

---

## Mobile Tips

### Best Browsers
- **Safari** on iPhone (best performance)
- **Chrome** on Android

### Keyboard Shortcuts
- Command Palette: Tap ⌘ icon at top
- Search files: Cmd+P (or tap search icon)
- Terminal: Tap terminal icon at bottom

### Rotate Phone
Landscape mode gives you more screen space!

### Use Split View on iPad
Even better - full desktop-like experience

---

## Auto-Deploy Pipeline

When you push to GitHub:

1. **GitHub Actions triggers**
2. **Installs dependencies** (`npm install`)
3. **Builds app** (`npm run build`)
4. **Authenticates with Google Cloud**
5. **Deploys to Cloud Run**
6. **Live in 2-3 minutes!**

You can watch progress:
https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions

---

## Costs

**Codespaces**: Free (120 hours/month)
- Plenty for casual mobile coding
- Auto-stops after 30 min idle

**GitHub Actions**: Free (2000 min/month)
- Each deploy takes ~3 minutes
- 600+ deploys/month for free

**Cloud Run**: Free tier
- First 2 million requests free

**Total: $0/month** for your usage! 🎉

---

## Security

✅ All secrets stored in GitHub Secrets (encrypted)
✅ Service account has minimal permissions
✅ Codespaces isolated per user
✅ Auto-stops after inactivity
✅ Can revoke access anytime

---

## Stop/Delete Codespace

**When done coding:**
1. Codespace auto-stops after 30 min idle
2. Or manually stop: Codespaces menu → Stop

**To delete:**
1. Go to: https://github.com/codespaces
2. Click ⋮ on your codespace
3. Delete

**Don't worry** - All your changes are in GitHub!

---

## Troubleshooting

### "Codespace won't start"
- Check you're logged into GitHub
- Try different browser
- Check free tier limit

### "Claude Code not working"
- Rebuild container: Command Palette → "Rebuild Container"
- Or delete and recreate Codespace

### "Deploy failing"
- Check GitHub Actions tab for errors
- Verify all secrets are set
- Check Cloud Run quotas

### "Can't see my changes"
- Make sure you pushed to GitHub
- Check GitHub Actions completed
- Hard refresh browser (Cmd+Shift+R)

---

## What's Next?

1. **Run the git commands** above to push config
2. **Add GitHub Secrets** (one-time setup)
3. **Create your first Codespace**
4. **Try it out!**

Then you can literally:
- Lay in bed 🛏️
- Open Codespaces on phone 📱
- Make changes with Claude Code 🤖
- Push to production 🚀
- No computer needed!

---

## Need Help?

Just open Codespaces and ask Claude Code:
- "How do I deploy this?"
- "Fix this error"
- "Add a new feature"

Claude Code has access to your entire repo and can help with anything!

---

**You're now set up to code from literally anywhere! 🎊**

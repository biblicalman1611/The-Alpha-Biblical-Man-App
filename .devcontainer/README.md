# GitHub Codespaces Setup for The Biblical Man

## What This Does

This configuration allows you to:
- **Code from anywhere** - Phone, tablet, any browser
- **Use Claude Code** - Full AI assistance in the cloud
- **Auto-deploy** - Push to GitHub → Auto-deploys to Cloud Run
- **No local setup** - Everything runs in the cloud

---

## How to Use on Your Phone

### 1. Open Codespaces
1. Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App
2. Tap the green **"Code"** button
3. Select **"Codespaces"** tab
4. Tap **"Create codespace on main"**

**Wait 1-2 minutes** while it sets up.

### 2. You'll Get
- Full VS Code in your browser
- Claude Code extension installed
- Your entire project ready to edit
- Terminal access
- Preview of your app

### 3. Make Changes
- Edit files like normal
- Use Claude Code (Cmd+K or Ctrl+K)
- Save changes (they auto-save)
- Commit and push

### 4. Auto-Deploy
When you push to GitHub:
- GitHub Actions triggers
- Builds your app
- Deploys to Cloud Run
- Live in 2-3 minutes

---

## Example Workflow (From Bed!)

1. **Open Codespaces** on your phone
2. **Ask Claude**: "Add a dark mode toggle"
3. **Claude makes the changes**
4. **Commit and push**
5. **Wait 2 minutes** → Live on production!

---

## Features Included

✅ **Claude Code** - AI coding assistant
✅ **Node.js 20** - Latest runtime
✅ **Auto npm install** - Dependencies ready
✅ **Port forwarding** - Test app on port 3000
✅ **GitHub CLI** - Manage repos from terminal
✅ **ESLint & Prettier** - Code formatting
✅ **Tailwind support** - CSS intellisense

---

## Environment Variables

Your secrets are automatically loaded from GitHub Secrets:
- `VITE_GEMINI_API_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## Commands

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Commit Changes
```bash
git add .
git commit -m "Your message"
git push
```

### View Logs
```bash
# Cloud Run logs
gcloud run services logs read the-biblical-man --limit 50

# Cloud Function logs
gcloud functions logs read stripeWebhook --limit 50 --region=us-central1
```

---

## Free Tier Limits

GitHub Codespaces free tier:
- **120 hours/month** for individuals
- **2-core machines** included
- Auto-stops after 30 min of inactivity

**More than enough for your needs!**

---

## Troubleshooting

### Codespace won't start
- Make sure you're logged into GitHub
- Check you haven't exceeded 120 hours/month
- Try creating in a different browser

### Claude Code not working
- Codespace might need to rebuild
- Click "Rebuild Container" in VS Code

### Changes not deploying
- Check GitHub Actions tab for errors
- Make sure secrets are configured

---

## Cost

**Codespaces**: Free (120 hours/month)
**GitHub Actions**: Free (2000 min/month)
**Cloud Run**: Free tier covers your traffic

**Total monthly cost: $0**

---

## Next Steps

1. **Push these files** to GitHub
2. **Configure GitHub Secrets** (one-time)
3. **Create your first Codespace**
4. **Start coding from your phone!**

---

**You can now code The Biblical Man from literally anywhere!** 🚀

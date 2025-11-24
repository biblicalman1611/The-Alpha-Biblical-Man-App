# Push Codespaces Setup to GitHub

I've created all the files for mobile coding, but need you to push them to GitHub.

## Quick Push

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App
git push
```

If that doesn't work, you may need to authenticate first.

---

## Files Ready to Push

✅ `.devcontainer/devcontainer.json` - Codespaces configuration
✅ `.devcontainer/README.md` - Setup documentation
✅ `.github/workflows/deploy.yml` - Auto-deploy pipeline
✅ `MOBILE_CODING_SETUP.md` - Complete mobile guide

All are committed and ready to push!

---

## After Pushing

### 1. Configure GitHub Secrets (One-Time)

Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions

Add these secrets (click "New repository secret" for each):

**Environment Variables:**
- `VITE_GEMINI_API_KEY` = `AIzaSyCmb1G6GXtiA5dRE6Szfez5DUUmaiejchw`
- `VITE_FIREBASE_API_KEY` = `AIzaSyDT1LEHPJcfQU3SSAbL3LGasS5EQ_ExSaM`
- `VITE_FIREBASE_AUTH_DOMAIN` = `the-biblical-man.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` = `the-biblical-man`
- `VITE_FIREBASE_STORAGE_BUCKET` = `the-biblical-man.firebasestorage.app`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `633727478392`
- `VITE_FIREBASE_APP_ID` = `1:633727478392:web:c9f3df68b78a8d87735b8d`

**For Auto-Deploy (Optional):**
- `GCP_SA_KEY` = Service account JSON (see below)

### 2. Get Service Account Key (For Auto-Deploy)

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=the-biblical-man
2. Create service account:
   - Name: `github-actions`
   - Roles: Cloud Run Admin, Service Account User, Storage Admin
3. Create key (JSON)
4. Copy entire JSON
5. Add to GitHub Secrets as `GCP_SA_KEY`

### 3. Try Codespaces!

Once pushed and secrets configured:

**On Phone:**
1. Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App
2. Tap "Code" → "Codespaces"
3. Tap "Create codespace on main"
4. Wait 1-2 minutes
5. Full VS Code with Claude Code opens!

---

## What You'll Be Able to Do

From your phone:
- ✅ Edit any file
- ✅ Use Claude Code AI assistant
- ✅ Commit and push changes
- ✅ Auto-deploy to production
- ✅ View logs
- ✅ Test features

All from bed, couch, anywhere!

---

## Cost

**Everything is FREE:**
- Codespaces: 120 hours/month free
- GitHub Actions: 2000 minutes/month free
- Cloud Run: Free tier covers your traffic

---

## Questions?

See the full guide: [MOBILE_CODING_SETUP.md](MOBILE_CODING_SETUP.md)

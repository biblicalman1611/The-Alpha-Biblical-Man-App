# Fix Deployment Pipeline Once and For All

## The Problem
Your local code changes aren't syncing to GitHub, so deployments are using old code. The SSH key is for `bib1611` but the repo is owned by `biblicalman1611`.

## The Solution
Set up proper GitHub authentication and automatic CI/CD pipeline.

---

## Step 1: Fix GitHub Authentication (Choose ONE)

### Option A: Use GitHub CLI (Easiest)
```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App

# Login with GitHub CLI
gh auth login

# Choose:
# - GitHub.com
# - HTTPS
# - Yes to authenticate Git
# - Login with a web browser

# Then push
git push origin main
```

### Option B: Use Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "The Biblical Man Deployment"
4. Select scopes: `repo` (all)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

Then run:
```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App

# Update remote to use HTTPS with token
git remote set-url origin https://biblicalman1611:YOUR_TOKEN_HERE@github.com/biblicalman1611/The-Alpha-Biblical-Man-App.git

# Push
git push origin main
```

---

## Step 2: Verify Push Worked

Check: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App

You should see your recent commits:
- "fix: Replace SDK with direct REST API to bypass service worker"
- "fix: Add Gemini API proxy and create user profile script"
- "fix: Disable service worker and add cache cleaner page"

---

## Step 3: Automatic Deployment is Already Set Up!

The `.github/workflows/deploy.yml` file is already in your repo. It will automatically:

1. **Trigger** on every push to main
2. **Build** the app with all environment variables
3. **Deploy** to Cloud Run
4. **Go live** in 2-3 minutes

---

## Step 4: Add GitHub Secrets (One-Time)

Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions

Click "New repository secret" for each:

### Application Secrets
| Name | Value |
|------|-------|
| `VITE_GEMINI_API_KEY` | `AIzaSyCmb1G6GXtiA5dRE6Szfez5DUUmaiejchw` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDT1LEHPJcfQU3SSAbL3LGasS5EQ_ExSaM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `the-biblical-man.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `the-biblical-man` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `the-biblical-man.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `633727478392` |
| `VITE_FIREBASE_APP_ID` | `1:633727478392:web:c9f3df68b78a8d87735b8d` |

### Deployment Secret
| Name | Value | How to Get |
|------|-------|------------|
| `GCP_SA_KEY` | Service account JSON | See below ⬇️ |

---

## Step 5: Get Google Cloud Service Account Key

### If you already have the JSON file:
```bash
# Show the content
cat /Users/thebi/The-Alpha-Biblical-Man-App/firebase-admin-key.json
```

Copy the ENTIRE JSON output and add it as the `GCP_SA_KEY` secret.

### If you need to create a new one:
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=the-biblical-man
2. Click on `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com`
3. Go to "KEYS" tab
4. Click "ADD KEY" → "Create new key"
5. Choose JSON
6. Download it
7. Copy the entire contents
8. Add as `GCP_SA_KEY` secret on GitHub

---

## Step 6: Test the Pipeline

After setting up secrets:

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "test: Verify CI/CD pipeline"
git push origin main
```

Then watch it deploy:
https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions

You'll see:
- ✅ Install dependencies
- ✅ Build application
- ✅ Deploy to Cloud Run
- ✅ Live in 2-3 minutes!

---

## How It Works Going Forward

### Every Time You Make Changes:

```bash
# 1. Make your changes in the code

# 2. Commit
git add .
git commit -m "your message"

# 3. Push
git push origin main

# 4. GitHub Actions automatically:
#    - Builds the app
#    - Deploys to Cloud Run
#    - Goes live in 2-3 minutes
```

### No More Manual Deployments!

You'll never need to run `gcloud run deploy` manually again. Just:
- Edit code locally
- Push to GitHub
- It deploys automatically

---

## Verify Everything is Synced

```bash
# Show current branch and status
git status

# Show last 5 commits
git log --oneline -5

# Show remote
git remote -v
```

All commits should be pushed to GitHub. Check:
https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/commits/main

---

## Troubleshooting

### "Permission denied" when pushing
- Use GitHub CLI (`gh auth login`) or
- Use personal access token in the remote URL

### GitHub Actions failing
- Check: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions
- Click on the failed run to see the error
- Usually means missing secrets - add them at:
  https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions

### Deployment succeeds but site shows old code
- Hard refresh: Cmd+Shift+R
- Or clear cache: https://thebiblicalmantruth.com/clear-cache.html
- Check deployed revision matches GitHub commit

---

## Summary

Once you:
1. ✅ Fix GitHub authentication (Step 1)
2. ✅ Push current code (Step 1)
3. ✅ Add GitHub secrets (Step 4 & 5)

Then every future change is automatic:
- **Code** → **Push** → **Deploy** → **Live**

No more manual deployments. No more out-of-sync code. Everything connected properly.

---

## Current Code Status

All your latest fixes are committed locally:
- ✅ Direct REST API (no more service worker issues)
- ✅ Firestore profile creation script
- ✅ Password reset script
- ✅ Emergency service worker unregister
- ✅ Clear cache page
- ✅ Nginx API proxy configuration

Ready to push once you fix authentication!

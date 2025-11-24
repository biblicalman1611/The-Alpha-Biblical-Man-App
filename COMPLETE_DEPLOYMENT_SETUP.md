# Complete Deployment Setup - Final Steps

## ✅ What's Already Done

1. **Scripture Tool Fixed** - Removed @google/genai SDK, using direct REST API
2. **Code Pushed to GitHub** - All latest changes are now on GitHub (commit `71fa93c`)
3. **Workflow File Created** - Located at `.github/workflows/deploy.yml` (ready to upload)
4. **Git Authentication Working** - Using HTTPS with personal access token

## 🔧 What You Need to Do (5 Minutes)

### Step 1: Create Workflow File on GitHub (2 minutes)

Since the GitHub token lacks `workflow` scope, we need to create the workflow file directly on GitHub:

1. Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/new/main?filename=.github/workflows/deploy.yml

2. Paste this content:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy the-biblical-man \
            --source . \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated \
            --project the-biblical-man
```

3. Commit message: "ci: Add GitHub Actions deployment workflow"
4. Click "Commit new file"

### Step 2: Add GitHub Secrets (3 minutes)

Go to: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions

Click "New repository secret" for each:

#### Application Secrets
| Name | Value |
|------|-------|
| `VITE_GEMINI_API_KEY` | `AIzaSyCmb1G6GXtiA5dRE6Szfez5DUUmaiejchw` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDT1LEHPJcfQU3SSAbL3LGasS5EQ_ExSaM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `the-biblical-man.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `the-biblical-man` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `the-biblical-man.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `633727478392` |
| `VITE_FIREBASE_APP_ID` | `1:633727478392:web:c9f3df68b78a8d87735b8d` |

#### Deployment Secret

For `GCP_SA_KEY`, run this command to get the JSON:

```bash
cat /Users/thebi/The-Alpha-Biblical-Man-App/firebase-admin-key.json
```

Copy the ENTIRE JSON output and add it as the `GCP_SA_KEY` secret.

### Step 3: Test the Pipeline

After adding secrets, make a small test change:

```bash
echo "# Automated deployments enabled" >> README.md
git add README.md
git commit -m "test: Verify CI/CD pipeline"
git push origin main
```

Then watch it deploy: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions

## 🎯 What Happens Next

Once you complete these steps:

1. **Every push to main** triggers automatic deployment
2. **No more manual deployments** - GitHub Actions handles it all
3. **Live in 2-3 minutes** after each push

## 📊 Current Status

- ✅ Scripture tool fixed (REST API, no service worker)
- ✅ Code synced to GitHub
- ✅ Workflow file ready
- ⏳ Workflow file needs to be added on GitHub (Step 1)
- ⏳ GitHub secrets need to be configured (Step 2)
- ⏳ Pipeline needs testing (Step 3)

## 🔍 Verify Everything

After setup, check:

1. **GitHub Actions**: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/actions
2. **Live Site**: https://thebiblicalmantruth.com
3. **Scripture Tool**: Should work without 405 errors

## 🆘 Troubleshooting

### If workflow doesn't trigger:
- Check secrets are all added: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/settings/secrets/actions
- Verify workflow file exists: https://github.com/biblicalman1611/The-Alpha-Biblical-Man-App/blob/main/.github/workflows/deploy.yml

### If deployment fails:
- Click on the failed run in Actions to see the error
- Usually means a secret is missing or incorrect

### If site shows old code:
- Hard refresh: Cmd+Shift+R
- Or visit: https://thebiblicalmantruth.com/clear-cache.html

---

**That's it!** Once you complete these 3 steps, you'll have a fully automated deployment pipeline. No more manual `gcloud` commands. Just push to GitHub and it deploys automatically.

# Install Google Cloud CLI - Step by Step

You need the Google Cloud CLI to deploy the webhook automation.

## Installation Options

### Option 1: Install via Script (Easiest)

Open your Terminal and run these commands one at a time:

```bash
# Download the installer
curl https://sdk.cloud.google.com | bash

# Restart your shell (or open a new Terminal window)
exec -l $SHELL

# Initialize gcloud
gcloud init
```

When `gcloud init` runs, it will:
1. Ask you to login (opens browser)
2. Ask you to select your project (choose: the-biblical-man)
3. Set up default settings

### Option 2: Manual Download

1. Go to: https://cloud.google.com/sdk/docs/install
2. Download the macOS installer
3. Run the installer
4. Open a new Terminal
5. Run: `gcloud init`

---

## After Installation

Once installed, come back and we'll deploy the webhook with this command:

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts
./deploy.sh
```

---

## Quick Test

After installation, test if it worked:

```bash
gcloud --version
```

You should see something like:
```
Google Cloud SDK 456.0.0
...
```

---

## What's Next

After gcloud is installed and initialized:

1. The deployment script will deploy your webhook
2. You'll get a Cloud Function URL
3. You'll add that URL to Stripe
4. Automation will be live!

Total time: ~10 minutes including installation

# Complete Deployment Steps - Manual Authentication Required

Good news: gcloud CLI is installed! ✅

Now you need to authenticate and deploy. Here's exactly what to do:

---

## Step 1: Authenticate with Google Cloud

Open a **new Terminal window** and run:

```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud auth login
```

This will:
1. Open your browser automatically
2. Ask you to login with your Google account (the one with access to `the-biblical-man` project)
3. Click "Allow" to give gcloud access
4. Return to terminal - it will say "You are now logged in"

---

## Step 2: Set Your Project

```bash
gcloud config set project the-biblical-man
```

You should see:
```
Updated property [core/project].
```

---

## Step 3: Deploy the Webhook

Now run the deployment script:

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts
./deploy.sh
```

The script will:
- Deploy the Cloud Function to Google Cloud
- Show you the webhook URL
- Tell you what to do next

**Look for this in the output:**
```
httpsTrigger:
  url: https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook
```

**SAVE THAT URL!** You'll need it in the next step.

---

## Step 4: Add Webhook to Stripe

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Paste the URL** from Step 3
4. Under "Events to send", select:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_...`)

---

## Step 5: Add Webhook Secret to Cloud Function

Back in your Terminal, run this (replace `whsec_YOUR_SECRET` with the actual secret from Step 4):

```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts

gcloud functions deploy stripeWebhook \
  --gen2 \
  --region=us-central1 \
  --update-env-vars STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

---

## Step 6: Test It! 🎉

Your automation is now live! Test it:

### Option A: Stripe Test Mode
1. Go to Stripe Dashboard (test mode)
2. Create a test $3.00 subscription
3. Check if user appears in Firebase: https://console.firebase.google.com/project/the-biblical-man/authentication/users

### Option B: View Logs
```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud functions logs read stripeWebhook --limit 20 --region=us-central1
```

---

## Summary of Commands

Here's everything in order:

```bash
# 1. Authenticate
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud auth login

# 2. Set project
gcloud config set project the-biblical-man

# 3. Deploy
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts
./deploy.sh

# 4. (After getting webhook secret from Stripe)
gcloud functions deploy stripeWebhook \
  --gen2 \
  --region=us-central1 \
  --update-env-vars STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"

# 5. Test logs
gcloud functions logs read stripeWebhook --limit 20 --region=us-central1
```

---

## What Happens After This

Once deployed, every time someone subscribes for $3.00/month:
1. ⚡ Stripe sends webhook (instant)
2. 🔐 Cloud Function validates signature
3. 👤 Firebase account created automatically
4. 📧 Welcome email sent with credentials
5. ✅ User can login immediately

**Zero manual work!**

---

## Need Help?

If you get stuck:
- **Authentication issues**: Make sure you're logged in to the correct Google account
- **Permission errors**: Ensure your account has Owner/Editor role on `the-biblical-man` project
- **Deploy fails**: Check logs with `gcloud functions logs read stripeWebhook`

---

## Current Status

✅ gcloud CLI installed
⏳ Need to authenticate (Step 1)
⏳ Need to deploy (Step 3)
⏳ Need to configure Stripe (Step 4)

**Start with Step 1 above!**

# Quick Start: Stripe Integration & User Migration

This is a simplified guide to get the Stripe webhook and user migration running quickly.

## What This Does

1. **Stripe Webhook** → Automatically creates Firebase accounts when someone subscribes
2. **Migration Script** → Creates accounts for existing paid subscribers
3. **Email Automation** → Sends login credentials to all users

## Prerequisites Checklist

You need these API keys:

- [ ] Stripe Secret Key (from Stripe Dashboard)
- [ ] Stripe Webhook Secret (will get after deploying webhook)
- [ ] Resend API Key (from resend.com - free tier is fine)
- [ ] Firebase Admin credentials (service account JSON)

## Step 1: Get Your API Keys

### Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Secret key" (starts with `sk_live_` or `sk_test_`)

### Resend API Key
1. Go to https://resend.com/signup
2. Verify email
3. Go to https://resend.com/api-keys
4. Create API Key → Copy it (starts with `re_`)

### Firebase Admin Key
1. Go to https://console.firebase.google.com/
2. Select project: "the-biblical-man"
3. Click gear icon → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate new private key"
6. Download the JSON file
7. Save it as `firebase-admin-key.json` in this directory

## Step 2: Install Dependencies

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App
npm install
```

This installs:
- `stripe` - Stripe API client
- `firebase-admin` - Firebase Admin SDK
- `dotenv` - Environment variable loader
- `ts-node` - TypeScript execution

## Step 3: Create Environment File

Create a file named `.env.migration` with your actual keys:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_your_actual_key_here

# Firebase (from the JSON file you downloaded)
FIREBASE_PROJECT_ID=the-biblical-man
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@the-biblical-man.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(paste the entire private key from the JSON file, including the BEGIN and END lines)
-----END PRIVATE KEY-----"

# Resend (for emails)
RESEND_API_KEY=re_your_actual_key_here
```

**Important**: Make sure to include the quotes around the FIREBASE_PRIVATE_KEY and preserve the newlines.

## Step 4: Test with Dry Run

Before migrating all users, test with a dry run:

```bash
# This will show you what would happen without actually creating users
DRY_RUN=true npm run migrate-users
```

You should see output like:
```
🚀 Starting User Migration Process
📥 Fetching active subscriptions from Stripe...
📊 Found 23 active subscriptions

[DRY RUN] Would migrate: john@example.com
[DRY RUN] Would migrate: jane@example.com
...
```

## Step 5: Run Full Migration

If the dry run looks good, run the real migration:

```bash
npm run migrate-users
```

This will:
- ✅ Create Firebase accounts for all active Stripe subscribers
- ✅ Send each user an email with their login credentials
- ✅ Skip users who already have accounts
- ✅ Log any failures for manual review

Expected output:
```
🚀 Starting User Migration Process
============================================================

📥 Fetching active subscriptions from Stripe...
📊 Found 23 active subscriptions

🔄 Migrating user: john@example.com
✅ Firebase user created: abc123xyz
✅ User profile created in Firestore
✅ Migration email sent to: john@example.com

...

============================================================
📈 MIGRATION SUMMARY
============================================================

✅ Successfully migrated: 21
⏭️  Already existed: 2
❌ Failed: 0
📊 Total processed: 23

⏱️  Total time: 34.2s

✅ Migration complete!
```

## Step 6: Deploy Stripe Webhook

### Option A: Quick Deploy with Google Cloud Functions

```bash
# Make sure you're logged into Google Cloud
gcloud auth login
gcloud config set project the-biblical-man

# Deploy the webhook function
gcloud functions deploy stripeWebhook \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handleStripeWebhook \
  --set-env-vars STRIPE_SECRET_KEY="sk_live_your_key" \
  --set-env-vars RESEND_API_KEY="re_your_key" \
  --set-env-vars FIREBASE_PROJECT_ID="the-biblical-man" \
  --set-env-vars FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@..." \
  --set-env-vars FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..." \
  --region us-west1 \
  --source scripts/
```

You'll get a URL like:
```
https://us-west1-the-biblical-man.cloudfunctions.net/stripeWebhook
```

Copy this URL - you'll need it for the next step.

### Option B: Manual Setup (if Option A doesn't work)

See the full guide: [STRIPE_WEBHOOK_SETUP.md](STRIPE_WEBHOOK_SETUP.md)

## Step 7: Configure Stripe to Send Events

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Paste your webhook URL from Step 6
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Click "Reveal" to see the webhook secret
7. Copy the `whsec_...` value
8. Update your Cloud Function:
   ```bash
   gcloud functions deploy stripeWebhook \
     --update-env-vars STRIPE_WEBHOOK_SECRET="whsec_your_secret" \
     --region us-west1
   ```

## Step 8: Test the Webhook

1. Go back to your Stripe webhook page
2. Click "Send test webhook"
3. Select `customer.subscription.created`
4. Click "Send test event"

Check if it worked:
```bash
gcloud functions logs read stripeWebhook --region us-west1 --limit 10
```

You should see:
```
Received event: customer.subscription.created
Subscription created: sub_xxxxx
✅ Firebase user created: abc123
✅ Migration email sent to: test@example.com
```

## Troubleshooting

### "No active subscriptions found"
- Check that you're using the correct Stripe secret key (live vs test)
- Verify you have actual active subscriptions in Stripe

### "Permission denied" errors
- Check that your Firebase Admin service account has the correct permissions
- Make sure the JSON file is valid

### "Email sending failed"
- Verify your Resend API key is correct
- Check you haven't exceeded the free tier limit (100 emails/day)
- Make sure you verified your domain in Resend

### Migration shows "Already existed"
- This is normal! It means users were already migrated
- The script automatically skips existing users

### Users not receiving emails
- Check spam folder
- Look in Firestore collection `migration_emails_pending` for failed sends
- You can manually email those users their credentials

## What to Tell Your Users

Send this message to existing subscribers:

```
Subject: Your Biblical Man Account is Ready

Hi [Name],

Great news! We've upgraded our member system and your account is now ready.

Your login credentials:
Email: [their email]
Password: [temporary password from migration]

Login here: https://thebiblicalmantruth.com

You'll be prompted to change your password on first login.

Nothing changes with your subscription - everything continues as normal.

Questions? Just reply to this email.

Blessings,
The Biblical Man Team
```

## Next Steps After Setup

1. ✅ Monitor the Cloud Function logs for the first few real subscriptions
2. ✅ Check Firestore to make sure user data is being created correctly
3. ✅ Test a real subscription yourself with a test card
4. ✅ Set up monitoring/alerts for webhook failures
5. ✅ Document your support process for user login issues

## Getting Help

If something goes wrong:

1. Check the Cloud Function logs:
   ```bash
   gcloud functions logs read stripeWebhook --region us-west1 --limit 50
   ```

2. Check Firestore collections:
   - `failed_users` - Users that couldn't be created
   - `migration_emails_pending` - Emails that failed to send

3. Check Resend dashboard for email delivery status

4. Review the full setup guide: [STRIPE_WEBHOOK_SETUP.md](STRIPE_WEBHOOK_SETUP.md)

## Important Security Notes

🔒 **Never commit these files to git:**
- `.env.migration`
- `firebase-admin-key.json`
- Any file with API keys

They're already in `.gitignore` but double-check before committing!

---

**Created**: November 23, 2024

Good luck! 🚀

# Stripe Webhook & User Migration Setup Guide

This guide covers setting up the Stripe webhook integration and migrating existing paid users to the new Firebase authentication system.

## Overview

The system handles:
1. **New subscriptions** → Automatic Firebase account creation + welcome email
2. **Existing paid users** → Migration script creates accounts + sends credentials
3. **Subscription updates** → Syncs status to Firebase
4. **Cancellations** → Updates user status in database

## Prerequisites

You'll need the following API keys and credentials:

- ✅ Stripe Secret Key (`STRIPE_SECRET_KEY`)
- ✅ Stripe Webhook Secret (`STRIPE_WEBHOOK_SECRET`)
- ✅ Resend API Key (`RESEND_API_KEY`) for emails
- ✅ Firebase Admin SDK credentials (service account JSON)

## Part 1: Deploy Stripe Webhook Handler

### Option A: Google Cloud Functions (Recommended)

1. **Install Google Cloud SDK** (if not already installed):
   ```bash
   brew install --cask google-cloud-sdk
   gcloud auth login
   gcloud config set project the-biblical-man
   ```

2. **Install dependencies**:
   ```bash
   cd /Users/thebi/The-Alpha-Biblical-Man-App
   npm install stripe firebase-admin dotenv
   npm install -D @types/node ts-node typescript
   ```

3. **Create Firebase Admin Service Account**:
   - Go to https://console.firebase.google.com/
   - Select project: "the-biblical-man"
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file (save as `firebase-admin-key.json`)
   - **IMPORTANT**: Never commit this file to git!

4. **Deploy the Cloud Function**:
   ```bash
   # Set environment variables
   gcloud functions deploy stripeWebhook \
     --runtime nodejs20 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point stripeWebhook \
     --set-env-vars STRIPE_SECRET_KEY=sk_live_... \
     --set-env-vars STRIPE_WEBHOOK_SECRET=whsec_... \
     --set-env-vars RESEND_API_KEY=re_... \
     --set-env-vars FIREBASE_PROJECT_ID=the-biblical-man \
     --set-env-vars FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@the-biblical-man.iam.gserviceaccount.com \
     --set-env-vars FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" \
     --region us-west1 \
     --source scripts/
   ```

   After deployment, you'll get a URL like:
   ```
   https://us-west1-the-biblical-man.cloudfunctions.net/stripeWebhook
   ```

### Option B: Cloud Run (Alternative)

1. **Create a Dockerfile for the webhook**:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY scripts/ ./scripts/
   EXPOSE 8080
   CMD ["node", "scripts/stripe-webhook-server.js"]
   ```

2. **Deploy to Cloud Run** (similar to main app deployment)

## Part 2: Configure Stripe Webhook

1. **Go to Stripe Dashboard**:
   - https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"

2. **Configure endpoint**:
   - **Endpoint URL**: `https://us-west1-the-biblical-man.cloudfunctions.net/stripeWebhook`
   - **Events to send**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Click "Add endpoint"

3. **Get webhook secret**:
   - After creating the endpoint, click "Reveal" under "Signing secret"
   - Copy the `whsec_...` value
   - Update your Cloud Function environment variables

4. **Test the webhook**:
   ```bash
   # Send a test event from Stripe Dashboard
   # Check Cloud Function logs:
   gcloud functions logs read stripeWebhook --region us-west1 --limit 50
   ```

## Part 3: Set Up Resend Email Service

1. **Create Resend Account**:
   - Go to https://resend.com/
   - Sign up (free tier: 100 emails/day, 3,000/month)
   - Verify your account

2. **Add and Verify Domain**:
   - Go to Domains → Add Domain
   - Enter: `thebiblicalmantruth.com`
   - Add the DNS records to your domain registrar:
     ```
     TXT  @  v=DKIM1; k=rsa; p=...
     MX   @  feedback-smtp.us-east-1.amazonses.com (Priority: 10)
     ```
   - Wait for verification (usually 15-30 minutes)

3. **Create API Key**:
   - Go to API Keys → Create API Key
   - Name it: "Biblical Man Webhook"
   - Copy the key (starts with `re_`)
   - Store it securely

4. **Update Cloud Function**:
   ```bash
   gcloud functions deploy stripeWebhook \
     --update-env-vars RESEND_API_KEY=re_your_api_key_here \
     --region us-west1
   ```

## Part 4: Migrate Existing Users

This script will:
- Fetch all active Stripe subscriptions
- Create Firebase accounts for users who don't have one
- Send migration emails with login credentials
- Log any failures for manual processing

### Step 1: Prepare Environment

Create a `.env.migration` file:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...

# Firebase Admin
FIREBASE_PROJECT_ID=the-biblical-man
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@the-biblical-man.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"

# Resend (for emails)
RESEND_API_KEY=re_...
```

### Step 2: Run Migration Script

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App

# Install dependencies
npm install stripe firebase-admin dotenv
npm install -D @types/node ts-node

# Test with first 5 users (dry run)
DRY_RUN=true ts-node scripts/migrate-existing-users.ts

# Run full migration
ts-node scripts/migrate-existing-users.ts
```

### Step 3: Monitor Results

The script will output:
```
🚀 Starting User Migration Process
============================================================

📥 Fetching active subscriptions from Stripe...
📊 Found 45 active subscriptions

🔄 Migrating user: john@example.com
✅ Firebase user created: abc123xyz
✅ User profile created in Firestore
✅ Migration email sent to: john@example.com

...

============================================================
📈 MIGRATION SUMMARY
============================================================

✅ Successfully migrated: 42
⏭️  Already existed: 2
❌ Failed: 1
📊 Total processed: 45

⏱️  Total time: 67.3s

✅ Migration complete!
```

### Step 4: Handle Failed Migrations

Check Firestore for failed records:
- Collection: `migration_emails_pending` - Users created but email failed
- Collection: `failed_users` - Users that couldn't be created

Manual recovery:
```bash
# List pending emails
firebase firestore:get migration_emails_pending

# Manually send credentials to users via your regular email client
```

## Part 5: Testing the Full Flow

### Test New Subscription Flow

1. **Create a test subscription** in Stripe Dashboard
   - Use test card: `4242 4242 4242 4242`
   - Email: `test@example.com`

2. **Check webhook was triggered**:
   ```bash
   gcloud functions logs read stripeWebhook --region us-west1 --limit 10
   ```

3. **Verify user was created**:
   - Check Firebase Console → Authentication
   - Check Firestore → `users` collection
   - Check email inbox for welcome email

4. **Test login**:
   - Go to https://thebiblicalmantruth.com
   - Click "Login" or "Member Area"
   - Use credentials from email
   - Should see member dashboard

### Test Subscription Cancellation

1. **Cancel subscription** in Stripe
2. **Check webhook logs**
3. **Verify user status** updated in Firestore:
   ```json
   {
     "subscriptionStatus": "cancelled",
     "cancelledAt": "2024-11-23T20:00:00.000Z"
   }
   ```

## Part 6: Monitoring & Maintenance

### Cloud Function Monitoring

```bash
# View recent logs
gcloud functions logs read stripeWebhook --region us-west1 --limit 100

# Monitor in real-time
gcloud functions logs read stripeWebhook --region us-west1 --limit 10 --follow

# Check function status
gcloud functions describe stripeWebhook --region us-west1
```

### Email Delivery Monitoring

- Resend Dashboard: https://resend.com/emails
- Check delivery status
- View bounce/complaint rates
- Monitor daily limits

### Database Monitoring

Check these Firestore collections regularly:
- `users` - All user profiles
- `failed_users` - Webhook failures
- `failed_emails` - Email delivery failures
- `migration_emails_pending` - Migration emails that need resending

## Troubleshooting

### Webhook Not Receiving Events

1. Check Stripe webhook configuration
2. Verify endpoint URL is correct
3. Check Cloud Function is deployed:
   ```bash
   gcloud functions list --region us-west1
   ```
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to https://your-function-url.cloudfunctions.net/stripeWebhook
   stripe trigger customer.subscription.created
   ```

### Emails Not Sending

1. Check Resend API key is valid
2. Verify domain is verified in Resend dashboard
3. Check daily limit (100 emails on free tier)
4. Review Resend logs for bounces/errors
5. Check spam folder

### User Creation Failing

1. Check Firebase Admin credentials are correct
2. Verify Firebase project ID matches
3. Check Firestore rules allow admin writes
4. Review Cloud Function logs for specific error

### Migration Script Issues

Common fixes:
```bash
# Permission denied
# → Check Firebase Admin key has proper IAM roles

# Rate limiting
# → Add delays between operations (already included in script)

# Duplicate user error
# → Script handles this automatically, skips existing users

# Email sending fails
# → Credentials stored in migration_emails_pending for manual retry
```

## Security Best Practices

1. **Never commit secrets** to git:
   ```bash
   # Ensure these are in .gitignore:
   .env
   .env.migration
   firebase-admin-key.json
   *-key.json
   ```

2. **Rotate API keys** periodically:
   - Stripe: Every 90 days
   - Resend: Every 90 days
   - Firebase: Use short-lived service accounts

3. **Monitor webhook signatures**:
   - All events are verified with Stripe webhook secret
   - Invalid signatures are rejected

4. **Use environment variables**:
   - Never hardcode credentials
   - Use Google Cloud Secret Manager for production

## Next Steps

After successful setup:

1. ✅ Monitor first few real subscriptions closely
2. ✅ Set up error alerting (Cloud Monitoring)
3. ✅ Create backup strategy for user data
4. ✅ Document support process for user issues
5. ✅ Set up automated weekly reports

## Support

If you encounter issues:
1. Check Cloud Function logs first
2. Review Stripe webhook event logs
3. Check Resend email delivery logs
4. Review Firestore `failed_*` collections
5. Contact support with specific error messages

---

**Created**: November 23, 2024
**Last Updated**: November 23, 2024

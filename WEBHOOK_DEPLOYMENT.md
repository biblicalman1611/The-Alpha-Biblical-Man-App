# Stripe Webhook Deployment Guide

## What This Does

Automates the entire subscription flow for $3.00 subscriptions:
1. Someone subscribes via Stripe ($3.00/month)
2. Webhook fires automatically
3. Firebase account created with their email
4. Welcome email sent with login credentials
5. User can immediately access the platform

---

## Prerequisites

- Google Cloud account
- gcloud CLI installed
- Firebase project: `the-biblical-man`
- Stripe account with webhook capability

---

## Step 1: Install Google Cloud CLI

If you don't have `gcloud` installed:

```bash
# macOS
brew install google-cloud-sdk

# Or download from:
# https://cloud.google.com/sdk/docs/install
```

After installation:
```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project the-biblical-man
```

---

## Step 2: Deploy the Cloud Function

Navigate to the scripts directory and deploy:

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts

gcloud functions deploy stripeWebhook \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=stripeWebhook \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars STRIPE_SECRET_KEY="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" \
  --set-env-vars RESEND_API_KEY="re_UR6YiByC_KuvqcNicpHZhSapuZAM2cSsb" \
  --set-env-vars FIREBASE_PROJECT_ID="the-biblical-man" \
  --set-env-vars FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com" \
  --set-env-vars FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0z/YF9uesKa8h
jIRVS0YKDr6F1ilaGu5cbVVqMTHZewT2LD/CA+VnsZDTlnr6DvTjCAvPxkB7+pOw
AM9yhPYW7Csn+ubCRRDFkQzKAjjTIJGcDt7jXiCEsEt9AMbd4DcAN9daI58qdi8o
bAMcIjw7D5LTb/xtfxxWqPA9srCpW/0YP+CraDIUV7TI/EwlM19F4R3wVcfxDZtT
VYTZ+ME6/Bk5fWoGavqoRrOF+NfX3YaagzfUPEi/LE6q8U84WEcwPB4eFHQp1WFc
XGhB6Hm3SUWLCW6v9kzUAC3prKu4sxzLHmzIVr2sDmDVAMAJwRLV0WpMKGPvlTUM
qSnmzB9dAgMBAAECggEACJXZTjYyO5atG1AzQQ42cKgmPBpLqLIfqvbWt+3xuoG2
CMRYG1ZuWvVE9a8EVCxH93cR1yydh5AshA5odefB/EZRfu/8a1wL1v2zWEIxFYv1
2K2iFV9foZKcuv5BncEVi3vwofXlYFxFPUuc/YXTS1CgKExTIECJWsS3HOQyXDrj
60+laeEMxIqGgSzMdKIZkvoaTH2F3D+xTQu4HRzZBA+FMtYTqPf4Ovjxk8mHi9SA
IpOI+XznvHEaeqc/yfOdwDCeg1gvlk7IlyXHVI3KodMyKT0HCWOkP7hVjkiT61T3
zPv87QdFnW3iW1Qa9LRn9nk40kbMR6j+Gk5KGM7b0QKBgQDtFpY/3ylXgkFBz2VB
yK0eVqN3nhv82dgTirfGqsWTKbzG3TQFrN2CpveuMhK89fxuyikwvPTQeHmG1xwr
ncPxnAxSXwwRXQTozKhKAP3aZk5GX+XahzG33J6OdH7DrVxQKOEUMX8Zejwsw9tO
O3ugMYFtq4fkTzUCIMTbuT2DKQKBgQDDPDQiBdzSL4kcfwrqfRx0l3Yk6HyXptQb
4pVWrevNlwKIZN/mKa0uDVwxblo88EWnMsGHVDihM+LfNhFLYH5Irc9LTbi3YmY+
5eqDDsPU/9ov7juCaQRlTeC6wrRhx2Vni7PGtygnp2FS4sBCuUb4PTCT7fmku27L
FxOy7s4VFQKBgQCx3TYO6M5NFiz6wCqItZIapoiwHm+Eu7E8x96jLk5W3wL+dcin
UU5EzBoYFvyzwh8ExqksJTXMh/Uz0YESv6LWSWl9Ck01YYFjXNYL3r6S8Blc9mis
Dqyf8OUKnh7TkeUlReXFjnR5mpg2RSDrifhu73TX381s3Hc6B3doF4osMQKBgE8d
DU8gKwxtQNVwUb8Vtbs1SSXJo/tcGiW2mqeGUMB9ygP1RJmjF89KkKpjOmPpRYBs
W+n34f7I5M1ovndaAbJ35EFynECLuj0QtAgpqoecqhC0LB87aRGYDlH/5lKdF2Vv
QglrXPU8qX6J7jjblXuwaAf57iin30yi7FOc25vFAoGBAJzwvgkg/RyVq0Qq9HVM
z6fePf/FJY8IMJYxxlbb8OA6conRrYIX4GkQ/vOXY0WZvw7vldFh/I4Fe++hCMF5
fFvFZ6//Zi15fjCm9CTwmz3K374WAzQZcdlfTgr1zqCQsnl1w5jeglGDwHb8bmdC
C8eRpt1OndYpbHfp8+FruEZ0
-----END PRIVATE KEY-----"
```

**Important**: After deployment, the command will output a URL like:
```
https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook
```

**Save this URL** - you'll need it for Step 3.

---

## Step 3: Get Stripe Webhook Secret

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Paste your Cloud Function URL from Step 2
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

---

## Step 4: Update Cloud Function with Webhook Secret

Add the webhook secret to your Cloud Function:

```bash
cd /Users/thebi/The-Alpha-Biblical-Man-App/scripts

gcloud functions deploy stripeWebhook \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=stripeWebhook \
  --trigger-http \
  --allow-unauthenticated \
  --update-env-vars STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

Replace `whsec_YOUR_SECRET_HERE` with the actual webhook secret from Step 3.

---

## Step 5: Test the Webhook

### Option A: Use Stripe CLI (Recommended)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your Cloud Function
stripe listen --forward-to https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook

# In another terminal, trigger a test event
stripe trigger customer.subscription.created
```

### Option B: Create a Real Test Subscription

1. Use Stripe test mode
2. Create a $3.00 subscription
3. Check Cloud Function logs:
   ```bash
   gcloud functions logs read stripeWebhook --limit 50
   ```
4. Verify user was created in Firebase Console

---

## Monitoring

### View Cloud Function Logs

```bash
# Real-time logs
gcloud functions logs read stripeWebhook --limit 50

# Or use Cloud Console
https://console.cloud.google.com/functions/list
```

### Check Firebase Users

Go to Firebase Console:
https://console.firebase.google.com/project/the-biblical-man/authentication/users

### Check Failed Operations

In Firestore, check these collections:
- `failed_emails` - Users created but email failed to send
- `failed_users` - User creation failed entirely

---

## Environment Variables Summary

These are configured in the Cloud Function:

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard (whsec_...) |
| `RESEND_API_KEY` | Your Resend API key (re_...) |
| `FIREBASE_PROJECT_ID` | the-biblical-man |
| `FIREBASE_CLIENT_EMAIL` | firebase-adminsdk-fbsvc@... |
| `FIREBASE_PRIVATE_KEY` | Full private key with \n preserved |

---

## Security Notes

- Cloud Function validates webhook signatures (prevents spoofing)
- Only processes $3.00 subscriptions
- Environment variables are encrypted by Google Cloud
- Failed operations are logged for manual recovery
- Temporary passwords are 16 characters with special chars

---

## Troubleshooting

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify the webhook endpoint URL matches exactly

### "RESEND_API_KEY not set"
- User account will be created, email will fail
- Check `failed_emails` collection in Firestore
- Manually resend emails or fix API key

### "Firebase user already exists"
- This is normal - webhook might fire twice
- Function will skip user creation (safe)

### No user created for subscription
- Check logs: Was it a $3.00 subscription?
- Verify subscription status was `active` or `trialing`
- Check `failed_users` collection

---

## Files Deployed

The Cloud Function uses these files from the `scripts/` directory:

- `index.js` - Entry point
- `stripe-webhook-handler.js` - Main logic
- `package.json` - Dependencies

---

## What Happens When Someone Subscribes

1. User enters payment info on your Stripe checkout
2. Stripe processes $3.00 payment
3. Stripe sends webhook to Cloud Function
4. Cloud Function:
   - Verifies webhook signature
   - Checks if subscription is $3.00
   - Creates Firebase account with email/password
   - Creates Firestore user profile
   - Sends welcome email via Resend
   - Logs success/failure
5. User receives email with credentials
6. User can login immediately

**Total time: 2-5 seconds**

---

## Cost Estimate

- Cloud Functions: ~$0.40 per 1 million invocations
- For 100 subscriptions/month: **~$0.00004** (essentially free)
- Resend: 100 emails/day free, then $0.10 per 1000 emails

---

## Next Steps After Deployment

1. Test with Stripe test mode first
2. Monitor logs for the first few real subscriptions
3. Check `failed_emails` collection periodically
4. Set up alerting for failures (optional)

---

## Support

If you encounter issues:

1. Check Cloud Function logs first
2. Verify all environment variables are set
3. Test webhook signature with Stripe CLI
4. Check Firebase Authentication is enabled
5. Verify Resend domain is verified

---

**Deployment Status**: Ready to deploy ✅

All files are prepared in `/Users/thebi/The-Alpha-Biblical-Man-App/scripts/`

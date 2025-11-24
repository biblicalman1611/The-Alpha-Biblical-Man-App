# Enable Billing for Cloud Functions

The deployment failed because your Google Cloud project needs billing enabled.

## Quick Fix (2 minutes)

### Step 1: Go to Billing
https://console.cloud.google.com/billing/linkedaccount?project=the-biblical-man

### Step 2: Link a Billing Account
- If you have a billing account: Select it and click "SET ACCOUNT"
- If you don't have one: Click "CREATE BILLING ACCOUNT" and add a payment method

**Don't worry about costs:**
- Cloud Functions: First 2 million invocations/month FREE
- You'll use ~100-200/month = $0.00
- Google gives $300 free credit for new accounts

### Step 3: Let Me Know
Once billing is enabled, say "done" and I'll deploy immediately!

---

## Alternative: Manual Console Deployment

If you don't want to enable billing via CLI, you can deploy manually:

https://console.cloud.google.com/functions/add?project=the-biblical-man

This uses the same billing but goes through the web interface.

See [FINAL_DEPLOYMENT_OPTIONS.md](FINAL_DEPLOYMENT_OPTIONS.md) Option 2 for complete instructions.

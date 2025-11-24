# 🎉 Webhook Successfully Deployed!

## Your Webhook URL

```
https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook
```

**COPY THIS URL** - you'll need it in the next step!

---

## Next Step: Configure Stripe

### 1. Go to Stripe Webhooks
https://dashboard.stripe.com/webhooks

### 2. Add Endpoint
1. Click **"Add endpoint"**
2. **Paste your webhook URL:**
   ```
   https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook
   ```

### 3. Select Events
Click "Select events" and choose these 3:
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

### 4. Add Endpoint
Click **"Add endpoint"**

### 5. Get Webhook Secret
1. After creating, click on your new endpoint
2. Under "Signing secret", click **"Reveal"**
3. Copy the secret (starts with `whsec_...`)

---

## Final Step: Add Webhook Secret

Once you have the `whsec_...` secret, run this command (I'll do this for you):

```bash
gcloud functions deploy stripeWebhook \
  --gen2 \
  --region=us-central1 \
  --update-env-vars STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

---

## Test It!

After configuring Stripe:

1. **Create a test $3.00 subscription** in Stripe (test mode)
2. **Check Firebase Console** to see if user was created:
   https://console.firebase.google.com/project/the-biblical-man/authentication/users
3. **Check Cloud Function logs**:
   ```bash
   gcloud functions logs read stripeWebhook --limit 20 --region=us-central1
   ```

---

## What Happens Now

When someone subscribes for $3.00/month:
1. ⚡ Stripe sends webhook (instant)
2. 🔐 Cloud Function validates signature
3. 👤 Firebase account created automatically
4. 📧 Welcome email sent with credentials
5. ✅ User can login immediately

**Zero manual work required!**

---

## Summary

✅ Webhook deployed successfully
✅ All environment variables configured
✅ Ready to receive Stripe events
🔄 Need to add webhook URL to Stripe
🔄 Need to add webhook secret to function

Let me know when you have the webhook secret from Stripe!

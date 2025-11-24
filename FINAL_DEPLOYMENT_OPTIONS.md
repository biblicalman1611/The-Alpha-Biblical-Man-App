# Final Deployment - Choose Your Method

The webhook code is 100% ready. You just need to deploy it. Here are your two easiest options:

---

## Option 1: Grant Service Account Permissions (Recommended)

This allows automated deployment to work.

### Step 1: Go to IAM Settings
https://console.cloud.google.com/iam-admin/iam?project=the-biblical-man

### Step 2: Find the Firebase Service Account
Look for: `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com`

### Step 3: Add Role
1. Click the pencil icon (Edit) next to that account
2. Click **"ADD ANOTHER ROLE"**
3. Search for and add: **"Cloud Functions Developer"**
4. Click **"SAVE"**

### Step 4: Let Me Know
Once you've added the role, just say "done" and I'll deploy it immediately!

---

## Option 2: Manual Deployment via Console (Fastest)

Deploy directly through Google Cloud Console (no permissions needed).

### Step 1: Go to Cloud Functions
https://console.cloud.google.com/functions/list?project=the-biblical-man

### Step 2: Create Function
1. Click **"CREATE FUNCTION"**
2. Set these values:
   - **Environment**: 2nd gen
   - **Function name**: `stripeWebhook`
   - **Region**: `us-central1`
   - **Trigger type**: HTTPS
   - **Authentication**: Allow unauthenticated invocations
   - Click **"SAVE"** then **"NEXT"**

### Step 3: Add Code
1. **Runtime**: Node.js 20
2. **Entry point**: `stripeWebhook`
3. Delete everything in `index.js` and paste this:

```javascript
[COPY FROM: /Users/thebi/The-Alpha-Biblical-Man-App/scripts/index.js]
```

4. Delete everything in `package.json` and paste this:

```json
[COPY FROM: /Users/thebi/The-Alpha-Biblical-Man-App/scripts/package.json]
```

5. Create a new file called `stripe-webhook-handler.js` and paste:

```javascript
[COPY FROM: /Users/thebi/The-Alpha-Biblical-Man-App/scripts/stripe-webhook-handler.js]
```

### Step 4: Add Environment Variables
Click **"Runtime, build... and connections settings"**, then **"Environment variables"**

Add these (click "+ ADD VARIABLE" for each):

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `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` |
| `RESEND_API_KEY` | `re_UR6YiByC_KuvqcNicpHZhSapuZAM2cSsb` |
| `FIREBASE_PROJECT_ID` | `the-biblical-man` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | See below ⬇️ |

**For FIREBASE_PRIVATE_KEY**, copy this entire value (including quotes):
```
"-----BEGIN PRIVATE KEY-----
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

### Step 5: Deploy
Click **"DEPLOY"** and wait 2-3 minutes.

When it's done, click on the function name and find the **"TRIGGER"** tab to get your webhook URL.

---

## After Deployment (Either Option)

Once deployed, you'll have a URL like:
```
https://us-central1-the-biblical-man.cloudfunctions.net/stripeWebhook
```

### Add to Stripe:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Paste your URL
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add it to your Cloud Function environment variables as `STRIPE_WEBHOOK_SECRET`

---

## My Recommendation

**Option 1** is easier - just grant the permission and I'll deploy it instantly.

**Option 2** works if you want to do it manually right now.

Let me know which you prefer!

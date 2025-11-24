#!/bin/bash

# Stripe Webhook Deployment Script
# This script deploys the webhook to Google Cloud Functions

echo "🚀 Deploying Stripe Webhook to Google Cloud Functions..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  brew install google-cloud-sdk"
    echo ""
    echo "Or download from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Not logged in to Google Cloud"
    echo ""
    echo "Run: gcloud auth login"
    exit 1
fi

echo "✅ gcloud CLI ready"
echo ""

# Set project
echo "Setting project to: the-biblical-man"
gcloud config set project the-biblical-man

echo ""
echo "📦 Deploying Cloud Function..."
echo ""

# Read the private key from .env.migration
PRIVATE_KEY=$(grep FIREBASE_PRIVATE_KEY ../.env.migration | cut -d '=' -f2-)

# Deploy
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

echo ""
echo "✅ Deployment complete!"
echo ""
echo "================================================"
echo "NEXT STEPS:"
echo "================================================"
echo ""
echo "1. Copy the Cloud Function URL from the output above"
echo ""
echo "2. Go to Stripe Dashboard:"
echo "   https://dashboard.stripe.com/webhooks"
echo ""
echo "3. Click 'Add endpoint' and paste the URL"
echo ""
echo "4. Select these events:"
echo "   - customer.subscription.created"
echo "   - customer.subscription.updated"
echo "   - customer.subscription.deleted"
echo ""
echo "5. Copy the webhook signing secret (whsec_...)"
echo ""
echo "6. Update the Cloud Function with the secret:"
echo "   gcloud functions deploy stripeWebhook \\"
echo "     --gen2 \\"
echo "     --update-env-vars STRIPE_WEBHOOK_SECRET=\"whsec_YOUR_SECRET\""
echo ""
echo "================================================"
echo ""

# Enable Required APIs for Cloud Functions

Cloud Functions needs 3 APIs enabled. Let's enable them all at once:

## Quick Links (Click Each One)

**Click these links and click "ENABLE" on each:**

1. **Cloud Build API** (Required for deployment)
   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=the-biblical-man

2. **Cloud Run API** (Required for Gen2 functions)
   https://console.developers.google.com/apis/api/run.googleapis.com/overview?project=the-biblical-man

3. **Artifact Registry API** (Required for storing function code)
   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com/overview?project=the-biblical-man

---

## What to Do

For each link above:
1. Click the link
2. Click the blue **"ENABLE"** button
3. Wait 10-20 seconds for it to enable
4. Move to the next one

Total time: ~2 minutes

---

## After Enabling All 3

Let me know when you've enabled all 3 APIs and I'll deploy the webhook immediately!

---

## What These APIs Do

- **Cloud Build**: Builds your function code
- **Cloud Run**: Runs your serverless function
- **Artifact Registry**: Stores your function's container

All are free for your usage level.

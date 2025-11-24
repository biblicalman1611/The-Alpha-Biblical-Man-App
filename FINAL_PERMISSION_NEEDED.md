# Final Permission Needed - Almost There!

The deployment needs one more permission for the Firebase service account.

## Quick Fix (30 seconds)

### Go to IAM Page
https://console.cloud.google.com/iam-admin/iam?project=the-biblical-man

### Find the Firebase Service Account
Look for: `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com`

### Add One More Role
1. Click the **pencil icon** (Edit) next to that account
2. Click **"ADD ANOTHER ROLE"**
3. Search for and add: **"Service Account User"**
4. Click **"SAVE"**

That's it!

---

## After Adding This Role

Let me know when done and I'll deploy immediately!

---

## Summary of What We've Done

✅ Enabled billing
✅ Enabled Cloud Functions API
✅ Enabled Cloud Build API
✅ Enabled Cloud Run API
✅ Enabled Artifact Registry API
✅ Added "Cloud Functions Developer" role
🔄 Need to add "Service Account User" role ← **You are here**

Just one more permission and we're done!

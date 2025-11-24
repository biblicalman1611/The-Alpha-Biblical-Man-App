# One More Role Needed - Function is Building!

Good news: The function is building successfully! We just need one more permission.

## Quick Fix (30 seconds)

### Go to IAM Page
https://console.cloud.google.com/iam-admin/iam?project=the-biblical-man

### Find the Firebase Service Account
Look for: `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com`

### Add This Role
1. Click the **pencil icon** (Edit) next to that account
2. Click **"ADD ANOTHER ROLE"**
3. Search for and add: **"Cloud Run Admin"**
4. Click **"SAVE"**

---

## Alternative: Grant Owner Role (Easier)

Instead of adding individual roles, you can make the Firebase service account an Owner:

1. Same page: https://console.cloud.google.com/iam-admin/iam?project=the-biblical-man
2. Find `firebase-adminsdk-fbsvc@the-biblical-man.iam.gserviceaccount.com`
3. Click pencil icon
4. Instead of adding another role, change the existing role to: **"Owner"**
5. Click "SAVE"

This gives all permissions and avoids needing to add roles one by one.

---

## Progress So Far

✅ Function code uploaded and built successfully!
✅ All APIs enabled
🔄 Just need permission to set IAM policy on the Cloud Run service

We're literally at the finish line!

# 🔒 Firebase Security Setup Instructions

You need to complete **2 manual steps** in the Firebase Console to activate the security:

## Step 1: Enable Anonymous Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Build** → **Authentication** in the left sidebar
4. Click **Get Started** (if you haven't set up Authentication yet)
5. Click the **Sign-in method** tab
6. Find **Anonymous** in the list of providers
7. Click on it and toggle the **Enable** switch
8. Click **Save**

## Step 2: Deploy Firestore Security Rules

### Option A: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Build** → **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top
5. **Replace** the existing rules with the content from `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // User-specific workspaces - each user can only access their own data
    match /workspaces/{userId} {
      // Only authenticated users can read/write their own workspace
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Click **Publish**

### Option B: Using Firebase CLI (Advanced)

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

---

## ✅ Verification

After completing both steps:

1. Run your app: `npm run dev`
2. The app should automatically authenticate anonymously
3. Your data will be secure and isolated per user
4. Try opening in a different browser/incognito - you'll get a separate workspace

## 🔐 What Changed?

- ✅ **Anonymous Authentication**: Each browser gets a unique user ID automatically
- ✅ **Secure Rules**: Only authenticated users can access their own data
- ✅ **Data Isolation**: Each user has their own private workspace
- ✅ **No Login Required**: Users don't need to create accounts

## ⚠️ Important Notes

- If a user clears their browser data, they'll get a new anonymous ID and lose access to their previous data
- For persistent accounts, you can upgrade to email/password authentication later
- The warning about public security rules will disappear once you deploy the new rules

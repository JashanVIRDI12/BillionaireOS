# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "billionaire-os")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider:
   - Click on Google
   - Toggle "Enable"
   - Add your project's domain to authorized domains
   - Save
5. Enable "Phone" provider:
   - Click on Phone
   - Toggle "Enable"
   - Save

## 3. Setup Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app with a nickname
5. Copy the config object

## 5. Update Firebase Config

Replace the config in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 6. Setup Firestore Security Rules

In Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /assets/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /liabilities/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm start`
2. Try signing in with Google
3. Try adding assets and liabilities
4. Check Firestore console to see data being saved

## 8. Production Setup

For production:
1. Change Firestore rules from "test mode" to the rules above
2. Add your production domain to Firebase Authentication authorized domains
3. Enable reCAPTCHA for phone authentication

## Troubleshooting

- **Phone auth not working**: Make sure reCAPTCHA is properly configured
- **Permission denied**: Check Firestore security rules
- **Auth domain error**: Add your domain to authorized domains in Authentication settings
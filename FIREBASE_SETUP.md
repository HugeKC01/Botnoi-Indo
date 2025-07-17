# Firebase Authentication Setup Guide

This project includes a complete Firebase authentication system with the following features:

## 🚀 Features

- **Email/Password Authentication** - Traditional signup and login
- **Google Authentication** - One-click Google sign-in
- **Password Reset** - Email-based password recovery
- **Protected Routes** - Route protection for authenticated users
- **User Dashboard** - Personalized user dashboard
- **Responsive Design** - Modern UI with Tailwind CSS and shadcn/ui

## 📋 Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name and follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password** - Click and enable
   - **Google** - Click, enable, and configure with your project's support email

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Scroll down to **Your apps** section
3. Click **Add app** and select **Web app** (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### 5. Configure Firestore (Optional)

If you plan to store user data:

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** for development
4. Select a location for your database

### 6. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Authentication Routes

- `/login` - Sign in page
- `/signup` - Create account page
- `/forgot-password` - Password reset page
- `/dashboard` - Protected user dashboard (requires authentication)

## 🛡️ Security Rules

### Firestore Security Rules (if using Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Components Overview

- **AuthContext** - Manages authentication state globally
- **ProtectedRoute** - Wrapper for routes requiring authentication
- **Login/Signup Pages** - Beautiful authentication forms
- **Dashboard** - User profile and account information
- **Header** - Navigation with auth status

## 🎨 Styling

The authentication system uses:
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Lucide React** for icons
- **React Hook Form** for form management

## 🔧 Customization

### Adding More Authentication Providers

To add more providers (GitHub, Twitter, etc.), update the `AuthContext.tsx`:

```typescript
import { GithubAuthProvider, TwitterAuthProvider } from 'firebase/auth';

// Add provider functions
const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  await signInWithPopup(auth, provider);
};
```

### Custom User Profile Fields

Extend the user profile by updating user documents in Firestore after authentication.

## 🚨 Important Security Notes

1. **Never commit** your `.env` file with real credentials
2. **Always validate** authentication on the server side for sensitive operations
3. **Use Firestore security rules** to protect user data
4. **Enable App Check** in production for additional security

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Router Documentation](https://reactrouter.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase app not initialized"** - Check your environment variables
2. **"Auth domain not authorized"** - Add your domain to authorized domains in Firebase Console
3. **Google sign-in not working** - Ensure Google provider is enabled and configured
4. **CORS errors** - Check your Firebase project configuration

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify your Firebase configuration
3. Ensure all required Firebase services are enabled
4. Check Firebase project quotas and limits

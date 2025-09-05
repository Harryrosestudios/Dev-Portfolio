# Firebase Setup Guide for Portfolio Projects

This guide will walk you through setting up Firebase Firestore to manage your portfolio projects dynamically.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "harry-portfolio")
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## 2. Set Up Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
   - For test mode: This allows read/write access for 30 days
   - For production mode: You'll need to set up security rules
4. Choose a location closest to your users

## 3. Get Your Firebase Configuration

1. In your Firebase project console, click on "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click on "Web" icon (</>) to add a web app
4. Register your app with a nickname (e.g., "portfolio-web")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 4. Update Your Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
```

## 5. Migrate Your Existing Projects to Firebase

Run the migration script to upload your current projects to Firebase:

```bash
npm run dev
```

Then in your browser console or in a separate script, run:

```javascript
// You can create a simple migration page or run this in the browser console
import { migrateProjectsToFirebase } from './src/utils/migrateProjects.js';
await migrateProjectsToFirebase();
```

Or create a temporary migration component and add it to your app temporarily.

## 6. Set Up Firestore Security Rules (Production)

If you started in production mode, you'll need to set up security rules. Go to "Firestore Database" > "Rules" and update them. Here's an example for read-only public access with authenticated write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to projects
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

For a completely public setup (development only):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 7. Project Data Structure

Each project document in Firestore should have the following structure:

```javascript
{
  title: "Project Title",
  desc: "Project description",
  subdesc: "Project sub-description", 
  href: "https://project-url.com",
  texture: "/textures/project/project1.mp4",
  logo: "/assets/project-logo1.png",
  logoStyle: {
    backgroundColor: '#2A1816',
    border: '0.2px solid #36201D',
    boxShadow: '0px 0px 60px 0px #AA3C304D'
  },
  spotlight: "/assets/spotlight1.png",
  tags: [
    {
      id: 1,
      name: "React.js",
      path: "/assets/react.svg"
    }
    // ... more tags
  ],
  order: 1, // For sorting projects
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 8. Managing Projects

### Option 1: Using the Admin Component (Recommended)

Access the admin component by temporarily adding it to your app:

```jsx
// In your main App.jsx or create a separate admin page
import ProjectAdmin from './src/components/ProjectAdmin.jsx';

// Add a route or conditional render for admin access
{showAdmin && <ProjectAdmin />}
```

### Option 2: Directly in Firebase Console

1. Go to Firestore Database in your Firebase console
2. Navigate to the `projects` collection
3. Add, edit, or delete documents directly

### Option 3: Using Firebase CLI/Scripts

Create scripts to manage your data programmatically.

## 9. Benefits of This Setup

- ✅ **No rebuilds required**: Update content directly in Firebase
- ✅ **Real-time updates**: Changes appear immediately
- ✅ **Easy management**: Use the admin interface or Firebase console
- ✅ **Fallback support**: If Firebase fails, falls back to static data
- ✅ **Scalable**: Easy to add more dynamic content types
- ✅ **Performance**: Firestore is fast and globally distributed

## 10. Troubleshooting

### Common Issues:

1. **Firestore rules deny access**: Check your security rules
2. **Environment variables not loading**: Make sure they start with `VITE_`
3. **Build errors**: Ensure all Firebase dependencies are installed
4. **Network errors**: Check your Firebase configuration

### Testing the Setup:

1. Start your development server: `npm run dev`
2. Check browser console for any Firebase connection errors
3. Verify projects load correctly
4. Test adding/editing a project through the admin interface

## 11. Deployment Notes

When deploying to production:

1. Update your environment variables in your hosting platform
2. Set up proper Firestore security rules
3. Consider setting up Firebase hosting for better integration
4. Set up backup and monitoring

---

Your portfolio now supports dynamic content management! You can update projects, add new ones, or remove them without needing to rebuild and redeploy your application.

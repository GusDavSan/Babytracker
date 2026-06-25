# Nana Baby Tracker

Shared baby tracker for sleep, wake-ups, feeds, diapers, and notes.

The app is designed as a static PWA for Firebase Hosting:

- Google login with Firebase Authentication.
- Realtime shared events with Firestore.
- English by default, Spanish toggle per user.
- Family invite code so two parents can share one baby profile.
- Demo mode while Firebase credentials are not configured.

## Project Structure

```txt
BabyTracker/
  firebase.json
  firestore.rules
  firestore.indexes.json
  public/
    index.html
    styles.css
    app.js
    firebase-config.js
    manifest.webmanifest
    sw.js
    icon.svg
```

## Local Preview

From this folder:

```bash
python3 -m http.server 8787 --directory public
```

Open:

```txt
http://127.0.0.1:8787
```

Until Firebase is configured, use **Try demo**.

## Firebase Setup

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Add a Web App from Project settings.
3. Copy the Firebase web config into:

```txt
public/firebase-config.js
```

4. Enable Authentication:
   - Provider: Google
   - Keep the default authorized domains. No custom domain is required.

5. Create Firestore Database:
   - Start in production mode.
   - Use a nearby region.
   - Deploy the included rules before real use.

## Production Deployment

The app does not need a build step because `public/` already contains the deployable static PWA.

1. Install the Firebase CLI if needed:

```bash
npm install -g firebase-tools
```

2. Sign in:

```bash
firebase login
```

3. Select your Firebase project from the `BabyTracker` folder:

```bash
firebase use --add
```

4. Deploy Hosting and Firestore rules:

```bash
firebase deploy
```

The app will be available at:

```txt
https://<project-id>.web.app
https://<project-id>.firebaseapp.com
```

If you only want to update the app files later:

```bash
firebase deploy --only hosting
```

If you only changed security rules:

```bash
firebase deploy --only firestore
```

## Sharing With Partner

1. First parent logs in with Google.
2. Create the family and baby profile.
3. Copy the family code from Settings.
4. Second parent logs in and joins with that code.

Events are stored as structured codes, not display text, so each user can view the same data in English or Spanish.

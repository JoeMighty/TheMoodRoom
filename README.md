# The Mood Room 🌌

An interactive, real-time art installation that bridges a mobile-accessible submission portal with a large-scale collective projection display. Attendees scan a QR code to submit a raw thought and attach an emotion via an emoji, which then sways and floats on a shared physical projection screen.

Built with pure, lightweight, serverless technologies: Vanilla HTML5, CSS3, and JavaScript, backed by Google Firebase Firestore.

---

## 1. Firebase Setup Guide

Since you've already created your Firebase project **TheMoodRoom** (`themoodroom-24902`), follow these steps to register the web app, set up Firestore, and connect it to this codebase.

### Step A: Get your API Key & App ID
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project **TheMoodRoom**.
3. In the center of the project overview page, click the **Web icon ( `</>` )** to register a new application.
4. Enter an App Nickname (e.g., `The Mood Room Web App`). Leave "Also set up Firebase Hosting" **unchecked** (we will use GitHub Pages for free hosting).
5. Click **Register App**.
6. Firebase will display a code snippet containing your `firebaseConfig` object. Copy the values for:
   * `"apiKey"`
   * `"appId"`
7. Open the file [js/firebase-config.js](file:///c:/Users/jobiz/Documents/Work/Jobin%20Bennykutty/Web%20Apps/Antigravity/The%20Mood%20Room/js/firebase-config.js) in your text editor.
8. Replace `"YOUR_API_KEY"` with your copied API key and `"YOUR_APP_ID"` with your copied App ID. Save the file.
   *(Note: The Project ID, Project Number, and other settings are already pre-filled for you!)*

### Step B: Enable Cloud Firestore
1. In the left-hand navigation sidebar of the Firebase console, click on **Build** -> **Firestore Database**.
2. Click the **Create database** button.
3. **Location:** Select a database location closest to your exhibition site (e.g. `nam5 (us-central)` or a location in Europe/Asia) and click **Next**.
4. **Security Rules:** Select **Start in test mode** (this is fine, as we will configure custom rules in the next step). Click **Create**.

### Step C: Deploy Firestore Security Rules
1. In the Firestore Database dashboard, click on the **Rules** tab at the top.
2. Open the local file [firestore.rules](file:///c:/Users/jobiz/Documents/Work/Jobin%20Bennykutty/Web%20Apps/Antigravity/The%20Mood%20Room/firestore.rules) in this codebase.
3. Copy the entire contents of that file and paste it into the editor in the Firebase Console Rules tab, overwriting the default rules.
4. Click **Publish**.
   *This grants public read and write access strictly to the `exhibitThoughts` collection so participants can submit thoughts and the projection screen can read them in real time.*

---

## 2. Local Testing & Visual Tour

Because this is a serverless static site, you can test it locally in your browser.

1. Open `index.html` in your browser. This is the **Projection Screen** display.
2. Open `submit.html` in another browser tab (or resize it to look like a mobile device). This is the **Participant Submission Form**.
3. Submit a thought from `submit.html` (e.g., *"Feeling nervous but excited about tonight."* + select **🌟 Excited** emoji).
4. Swap back to the `index.html` tab. You should see your thought bubble instantly animate onto the screen with a golden glow and float gently!
5. Test the **15-thought limit**: Submit 16 thoughts. You will notice that when the 16th thought is added, the 1st (oldest) thought fades out smoothly and is deleted from the screen.

---

## 3. Deployment to GitHub Pages (Free Hosting)

To launch the project for your exhibition, deploy it to GitHub Pages.

### Step A: Verify Git setup
Ensure you have committed your changes. In your terminal, configure Git to commit using your GitHub proxy email:
```bash
git add .
git commit -m "Initialize The Mood Room application"
```

### Step B: Push to your GitHub Repository
Push the codebase to your remote repository:
```bash
git push -u origin main
```

### Step C: Enable GitHub Pages
1. Go to your GitHub repository: `https://github.com/JoeMighty/TheMoodRoom`
2. Click on the **Settings** tab.
3. In the left-hand sidebar, scroll down to the **Code and automation** section and click on **Pages**.
4. Under **Build and deployment**:
   * **Source:** Select **Deploy from a branch**.
   * **Branch:** Select `main` (or `master`) and folder `/ (root)`.
5. Click **Save**.
6. Wait 1–2 minutes. GitHub will generate a live URL for your project (e.g., `https://joemighty.github.io/TheMoodRoom/`).

### Step D: Accessing the Live App
Once deployed, the pages are accessible at:
* **Main Projection Screen:** `https://joemighty.github.io/TheMoodRoom/index.html`
  * *Open this URL on the computer hooked up to the main projector, and press `F11` to make the browser fullscreen.*
* **Mobile Submission Portal:** `https://joemighty.github.io/TheMoodRoom/submit.html`
  * *Generate a QR code linking to this URL and print it out on your physical signage for attendees to scan.*

---

## 4. Visual Elements & Customization

* **Emotion Mapping:** If you want to change the colors of the emotions or add new emojis, edit [css/style.css](file:///c:/Users/jobiz/Documents/Work/Jobin%20Bennykutty/Web%20Apps/Antigravity/The%20Mood%20Room/css/style.css). The color variables are located at the top under `:root`.
* **Content Moderation:** Local blocklist words are managed in [js/moderation.js](file:///c:/Users/jobiz/Documents/Work/Jobin%20Bennykutty/Web%20Apps/Antigravity/The%20Mood%20Room/js/moderation.js). You can expand the `LOCAL_BLOCKLIST` array to instantly filter out additional specific words.

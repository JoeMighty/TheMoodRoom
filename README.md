<div align="center">

# The Mood Room 🌌

An interactive, real-time art installation that bridges a mobile-accessible submission portal with a large-scale collective projection display. Attendees scan a QR code to submit a raw thought and attach an emotion via an emoji, which then sways and floats on a shared physical projection screen.

Built with pure, lightweight, serverless technologies: Vanilla HTML5, CSS3, and JavaScript, backed by Google Firebase Firestore.

[![Platform - Web](https://img.shields.io/badge/Platform-Web-3b82f6?style=plastic)](submit.html)
[![Database - Firestore](https://img.shields.io/badge/Database-Firebase_Firestore-ffca28?logo=firebase&style=plastic)](https://firebase.google.com/)
[![Moderation - PurgoMalum](https://img.shields.io/badge/Moderation-PurgoMalum-8b5cf6?style=plastic)](https://www.purgomalum.com/)
[![Tech Stack - Vanilla HTML/CSS/JS](https://img.shields.io/badge/Tech_Stack-HTML5%20%7C%20CSS3%20%7C%20JS-10b981?style=plastic)](#)

</div>

---

## 🎨 Visual Concept & Experience

"The Mood Room" acts as a breathing emotional landscape. Submissions from mobile devices are rendered as floating, glassmorphic bubbles containing the participant's thought, a name initial, and a matching emoji. 

*   **Atmosphere:** Deep dark gray radial-gradient backgrounds with subtle grid details.
*   **Aesthetics:** Translucent glassmorphism (`backdrop-filter`) with custom neon glowing borders.
*   **Motion:** Staggered floating animations which sway out-of-sync to simulate an organic collective cloud.

---

## 🚀 Key Features

*   **Real-time Beaming:** Live Firestore sync loads new thoughts instantly without refreshing the page.
*   **The 15-Thought Limit (FIFO):** The screen displays a maximum of 15 thoughts. When the 16th thought is added, the oldest thought is targeted, faded out, and removed from the screen.
*   **Balanced Anonymity:** Displays first initials of names (e.g. "J.") to provide a personal connection while keeping submissions anonymous.
*   **Emotion Mapping:** 8 emotional categories mapped to tailored colors (Mint, Rose, Slate, Amber, Violet, Coral, Crimson, Emerald) dictating glows and background hues.
*   **Content Moderation:** Staged local regex checks backed by the PurgoMalum API to filter profanity.
*   **Built-in QR Code:** The projection screen features an elegant QR code in the bottom-right corner that dynamically links straight to the live submission form.

---

## 📂 Codebase Modules

*   **[index.html](index.html) / [js/app.js](js/app.js):** The projection screen listener, grid assignment slots (collision avoidance), and bubble manager.
*   **[submit.html](submit.html) / [js/submit.js](js/submit.js):** Participant mobile form with active character count validation and emoji indicators.
*   **[css/style.css](css/style.css):** Styling system, color definitions, layouts, and animations.
*   **[js/moderation.js](js/moderation.js):** Staged local and remote profanity filters.
*   **[firestore.rules](firestore.rules):** Firestore database access controls.

---

<div align="center">

### 🛠️ Setup & Technical Documentation

For step-by-step guides on Firebase console setup, security rule publishing, local testing, and GitHub Pages deployment, open the developer documentation:

### [👉 Read docs.html (Developer Guide)](docs.html)

*(This file is part of the codebase repository and is not linked on the public-facing exhibition screens)*

</div>

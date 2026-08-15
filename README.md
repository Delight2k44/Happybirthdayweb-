# Happy Birthday Website 🎈

A beautiful, premium, and interactive birthday website built for your dearest niece.

## Features
- **Modern & Responsive Design**: Elegant rose gold and champagne pastel gradient colors with smooth hover states and responsive grids.
- **Interactive Birthday Card**: A simulated envelopes card modal that flips open on click, triggers confetti, and starts playing a sweet birthday tune.
- **Memory Lane Gallery**: A high-end photo gallery displaying your uploaded pictures dynamically.
- **Wishes Board**: Powered by **Firebase Firestore**. Family and friends can post real-time wishes directly to the page. If Firestore is offline or not set up, it automatically and gracefully falls back to using `localStorage`!
- **Canvas Confetti**: Celebratory sparkle animations when opening the card and sending a wish.

---

## How to Add Your Pictures 📸
1. Copy or upload your niece's pictures into the `images/` directory.
2. Open [`app.js`](file:///C:/Users/delig/.gemini/antigravity/scratch/Happybirthdayweb-/app.js) and locate the `niecePhotos` array.
3. List your image paths in the array. For example:
   ```javascript
   const niecePhotos = [
       "images/baby_photo.jpg",
       "images/cake_cutting.jpg",
       "images/family_smile.jpg"
   ];
   ```
4. Save the file and reload the website!

---

## Firebase Setup (Wishes Board) 🌟
We have pre-configured Firebase in [`app.js`](file:///C:/Users/delig/.gemini/antigravity/scratch/Happybirthdayweb-/app.js) using the details you provided.

To make the Wishes Board work across different devices:
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project **happy-birthday-ff3ad**.
3. Create a **Cloud Firestore Database** (in test mode or configure standard read/write rules).
4. Create a collection named `wishes`.
5. Once configured, family wishes will automatically synchronize in real-time on the website!

*Note: If Firestore is not set up, wishes will still save locally to the browser's storage so you can easily test it.*

---

## Running Locally 🚀
Since the project uses ES Modules (`import`/`export`), you need to run it using a local server:
- If you have VS Code, you can use the **Live Server** extension.
- Alternatively, if you have Python installed, run this command in the project directory:
  ```bash
  python -m http.server 8000
  ```
- Or if you have Node/npm:
  ```bash
  npx serve
  ```
  Then open `http://localhost:8000` (or the port specified) in your browser.

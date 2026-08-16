# ✦ 22 Years of Frost ✦ 🎂💖

> A premium, interactive birthday celebration website built with love for **Frost's 22nd Birthday**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

---

## 🌟 Overview

A fully interactive, multi-page birthday website featuring a countdown timer, real-time wish board, memory photo uploads with 3D gift-wrapping animations, an interactive cake candle-blowing widget, and a private passcode-protected birthday girl dashboard — all wrapped in a gorgeous **pink theme** with floating particle effects.

---

## 🎀 Pages & Features

### 1. 🏠 Landing Page (`index.html`)
- **10-second countdown timer** with glassmorphic cards
- Floating ambient **bokeh particle canvas** animation
- Locked button that unlocks with confetti when the countdown hits zero
- **Frost's Universe Portal** — a direct link to the birthday girl's private dashboard
- Credits footer

### 2. 💌 Celebration / Wishes Page (`celebration.html`)
- **Sealed envelope** that opens on click with confetti, revealing a welcome letter
- **Warm Wishes Wall** — guests write and submit birthday messages
- Real-time wish syncing via **Firebase Firestore** (localStorage fallback)
- **One wish per person** — after sending, the form is replaced with a success state
- **Auto-redirect** to the Memories page 2.5 seconds after sending a wish
- Live wishes feed displayed on the right panel

### 3. 📸 Memory Lane (`memories.html`)
- Upload **two polaroid-style memory photos** with captions
- **Drag & drop** or click-to-upload with live image previews
- Client-side **image compression** (400×400, JPEG quality 0.5) to fit Firestore's 1MB limit
- **3D gift box wrapping animation** — box shakes, lid pops open, polaroids float out
- RSVP modal — "Are you attending?" with Yes/No options saved to Firestore
- Redirect back to the home page after completing RSVP

### 4. 👑 Birthday Girl Dashboard (`birthday-girl.html`)
- **Passcode lock screen** — PIN `040816` required to enter
- Shake animation + error feedback on wrong PIN (3 attempts max)
- **Welcome Letters phase** — two sealed envelopes (personal + friends) with confetti
- Friends' signatures dynamically loaded from Firestore
- **Dashboard grid** showing:
  - 💬 Warm Wishes Wall — all submitted wishes
  - 📸 Shared Memories — all uploaded photos
  - ✅ RSVP Tracker — who's coming and who's not
- **Celebration Room** 🍰:
  - Interactive **CSS cake with flickering candle flames**
  - Click the cake to **blow out candles** (smoke + wick animation)
  - Custom **Happy Birthday song** plays on loop while candles are lit
  - Song **automatically pauses** when candles are blown out
  - Click again to **re-light candles** and resume the song
  - **Floating polaroid photo collage** in the background
  - **Animated wishes slideshow** — cycles through messages (40s per message)
  - Falling **polaroid rain animation** when transitioning to the Memory Lightbox
  - **Polaroid Memory Lightbox Modal** displaying all shared photos

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Glassmorphism, animations, gradients, responsive design |
| **Vanilla JavaScript (ES Modules)** | Interactivity, canvas particles, form handling |
| **Firebase Firestore** | Real-time database for wishes, memories, and RSVPs |
| **Firebase Analytics** | Usage tracking (gracefully degrades if blocked) |
| **Canvas Confetti** | Celebratory particle effects |
| **Font Awesome 6** | Icons throughout the site |
| **Google Fonts** | Cormorant Garamond, Inter, Caveat typography |

---

## 📁 Project Structure

```
Happybirthdayweb-/
├── index.html              # Landing page with countdown
├── index.css               # Landing page styles
├── app.js                  # Countdown logic & particles
├── celebration.html        # Wishes board page
├── celebration.css          # Wishes board styles
├── celebration.js           # Wish form, Firebase sync, envelope transitions
├── memories.html            # Photo upload & gift wrapping page
├── memories.css             # Memories page styles
├── memories.js              # Upload handling, compression, RSVP
├── birthday-girl.html       # Private birthday girl dashboard
├── birthday-girl.css        # Dashboard styles (1500+ lines)
├── birthday-girl.js         # PIN gate, dashboard, celebration room, cake widget
├── images/                  # Birthday girl photos
│   ├── Picture 1.jpeg
│   ├── Picture 2.jpeg
│   └── picture 3.jpeg
├── music/                   # Custom audio
│   └── birthday-song.mp3   # Custom Happy Birthday song
└── README.md
```

---

## 🔥 Firebase Setup

### Firestore Database
The project uses Firebase project **`happy-birthday-ff3ad`** with three collections:

| Collection | Fields | Purpose |
|---|---|---|
| `wishes` | `name`, `message`, `createdAt` | Birthday wish messages |
| `memories` | `name`, `photo1`, `caption1`, `photo2`, `caption2`, `createdAt` | Uploaded memory photos (base64) |
| `rsvps` | `name`, `attending`, `createdAt` | Event attendance responses |

### Security Rules
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{wishId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
    match /memories/{memoryId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
    match /rsvps/{rsvpId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

> Anyone can **read** and **create** entries. No one can **update** or **delete** them.

---

## 🚀 Running Locally

Since the project uses ES Modules (`import`/`export`), you need a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8000` in your browser.

---

## 🎨 Theme

The entire site uses a **vibrant pink color palette**:

| Variable | Color | Hex |
|---|---|---|
| Dark background | Black cherry | `#0e0205` |
| Rose gold light | Baby pink | `#ffb9cd` |
| Rose gold | Romantic pink | `#ff7597` |
| Rose gold dark | Hot magenta | `#ff477e` |
| Accent | Neon rose | `#ff2e63` |

---

## 📱 Responsive

The site is fully responsive across desktop, tablet, and mobile devices with CSS media queries and flexible grid layouts.

---

## 👤 Credits

**Designed by Delight Chetter** (0822349565 for more info) 🤍

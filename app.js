// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBenytTRI-15x8wAUuAvkedbw535xUUt-s",
  authDomain: "happy-birthday-ff3ad.firebaseapp.com",
  projectId: "happy-birthday-ff3ad",
  storageBucket: "happy-birthday-ff3ad.firebasestorage.app",
  messagingSenderId: "437796821765",
  appId: "1:437796821765:web:81c4406871f6f67edc356c",
  measurementId: "G-HP3Q6DCSDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with fallback support
let db;
let firestoreEnabled = false;

try {
    db = getFirestore(app);
    firestoreEnabled = true;
    console.log("Firebase Firestore initialized successfully! 🎉");
} catch (error) {
    console.warn("Firestore initialization failed. Using LocalStorage fallback.", error);
}

// -------------------------------------------------------------
// Photo Gallery Configuration
// -------------------------------------------------------------
// Once you add photos to the "images" folder, add their filenames to this array.
// Example: const niecePhotos = ["images/birthday_cake.jpg", "images/baby_pic.jpg"];
const niecePhotos = [
    // "images/photo1.jpg",
    // "images/photo2.jpg",
];

// Initialize Gallery UI
const galleryGrid = document.getElementById("gallery-grid");

function loadGallery() {
    if (niecePhotos.length > 0) {
        galleryGrid.innerHTML = ""; // Clear placeholders
        niecePhotos.forEach((photoUrl, index) => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            item.innerHTML = `
                <img src="${photoUrl}" alt="Niece memory ${index + 1}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600';">
                <div class="gallery-caption">Memory #${index + 1}</div>
            `;
            galleryGrid.appendChild(item);
        });
    }
}

// -------------------------------------------------------------
// Interactive Birthday Card Modal
// -------------------------------------------------------------
const openCardBtn = document.getElementById("open-card-btn");
const cardModal = document.getElementById("card-modal");
const closeModal = document.querySelector(".close-modal");
const birthdayCard = document.querySelector(".birthday-card");

openCardBtn.addEventListener("click", () => {
    cardModal.style.display = "flex";
    triggerConfettiExplosion();
});

closeModal.addEventListener("click", () => {
    cardModal.style.display = "none";
    birthdayCard.classList.remove("open");
});

// Click outside modal to close
window.addEventListener("click", (e) => {
    if (e.target === cardModal) {
        cardModal.style.display = "none";
        birthdayCard.classList.remove("open");
    }
});

// Flip/Open the cover when clicked
birthdayCard.addEventListener("click", (e) => {
    // Avoid toggling when closing the modal
    if (e.target.closest(".close-modal")) return;
    
    birthdayCard.classList.toggle("open");
    if (birthdayCard.classList.contains("open")) {
        triggerHeartsConfetti();
        playMusic();
    }
});

// -------------------------------------------------------------
// Music Controls
// -------------------------------------------------------------
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let isPlaying = false;

function playMusic() {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add("playing");
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(err => {
            console.log("Autoplay was prevented. Click the music button to play.", err);
        });
    }
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove("playing");
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
}

musicToggle.addEventListener("click", () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// -------------------------------------------------------------
// Confetti Celebrations (canvas-confetti)
// -------------------------------------------------------------
function triggerConfettiExplosion() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff758c', '#ff7eb3', '#fda085', '#e5c158', '#ffffff']
    });
}

function triggerHeartsConfetti() {
    const defaults = { spread: 360, ticks: 100, gravity: 0.5, decay: 0.94, startVelocity: 30, colors: ['#ff758c', '#ff7eb3', '#ff85a1'] };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['heart'] // canvas-confetti supports shape elements or custom plugins, if not standard fallback works.
        });

        confetti({
            ...defaults,
            particleCount: 20,
            scalar: 0.75
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

// -------------------------------------------------------------
// Wishes Board (Firebase / LocalStorage Sync)
// -------------------------------------------------------------
const wishForm = document.getElementById("wish-form");
const wishesList = document.getElementById("wishes-list");
const localWishesKey = "birthday_wishes_backup";

// Format date nicely
function formatDate(timestamp) {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Create a wish card element
function createWishCard(name, message, timeString) {
    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
        <p class="message">"${message}"</p>
        <div class="sender">
            <i class="fas fa-heart"></i> ${name}
        </div>
        <div class="timestamp">${timeString}</div>
    `;
    return card;
}

// Display Wishes in the UI
function displayWishes(wishes) {
    wishesList.innerHTML = "";
    if (wishes.length === 0) {
        wishesList.innerHTML = `
            <div class="wish-card loading">
                <p>No wishes yet. Be the first to leave one! ✨</p>
            </div>
        `;
        return;
    }
    wishes.forEach(wish => {
        const timeString = formatDate(wish.createdAt);
        const card = createWishCard(wish.name, wish.message, timeString);
        wishesList.appendChild(card);
    });
}

// Fetch Wishes from LocalStorage
function getLocalWishes() {
    const raw = localStorage.getItem(localWishesKey);
    return raw ? JSON.parse(raw) : [];
}

// Save Wish to LocalStorage
function saveLocalWish(name, message) {
    const wishes = getLocalWishes();
    const newWish = {
        name,
        message,
        createdAt: new Date().toISOString()
    };
    wishes.unshift(newWish); // Newest first
    localStorage.setItem(localWishesKey, JSON.stringify(wishes));
    return wishes;
}

// Bind Wishes Stream (Firebase or Fallback)
if (firestoreEnabled) {
    try {
        const wishesRef = collection(db, "wishes");
        const q = query(wishesRef, orderBy("createdAt", "desc"));
        
        onSnapshot(q, (snapshot) => {
            const wishes = [];
            snapshot.forEach((doc) => {
                wishes.push(doc.data());
            });
            displayWishes(wishes);
        }, (error) => {
            console.error("Firebase Read Error, using LocalStorage fallback:", error);
            displayWishes(getLocalWishes());
        });
    } catch (e) {
        console.error("Error setting up Firebase stream, using LocalStorage fallback:", e);
        displayWishes(getLocalWishes());
    }
} else {
    displayWishes(getLocalWishes());
}

// Handle Form Submission
wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("sender-name");
    const messageInput = document.getElementById("wish-message");
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) return;
    
    // UI response
    triggerConfettiExplosion();
    
    if (firestoreEnabled) {
        try {
            await addDoc(collection(db, "wishes"), {
                name: name,
                message: message,
                createdAt: serverTimestamp()
            });
            console.log("Wish sent to Firebase Cloud Firestore! ✨");
        } catch (error) {
            console.error("Failed to save to Firebase, saving locally:", error);
            const updated = saveLocalWish(name, message);
            displayWishes(updated);
        }
    } else {
        const updated = saveLocalWish(name, message);
        displayWishes(updated);
    }
    
    // Clear form
    nameInput.value = "";
    messageInput.value = "";
});

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadGallery();
    // Start with a small celebration confetti delay
    setTimeout(triggerConfettiExplosion, 1000);
});

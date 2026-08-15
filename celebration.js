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

// Initialize Firestore with fallback
let db;
let firestoreEnabled = false;

try {
    db = getFirestore(app);
    firestoreEnabled = true;
    console.log("Firebase Firestore initialized successfully on celebration page! 🌟");
} catch (error) {
    console.warn("Firestore initialization failed. Falling back to LocalStorage.", error);
}

// -------------------------------------------------------------
// HTML5 Canvas - Ambient Floating Particles (Bokeh Effect)
// -------------------------------------------------------------
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // distribute initially
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 6 + 2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -(Math.random() * 0.4 + 0.1); // slow upward float
        this.opacity = Math.random() * 0.35 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // fade out near top
        if (this.y < height * 0.2) {
            this.opacity -= this.fadeSpeed;
        }

        if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(253, 160, 133, ${this.opacity})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = "#fda085";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particleCount = 35;
const particles = Array.from({ length: particleCount }, () => new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0;
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// -------------------------------------------------------------
// Background Music Control
// -------------------------------------------------------------
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let isPlaying = false;

function playMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add("playing");
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(err => {
        console.log("Autoplay blocked. User interaction required.", err);
    });
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

// Try to auto-play when user lands on this page (since they clicked the enter button on index)
document.addEventListener("DOMContentLoaded", () => {
    // If the browser already registered user interaction from the index click, play starts immediately
    setTimeout(playMusic, 500);
});

// -------------------------------------------------------------
// Wishes Syncing (Firebase / LocalStorage backup)
// -------------------------------------------------------------
const wishForm = document.getElementById("wish-form");
const wishesList = document.getElementById("wishes-list");
const localWishesKey = "birthday_wishes_backup";

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

function createWishCard(name, message, timeString) {
    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
        <p class="message">"${message}"</p>
        <div class="sender">
            <i class="fa-solid fa-heart" style="color: #ff758c;"></i> ${name}
        </div>
        <div class="timestamp">${timeString}</div>
    `;
    return card;
}

function displayWishes(wishes) {
    wishesList.innerHTML = "";
    
    if (wishes.length === 0) {
        wishesList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-comments"></i>
                <p>Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan hangat! 💖</p>
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

function getLocalWishes() {
    const raw = localStorage.getItem(localWishesKey);
    return raw ? JSON.parse(raw) : [];
}

function saveLocalWish(name, message) {
    const wishes = getLocalWishes();
    const newWish = {
        name,
        message,
        createdAt: new Date().toISOString()
    };
    wishes.unshift(newWish);
    localStorage.setItem(localWishesKey, JSON.stringify(wishes));
    return wishes;
}

// Bind live stream
if (firestoreEnabled) {
    try {
        const wishesRef = collection(db, "wishes");
        const q = query(wishesRef, orderBy("createdAt", "desc"));
        
        onSnapshot(q, (snapshot) => {
            const wishes = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name && data.message) {
                    wishes.push(data);
                }
            });
            displayWishes(wishes);
        }, (error) => {
            console.error("Firebase read error, falling back to LocalStorage:", error);
            displayWishes(getLocalWishes());
        });
    } catch (err) {
        console.error("Error setting up Firebase stream, using LocalStorage backup:", err);
        displayWishes(getLocalWishes());
    }
} else {
    displayWishes(getLocalWishes());
}

// Form submit handler
wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById("sender-name");
    const messageInput = document.getElementById("wish-message");
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) return;
    
    // Confetti pop!
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fda085', '#ff758c', '#ffffff']
    });
    
    if (firestoreEnabled) {
        try {
            await addDoc(collection(db, "wishes"), {
                name: name,
                message: message,
                createdAt: serverTimestamp()
            });
            console.log("Wish saved to Firebase! 🌟");
        } catch (error) {
            console.error("Failed writing wish to Firebase, saving to backup:", error);
            const updated = saveLocalWish(name, message);
            displayWishes(updated);
        }
    } else {
        const updated = saveLocalWish(name, message);
        displayWishes(updated);
    }
    
    // Clear inputs
    nameInput.value = "";
    messageInput.value = "";
});

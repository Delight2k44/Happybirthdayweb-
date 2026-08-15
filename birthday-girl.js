// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    query, 
    orderBy 
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

// Initialize Firestore
let db;
let firestoreEnabled = false;

try {
    db = getFirestore(app);
    firestoreEnabled = true;
    console.log("Firebase Firestore initialized for dashboard! 🌟");
} catch (error) {
    console.warn("Firestore initialization failed. Fallbacks active.", error);
}

// -------------------------------------------------------------
// HTML5 Canvas - Colorful Celebratory Particles (Floating Bokeh)
// -------------------------------------------------------------
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Colorful particles array
const particleColors = [
    "#fda085", // warm rose gold
    "#ff758c", // pink
    "#e5c158", // gold
    "#ff85a1", // soft magenta
    "#ffc4b5", // champagne
    "#ffd275"  // bright yellow
];

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // distribute initially
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 8 + 3;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = -(Math.random() * 0.5 + 0.15); // slow upward float
        this.opacity = Math.random() * 0.45 + 0.15;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.fadeSpeed = Math.random() * 0.004 + 0.001;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < height * 0.25) {
            this.opacity -= this.fadeSpeed;
        }

        if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particleCount = 45;
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
// Passcode (PIN) Lock Screen Logic
// -------------------------------------------------------------
const correctPin = "040816";
let currentPin = "";
let attempts = 0;
const maxAttempts = 3;

const pinDotsContainer = document.getElementById("pin-dots-container");
const pinDots = document.querySelectorAll(".pin-dot");
const errorBanner = document.getElementById("error-banner");
const errorText = document.getElementById("error-text");

// Set up keypad button listeners
const keys = document.querySelectorAll(".key-btn");
keys.forEach(key => {
    key.addEventListener("click", () => {
        const val = key.getAttribute("data-value");
        handleKeyPress(val);
    });
});

// Also support keyboard input
document.addEventListener("keydown", (e) => {
    // Only capture keyboard if lock screen is visible
    if (document.getElementById("lock-screen-view").style.display !== "none") {
        if (e.key >= "0" && e.key <= "9") {
            handleKeyPress(e.key);
        } else if (e.key === "Backspace") {
            handleKeyPress("delete");
        } else if (e.key === "Escape") {
            handleKeyPress("clear");
        }
    }
});

function handleKeyPress(val) {
    if (val === "clear") {
        currentPin = "";
        updatePinDots();
        hideError();
    } else if (val === "delete") {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
        hideError();
    } else {
        if (currentPin.length < 6) {
            currentPin += val;
            updatePinDots();
            hideError();
            
            // Check PIN once 6 characters entered
            if (currentPin.length === 6) {
                setTimeout(validatePasscode, 300);
            }
        }
    }
}

function updatePinDots() {
    pinDots.forEach((dot, idx) => {
        if (idx < currentPin.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled", "error-dot");
        }
    });
}

function hideError() {
    errorBanner.style.display = "none";
}

// Check if input PIN matches correct PIN
function validatePasscode() {
    if (currentPin === correctPin) {
        // Authenticated!
        unlockDashboard();
    } else {
        // Incorrect Code
        attempts++;
        
        // Add shake animation and error dot styles
        pinDotsContainer.classList.add("shake-animation");
        pinDots.forEach(dot => dot.classList.add("error-dot"));
        
        // Render error banner text
        const attemptsLeft = maxAttempts - attempts;
        errorText.textContent = `Incorrect PIN! ${attemptsLeft} attempt(s) remaining.`;
        errorBanner.style.display = "flex";

        // Reset indicators after shake finishes
        setTimeout(() => {
            currentPin = "";
            updatePinDots();
            pinDotsContainer.classList.remove("shake-animation");
        }, 500);

        if (attempts >= maxAttempts) {
            // Locked out
            setTimeout(() => {
                alert("Access Denied!\nUnfortunately, it is not your birthday! 🎈");
                window.location.href = "index.html";
            }, 600);
        }
    }
}

// -------------------------------------------------------------
// Unlocking Dashboard Scene - Welcoming Letters Phase
// -------------------------------------------------------------
const lockView = document.getElementById("lock-screen-view");
const welcomeLettersView = document.getElementById("welcome-letters-view");
const dashboardView = document.getElementById("dashboard-view");
const musicBtn = document.getElementById("music-toggle");

const personalEnvelope = document.getElementById("personal-envelope");
const personalLetter = document.getElementById("personal-letter");
const friendsEnvelope = document.getElementById("friends-envelope");
const friendsLetter = document.getElementById("friends-letter");
const enterBtnWrapper = document.getElementById("enter-btn-wrapper");
const revealDashboardBtn = document.getElementById("reveal-dashboard-btn");
const friendsSignaturesList = document.getElementById("friends-signatures-list");

let personalOpened = false;
let friendsOpened = false;

function unlockDashboard() {
    // 1. Fire massive celebratory confetti
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: particleColors
    });

    // Ring firework confetti spray
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 1000);

    // 2. Animate view transition to Welcoming Letters screen first
    lockView.style.opacity = 0;
    lockView.style.transition = "opacity 0.8s ease";
    
    setTimeout(() => {
        lockView.style.display = "none";
        welcomeLettersView.style.display = "block";
        welcomeLettersView.style.opacity = 0;
        welcomeLettersView.style.transition = "opacity 0.8s ease";
        
        setTimeout(() => {
            welcomeLettersView.style.opacity = 1;
        }, 50);

        // Enable music control
        musicBtn.style.display = "flex";
        playMusic();
        
        // 3. Load dynamic signatures list of friends' names from Firestore
        loadFriendsSignatures();
    }, 800);
}

// -------------------------------------------------------------
// Welcoming Letters Phase Events
// -------------------------------------------------------------

// Personal Letter Envelope click
personalEnvelope.addEventListener("click", () => {
    confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#fda085', '#ff758c', '#ffffff']
    });
    
    personalEnvelope.style.display = "none";
    personalLetter.style.display = "block";
    personalOpened = true;
    checkLettersOpened();
});

// Friends Letter Envelope click
friendsEnvelope.addEventListener("click", () => {
    confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#fda085', '#ff758c', '#ffffff']
    });
    
    friendsEnvelope.style.display = "none";
    friendsLetter.style.display = "block";
    friendsOpened = true;
    checkLettersOpened();
});

// Show dashboard enter button once both letters are opened
function checkLettersOpened() {
    if (personalOpened && friendsOpened) {
        enterBtnWrapper.style.display = "flex";
        enterBtnWrapper.style.opacity = 0;
        enterBtnWrapper.style.transition = "opacity 0.8s ease";
        setTimeout(() => {
            enterBtnWrapper.style.opacity = 1;
        }, 100);
    }
}

// Transition from Welcome Letters to Main Dashboard Grid
revealDashboardBtn.addEventListener("click", () => {
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: particleColors
    });

    welcomeLettersView.style.opacity = 0;
    welcomeLettersView.style.transition = "opacity 0.6s ease";

    setTimeout(() => {
        welcomeLettersView.style.display = "none";
        
        // Reveal Dashboard
        dashboardView.style.display = "block";
        dashboardView.style.opacity = 0;
        dashboardView.style.transition = "opacity 0.8s ease";
        
        setTimeout(() => {
            dashboardView.style.opacity = 1;
        }, 50);

        // Bind main dashboard grid data streams
        loadDashboardData();
    }, 600);
});

// Helper to fetch wishes collection names and render signature items
function loadFriendsSignatures() {
    if (!firestoreEnabled) {
        renderFallbackSignatures();
        return;
    }

    const wishesQuery = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    onSnapshot(wishesQuery, (snapshot) => {
        friendsSignaturesList.innerHTML = "";
        const namesSet = new Set();
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name) {
                namesSet.add(data.name.trim());
            }
        });

        if (namesSet.size === 0) {
            renderFallbackSignatures();
        } else {
            namesSet.forEach(name => {
                const item = document.createElement("span");
                item.className = "signature-item";
                item.textContent = `${name} 🖋️`;
                friendsSignaturesList.appendChild(item);
            });
        }
    }, (error) => {
        console.error("Signatures collection query failed:", error);
        renderFallbackSignatures();
    });
}

function renderFallbackSignatures() {
    friendsSignaturesList.innerHTML = "";
    const list = ["Sarah 🖋️", "Rian 🖋️", "Dewi 🖋️", "Adi 🖋️", "Laras 🖋️", "Frost 🖋️"];
    list.forEach(name => {
        const item = document.createElement("span");
        item.className = "signature-item";
        item.textContent = name;
        friendsSignaturesList.appendChild(item);
    });
}

// -------------------------------------------------------------
// Background Music Control
// -------------------------------------------------------------
const bgMusic = document.getElementById("bg-music");
const navMusicToggle = document.getElementById("nav-music-toggle");
let isPlaying = false;

function playMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add("playing");
        navMusicToggle.classList.add("playing");
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        navMusicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(err => {
        console.log("Autoplay was blocked by browser. Click music icon to play.", err);
    });
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove("playing");
    navMusicToggle.classList.remove("playing");
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    navMusicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
}

function toggleMusicControl() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

musicBtn.addEventListener("click", toggleMusicControl);
navMusicToggle.addEventListener("click", toggleMusicControl);

// -------------------------------------------------------------
// Real-Time Dashboard Data Loader (Wishes, Memories, RSVPs)
// -------------------------------------------------------------
const wishesList = document.getElementById("dashboard-wishes-list");
const memoriesList = document.getElementById("dashboard-memories-list");
const rsvpList = document.getElementById("dashboard-rsvp-list");

function loadDashboardData() {
    if (!firestoreEnabled) {
        renderFallbackStates();
        return;
    }

    // 1. Stream Wishes (real-time)
    const wishesQuery = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    onSnapshot(wishesQuery, (snapshot) => {
        wishesList.innerHTML = "";
        const wishes = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name && data.message) wishes.push(data);
        });
        
        if (wishes.length === 0) {
            renderEmptyState(wishesList, "wishes");
        } else {
            wishes.forEach(wish => {
                const dateStr = wish.createdAt ? wish.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now";
                const card = document.createElement("div");
                card.className = "wish-card";
                card.innerHTML = `
                    <p class="message">"${wish.message}"</p>
                    <div class="sender"><i class="fa-solid fa-heart"></i> ${wish.name}</div>
                    <div class="timestamp">${dateStr}</div>
                `;
                wishesList.appendChild(card);
            });
        }
    }, (error) => {
        console.error("Wishes read failed:", error);
        renderEmptyState(wishesList, "wishes");
    });

    // 2. Stream Memories (real-time)
    const memoriesQuery = query(collection(db, "memories"), orderBy("createdAt", "desc"));
    onSnapshot(memoriesQuery, (snapshot) => {
        memoriesList.innerHTML = "";
        const memories = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.photo1 && data.photo2) memories.push(data);
        });

        if (memories.length === 0) {
            renderEmptyState(memoriesList, "memories");
        } else {
            memories.forEach((mem, idx) => {
                const card = document.createElement("div");
                card.className = "memory-card";
                card.id = `mem-card-${idx}`;
                
                // Set up double photo flipping structure
                // Shows Photo 1 initially. Clicking on polaroid toggles/flips to Photo 2!
                card.innerHTML = `
                    <img id="mem-img-${idx}" src="${mem.photo1}" alt="Memory photo">
                    <span class="caption" id="mem-cap-${idx}">${mem.caption1}</span>
                    <span class="author">Shared by ${mem.name}</span>
                `;
                
                let activePhoto = 1;
                card.addEventListener("click", () => {
                    const imgNode = document.getElementById(`mem-img-${idx}`);
                    const capNode = document.getElementById(`mem-cap-${idx}`);
                    if (activePhoto === 1) {
                        imgNode.src = mem.photo2;
                        capNode.textContent = mem.caption2;
                        activePhoto = 2;
                        // small flip confetti shake
                        confetti({ particleCount: 15, spread: 20, origin: { y: 0.8 } });
                    } else {
                        imgNode.src = mem.photo1;
                        capNode.textContent = mem.caption1;
                        activePhoto = 1;
                    }
                });
                
                memoriesList.appendChild(card);
            });
        }
    }, (error) => {
        console.error("Memories read failed:", error);
        renderEmptyState(memoriesList, "memories");
    });

    // 3. Stream RSVPs (real-time)
    const rsvpQuery = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
    onSnapshot(rsvpQuery, (snapshot) => {
        rsvpList.innerHTML = "";
        const rsvps = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name) rsvps.push(data);
        });

        if (rsvps.length === 0) {
            renderEmptyState(rsvpList, "rsvps");
        } else {
            rsvps.forEach(rsvp => {
                const card = document.createElement("div");
                card.className = "rsvp-card-item";
                
                const badgeClass = rsvp.attending ? "attending" : "declined";
                const badgeIcon = rsvp.attending ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>';
                const badgeText = rsvp.attending ? "Attending" : "Declined";

                card.innerHTML = `
                    <span class="rsvp-name">${rsvp.name}</span>
                    <span class="rsvp-badge ${badgeClass}">${badgeIcon} ${badgeText}</span>
                `;
                rsvpList.appendChild(card);
            });
        }
    }, (error) => {
        console.error("RSVP read failed:", error);
        renderEmptyState(rsvpList, "rsvps");
    });
}

function renderEmptyState(container, type) {
    let icon = "fa-comments";
    let text = "No records yet.";
    if (type === "memories") {
        icon = "fa-images";
        text = "No shared memories yet.";
    } else if (type === "rsvps") {
        icon = "fa-clipboard-user";
        text = "No RSVPs received yet.";
    }

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-regular ${icon}"></i>
            <p>${text}</p>
        </div>
    `;
}

function renderFallbackStates() {
    renderEmptyState(wishesList, "wishes");
    renderEmptyState(memoriesList, "memories");
    renderEmptyState(rsvpList, "rsvps");
}

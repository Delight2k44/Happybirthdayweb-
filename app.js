// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (saved for later use)
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
console.log("Firebase initialized successfully! 🚀");

// -------------------------------------------------------------
// HTML5 Canvas - Ambient Floating Particles (Bokeh Effect)
// -------------------------------------------------------------
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Re-adjust on resize
window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.reset();
        // distribute initially across the screen
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 6 + 2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -(Math.random() * 0.4 + 0.1); // Slow upward float
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // fade out near the top
        if (this.y < height * 0.2) {
            this.opacity -= this.fadeSpeed;
        }

        if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 117, 151, ${this.opacity})`;
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = "#ff7597";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Generate particle collection
const particleCount = 45;
const particles = Array.from({ length: particleCount }, () => new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0; // reset shadow for performance before clearing
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// Start animations
animateParticles();



// -------------------------------------------------------------
// Live Countdown Logic
// -------------------------------------------------------------
// Target date: Set to exactly 10 seconds from page load for testing/marking!
const targetDate = new Date().getTime() + 10000;

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const statusText = document.getElementById("status-text");
const actionBtn = document.getElementById("unlocked-action-btn");
const btnLockIcon = document.getElementById("btn-lock-icon");
const btnText = document.getElementById("btn-text");

let countdownInterval;
let confettiInterval;

function startCountdown() {
    updateTimer(); // Initial call
    countdownInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        // Countdown finished!
        clearInterval(countdownInterval);
        handleCountdownExpiry();
        return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Render output padded with leading zeros
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Unlocks the interactive elements when countdown hits 0
function handleCountdownExpiry() {
    // 1. Force zero displays
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    // 2. Update status label
    statusText.innerHTML = `<i class="fa-solid fa-cake-candles" style="color: #ff758c; animation: pulse 1.2s infinite;"></i> The time has arrived! Happy Birthday! 💖`;
    statusText.style.color = "#fda085";

    // 3. Unlock action button
    actionBtn.disabled = false;
    actionBtn.classList.add("unlocked");
    
    // Change lock icon to open lock
    btnLockIcon.className = "fa-solid fa-lock-open";
    btnLockIcon.style.color = "#fda085";
    
    // Change button text
    btnText.textContent = "ENTER THE PARTY 🎈";

    // 4. Trigger celebration effects
    triggerContinuousCelebration();
}

// -------------------------------------------------------------
// Confetti & Celebration Effects
// -------------------------------------------------------------
function triggerSingleBurst() {
    confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff7597', '#ff477e', '#ffb9cd', '#ffffff']
    });
}

function triggerContinuousCelebration() {
    // Basic burst on unlock
    triggerSingleBurst();

    // Set up recurring side-cannon confetti shots
    const end = Date.now() + (15 * 1000); // confetti for 15 seconds
    
    if (confettiInterval) clearInterval(confettiInterval);
    
    confettiInterval = setInterval(() => {
        const timeLeft = end - Date.now();
        if (timeLeft <= 0) {
            clearInterval(confettiInterval);
            return;
        }

        const frameInterval = 50;
        const particleCount = 25;

        confetti({
            particleCount: particleCount,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff7597', '#ff477e', '#ffb9cd']
        });
        
        confetti({
            particleCount: particleCount,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff7597', '#ff477e', '#ffb9cd']
        });
    }, 1500);
}

// -------------------------------------------------------------
// Button Action Handler (Redirects to birthday girl's custom page)
// -------------------------------------------------------------
actionBtn.addEventListener("click", () => {
    if (actionBtn.classList.contains("unlocked")) {
        // Play final confetti burst
        triggerSingleBurst();
        
        // Brief delay for transition feedback before routing
        setTimeout(() => {
            window.location.href = "celebration.html";
        }, 800);
    }
});

// Start the live clock once DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
    startCountdown();
});

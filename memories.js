// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    console.log("Firebase Firestore initialized for memories! 🌟");
} catch (error) {
    console.warn("Firestore initialization failed. Using LocalStorage fallback.", error);
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
        console.log("Autoplay blocked. User click required.", err);
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

// Try to auto-play when user lands on this page and pre-fill name
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(playMusic, 500);
    
    const savedName = localStorage.getItem("sender_name");
    if (savedName) {
        const nameField = document.getElementById("sender-name");
        if (nameField) nameField.value = savedName;
    }
});

// -------------------------------------------------------------
// Polaroid Upload Handling
// -------------------------------------------------------------
const fileInputs = [
    document.getElementById("file-input-1"),
    document.getElementById("file-input-2")
];

const dropzones = [
    document.getElementById("dropzone-1"),
    document.getElementById("dropzone-2")
];

const previews = [
    document.getElementById("preview-container-1"),
    document.getElementById("preview-container-2")
];

// Memory image base64 stores
let memoryImages = [null, null];

// Set up event listeners for file loading
fileInputs.forEach((input, index) => {
    // Click on dropzone triggers hidden file input
    dropzones[index].addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                memoryImages[index] = dataUrl;
                
                // Render image preview inside polaroid frame
                previews[index].innerHTML = `<img class="preview-img" src="${dataUrl}" alt="Memory Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle drag and drop files
    dropzones[index].addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzones[index].style.borderColor = "var(--rose-gold)";
    });

    dropzones[index].addEventListener("dragleave", () => {
        dropzones[index].style.borderColor = "rgba(255, 255, 255, 0.08)";
    });

    dropzones[index].addEventListener("drop", (e) => {
        e.preventDefault();
        dropzones[index].style.borderColor = "rgba(255, 255, 255, 0.08)";
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            input.files = e.dataTransfer.files;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                memoryImages[index] = dataUrl;
                previews[index].innerHTML = `<img class="preview-img" src="${dataUrl}" alt="Memory Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
});
// Image compression helper
function compressImage(dataUrl, maxWidth = 600, maxHeight = 600, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(compressedDataUrl);
        };
    });
}

const localMemoriesKey = "birthday_memories_backup";

function saveLocalMemories(name, photo1, caption1, photo2, caption2) {
    const backup = {
        name,
        photo1,
        caption1,
        photo2,
        caption2,
        createdAt: new Date().toISOString()
    };
    const current = localStorage.getItem(localMemoriesKey);
    const list = current ? JSON.parse(current) : [];
    list.unshift(backup);
    localStorage.setItem(localMemoriesKey, JSON.stringify(list));
}

// -------------------------------------------------------------
// Form Submission & Packaging Scene Trigger
// -------------------------------------------------------------
const memoriesForm = document.getElementById("memories-form");
const formWrapper = document.getElementById("memories-form-wrapper");
const packagingScene = document.getElementById("packaging-scene");
const giftBox = document.getElementById("gift-box");
const polaroidsOutput = document.getElementById("polaroids-output");
const finalCta = document.getElementById("final-cta-container");
const finishBtn = document.getElementById("finish-celebration-btn");

memoriesForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Safety check - require both images uploaded
    if (!memoryImages[0] || !memoryImages[1]) {
        alert("Harap pilih kedua foto memori Anda terlebih dahulu! 😊");
        return;
    }

    const name = document.getElementById("sender-name").value.trim();
    const caption1 = document.getElementById("caption-1").value.trim();
    const caption2 = document.getElementById("caption-2").value.trim();
    
    if (!name) return;

    // Change button text to indicate active loading
    const packageBtn = document.getElementById("package-memories-btn");
    packageBtn.disabled = true;
    packageBtn.innerHTML = 'Memproses Kenangan... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Save name locally
    localStorage.setItem("sender_name", name);

    // Compress pictures client-side
    const compressedImg1 = await compressImage(memoryImages[0]);
    const compressedImg2 = await compressImage(memoryImages[1]);

    // Save to Firebase
    if (firestoreEnabled) {
        try {
            await addDoc(collection(db, "memories"), {
                name: name,
                photo1: compressedImg1,
                caption1: caption1,
                photo2: compressedImg2,
                caption2: caption2,
                createdAt: serverTimestamp()
            });
            console.log("Memories successfully uploaded to Firebase Firestore! 🌟");
        } catch (error) {
            console.error("Failed uploading memories to Firebase, saving to backup:", error);
            saveLocalMemories(name, compressedImg1, caption1, compressedImg2, caption2);
        }
    } else {
        saveLocalMemories(name, compressedImg1, caption1, compressedImg2, caption2);
    }

    // Fade out form and display 3D Packaging scene
    formWrapper.style.opacity = 0;
    setTimeout(() => {
        formWrapper.style.display = "none";
        packagingScene.style.display = "flex";
        
        // Dynamically build the two polaroid items inside the scene (using compressed images)
        buildPolaroids(compressedImg1, compressedImg2, caption1, caption2);
        
        // Start packaging sequence
        runPackagingSequence();
    }, 500);
});

function buildPolaroids(img1, img2, cap1, cap2) {
    polaroidsOutput.innerHTML = `
        <div class="polaroid-card" id="output-card-1">
            <img src="${img1}" alt="Memori 1">
            <span class="polaroid-caption">${cap1}</span>
        </div>
        <div class="polaroid-card" id="output-card-2">
            <img src="${img2}" alt="Memori 2">
            <span class="polaroid-caption">${cap2}</span>
        </div>
    `;
}
function runPackagingSequence() {
    // 1. Box shakes to pack/prepare pictures
    setTimeout(() => {
        giftBox.classList.add("shake");
    }, 800);

    // 2. Stop shake and pop open the lid
    setTimeout(() => {
        giftBox.classList.remove("shake");
        giftBox.classList.add("open");
        
        // Trigger small pop sound confetti
        confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.5 },
            colors: ['#fda085', '#ff758c', '#ffffff']
        });
    }, 2000);

    // 3. Polaroids float out of open box
    setTimeout(() => {
        document.getElementById("output-card-1").classList.add("pop-1");
        document.getElementById("output-card-2").classList.add("pop-2");
    }, 2800);

    // 4. Reveal the final success CTA button
    setTimeout(() => {
        finalCta.style.display = "block";
        
        // Fireworks confetti loop for 5 seconds
        const end = Date.now() + (5 * 1000);
        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }
            confetti({
                particleCount: 30,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 }
            });
            confetti({
                particleCount: 30,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 }
            });
        }, 1000);
    }, 4800);
}

// -------------------------------------------------------------
// Final Button Redirection Handler
// -------------------------------------------------------------
finishBtn.addEventListener("click", () => {
    // Final check confetti pop
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });
    
    // Redirect back to welcome screen with success banner query parameter
    setTimeout(() => {
        alert("🎁 Kenangan manis Anda telah berhasil dibungkus dan dikirimkan ke dalam Kotak Ulang Tahunnya! Terima kasih! 🎉");
        window.location.href = "index.html";
    }, 1000);
});

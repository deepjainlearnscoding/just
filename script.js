// ============================================
// VALENTINE'S DAY WEBSITE - JAVASCRIPT
// Multi-Page Version
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================
let gameActive = false;
let gameTimer = null;
let timeRemaining = 15;
let score = 0;
let targetScore = 15;
let heartSpawnInterval = null;

// ============================================
// DOM ELEMENTS
// ============================================
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const floatingHeartsContainer = document.getElementById('floatingHearts');

// Game page elements (only exist on game.html)
const gameStartBtn = document.getElementById('gameStartBtn');
const gameArea = document.getElementById('gameArea');
const gameMessage = document.getElementById('gameMessage');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const gameResult = document.getElementById('gameResult');

// Message page elements (only exist on message.html)
const confettiCanvas = document.getElementById('confettiCanvas');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initScrollAnimations();
    initMusicToggle();

    // Page-specific initialization
    const currentPage = getCurrentPage();

    if (currentPage === 'game') {
        initGamePage();
    } else if (currentPage === 'message') {
        initMessagePage();
    }
});

// ============================================
// PAGE DETECTION
// ============================================
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('game.html')) return 'game';
    if (path.includes('message.html')) return 'message';
    if (path.includes('timeline.html')) return 'timeline';
    return 'home';
}

// ============================================
// GAME PAGE INITIALIZATION
// ============================================
function initGamePage() {
    if (gameStartBtn) {
        gameStartBtn.addEventListener('click', startGame);
    }
}

// ============================================
// MESSAGE PAGE INITIALIZATION
// ============================================
function initMessagePage() {
    // Check if user won the game
    const gameWon = sessionStorage.getItem('gameWon');

    if (gameWon === 'true') {
        // Launch confetti celebration
        setTimeout(() => {
            launchConfetti();
        }, 500);

        // Clear the flag
        sessionStorage.removeItem('gameWon');
    }
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================
function initFloatingHearts() {
    setInterval(() => {
        createFloatingHeart();
    }, 800);
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';

    floatingHeartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// ============================================
// GAME LOGIC
// ============================================
function startGame() {
    if (gameActive) return;

    // Reset game state
    gameActive = true;
    score = 0;
    timeRemaining = 15;
    gameMessage.style.display = 'none';
    gameResult.textContent = '';
    gameResult.className = 'game-result';

    updateDisplay();

    // Start timer
    gameTimer = setInterval(() => {
        timeRemaining--;
        updateDisplay();

        if (timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);

    // Start spawning hearts
    heartSpawnInterval = setInterval(() => {
        spawnGameHeart();
    }, 600);
}

function spawnGameHeart() {
    if (!gameActive) return;

    const heart = document.createElement('div');
    heart.className = 'game-heart';

    // Random heart emoji
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    // Random position
    const maxX = gameArea.clientWidth - 60;
    const maxY = gameArea.clientHeight - 60;
    heart.style.left = Math.random() * maxX + 'px';
    heart.style.top = Math.random() * maxY + 'px';

    // Random size
    const size = Math.random() * 1.5 + 1.5;
    heart.style.fontSize = size + 'rem';

    // Click handler
    heart.addEventListener('click', () => {
        if (!gameActive) return;

        score++;
        updateDisplay();

        // Animate heart pop
        heart.classList.add('clicked');
        setTimeout(() => heart.remove(), 500);

        // Check win condition
        if (score >= targetScore) {
            endGame(true);
        }
    });

    gameArea.appendChild(heart);

    // Remove heart after 3 seconds if not clicked
    setTimeout(() => {
        if (heart.parentNode && !heart.classList.contains('clicked')) {
            heart.remove();
        }
    }, 3000);
}

function updateDisplay() {
    if (timerDisplay) timerDisplay.textContent = timeRemaining;
    if (scoreDisplay) scoreDisplay.textContent = `${score}/${targetScore}`;
}

function endGame(won) {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(heartSpawnInterval);

    // Remove all hearts
    const hearts = gameArea.querySelectorAll('.game-heart');
    hearts.forEach(heart => heart.remove());

    if (won) {
        gameResult.textContent = '🎉 You caught my love! Redirecting to your message... 💖';
        gameResult.className = 'game-result success';

        // Store win state
        sessionStorage.setItem('gameWon', 'true');

        // Redirect to message page after 2 seconds
        setTimeout(() => {
            window.location.href = 'message.html';
        }, 2000);
    } else {
        gameResult.textContent = '💔 Time\'s up! Try again to unlock my message.';
        gameResult.className = 'game-result failure';

        // Show retry button
        setTimeout(() => {
            gameMessage.innerHTML = `
                <p>Don't give up! My love is worth another try 💕</p>
                <button class="retry-btn" onclick="retryGame()">Try Again</button>
            `;
            gameMessage.style.display = 'block';
        }, 1000);
    }
}

function retryGame() {
    gameMessage.style.display = 'none';
    startGame();
}

// ============================================
// CONFETTI EFFECT
// ============================================
function launchConfetti() {
    if (!confettiCanvas) return;

    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 150;
    const colors = ['#ff1744', '#ff4081', '#ffc1cc', '#ffffff', '#ff69b4'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animate
    let animationFrames = 0;
    const maxFrames = 300; // 5 seconds at 60fps

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationFrames++;

        if (animationFrames < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ============================================
// MUSIC TOGGLE
// ============================================
function initMusicToggle() {
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', toggleMusic);

        // Persist music state across pages
        const musicPlaying = sessionStorage.getItem('musicPlaying');
        if (musicPlaying === 'true') {
            bgMusic.play().catch(err => {
                console.log('Music playback failed:', err);
            });
            musicToggle.classList.add('playing');
        }
    }
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(err => {
            console.log('Music playback failed:', err);
        });
        musicToggle.classList.add('playing');
        sessionStorage.setItem('musicPlaying', 'true');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        sessionStorage.setItem('musicPlaying', 'false');
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe timeline cards
    const timelineCards = document.querySelectorAll('.timeline-card');
    timelineCards.forEach(card => observer.observe(card));

    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(element => observer.observe(element));
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    // Update confetti canvas size if needed
    if (confettiCanvas && confettiCanvas.width > 0) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c💖 Happy Valentine\'s Day! 💖', 'color: #ff4081; font-size: 24px; font-weight: bold;');
console.log('%cMade with love ❤️', 'color: #ff1744; font-size: 16px;');

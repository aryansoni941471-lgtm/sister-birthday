window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error("Global Error:", msg, lineNo, error);
    alert("System Error: " + msg + " at line " + lineNo);
    return false;
};

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- ENTERTAINMENT FEATURES ---

// Global click debugger removed

// 1. Fingerprint Scanner (5-Click Unlock)
const fpBtn = document.getElementById('fingerprint-btn');
const fpOverlay = document.getElementById('fingerprint-overlay');
const scanLogs = document.getElementById('auth-logs');
const clickCounter = document.getElementById('click-counter');

let clicks = 0;
let isUnlocking = false;

const scanMessages = [
    "Checking attitude levels... VERY HIGH 📈",
    "Scanning face... ERROR: Too much makeup detected 🤡",
    "Verifying age... 28? Oh god, you're getting old! 👵",
    "DNA Match: Haan meri hi Didi hai... unfortunately 🙄",
    "Fine, I'll let you in. Happy Birthday! 🎉"
];

function handleFpClick(e) {
    if(e.cancelable) e.preventDefault();
    if (isUnlocking) return;
    
    clicks++;
    clickCounter.innerText = `${clicks} / 5`;
    
    // Tiny animation on click
    gsap.fromTo(fpBtn, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(1.5)" });
    fpBtn.classList.add('scanning');
    
    if (clicks < 5) {
        scanLogs.innerHTML = `<p>> ${scanMessages[clicks-1]}</p>`;
    }
    
    if (clicks >= 5) {
        isUnlocking = true;
        scanLogs.innerHTML = `<p style="color:var(--neon-green)">> ${scanMessages[4]}</p>`;
        clickCounter.style.color = "var(--neon-green)";
        clickCounter.innerText = "UNLOCKED";
        
        setTimeout(() => {
            gsap.to(fpOverlay, {opacity: 0, duration: 1, onComplete: () => {
                fpOverlay.style.pointerEvents = 'none';
                fpOverlay.style.display = 'none';
                if (isPlayerReady && !isPlaying) {
                    ytPlayer.playVideo();
                }
            }});
        }, 800);
    }
}

fpBtn.addEventListener('mousedown', handleFpClick);
fpBtn.addEventListener('touchstart', handleFpClick);
// Scroll indicator click
const scrollIndicator = document.getElementById('scroll-indicator');
if(scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.getElementById('gallery-pin').scrollIntoView({ behavior: 'smooth' });
    });
}

// 2. DO NOT CLICK Roast Button
const roastBtn = document.getElementById('roast-btn');
const roastToast = document.getElementById('roast-toast');
const roasts = [
    "Ek baar mein baat samajh kyu nahi aati aapko? 🙄",
    "Bachpan ki tarah aaj bhi har cheez mein ungli karni hai! 😂",
    "WARNING: Clicking this button reduces your brain cells. 🧠📉",
    "Aise click kar rahi ho jaise sale mein free kapde mil rahe ho! 🛍️",
    "Agar dubara click kiya toh party mein gift nahi dunga! 🎁❌",
    "Waise 28 ki ho gayi ho, thodi samjhdaari dikhao ab! 👵",
    "Ab screen band ho jayegi... Just kidding! 😜"
];
let roastIndex = 0;

function showRoast(msg) {
    roastToast.innerText = msg;
    roastToast.classList.remove('hidden');
    roastToast.classList.add('show');
    setTimeout(() => {
        roastToast.classList.remove('show');
        setTimeout(() => roastToast.classList.add('hidden'), 300);
    }, 3500);
}

roastBtn.addEventListener('click', () => {
    showRoast(roasts[roastIndex]);
    roastIndex = (roastIndex + 1) % roasts.length;
    
    // Annoyingly move the button away
    roastBtn.style.top = Math.random() * 70 + 10 + 'vh';
    roastBtn.style.right = Math.random() * 70 + 10 + 'vw';
});

// Loader Logic
// Cover Page Logic
window.addEventListener('load', () => {
    const coverPage = document.getElementById('cover-page');
    const loader = document.getElementById('loader');
    const knifeElement = document.getElementById('knife-element');
    const ribbonBow = document.getElementById('ribbon-bow');
    const ribbonLeft = document.getElementById('ribbon-left');
    const ribbonRight = document.getElementById('ribbon-right');
    const giftLid = document.getElementById('gift-lid');
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const dragHint = document.getElementById('drag-hint');
    
    // Hide loader initially so it doesn't do anything weird behind the cover
    if (loader) loader.style.opacity = '1';

    if (knifeElement && giftBoxWrapper) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let xOffset = 0;
        let yOffset = 0;
        let isCut = false;
        
        // Pointer down
        knifeElement.addEventListener('pointerdown', (e) => {
            if (isCut) return;
            isDragging = true;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            knifeElement.style.transition = 'none';
            if (dragHint) dragHint.style.opacity = '0'; // hide hint on drag
        });
        
        // Pointer move
        window.addEventListener('pointermove', (e) => {
            if (!isDragging || isCut) return;
            e.preventDefault();
            
            xOffset = e.clientX - initialX;
            yOffset = e.clientY - initialY;
            
            knifeElement.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            
            // Collision detection
            const knifeRect = knifeElement.getBoundingClientRect();
            const boxRect = giftBoxWrapper.getBoundingClientRect();
            
            // Check if knife overlaps with the center of the gift box (where ribbon is)
            if (
                knifeRect.left < boxRect.right - 20 &&
                knifeRect.right > boxRect.left + 20 &&
                knifeRect.top < boxRect.bottom - 20 &&
                knifeRect.bottom > boxRect.top + 20
            ) {
                // Cut the ribbon!
                isCut = true;
                isDragging = false;
                
                // Play audio if ready
                if (typeof isPlayerReady !== 'undefined' && isPlayerReady && !isPlaying) {
                    try { ytPlayer.playVideo(); } catch(err) {}
                }
                
                // Animations
                knifeElement.style.transition = 'transform 0.5s, opacity 0.5s';
                knifeElement.style.transform = `translate(${xOffset}px, ${yOffset + 50}px) rotate(45deg)`;
                knifeElement.style.opacity = '0';
                
                if (ribbonLeft) ribbonLeft.classList.add('ribbon-cut-left');
                if (ribbonRight) ribbonRight.classList.add('ribbon-cut-right');
                if (ribbonBow) ribbonBow.classList.add('bow-fall');
                
                // Open box lid shortly after
                setTimeout(() => {
                    if (giftLid) giftLid.classList.add('lid-open');
                }, 400);
                
                // Transition to main site
                setTimeout(() => {
                    if (coverPage) coverPage.classList.add('glitching');
                    setTimeout(() => {
                        if (coverPage) coverPage.style.display = 'none';
                        startLoader();
                    }, 800);
                }, 1500);
            }
        }, { passive: false });
        
        // Pointer up
        window.addEventListener('pointerup', () => {
            if (!isDragging || isCut) return;
            isDragging = false;
            
            // Snap back if not cut
            xOffset = 0;
            yOffset = 0;
            knifeElement.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            knifeElement.style.transform = `translate(0px, 0px)`;
            if (dragHint) dragHint.style.opacity = '1';
        });
    } else {
        startLoader();
    }
});

function startLoader() {
    const loader = document.getElementById('loader');
    const fill = document.querySelector('.progress-fill');
    if (!loader || !fill) return;
    
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    
    // Fake progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initAnimations();
                    if (typeof isPlayerReady !== 'undefined' && isPlayerReady && !isPlaying) {
                        try { ytPlayer.playVideo(); } catch(e) {}
                    }
                }, 1000);
            }, 500);
        }
        fill.style.width = progress + '%';
    }, 100);
}

// Custom Cursor (Smooth Follow)
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Smooth glow follow
gsap.ticker.add(() => {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
});

// Hover effects
document.querySelectorAll('button, .holo-card, .cyber-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorGlow, { width: 60, height: 60, borderColor: '#00f3ff', duration: 0.3 });
        gsap.to(cursorDot, { scale: 0, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorGlow, { width: 40, height: 40, borderColor: 'rgba(255, 42, 117, 0.5)', duration: 0.3 });
        gsap.to(cursorDot, { scale: 1, duration: 0.3 });
    });
});

// Global Canvas Background (Starfield/Cyber Particles)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y += this.speedY;
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 150; i++) {
    particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Music Toggle (YouTube Player)
const musicToggle = document.getElementById('music-toggle');
let ytPlayer;
let sfxPlayer;
let isPlaying = false;
let isPlayerReady = false;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: 'i2ceSzs2y4Q',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'loop': 1,
            'playlist': 'i2ceSzs2y4Q',
            'playsinline': 1
        },
        events: {
            'onReady': () => { 
                isPlayerReady = true; 
                ytPlayer.playVideo(); 
            },
            'onStateChange': onPlayerStateChange
        }
    });

    sfxPlayer = new YT.Player('yt-sfx-player', {
        height: '0',
        width: '0',
        videoId: 'RNmQeOKLp4k',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'playsinline': 1
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        gsap.to(musicToggle, { borderColor: 'var(--neon-blue)', boxShadow: '0 0 15px var(--neon-blue)' });
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        gsap.to(musicToggle, { borderColor: 'var(--glass-border)', boxShadow: 'none' });
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent global interact from firing
    if (!isPlayerReady) {
        console.warn("Music player not ready");
        return;
    }
    
    if (isPlaying) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
});

// Fallback for browsers that block autoplay: Play on first interaction
const playOnInteract = () => {
    if (isPlayerReady && !isPlaying) {
        ytPlayer.playVideo();
    }
    document.removeEventListener('click', playOnInteract);
    document.removeEventListener('scroll', playOnInteract);
};
document.addEventListener('click', playOnInteract, { once: true });
document.addEventListener('scroll', playOnInteract, { once: true });

// --- GSAP ANIMATIONS ---
function initAnimations() {
    
    // Hero Elements
    gsap.from('.fade-up-elem', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });

    // Gallery Horizontal Scroll (Pinning)
    const galleryTrack = document.querySelector('.horizontal-scroll-track');
    
    // Calculate total scroll distance based on container width vs viewport
    let scrollWidth = galleryTrack.offsetWidth - window.innerWidth + 200;

    gsap.to(galleryTrack, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
            trigger: "#gallery-pin",
            pin: true,
            scrub: 1,
            end: () => "+=" + scrollWidth,
            onUpdate: (self) => {
                // Thoda thoda party bomber while scrolling gallery
                if (Math.abs(self.getVelocity()) > 50 && Math.random() > 0.85) {
                    confetti({
                        particleCount: 4,
                        spread: 50,
                        startVelocity: 30,
                        origin: { x: Math.random(), y: Math.random() * 0.3 },
                        colors: ['#ff2a75', '#00f3ff', '#ffd700'],
                        zIndex: 9999
                    });
                }
            }
        }
    });

    // Reveal Text (Titles)
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 80%"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        });
    });

    // Cyber Cards Stagger
    gsap.from('.cyber-card', {
        scrollTrigger: {
            trigger: "#reasons",
            start: "top 70%"
        },
        y: 50,
        opacity: 0,
        rotationX: -20,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Hologram Cake Animation Trigger
    gsap.from('.holo-cake-container', {
        scrollTrigger: {
            trigger: "#cake-section",
            start: "top 60%"
        },
        scale: 0.5,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
    });
}

// Typewriter / Terminal Decrypt Effect
const letterText = `> INITIALIZING SECURE CONNECTION...
> IDENTITY CONFIRMED: ELDER SISTER.
> DECRYPTING MESSAGE...

My Dearest Didi,

From the very beginning, you have been my shield, my guide, and my biggest inspiration. Even as we level up in the game of life, some things never change—like how much I look up to you.

You are the strongest, most compassionate person I know. Today we celebrate you reaching Level 28. May this next chapter be filled with epic victories and endless joy.

Keep glowing. Keep winning.`;

const typeWriterElement = document.getElementById('typewriter-text');
const sigElement = document.querySelector('.hidden-sig');
let typeIndex = 0;
let isTyping = false;

function typeTerminal() {
    if (typeIndex < letterText.length) {
        let char = letterText.charAt(typeIndex);
        typeWriterElement.innerHTML += char === '\n' ? '<br>' : char;
        typeIndex++;
        // Random typing speed for realism
        let speed = Math.random() * 30 + 10;
        setTimeout(typeTerminal, speed);
    } else {
        gsap.to(sigElement, { opacity: 1, duration: 1, delay: 0.5 });
    }
}

ScrollTrigger.create({
    trigger: "#letter",
    start: "top 60%",
    onEnter: () => {
        if(!isTyping) {
            isTyping = true;
            setTimeout(typeTerminal, 1000);
        }
    }
});

// Cake Ignite (Celebration Protocol)
const igniteBtn = document.getElementById('ignite-btn');
igniteBtn.addEventListener('click', () => {
    try {
        if(!isPlaying && isPlayerReady) {
            try { ytPlayer.playVideo(); } catch(e) { console.error(e); }
        }

        try { gsap.to('.neon-number', { scale: 1.5, color: '#ff2a75', textShadow: '0 0 30px #ff2a75', duration: 0.5, yoyo: true, repeat: 3 }); } catch(e) { console.error("gsap error:", e); }
        
        igniteBtn.innerHTML = "PROTOCOL INITIATED";
        igniteBtn.disabled = true;
        try { gsap.to(igniteBtn, { borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }); } catch(e) {}

    // YouTube SFX Sound Effect
    try {
        if (typeof sfxPlayer !== 'undefined' && sfxPlayer.playVideo) {
            sfxPlayer.unMute();
            sfxPlayer.setVolume(100);
            sfxPlayer.seekTo(0);
            sfxPlayer.playVideo();
        }
    } catch(e) { console.error(e); }

    // Neon Confetti - Extreme Burst (Screen Fully Covered)
    var duration = 7000; // 7 seconds of madness
    var end = Date.now() + duration;

    (function frame() {
        // Left Cannon
        confetti({
            particleCount: 30,
            angle: 60,
            spread: 120,
            startVelocity: 70,
            origin: { x: -0.1, y: Math.random() * 0.4 + 0.4 },
            colors: ['#ff2a75', '#00f3ff', '#ffd700', '#ffffff', '#ff0000']
        });
        // Right Cannon
        confetti({
            particleCount: 30,
            angle: 120,
            spread: 120,
            startVelocity: 70,
            origin: { x: 1.1, y: Math.random() * 0.4 + 0.4 },
            colors: ['#ff2a75', '#00f3ff', '#ffd700', '#ffffff', '#ff0000']
        });
        // Top Shower
        confetti({
            particleCount: 20,
            angle: 270,
            spread: 150,
            startVelocity: 40,
            origin: { x: Math.random(), y: -0.1 },
            colors: ['#ff2a75', '#00f3ff', '#ffd700', '#ffffff', '#ff0000']
        });
        // Random Center Burst
        confetti({
            particleCount: 15,
            angle: Math.random() * 360,
            spread: 180,
            startVelocity: 30,
            origin: { x: Math.random(), y: Math.random() * 0.5 },
            colors: ['#ff2a75', '#00f3ff', '#ffd700']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        } else {
            // Unlock final surprise button via T&C
            const tncContainer = document.getElementById('tnc-container');
            const unlockBtn = document.getElementById('unlock-btn');
            
            tncContainer.classList.remove('hidden');
            unlockBtn.classList.remove('hidden');
            
            gsap.fromTo(tncContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
            gsap.fromTo(unlockBtn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
            
            document.querySelector('.auth-text').innerText = "AUTHORIZATION GRANTED. PLEASE ACCEPT T&C.";
            document.querySelector('.scan-line-lock').style.animation = "none";
            document.querySelector('.cyber-lock').style.color = "var(--neon-blue)";
        }
    }());
    } catch(err) {
        alert("Error in igniteBtn click: " + err.message);
    }
});

// T&C Validation Logic
const tnc1 = document.getElementById('tnc-1');
const tnc2 = document.getElementById('tnc-2');

[tnc1, tnc2].forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        if (!e.target.checked) {
            alert("Error: You cannot deny the universal truth!");
            e.target.checked = true;
        }
    });
});

// Final Unlock Surprise - EPIC HACKER VERSION
const unlockBtn = document.getElementById('unlock-btn');
unlockBtn.addEventListener('click', () => {
    
    if (!tnc1.checked || !tnc2.checked) {
        alert("Please accept the Terms & Conditions first!");
        return;
    }
    
    // 1. Lock animation
    const lockIcon = document.querySelector('#main-lock i');
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-spinner', 'fa-spin');
    lockIcon.style.color = '#00f3ff';
    document.querySelector('.auth-text').innerText = "BYPASSING SECURITY...";
    unlockBtn.style.display = 'none';

    setTimeout(() => {
        // 2. Show Terminal Overlay
        const terminalOverlay = document.createElement('div');
        terminalOverlay.className = 'terminal-overlay active';
        terminalOverlay.innerHTML = `
            <div class="terminal-content">
                <div class="terminal-header">
                    <span class="red-dot"></span>
                    <span class="yellow-dot"></span>
                    <span class="green-dot"></span>
                    <span class="terminal-title">bash - root@mainframe:~</span>
                </div>
                <div id="terminal-logs" class="terminal-logs"></div>
            </div>
        `;
        document.body.appendChild(terminalOverlay);
        
        const logsContainer = terminalOverlay.querySelector('#terminal-logs');
        
        const logs = [
            "INITIATING OVERRIDE PROTOCOL...",
            "BYPASSING FIREWALL... [SUCCESS]",
            "ACCESSING MAINFRAME ENCRYPTION...",
            "BRUTE-FORCING KEYS...",
            "KEY FOUND: 0x98AF32_DIDI",
            "DECRYPTING SECTOR 1... DONE",
            "DECRYPTING SECTOR 2... DONE",
            "DOWNLOADING SURPRISE PAYLOAD (100%)",
            "SYSTEM UNLOCKED.",
            "DEPLOYING IN 3...",
            "DEPLOYING IN 2...",
            "DEPLOYING IN 1..."
        ];

        let logIndex = 0;
        
        function typeLog() {
            if (logIndex < logs.length) {
                const p = document.createElement('p');
                p.innerText = "> " + logs[logIndex];
                logsContainer.appendChild(p);
                logsContainer.scrollTop = logsContainer.scrollHeight; // Auto-scroll
                
                logIndex++;
                let delay = Math.random() * 150 + 50;
                if (logIndex >= logs.length - 3) delay = 700; // Countdown slower
                setTimeout(typeLog, delay);
            } else {
                // Flash white and explode
                gsap.to(terminalOverlay, { opacity: 0, duration: 0.2, onComplete: () => {
                    terminalOverlay.remove();
                    executeFinalReveal();
                }});
            }
        }
        
        setTimeout(typeLog, 500);

    }, 1000);
});

function executeFinalReveal() {
    // Hide unlock container entirely
    document.querySelector('.unlock-container').style.display = 'none';
        
    const finalCore = document.getElementById('final-message');
    finalCore.classList.remove('hidden');
    
    // Screen Flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = 0; flash.style.left = 0; flash.style.width = '100vw'; flash.style.height = '100vh';
    flash.style.backgroundColor = 'white';
    flash.style.zIndex = 99999;
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    gsap.to(flash, { opacity: 0, duration: 1, onComplete: () => flash.remove() });

    const h1 = finalCore.querySelector('h1');
    const p = finalCore.querySelector('p');
    const finalPhoto = finalCore.querySelector('.final-photo');
    const originalH1 = "I LOVE YOU, DIDI.";
    const originalP = "PROUD TO BE YOUR BROTHER.";
    
    gsap.fromTo(finalCore, 
        { scale: 0.5, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );
    
    if (finalPhoto) {
        finalPhoto.classList.remove('hidden');
        gsap.fromTo(finalPhoto, 
            { scale: 0, rotation: -10, opacity: 0 }, 
            { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.2)', delay: 0.5 }
        );
    }
    
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
    let iter = 0;
    
    const interval = setInterval(() => {
        h1.innerText = originalH1.split("").map((letter, index) => {
            if(index < iter) return originalH1[index];
            return letter === " " ? " " : letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        
        p.innerText = originalP.split("").map((letter, index) => {
            if(index < iter - 5) return originalP[index]; 
            if(index > iter + 15) return "";
            return letter === " " ? " " : letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        
        if(iter >= Math.max(originalH1.length, originalP.length + 5)) {
            clearInterval(interval);
            h1.innerText = originalH1;
            p.innerText = originalP;
            h1.classList.add('glitch');
            h1.setAttribute('data-text', originalH1);
            
            // Massive Fireworks Matrix style
            var count = 500;
            var defaults = { origin: { y: 0.7 } };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio),
                    colors: ['#ff2a75', '#00f3ff', '#ffffff', '#ffbd2e']
                }));
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
        iter += 0.5; // Even faster scramble
    }, 20);
}

// --- COMEDY FEATURES ---

// 1. Truth Section (Running NO Button)
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const truthResult = document.getElementById('truth-result');
const truthContainer = document.querySelector('.truth-buttons');

function moveBtnNo(e) {
    if (e && e.cancelable) e.preventDefault();
    const maxX = window.innerWidth - btnNo.offsetWidth - 20;
    const maxY = window.innerHeight - btnNo.offsetHeight - 20;
    
    btnNo.style.position = 'fixed';
    btnNo.style.left = Math.max(20, Math.random() * maxX) + 'px';
    btnNo.style.top = Math.max(20, Math.random() * maxY) + 'px';
    btnNo.style.zIndex = 9999;
}

btnNo.addEventListener('mouseover', moveBtnNo);
btnNo.addEventListener('touchstart', moveBtnNo);
btnNo.addEventListener('click', moveBtnNo);

btnYes.addEventListener('click', () => {
    try {
        btnNo.style.display = 'none';
        btnYes.style.display = 'none';
        truthResult.classList.remove('hidden');
        gsap.from(truthResult, {scale: 0, duration: 0.5, ease: 'back.out(1.5)'});
    } catch (err) {
        alert("Error in btnYes: " + err.message);
    }
});

// 2. Claim Gift (Fake BSOD)
const claimGiftBtn = document.getElementById('claim-gift-btn');
const bsodOverlay = document.getElementById('bsod-overlay');

claimGiftBtn.addEventListener('click', () => {
    bsodOverlay.classList.remove('hidden');
    let percent = 0;
    const percEl = bsodOverlay.querySelector('.bsod-percentage');
    
    const bsodInterval = setInterval(() => {
        percent += Math.floor(Math.random() * 20);
        if (percent > 100) percent = 100;
        percEl.innerText = `${percent}% complete`;
        
        if (percent >= 100) {
            clearInterval(bsodInterval);
            setTimeout(() => {
                bsodOverlay.classList.add('hidden');
                claimGiftBtn.innerText = "JUST KIDDING 😂";
                claimGiftBtn.disabled = true;
                gsap.to(claimGiftBtn, { borderColor: 'var(--text-muted)', color: 'var(--text-muted)' });
            }, 1000);
        }
    }, 500);
});

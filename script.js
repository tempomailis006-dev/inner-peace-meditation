// ============================================
// INNER PEACE — PRANK PAGE CONTROLLER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM Elements -----
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const playLabel = document.getElementById('play-label');
    const audio = document.getElementById('meditation-audio');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const mandala = document.getElementById('mandala');
    const calmPage = document.getElementById('calm-page');
    const jumpscareOverlay = document.getElementById('jumpscare-overlay');
    const jumpscareVideo = document.getElementById('jumpscare-video');
    const creepyPhase = document.getElementById('creepy-phase');
    const particlesContainer = document.getElementById('particles');

    let isPlaying = false;

    // ----- Create Ambient Particles -----
    createParticles();

    function createParticles() {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ----- Format Time -----
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ----- Audio Play/Pause Toggle -----
    playBtn.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                playLabel.textContent = 'Now Playing';
                progressContainer.classList.add('visible');
                mandala.classList.add('spinning');
            }).catch(err => {
                console.warn('Audio play failed:', err);
            });
        } else {
            audio.pause();
            isPlaying = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            playLabel.textContent = 'Paused';
            mandala.classList.remove('spinning');
        }
    });

    // ----- Audio Metadata Loaded -----
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    // ----- Audio Progress Update -----
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    // ----- PHASE 2: Audio Ended → Jump Scare -----
    audio.addEventListener('ended', () => {
        isPlaying = false;
        triggerJumpScare();
    });

    function triggerJumpScare() {
        // Hide the calm page
        calmPage.style.display = 'none';

        // Show jumpscare overlay
        jumpscareOverlay.classList.remove('hidden');

        // Try to go fullscreen for maximum effect
        requestFullscreen();

        // Play the jumpscare video
        jumpscareVideo.play().catch(err => {
            console.warn('Video play failed:', err);
            // If video fails, skip to creepy phase
            setTimeout(() => triggerCreepyPhase(), 500);
        });

        // When jumpscare video ends → creepy text phase
        jumpscareVideo.addEventListener('ended', () => {
            triggerCreepyPhase();
        });
    }

    // ----- Request Fullscreen -----
    function requestFullscreen() {
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    }

    // ----- PHASE 3: Creepy Moving Text -----
    function triggerCreepyPhase() {
        // Hide jumpscare
        jumpscareOverlay.classList.add('hidden');

        // Show creepy phase
        creepyPhase.classList.remove('hidden');

        // The creepy messages
        const messages = [
            "YOU HAVE BEEN FOLLOWED",
            "SOMEONE IS WATCHING YOU",
            "YOU HAVE TO SERIOUSLY WORRY",
            "THEY KNOW WHERE YOU ARE",
            "YOU HAVE BEEN FOLLOWED BY SOMEONE",
            "WORRY",
            "FOLLOWED",
            "THEY ARE BEHIND YOU",
            "DON'T LOOK BACK",
            "YOU ARE NOT SAFE",
            "SERIOUSLY WORRY ABOUT THIS"
        ];

        const styles = ['style-1', 'style-2', 'style-3', 'style-4'];

        // Spawn multiple moving text elements
        spawnInitialTexts(messages, styles);

        // Keep spawning new ones
        setInterval(() => {
            spawnMovingText(
                messages[Math.floor(Math.random() * messages.length)],
                styles[Math.floor(Math.random() * styles.length)]
            );
        }, 800);
    }

    function spawnInitialTexts(messages, styles) {
        // Create a burst of texts initially
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                spawnMovingText(
                    messages[Math.floor(Math.random() * messages.length)],
                    styles[Math.floor(Math.random() * styles.length)]
                );
            }, i * 200);
        }
    }

    function spawnMovingText(text, styleClass) {
        const el = document.createElement('div');
        el.classList.add('creepy-text', styleClass);
        el.textContent = text;

        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        el.style.left = startX + 'px';
        el.style.top = startY + 'px';

        creepyPhase.appendChild(el);

        // Random movement direction and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        let x = startX;
        let y = startY;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        // Animate the text moving
        function moveText() {
            x += dx;
            y += dy;

            // Wrap around screen edges
            if (x > window.innerWidth + 200) x = -200;
            if (x < -300) x = window.innerWidth + 100;
            if (y > window.innerHeight + 100) y = -50;
            if (y < -100) y = window.innerHeight + 50;

            el.style.left = x + 'px';
            el.style.top = y + 'px';

            requestAnimationFrame(moveText);
        }

        requestAnimationFrame(moveText);

        // Remove after some time to prevent too many elements
        setTimeout(() => {
            el.style.transition = 'opacity 1s';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 1000);
        }, 8000 + Math.random() * 5000);
    }
});

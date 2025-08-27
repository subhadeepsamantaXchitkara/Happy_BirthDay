document.addEventListener('DOMContentLoaded', function() {
    // --- EDIT BIRTHDAY DATE HERE ---
    // Format: 'Month Day, Year' (e.g., 'January 1, 2025')
    const birthdayDate = 'August 28, 2025';

    // --- COUNTDOWN TIMER LOGIC ---
    function updateCountdown() {
        const now = new Date();
        let nextBirthday = new Date(birthdayDate);

        // If the birthday has passed this year, set it to next year
        if (now > nextBirthday) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }

        const totalSeconds = (nextBirthday - now) / 1000;

        const days = Math.floor(totalSeconds / 3600 / 24);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds) % 60;

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // --- FADE-IN ANIMATION ON SCROLL ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- CONFETTI AND MUSIC LOGIC ---
    const surpriseBtn = document.getElementById('surprise-btn');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    // Get the audio element from the HTML
    const birthdaySong = document.getElementById('birthday-song'); 
    let confettiPieces = [];
    const numberOfPieces = 200;
    const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createConfetti() {
        confettiPieces = [];
        for (let i = 0; i < numberOfPieces; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: -Math.random() * canvas.height, // Start above the screen
                size: Math.random() * 8 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 5 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
        });
    }

    function updateConfetti() {
        confettiPieces.forEach(piece => {
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += piece.rotationSpeed;
            if (piece.y > canvas.height) {
                // Reset piece to the top
                piece.y = -20;
                piece.x = Math.random() * canvas.width;
            }
        });
    }

    let animationFrameId;
    function animateConfetti() {
        updateConfetti();
        drawConfetti();
        animationFrameId = requestAnimationFrame(animateConfetti);
    }

    // This function runs when the "Celebrate!" button is clicked
    surpriseBtn.addEventListener('click', () => {
        // --- THIS IS THE FIX ---
        // These two lines find the audio and play it.
        birthdaySong.currentTime = 0; // Rewind to the start
        birthdaySong.play();

        // Start the confetti
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        resizeCanvas();
        createConfetti();
        animateConfetti();
        
        // Stop confetti after some time
        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 8000); // Stop after 8 seconds
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial size set
});

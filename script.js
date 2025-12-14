const canvas = document.getElementById('timer-canvas');
const ctx = canvas.getContext('2d');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

let countdown;
let totalSeconds = 0;
let initialTotalSeconds = 0;
let wakeLock = null;

// Function to request a wake lock
const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen Wake Lock is active.');
            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock was released.');
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    }
};

// Function to release the wake lock
const releaseWakeLock = () => {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
    }
};

function resizeCanvas() {
    const container = document.querySelector('.timer-container');
    const size = container.offsetWidth;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    drawCircle(1); // Redraw the circle after resizing
}

function drawCircle(percentage) {
    const radius = canvas.width / (2 * (window.devicePixelRatio || 1)) - 10;
    const center = canvas.width / (2 * (window.devicePixelRatio || 1));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Foreground circle
    ctx.beginPath();
    ctx.arc(center, center, radius, -0.5 * Math.PI, (2 * Math.PI * percentage) - 0.5 * Math.PI);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Text
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    ctx.fillStyle = '#ffffff';
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, center, center);
}

function startTimer() {
    if (totalSeconds <= 0) {
        totalSeconds = (parseInt(minutesInput.value) * 60 || 0) + (parseInt(secondsInput.value) || 0);
        initialTotalSeconds = totalSeconds;
    }

    if (totalSeconds > 0) {
        requestWakeLock();
        clearInterval(countdown);
        countdown = setInterval(() => {
            totalSeconds--;
            const percentage = totalSeconds / initialTotalSeconds;
            drawCircle(percentage);
            if (totalSeconds <= 0) {
                clearInterval(countdown);
                releaseWakeLock();
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(countdown);
    releaseWakeLock();
}

function resetTimer() {
    clearInterval(countdown);
    totalSeconds = (parseInt(minutesInput.value) * 60 || 0) + (parseInt(secondsInput.value) || 0);
    initialTotalSeconds = totalSeconds;
    drawCircle(1);
    releaseWakeLock();
}

// Listen for visibility changes
document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();

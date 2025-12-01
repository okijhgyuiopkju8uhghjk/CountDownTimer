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

function drawCircle(percentage) {
    const radius = canvas.width / 2 - 10;
    const center = canvas.width / 2;

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
        clearInterval(countdown);
        countdown = setInterval(() => {
            totalSeconds--;
            const percentage = totalSeconds / initialTotalSeconds;
            drawCircle(percentage);
            if (totalSeconds <= 0) {
                clearInterval(countdown);
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(countdown);
}

function resetTimer() {
    clearInterval(countdown);
    totalSeconds = (parseInt(minutesInput.value) * 60 || 0) + (parseInt(secondsInput.value) || 0);
    initialTotalSeconds = totalSeconds;
    drawCircle(1);
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial draw
drawCircle(1);

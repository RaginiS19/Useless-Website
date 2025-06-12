// Fake data and state
let productivityScore = 0;
let meetingSeconds = 0;
let meetingInterval;
let panicMode = false;

const corporateTasks = [
    "Optimize blockchain deliverables",
    "Refactor legacy paradigms",
    "Disrupt supply chain matrices",
    "Leverage agile frameworks",
    "Run time-wasting team retrospectives",
    "Brainstorm synergetic KPI disruption"
];

// Initialize Chart.js
const ctx = document.getElementById('productivityChart').getContext('2d');
const productivityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
            label: 'Fake Productivity',
            data: [10, 30, 25, 50, 40],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.formattedValue}%`
                }
            }
        },
        scales: {
            y: {
                suggestedMax: 150,
                ticks: {
                    stepSize: 25
                }
            }
        }
    }
});

// DOM elements
const scoreElement = document.getElementById('score');
const taskProgress = document.getElementById('taskProgress');
const progressText = document.getElementById('progressText');
const meetingProgress = document.getElementById('meetingProgress');
const meetingText = document.getElementById('meetingText');
const taskList = document.getElementById('taskList');
const completeTaskBtn = document.getElementById('completeTask');
const startMeetingBtn = document.getElementById('startMeeting');
const addTaskBtn = document.getElementById('addTask');
const generateReportBtn = document.getElementById('generateReport');
const panicModeBtn = document.getElementById('panicMode');

// Task Simulator
completeTaskBtn.addEventListener('click', () => {
    completeTaskBtn.disabled = true;

    const randomProgress = 10 + Math.floor(Math.random() * 30);
    const currentWidth = parseInt(taskProgress.style.width) || 0;
    const newWidth = Math.min(currentWidth + randomProgress, 100);

    animateProgress(taskProgress, currentWidth, newWidth, progressText, '%', () => {
        updateScore(randomProgress);
        updateChart();
        completeTaskBtn.disabled = false;
    });
});

// Meeting Tracker
startMeetingBtn.addEventListener('click', () => {
    if (meetingInterval) {
        clearInterval(meetingInterval);
        meetingInterval = null;
        startMeetingBtn.textContent = "Start Fake Meeting";
        meetingProgress.style.width = '0%';
    } else {
        meetingSeconds = 0;
        meetingInterval = setInterval(updateMeetingTimer, 1000);
        startMeetingBtn.textContent = "End Meeting";
        meetingProgress.style.width = '100%';
    }
});

// Add Task
addTaskBtn.addEventListener('click', () => {
    const newTask = corporateTasks[Math.floor(Math.random() * corporateTasks.length)];
    const li = document.createElement('li');
    li.textContent = newTask;
    li.style.opacity = '0';
    taskList.appendChild(li);

    setTimeout(() => {
        li.style.transition = 'opacity 0.4s ease-in-out';
        li.style.opacity = '1';
    }, 10);

    updateScore(5);
});

// Generate Report
generateReportBtn.addEventListener('click', () => {
    updateScore(15);
    updateChart();
    showTemporaryAlert("📄 Generated 27-page report!<br>(No one will read it.)", 3000);
});

// Panic Mode
panicModeBtn.addEventListener('click', () => {
    panicMode = !panicMode;
    document.body.style.backgroundColor = panicMode ? "#ffcccc" : "#f7f9fc";

    if (panicMode) {
        showTemporaryAlert("🚨 ACTIVATING PANIC MODE!<br>Quick, Alt+Tab to Excel!", 2500);
    }
});

// Score + Chart logic
function updateMeetingTimer() {
    meetingSeconds++;
    const hours = Math.floor(meetingSeconds / 3600);
    const minutes = Math.floor((meetingSeconds % 3600) / 60);
    const seconds = meetingSeconds % 60;

    meetingText.textContent =
        (hours > 0 ? hours.toString().padStart(2, '0') + ':' : '') +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0');

    updateScore(1);
}

function updateScore(points) {
    productivityScore = Math.min(productivityScore + points, 150);
    scoreElement.textContent = productivityScore;
}

function updateChart() {
    productivityChart.data.datasets[0].data = [
        Math.min(100, productivityScore - 40),
        Math.min(100, productivityScore - 20),
        Math.min(100, productivityScore - 10),
        Math.min(100, productivityScore + 5),
        Math.min(100, productivityScore)
    ];
    productivityChart.update();
}

// Smooth Progress Fill Animation
function animateProgress(bar, from, to, label, unit = '%', callback) {
    let current = from;
    const increment = (to - from) / 20;

    const step = () => {
        current += increment;
        if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
            current = to;
            bar.style.width = `${to}%`;
            label.textContent = `${Math.round(to)}${unit}`;
            if (callback) callback();
        } else {
            bar.style.width = `${current}%`;
            label.textContent = `${Math.round(current)}${unit}`;
            requestAnimationFrame(step);
        }
    };
    step();
}

// Reusable Toast/Alert UI
function showTemporaryAlert(message, duration = 2000) {
    const alert = document.createElement('div');
    alert.innerHTML = message;
    alert.style.position = 'fixed';
    alert.style.bottom = '40px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.background = '#2c3e50';
    alert.style.color = '#fff';
    alert.style.padding = '12px 20px';
    alert.style.borderRadius = '8px';
    alert.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    alert.style.zIndex = 9999;
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s ease-in-out';

    document.body.appendChild(alert);

    requestAnimationFrame(() => {
        alert.style.opacity = '1';
    });

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

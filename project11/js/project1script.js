// Mock data for demonstration
const mockData = {
    steps: 8547,
    calories: 1234,
    activeMinutes: 67,
    workouts: 3,
    weeklyProgress: [6500, 7200, 8000, 7500, 8200, 8547, 9000]
};

// Update stats
function updateStats() {
    document.getElementById('steps').textContent = mockData.steps.toLocaleString();
    document.getElementById('calories').textContent = mockData.calories.toLocaleString();
    document.getElementById('active-minutes').textContent = mockData.activeMinutes;
    document.getElementById('workouts-count').textContent = mockData.workouts;
}

// Simple chart implementation
function drawChart() {
    const canvas = document.getElementById('progressChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart settings
    const data = mockData.weeklyProgress;
    const maxValue = Math.max(...data);
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;

    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 40);
        const x = index * (barWidth + barSpacing) + barSpacing / 2;
        const y = height - barHeight - 20;

        // Bar
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();

    // Day labels
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach((day, index) => {
        const x = index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2;
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(day, x, height - 5);
    });
}

// Add workout functionality
document.getElementById('add-workout-btn').addEventListener('click', function() {
    alert('Add New Workout functionality would open a modal or navigate to a form page.');
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    drawChart();
});

// Simulate real-time updates (for demo purposes)
setInterval(() => {
    mockData.steps += Math.floor(Math.random() * 10);
    mockData.calories += Math.floor(Math.random() * 5);
    updateStats();
}, 5000);

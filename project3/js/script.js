// Mock data for demonstration
const mockData = {
    metrics: [
        { label: 'Total Users', value: 12543, change: 12.5, changeType: 'positive' },
        { label: 'Revenue', value: 45678, change: -2.3, changeType: 'negative' },
        { label: 'Conversion Rate', value: 3.24, change: 8.7, changeType: 'positive' },
        { label: 'Active Sessions', value: 8921, change: 15.2, changeType: 'positive' }
    ],
    chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            { label: 'Revenue', data: [12000, 15000, 18000, 14000, 22000, 25000], color: '#6f42c1' },
            { label: 'Users', data: [8000, 9500, 11000, 10500, 13000, 14500], color: '#28a745' }
        ]
    },
    tableData: [
        { name: 'John Doe', email: 'john@example.com', status: 'Active', lastLogin: '2023-12-01' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', lastLogin: '2023-11-28' },
        { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', lastLogin: '2023-12-02' },
        { name: 'Alice Brown', email: 'alice@example.com', status: 'Active', lastLogin: '2023-11-30' },
        { name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Inactive', lastLogin: '2023-11-25' }
    ]
};

// DOM elements
const metricCards = document.querySelectorAll('.metric-card');
const chartCanvas = document.getElementById('mainChart');
const dataTableBody = document.querySelector('tbody');
const dateFilter = document.getElementById('date-filter');
const metricFilter = document.getElementById('metric-filter');

// Initialize the dashboard
function init() {
    updateMetrics();
    drawChart();
    populateTable();
    setupEventListeners();
}

// Update metric cards
function updateMetrics() {
    mockData.metrics.forEach((metric, index) => {
        const card = metricCards[index];
        if (card) {
            const valueEl = card.querySelector('.value');
            const changeEl = card.querySelector('.change');

            valueEl.textContent = formatValue(metric.value, metric.label);
            changeEl.textContent = `${metric.change > 0 ? '+' : ''}${metric.change}%`;
            changeEl.className = `change ${metric.changeType}`;
        }
    });
}

// Format values based on metric type
function formatValue(value, label) {
    if (label.includes('Revenue')) {
        return `$${value.toLocaleString()}`;
    } else if (label.includes('Rate')) {
        return `${value}%`;
    } else {
        return value.toLocaleString();
    }
}

// Draw chart
function drawChart() {
    const ctx = chartCanvas.getContext('2d');
    const width = chartCanvas.width = chartCanvas.offsetWidth;
    const height = chartCanvas.height = chartCanvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const data = mockData.chartData;
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
    const barWidth = (width - 100) / data.labels.length / data.datasets.length;
    const groupSpacing = (width - 100) / data.labels.length;

    // Draw bars
    data.labels.forEach((label, labelIndex) => {
        data.datasets.forEach((dataset, datasetIndex) => {
            const value = dataset.data[labelIndex];
            const barHeight = (value / maxValue) * (height - 80);
            const x = 50 + labelIndex * groupSpacing + datasetIndex * barWidth;
            const y = height - barHeight - 30;

            ctx.fillStyle = dataset.color;
            ctx.fillRect(x, y, barWidth - 2, barHeight);

            // Value label
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 5);
        });
    });

    // Draw axes and labels
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // X-axis labels
    data.labels.forEach((label, index) => {
        const x = 50 + index * groupSpacing + (groupSpacing - barWidth * data.datasets.length) / 2;
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(label, x, height - 10);
    });

    // Legend
    data.datasets.forEach((dataset, index) => {
        const legendX = width - 150;
        const legendY = 50 + index * 25;

        ctx.fillStyle = dataset.color;
        ctx.fillRect(legendX, legendY - 10, 15, 15);

        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(dataset.label, legendX + 20, legendY);
    });
}

// Populate data table
function populateTable() {
    dataTableBody.innerHTML = '';
    mockData.tableData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.email}</td>
            <td><span class="status ${row.status.toLowerCase()}">${row.status}</span></td>
            <td>${row.lastLogin}</td>
        `;
        dataTableBody.appendChild(tr);
    });
}

// Setup event listeners
function setupEventListeners() {
    dateFilter.addEventListener('change', handleFilterChange);
    metricFilter.addEventListener('change', handleFilterChange);
}

// Handle filter changes
function handleFilterChange() {
    // In a real app, this would fetch new data based on filters
    console.log('Filters changed:', {
        date: dateFilter.value,
        metric: metricFilter.value
    });

    // Simulate data update
    updateMetrics();
    drawChart();
}

// Simulate real-time updates
setInterval(() => {
    // Randomly update metrics
    mockData.metrics.forEach(metric => {
        const change = (Math.random() - 0.5) * 0.1; // Small random change
        metric.value *= (1 + change);
        metric.change = (change * 100).toFixed(1);
        metric.changeType = change > 0 ? 'positive' : 'negative';
    });

    updateMetrics();
}, 10000); // Update every 10 seconds

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

import { loadConsoleMethods, setupPlayground } from './playgroundFunctions.js';

// Main entry point for playground

document.addEventListener('DOMContentLoaded', async () => {
  const methods = await loadConsoleMethods();
  setupPlayground(methods);

  // Chart.js setup (unchanged)
  const inspectionCtx = document
    .getElementById('inspectionChart')
    .getContext('2d');
  new Chart(inspectionCtx, {
    type: 'bar',
    data: {
      labels: ['Array Readability', 'Object Deep Dive'],
      datasets: [
        {
          label: 'console.table()',
          data: [95, 40],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
        {
          label: 'console.dir()',
          data: [50, 90],
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Primary Strengths of Inspection Tools',
          font: { size: 16 },
          color: '#333',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#666' },
        },
        x: { ticks: { color: '#666' } },
      },
    },
  });
});

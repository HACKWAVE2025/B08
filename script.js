// ====== GLOBAL VARIABLES ======
let barChart, pieChart;

// ====== RANDOM DATA GENERATOR ======
function generateBinData() {
  return {
    bins: ["Bin-A", "Bin-B", "Bin-C", "Bin-D", "Bin-E", "Bin-F"],
    fillLevels: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
    sectors: ["Sector A", "Sector B", "Sector C", "Sector D"],
    distribution: Array.from({ length: 4 }, () => Math.floor(Math.random() * 25) + 10)
  };
}

// ====== UPDATE SUMMARY CARDS ======
function updateSummary(binData) {
  const totalBins = binData.bins.length;
  const fullBins = binData.fillLevels.filter(level => level >= 80).length;
  const recycledPercent = Math.floor(Math.random() * 30) + 60;

  document.getElementById("totalBins").textContent = totalBins;
  document.getElementById("fullBins").textContent = fullBins;
  document.getElementById("recycledPercent").textContent = `${recycledPercent}%`;

  const now = new Date();
  document.getElementById("lastUpdated").textContent = now.toLocaleTimeString();

  // Trigger alert popup for full bins
  if (fullBins > 0) {
    showAlert(`${fullBins} bins are nearing full capacity!`);
  }
}

// ====== UPDATE BAR CHART ======
function updateBarChart(binData) {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: binData.bins,
      datasets: [{
        label: "Bin Fill Level (%)",
        data: binData.fillLevels,
        backgroundColor: binData.fillLevels.map(level =>
          level >= 80 ? "#ef5350" : "#42a5f5"
        ),
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutQuart" },
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });
}

// ====== UPDATE PIE CHART ======
function updatePieChart(binData) {
  const ctx = document.getElementById("pieChart").getContext("2d");
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: binData.sectors,
      datasets: [{
        data: binData.distribution,
        backgroundColor: ["#42a5f5", "#ef5350", "#66bb6a", "#ffb74d"],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      animation: { animateRotate: true, animateScale: true },
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// ====== UPDATE NOTIFICATIONS ======
function updateNotifications(binData) {
  const notificationList = document.getElementById("notificationList");
  notificationList.innerHTML = "";

  const fullBins = binData.bins.filter((_, i) => binData.fillLevels[i] >= 80);

  const notifications = [
    `🚛 Pickup scheduled for ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    fullBins.length > 0
      ? `⚠️ ${fullBins.join(", ")} nearing full capacity`
      : "✅ All bins below 80% capacity",
    `🧠 AI model refreshed successfully`,
    `♻️ Recycling efficiency: ${Math.floor(Math.random() * 20) + 70}%`
  ];

  notifications.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    notificationList.appendChild(li);
  });
}

// ====== UPDATE ROUTE ======
function updateRoute(binData) {
  const routeElement = document.getElementById("routeText");
  const fullBins = binData.bins.filter((_, i) => binData.fillLevels[i] >= 80);
  if (fullBins.length === 0) {
    routeElement.textContent = "✅ No bins require pickup currently.";
  } else {
    routeElement.textContent = `🗺️ Suggested Route → ${fullBins.join(" → ")} → Dump Yard`;
  }
}

// ====== ALERT POPUP ======
function showAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert-popup";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);

  // Animate in and out
  setTimeout(() => { alertBox.classList.add("show"); }, 100);
  setTimeout(() => { alertBox.classList.remove("show"); }, 4000);
  setTimeout(() => { alertBox.remove(); }, 4500);
}

// ====== REFRESH DASHBOARD ======
function refreshDashboard() {
  const binData = generateBinData();
  updateSummary(binData);
  updateBarChart(binData);
  updatePieChart(binData);
  updateNotifications(binData);
  updateRoute(binData);
}

// ====== AUTO REFRESH EVERY 30 SECONDS ======
function startAutoRefresh() {
  refreshDashboard(); // Initial
  setInterval(refreshDashboard, 30000); // every 30 seconds
}

// ====== INIT ======
window.onload = startAutoRefresh;

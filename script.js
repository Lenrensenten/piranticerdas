// Global variables to hold the chart instances
let soilMoistureChart = null;
let temperatureChart = null;
let humidityChart = null;

// Fungsi untuk mengontrol relay (menyalakan atau mematikan)
// Fungsi untuk mengatur mode otomatis/manual
function setAutoMode(isAuto) {
  const modeStatus = isAuto ? 1 : 0; // 1 untuk auto, 0 untuk manual
  fetch(
    "http://192.168.100.57/piranti_uap/set_auto_mode.php?mode=" + modeStatus
  )
    .then((response) => response.text())
    .then((data) => {
      alert("Auto mode status updated: " + data);
      updateAutoModeStatus(isAuto); // Memperbarui status mode otomatis
    })
    .catch((error) => console.error("Error setting auto mode:", error));
}

// Fungsi untuk memperbarui status mode otomatis di halaman
function updateAutoModeStatus() {
  fetch("http://192.168.100.57/piranti_uap/auto_mode_status.php")
    .then((response) => response.text())
    .then((data) => {
      const autoModeStatusElement = document.getElementById("autoModeStatus");
      if (data == "1") {
        autoModeStatusElement.textContent = "Mode: Auto";
        autoModeStatusElement.className = "status on";
      } else {
        autoModeStatusElement.textContent = "Mode: Manual";
        autoModeStatusElement.className = "status off";
      }
    });
}

// Fungsi untuk mengontrol relay berdasarkan mode otomatis atau manual
function controlRelay(state) {
  // Periksa apakah mode otomatis aktif atau tidak
  fetch("http://192.168.100.57/piranti_uap/relay_status.php?id=2") // ID 2 untuk mode otomatis
    .then((response) => response.text())
    .then((mode) => {
      if (mode == "1") {
        const soilMoisture = parseInt(
          document.getElementById("soil_moisture").textContent
        );
        if (soilMoisture < 30) {
          fetch("http://192.168.100.57/piranti_uap/control_relay.php?status=1"); // ON
        } else {
          fetch("http://192.168.100.57/piranti_uap/control_relay.php?status=0"); // OFF
        }
      } else {
        // Jika mode manual, kontrol relay secara langsung
        fetch(
          "http://192.168.100.57/piranti_uap/control_relay.php?status=" + state
        )
          .then((response) => response.text())
          .then((data) => {
            alert("Relay status updated: " + data);
            updateRelayStatus(); // Memperbarui status relay setelah mengubahnya
          });
      }
    })
    .catch((error) => console.error("Error checking auto mode:", error));
}

// Fungsi untuk memperbarui status relay dari server
function updateRelayStatus() {
  fetch("http://192.168.100.57/piranti_uap/relay_status.php")
    .then((response) => response.text())
    .then((data) => {
      const relayStatusElement = document.getElementById("relayStatus");
      if (data == "1") {
        relayStatusElement.textContent = "Pump is ON";
        relayStatusElement.className = "status on";
      } else {
        relayStatusElement.textContent = "Pump is OFF";
        relayStatusElement.className = "status off";
      }
    });
}

// Fungsi untuk memperbarui data sensor (kelembaban tanah, suhu, dan kelembaban udara)
function updateSensorData() {
  fetch("http://192.168.100.57/piranti_uap/latest_data.php")
    .then((response) => response.json())
    .then((data) => {
      // Perbarui data ke halaman HTML
      document.getElementById("soil_moisture").textContent = data.soil_moisture;
      document.getElementById("temperature").textContent = data.temperature;
      document.getElementById("humidity").textContent = data.humidity;

      // Perbarui grafik dengan data terbaru
      updateCharts(data.soil_moisture, data.temperature, data.humidity);
    })
    .catch((error) => {
      console.error("Error updating sensor data:", error);
    });
}

function updateCharts(soilMoisture, temperature, humidity) {
  if (soilMoistureChart) {
    soilMoistureChart.data.datasets[0].data = [
      soilMoisture,
      100 - soilMoisture,
    ];
    soilMoistureChart.update();
  }
  if (temperatureChart) {
    temperatureChart.data.datasets[0].data = [temperature, 50 - temperature];
    temperatureChart.update();
  }
  if (humidityChart) {
    humidityChart.data.datasets[0].data = [humidity, 100 - humidity];
    humidityChart.update();
  }
}

// Fungsi untuk membuat chart pertama kali
function createCharts() {
  // Soil Moisture Chart
  const soilMoistureCtx = document
    .getElementById("soilMoistureChart")
    .getContext("2d");
  soilMoistureChart = new Chart(soilMoistureCtx, {
    type: "doughnut",
    data: {
      labels: ["Soil Moisture", "None"],
      datasets: [
        {
          backgroundColor: ["#FF6347", "#E0E0E0"],
          borderColor: ["#FF6347", "#E0E0E0"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Temperature Chart
  const temperatureCtx = document
    .getElementById("temperatureChart")
    .getContext("2d");
  temperatureChart = new Chart(temperatureCtx, {
    type: "doughnut",
    data: {
      labels: ["Temperature", "None"],
      datasets: [
        {
          backgroundColor: ["#4CAF50", "#E0E0E0"],
          borderColor: ["#4CAF50", "#E0E0E0"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Humidity Chart
  const humidityCtx = document.getElementById("humidityChart").getContext("2d");
  humidityChart = new Chart(humidityCtx, {
    type: "doughnut",
    data: {
      labels: ["Humidity", "None"],
      datasets: [
        {
          data: [50, 50],
          backgroundColor: ["#FF9800", "#E0E0E0"],
          borderColor: ["#FF9800", "#E0E0E0"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

setInterval(updateSensorData, 2000);

window.onload = function () {
  updateAutoModeStatus();
  updateRelayStatus();
  updateSensorData();
  createCharts();
};

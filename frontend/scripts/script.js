const apiUrl = "http://127.0.0.1:8000/api/sensor"; // Ganti <ip_address> dengan alamat IP server Laravel

// Fungsi untuk mengambil data dari API dan menampilkannya di tabel
async function fetchSensorData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "success") {
      const tbody = document.getElementById("sensor-data");
      tbody.innerHTML = ""; // Kosongkan tabel sebelum menambah data baru

      data.data.forEach((log) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = log.id;
        row.appendChild(idCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = log.tilted ? "Miring" : "Datar";
        row.appendChild(statusCell);

        const timestampCell = document.createElement("td");
        timestampCell.textContent = log.created_at;
        row.appendChild(timestampCell);

        tbody.appendChild(row);

        // Kirim notifikasi saat sensor miring
        if (log.tilted) {
          showNotification();
        }
      });

      // Membuat grafik status sensor
      createChart(data.data);
    } else {
      console.error("Gagal mengambil data dari API");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat memanggil API:", error);
  }
}

// Fungsi untuk menampilkan notifikasi
function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Peringatan: Sensor Keamanan Miring!", {
      body: "Sensor gerak mendeteksi adanya pergerakan tidak normal.",
      icon: "alarm-icon.png", // Gambar ikon notifikasi
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Peringatan: Sensor Keamanan Miring!", {
          body: "Sensor gerak mendeteksi adanya pergerakan tidak normal.",
          icon: "alarm-icon.png", // Gambar ikon notifikasi
        });
      }
    });
  }
}

// Fungsi untuk membuat grafik
function createChart(data) {
  const ctx = document.getElementById("sensor-chart").getContext("2d");
  const labels = data.map(log => log.created_at);
  const statusData = data.map(log => log.tilted ? 1 : 0); // 1 untuk miring, 0 untuk datar

  new Chart(ctx, {
    type: "line", // Jenis grafik
    data: {
      labels: labels,
      datasets: [{
        label: "Status Sensor",
        data: statusData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return value === 1 ? "Miring" : "Datar"; // Menampilkan status "Miring" atau "Datar"
            },
          },
        },
      },
    },
  });
}

// Event listener untuk tombol refresh
document.getElementById("refresh-btn").addEventListener("click", fetchSensorData);

// Event listener untuk tombol LED dan Buzzer
document.getElementById("led-btn").addEventListener("click", () => {
  fetch("http://<ip_address>/api/led/on", { method: "POST" })
    .then(response => response.json())
    .then(data => console.log("LED status:", data))
    .catch(error => console.error("Error activating LED:", error));
});

document.getElementById("buzzer-btn").addEventListener("click", () => {
  fetch("http://<ip_address>/api/buzzer/on", { method: "POST" })
    .then(response => response.json())
    .then(data => console.log("Buzzer status:", data))
    .catch(error => console.error("Error activating Buzzer:", error));
});

// Panggil fetchSensorData saat halaman dimuat pertama kali
window.onload = fetchSensorData;

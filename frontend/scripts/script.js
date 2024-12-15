const apiUrl = "http://127.0.0.1:8000/api/sensor"; // Ganti <ip_address> dengan alamat IP server Laravel

// Fungsi untuk mengambil data dari API dan menampilkannya di tabel
async function fetchSensorData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "success") {
      const tbody = document.getElementById("sensor-data");
      tbody.innerHTML = ""; // Kosongkan tabel sebelum menambah data baru

      // Mengambil nilai slider untuk menentukan jumlah data yang akan ditampilkan
      const dataCount = document.getElementById("data-slider").value;

      // Mengatur jumlah data yang akan ditampilkan
      const rowsToDisplay = data.data.slice(0, dataCount);

      rowsToDisplay.forEach((log) => {
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

        // Kirim notifikasi saat sensor miring (untuk data terbaru)
      
      });
      
      if (data.data.length > 0 && data.data[0].tilted) {
        showNotification();
      }
      // Membuat grafik status sensor
      createChart(data.data.slice(0, dataCount));
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

// Event listener untuk mengupdate nilai slider
document.getElementById("data-slider").addEventListener("input", function() {
  // Menampilkan nilai slider yang dipilih di elemen <span>
  document.getElementById("slider-value").textContent = this.value;
});

// Panggil fetchSensorData saat halaman dimuat pertama kali
window.onload = fetchSensorData;

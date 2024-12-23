<?php
// Konfigurasi database
$host = "localhost";          // Server database
$username = "root";           // Username database
$password = "";               // Password database
$database = "monitoring";     // Nama database

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");


// Koneksi ke database
$conn = new mysqli($host, $username, $password, $database);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query untuk mengambil data terbaru
$sql = "SELECT soil_moisture, temperature, humidity FROM sensor_data ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($sql);

// Cek apakah ada data yang diambil
if ($result->num_rows > 0) {
    // Ambil data terbaru
    $row = $result->fetch_assoc();
    
    // Kirimkan data dalam format JSON
    echo json_encode([
        "soil_moisture" => $row['soil_moisture'],
        "temperature" => $row['temperature'],
        "humidity" => $row['humidity']
    ]);
} else {
    // Jika tidak ada data, kirimkan nilai default
    echo json_encode([
        "soil_moisture" => 0,
        "temperature" => 0,
        "humidity" => 0
    ]);
}

// Tutup koneksi
$conn->close();
?>

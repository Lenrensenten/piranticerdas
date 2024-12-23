<?php
// Konfigurasi database
$host = "localhost";          // Server database (biasanya localhost)
$username = "root";           // Username database
$password = "";               // Password database
$database = "monitoring";     // Nama database

// Koneksi ke database
$conn = new mysqli($host, $username, $password, $database);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ambil data dari request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $soil_moisture = $_POST['soil_moisture'];
    $temperature = $_POST['temperature'];
    $humidity = $_POST['humidity'];

    // Validasi data
    if (!empty($soil_moisture) && !empty($temperature) && !empty($humidity)) {
        // Query untuk memasukkan data ke database
        $sql = "INSERT INTO sensor_data (soil_moisture, temperature, humidity) 
                VALUES ('$soil_moisture', '$temperature', '$humidity')";

        if ($conn->query($sql) === TRUE) {
            echo "Data uploaded successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Invalid input: Please provide all required data.";
    }
} else {
    echo "Invalid request method. Use POST.";
}

// Tutup koneksi
$conn->close();
?>

<?php
$servername = "localhost"; // Ganti dengan alamat server database Anda
$username = "root"; // Ganti dengan username database Anda
$password = ""; // Ganti dengan password database Anda
$dbname = "monitoring"; // Ganti dengan nama database Anda

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Mengambil status mode otomatis dari database
$sql = "SELECT status FROM relay_control WHERE id = 2"; // Sesuaikan dengan query database Anda
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['status']; // 1 untuk Auto Mode, 0 untuk Manual Mode
} else {
    echo "0"; // Default jika tidak ada data
}

$conn->close();
?>

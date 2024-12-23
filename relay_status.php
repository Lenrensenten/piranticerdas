<?php
$host = 'localhost'; // Ganti dengan host Anda
$username = 'root';  // Ganti dengan username Anda
$password = '';      // Ganti dengan password Anda
$dbname = 'monitoring'; // Ganti dengan nama database Anda

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Membuat koneksi
$conn = new mysqli($host, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ambil status relay dari tabel
$sql = "SELECT status FROM relay_control WHERE id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['status']; // 1 untuk relay ON, 0 untuk relay OFF
} else {
    echo "0"; // Default jika tidak ada data
}

$conn->close();
?>

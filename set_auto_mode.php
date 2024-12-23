<?php
$host = 'localhost'; // Ganti dengan host Anda
$username = 'root';  // Ganti dengan username Anda
$password = '';      // Ganti dengan password Anda
$dbname = 'monitoring'; // Ganti dengan nama database Anda

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli($host, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$mode = isset($_GET['mode']) ? $_GET['mode'] : 0; // Default mode manual jika tidak ada parameter

// Update status mode otomatis
$sql = "UPDATE relay_control SET status = $mode WHERE id = 2"; // ID 2 untuk mode otomatis

if ($conn->query($sql) === TRUE) {
    echo "Mode updated successfully";
} else {
    echo "Error updating mode: " . $conn->error;
}

$conn->close();
?>

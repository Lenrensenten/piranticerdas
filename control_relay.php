<?php
$host = 'localhost'; // Ganti jika menggunakan host lain
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

// Ambil status relay dari parameter GET
if(isset($_GET['status'])) {
    $relayStatus = $_GET['status']; // 1 = ON, 0 = OFF
    $sql = "UPDATE relay_control SET status = $relayStatus WHERE id = 1";
    if ($conn->query($sql) === TRUE) {
        echo "Relay control updated successfully";
    } else {
        echo "Error updating relay: " . $conn->error;
    }
}

$conn->close();
?>

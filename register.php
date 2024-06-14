<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "FarmFresh";

// Create connection
$conID = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conID->connect_error) {
    die("Connection failed: " . $conID->connect_error);
}

// Check that form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password for security

    // Prepare and execute SQL query to insert user data
    $sql_insert = "INSERT INTO reg (username, email, password, created_at) VALUES (?, ?, ?, NOW())";
    $stmt_insert = $conID->prepare($sql_insert);
    $stmt_insert->bind_param("sss", $username, $email, $password);

    if ($stmt_insert->execute()) {
        echo "User registered successfully!";
    } else {
        echo "ERROR: Hush! Sorry " . $sql_insert . ". " . mysqli_error($conID);
    }

    $stmt_insert->close();
    $conID->close();
} else {
    echo "Invalid request method.";
}
?>

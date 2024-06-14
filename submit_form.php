<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "FarmFresh";

// Create connection
$conID = new mysqli($servername, $username, $password, $dbname);


if ($conID->connect_error) {
    die("Connection failed: " . $conID->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];


    $sql_insert = "INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, NOW())";
    $stmt_insert = $conID->prepare($sql_insert);
    $stmt_insert->bind_param("sss", $name, $email, $message);

    if ($stmt_insert->execute()) {
        echo "Form data stored successfully!";
    } else {
        echo "ERROR: Hush! Sorry " . $sql_insert . ". " . mysqli_error($conID);
    }

    $stmt_insert->close();
    $conID->close();
} else {
    echo "Invalid request method.";
}
?>
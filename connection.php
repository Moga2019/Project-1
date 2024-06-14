<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "FarmFresh";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check that form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the login button was clicked
    if (isset($_POST['login']) && !isset($_POST['signup'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Prepare and execute SQL query to check if the user exists
        $sql_select = "SELECT * FROM reg WHERE username = ? AND password = ?";
        $stmt_select = $conn->prepare($sql_select);
        $stmt_select->bind_param("ss", $username, $password);
        $stmt_select->execute();
        $result = $stmt_select->get_result();

        if ($result->num_rows > 0) {
            // User is registered, redirect to home page
            header("Location: home.html");
            exit();
        } else {
            // User is not registered, display an error message
            echo "Invalid username or password.";
        }

        $stmt_select->close();
    }
    // Check if the sign up button was clicked
    elseif (!isset($_POST['login']) && isset($_POST['signup'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Prepare and execute SQL query to insert the user details into the "reg" table
        $sql_insert = "INSERT INTO reg (username, password) VALUES (?, ?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("ss", $username, $password);

        if ($stmt_insert->execute()) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $sql_insert . ". " . $conn->error;
        }

        $stmt_insert->close();
    } else {
        echo "Invalid request.";
    }
} else {
    echo "Invalid request method.";
}

$conn->close();
?>
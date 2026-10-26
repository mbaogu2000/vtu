<?php
// Set headers for JSON response and CORS (Allow all origins)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection (assumes $conn is a PDO instance)
require_once __DIR__ . '/../conn.php';

// Initialize response array
$response = [
    "status" => false,
    "message" => "An error occurred.",
    "data" => null
];

// Retrieve input data from JSON payload or POST request
$inputData = json_decode(file_get_contents("php://input"), true);
if (!$inputData) {
    $inputData = $_POST;
}

$user = isset($inputData['user']) ? trim($inputData['user']) : '';
$pass = isset($inputData['pass']) ? trim($inputData['pass']) : '';

// Validate inputs
if (!empty($user) && !empty($pass)) {
    try {
        // Query to check if user exists via email or phone number
        $stmt = $conn->prepare("SELECT uuid, name, password FROM users WHERE email = :user OR phonenumber = :user LIMIT 1");
        $stmt->execute(['user' => $user]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify user and password 
        // Note: For production, it is strongly recommended to use password_verify($pass, $userData['password']) 
        // if your passwords are encrypted using password_hash().
        if ($userData && $pass === $userData['password']) {
            
            // Generate token: md5(time().rand(1000,9999))
            $token = md5(time() . rand(1000, 9999));

            // Update user token in database
            $updateStmt = $conn->prepare("UPDATE users SET token = :token WHERE email = :user OR phonenumber = :user");
            $updateStmt->execute([
                'token' => $token,
                'user' => $user
            ]);

            // Success response
            $response["status"] = true;
            $response["message"] = "Login successful.";
            $response["data"] = [
                "token" => $token,
                "user_id" => $userData['uuid'],
                "name" => $userData['name']
            ];
        } else {
            $response["message"] = "Invalid credentials. Please check your email/phone and password.";
        }
    } catch (PDOException $e) {
        $response["message"] = "Database error: " . $e->getMessage();
    }
} else {
    $response["message"] = "User and password fields cannot be empty.";
}

// Return JSON output
echo json_encode($response);
?>
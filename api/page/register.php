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

$fullname    = isset($inputData['fullname']) ? trim($inputData['fullname']) : '';
$email       = isset($inputData['email']) ? trim($inputData['email']) : '';
$phonenumber = isset($inputData['phonenumber']) ? trim($inputData['phonenumber']) : '';
$pass        = isset($inputData['pass']) ? trim($inputData['pass']) : '';

// --- VALIDATION SECTION ---

// 1. Fullname validation (must be 2 or 3 words/parts)
$nameParts = preg_split('/\s+/', $fullname);
$wordCount = count($nameParts);
if (empty($fullname) || $wordCount < 2 || $wordCount > 3) {
    $response["message"] = "Full name must consist of 2 or 3 parts (e.g., First Last or First Middle Last).";
    echo json_encode($response);
    exit();
}

// 2. Email validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Invalid email format.";
    echo json_encode($response);
    exit();
}

// 3. Phone number validation (digits only, e.g., 10 to 15 digits)
// Strips out non-digit characters like +, -, spaces for length check
$cleanPhone = preg_replace('/\D/', '', $phonenumber);
if (empty($phonenumber) || strlen($cleanPhone) < 10 || strlen($cleanPhone) > 15) {
    $response["message"] = "Invalid phone number format or digit length.";
    echo json_encode($response);
    exit();
}

// 4. Password validation
if (empty($pass)) {
    $response["message"] = "Password cannot be empty.";
    echo json_encode($response);
    exit();
}

try {
    // Check if email or phone number already exists in the database
    $checkStmt = $conn->prepare("SELECT uuid FROM users WHERE email = :email OR phonenumber = :phonenumber LIMIT 1");
    $checkStmt->execute([
        'email' => $email,
        'phonenumber' => $phonenumber
    ]);

    if ($checkStmt->rowCount() > 0) {
        $response["message"] = "An account with this email or phone number already exists.";
    } else {
        // Generate UUID, token, and hash the password (recommended)
        // If your schema uses standard string UUIDs:
        $uuid = sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        $token = md5(time() . rand(1000, 9999));
        
        // Note: For secure storage, consider using password_hash($pass, PASSWORD_DEFAULT). 
        // If your application requires plain text, you can use $pass directly.
        $hashedPass = password_hash($pass, PASSWORD_DEFAULT);

        // Insert new user into database
        $insertStmt = $conn->prepare("
            INSERT INTO users (uuid, fullname, email, phonenumber, password, token) 
            VALUES (:uuid, :fullname, :email, :phonenumber, :password, :token)
        ");
        
        $insertSuccess = $insertStmt->execute([
            'uuid' => $uuid,
            'fullname' => $fullname,
            'email' => $email,
            'phonenumber' => $phonenumber,
            'password' => $hashedPass, // Switch to $pass if plain-text password is required by your setup
            'token' => $token
        ]);

        if ($insertSuccess) {
            $response["status"] = true;
            $response["message"] = "Registration successful.";
            $response["data"] = [
                "token" => $token,
                "user_id" => $uuid,
                "name" => $fullname
            ];
        } else {
            $response["message"] = "Failed to register user. Please try again.";
        }
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

// Return JSON output
echo json_encode($response);
?>
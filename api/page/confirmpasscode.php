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

// Include database connection and mailer functions
require_once __DIR__ . '/../conn.php';
require_once __DIR__ . '/../mailer.php'; // Assumes this file defines function sendMail($to, $subject, $body)

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
$code = isset($inputData['code']) ? trim($inputData['code']) : '';

// --- VALIDATION SECTION ---
if (empty($user)) {
    $response["message"] = "User identifier cannot be empty.";
    echo json_encode($response);
    exit();
}

// Validate 4-digit code (must be exactly 4 digits)
if (empty($code) || !ctype_digit($code) || strlen($code) !== 4) {
    $response["message"] = "Invalid code format. Must be a 4-digit number.";
    echo json_encode($response);
    exit();
}

try {
    // Check if user (UUID or Email) and 4-digit token exist in database
    $stmt = $conn->prepare("SELECT uuid, email, fullname, token FROM users WHERE (uuid = :user OR email = :user) AND token = :code LIMIT 1");
    $stmt->execute([
        'user' => $user,
        'code' => $code
    ]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        // Update token (ensures token consistency as requested)
        $updateStmt = $conn->prepare("UPDATE users SET token = :token WHERE uuid = :uuid");
        $updateStmt->execute([
            'token' => $code,
            'uuid' => $userData['uuid']
        ]);

        // Define recipient email and responsive HTML body
        $recipientEmail = $userData['email'];
        $subject = "Welcome Back! Change Your Password";

        $htmlBody = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Back</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .header { text-align: center; color: #333333; margin-bottom: 20px; }
                .btn { display: inline-block; background: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; color: #777777; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 class="header">Welcome Back, ' . htmlspecialchars($userData['fullname']) . '!</h2>
                <p>Your verification code has been successfully confirmed.</p>
                <p>You can now change your password and securely access your account by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="#" class="btn">Change Your Password</a>
                </div>
                <p>If you did not request this, please ignore this email or secure your account.</p>
                <div class="footer">&copy; ' . date('Y') . ' Your Application. All rights reserved.</div>
            </div>
        </body>
        </html>';

        // Send mail using the provided sendMail function
        $mailSent = sendMail($recipientEmail, $subject, $htmlBody);

        if ($mailSent) {
            $response["status"] = true;
            $response["message"] = "Code verified successfully. Welcome back email sent.";
            $response["data"] = [
                "user_id" => $userData['uuid'],
                "token" => $userData['token'],
                "name" => $userData['fullname']
            ];
        } else {
            $response["message"] = "Verification successful, but failed to send the welcome email.";
        }
    } else {
        $response["message"] = "Invalid user identifier or incorrect 4-digit verification code.";
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

// Return JSON output
echo json_encode($response);
?>
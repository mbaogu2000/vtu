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

// --- VALIDATION SECTION ---
if (empty($user) || !filter_var($user, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Invalid email format.";
    echo json_encode($response);
    exit();
}

try {
    // Check if user exists by email or phone number
    $stmt = $conn->prepare("SELECT uuid, name, email, phonenumber FROM users WHERE email = :user OR phonenumber = :user LIMIT 1");
    $stmt->execute(['user' => $user]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        // Generate a 4-digit code
        $code = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        // Update user token in the database with the 4-digit code
        $updateStmt = $conn->prepare("UPDATE users SET token = :token WHERE uuid = :uuid");
        $updateStmt->execute([
            'token' => $code,
            'uuid' => $userData['uuid']
        ]);

        // Define recipient email (use the found user's actual email address)
        $recipientEmail = $userData['email'];
        $subject = "Your Password Reset Verification Code";

        // Responsive HTML Body for the email
        $htmlBody = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .header { text-align: center; color: #333333; margin-bottom: 20px; }
                .code-box { background: #f8f9fa; border: 2px dashed #007bff; color: #007bff; font-size: 32px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px; letter-spacing: 5px; }
                .footer { text-align: center; color: #777777; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 class="header">Password Reset Request</h2>
                <p>Hello <strong>' . htmlspecialchars($userData['name']) . '</strong>,</p>
                <p>We received a request to reset your password. Please use the 4-digit verification code below to proceed:</p>
                <div class="code-box">' . $code . '</div>
                <p>If you did not request this, please ignore this email.</p>
                <div class="footer">&copy; ' . date('Y') . ' Your Application. All rights reserved.</div>
            </div>
        </body>
        </html>';

        // Send mail using the provided sendMail function
        // Ensure your mailer.php defines: function sendMail($to, $subject, $body)
        $mailSent = sendMail($recipientEmail, $subject, $htmlBody);

        if ($mailSent) {
            $response["status"] = true;
            $response["message"] = "Verification code sent successfully to your email.";
            $response["data"] = [
                "user_id" => $userData['uuid'],
                "name" => $userData['name']
            ];
        } else {
            $response["message"] = "Failed to send verification email. Please try again later.";
        }
    } else {
        // For security reasons, you can choose a generic message, or state user not found
        $response["message"] = "No account found associated with this user identifier.";
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

// Return JSON output
echo json_encode($response);
?>
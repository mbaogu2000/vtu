<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../conn.php'; // $conn = new mysqli(...)

$headers = function_exists('getallheaders') ? getallheaders() : [];
$bearer = $headers['Authorization'] ?? $headers['authorization']
    ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

$auth = preg_match('/^Bearer\s+(.+)$/i', trim($bearer), $matches)
    ? json_decode($matches[1], true)
    : null;

$uid = $auth['uid'] ?? null;
$token = $auth['token'] ?? null;

function response(int $code, bool $status, string $message, array $data = []): void {
    http_response_code($code);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

if (!$uid || !$token) {
    response(401, false, 'UID and token are required');
}

$stmt = $conn->prepare(
    "SELECT fullname FROM users
     WHERE uuid = ? AND token = ? AND is_active = 1
     LIMIT 1"
);

if (!$stmt) {
    response(500, false, 'Database query failed');
}

$stmt->bind_param("ss", $uid, $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    response(401, false, 'Invalid credentials or inactive account');
}

response(200, true, 'User validated successfully', [
    'fullname' => $user['fullname']
]);
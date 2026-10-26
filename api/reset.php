<?php
require_once __DIR__ . '/conn.php';
$sqlFile = __DIR__ . '/db.sql';
$sql = file_get_contents($sqlFile);
try {
    $conn->multi_query($sql);

    do {
        $result = $conn->store_result();
        if ($result instanceof mysqli_result) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    echo 'Database reset successfully.';
} catch (mysqli_sql_exception $exception) {
    http_response_code(500);
    error_log('Database reset failed: ' . $exception->getMessage());
    echo 'Database reset failed. Check the server logs for details.';
}

<?php
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASSWORD", "");
define("DB_NAME", "vtu9ja");

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
$conn->set_charset('utf8mb4');
$conn->query(
    "CREATE DATABASE IF NOT EXISTS " . DB_NAME );
$conn->select_db(DB_NAME);

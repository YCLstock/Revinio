<?php
    header('Content-Type: application/json');
    require_once 'config.php';  // 包含配置文件

    $conn = new mysqli(
        $databaseConfig['servername'],
        $databaseConfig['username'],
        $databaseConfig['password'],
        $databaseConfig['dbname']
    );

    $sql = "DELETE FROM `note_check` WHERE 1";
    $result = $conn->query($sql);
?>
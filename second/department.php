<?php
header('Content-Type: application/json');

require_once '../config.php';  // 包含配置文件

$conn = new mysqli(
    $databaseConfig['servername'],
    $databaseConfig['username'],
    $databaseConfig['password'],
    $databaseConfig['dbname']
);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    $id = $data['id'];
    // $note = $data['note'];
    $hr_view = 2;
    $check = 1;

    // 检查数据库中是否存在相同的记录
    $sql_check = "SELECT * FROM `note_check` WHERE `C_id` = '$id' AND `Note_View` = '$hr_view'";
    $result_check = $conn->query($sql_check);

    if ($result_check && $result_check->num_rows > 0) {
        // 如果已存在记录，则更新对应的 Note
        $sql_update = "UPDATE `note_check` SET `N_check` = '$check' WHERE `C_id` = '$id' AND `Note_View` = '$hr_view'";
        $result_update = $conn->query($sql_update);

        if ($result_update) {
            echo json_encode(array('success' => true, 'message' => 'check updated'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Failed to update check'));
        }
    } else {
        // 如果不存在记录
        $sql_insert = "INSERT INTO `note_check`(`C_id`, `Note`, `Note_View`, `N_check`) VALUES ('$id', '', '2', '1')";
        $result_insert = $conn->query($sql_insert);
    
        if ($result_insert) {
            echo json_encode(array('success' => true, 'message' => 'New record inserted'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Failed to insert new record'));
        }
    }
}
?>

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
        // 獲取 POST 請求中的 JSON 數據
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        $i = 0;
        $hr_view = 1;
        // 在這裡對數據進行處理或更新操作
        $sql = "DELETE FROM `note_check` WHERE `Note_View` = '$hr_view'";
        $result = $conn->query($sql);

        while(isset($data[$i])){
            echo json_encode($data[$i]['ids']);
            $sql = "INSERT INTO `note_check`(`C_id`, `Note`, `Note_View`, `N_check`) VALUES ('{$data[$i]['ids']}','{$data[$i]['comment']}','1','{$data[$i]['check']}')";
            // 執行 SQL 敘述
            $result = $conn->query($sql);
            $i++;
        }
    }
?>






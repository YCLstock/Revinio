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

// $json_data = file_get_contents('php://input');
//     $data = json_decode($json_data, true);
//     $id = $data['id'];
//     $hr_view = '2';
//     $N_check = '1';

// 检查数据库中是否存在相同的记录
$sql_check = "SELECT * FROM `note_check` WHERE `N_check` = 1 AND `Note_View` = 2";
$result_check = $conn->query($sql_check);

// ...

if ($result_check && $result_check->num_rows > 0) {
    $records = array();  // 初始化一個空數組
    while($row = $result_check->fetch_assoc()) {
        $records[] = array(
            'C_id' => $row['C_id'],
            'n_star' => $row['N_star']
        );
    }
    echo json_encode($records);
} else {
    http_response_code(400); // 返回一个错误状态码，比如400表示Bad Request
    echo json_encode(array('error' => 'No matching records found'));
}

// if ($result_check && $result_check->num_rows > 0) {
//     $records = array();  // 初始化一个空数组
//     while($row = $result_check->fetch_assoc()) {
//         $records[] = $row;  // 直接将整个 $row 数组添加到结果数组中
//     }
//     echo json_encode($records);
// } else {
//     http_response_code(400); // 返回一个错误状态码，比如400表示Bad Request
//     echo json_encode(array('error' => 'No matching records found'));
// }


// ...



?>
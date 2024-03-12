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

$json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    $id = $data['id'];
    $hr_view =$data['layer'];

// 检查数据库中是否存在相同的记录
$sql_check = "SELECT * FROM `note_check` WHERE `C_id` = '$id' AND `Note_View` = '$hr_view'";
$result_check = $conn->query($sql_check);

// if ($result_check && $result_check->num_rows > 0) {
//     // 如果已存在记录，则更新对应的 Note
//     $sql = "SELECT `Note` FROM `note_check` WHERE `C_id` = '$id' AND `Note_View` = '$hr_view'";  // 修改为实际的查询语句
//     $result = $conn->query($sql);

//     if ($result) {
//         $rows = array();
//         while ($row = $result->fetch_assoc()) {
//             $rows[] = $row;
//         }
//         echo json_encode($rows);
//     } else {
//         echo json_encode(array('error' => 'Failed to execute query'));
// }

// } else {
//     echo json_encode("");
// } 

if ($result_check && $result_check->num_rows > 0) {
    // 如果已存在记录，则返回对应的 Note 值
    $row = $result_check->fetch_assoc();  // 只取第一条记录
    echo json_encode(array('note' => $row['Note'],'n_star' => $row['N_star']));
} else {
    echo json_encode(array('note' => ''));  // 返回一个空的 note
}

?>
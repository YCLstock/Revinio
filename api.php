<?php
header('Content-Type: application/json');

// 连接到数据库
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'vrs';

$conn = new mysqli($servername, $username, $password, $dbname);

// 检查数据库连接是否成功
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}

// 执行查询操作
$sql = 'SELECT * FROM basic_information';
$result = $conn->query($sql);

// 处理查询结果
$basic_information = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $basic_information[] = $row;
  }
}

// // 执行查询操作
// $sql = 'SELECT * FROM p_select';
// $result = $conn->query($sql);

// // 处理查询结果
// $p_select = array();
// if ($result->num_rows > 0) {
//   while ($row = $result->fetch_assoc()) {
//     $p_select[] = $row;
//   }
// }

// 执行查询操作
$sql = 'SELECT * FROM academic';
$result = $conn->query($sql);

// 处理查询结果
$academic = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $academic[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM other_experience';
$result = $conn->query($sql);

// 处理查询结果
$other_experience = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $other_experience[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM work_experience';
$result = $conn->query($sql);

// 处理查询结果
$work_experience = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $work_experience[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM skill';
$result = $conn->query($sql);

// 处理查询结果
$skill = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $skill[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM relation_table_we_s';
$result = $conn->query($sql);

// 处理查询结果
$relation_table_we_s = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $relation_table_we_s[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM relation_table_oe_s';
$result = $conn->query($sql);

// 处理查询结果
$relation_table_oe_s = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $relation_table_oe_s[] = $row;
  }
}

// 执行查询操作
$sql = 'SELECT * FROM note_check';
$result = $conn->query($sql);

// 处理查询结果
$note_check = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $note_check[] = $row;
  }
}

// 关闭数据库连接
$conn->close();

// 构建一个包含两个数组的关联数组
$data = array(
  'basic_information' => $basic_information,
  'academic' => $academic,
  'other_experience' => $other_experience,
  'work_experience' => $work_experience,
  'skill' => $skill,
  'relation_table_we_s' => $relation_table_we_s,
  'relation_table_oe_s' => $relation_table_oe_s,
  'note_check' => $note_check,

);

// 返回数据给 Vue 应用
echo json_encode($data);
?>

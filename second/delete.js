function delete_note(id, layer, note) {
    var data = {
      id: id,
      layer: layer,
      note: note
    };
  
    // 将值转换为合法的JSON字符串
    var jsonData = JSON.stringify(data);
  
    console.log("json",jsonData)
  
    fetch('delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then(response => response.json())
      .then(result => {
        // 在這裡處理後端回傳的結果
        console.log('result:', result);
      })
      .catch(error => {
        // 處理錯誤
        console.log('error',error);
      });
  }
function submit(id, layer, note, star) {
    var data = {
      id: id,
      layer: layer,
      note: note,
      star: star
    };
  
    // 将值转换为合法的JSON字符串
    var jsonData = JSON.stringify(data);
  
    console.log("json",jsonData)
  
    fetch('submit.php', {
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

function dep(id, layer) {

  // ids = extractNumbersFromString(id)

    var data = {
      id: id,
      layer: layer
    };
  
    // 将值转换为合法的JSON字符串
    var jsonData = JSON.stringify(data);
  
    console.log("json",jsonData)
  
    fetch('department.php', {
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

function de_dep(id, layer) {

  // ids = extractNumbersFromString(id)

    var data = {
      id: id,
      layer: layer
    };
  
    // 将值转换为合法的JSON字符串
    var jsonData = JSON.stringify(data);
  
    console.log("json",jsonData)
  
    fetch('de_department.php', {
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


//分數字
function extractNumbersFromString(inputString) {
  var numberMatch = inputString.match(/\d+/); // 使用正則表達式匹配數字
  if (numberMatch) {
      var extractedNumber = parseInt(numberMatch[0], 10); // 將匹配到的數字轉換為整數
      return extractedNumber;
  } else {
      return null; // 如果未匹配到數字，返回 null 或其他適當值
  }
}
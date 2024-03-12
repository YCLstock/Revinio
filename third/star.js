function create_star(){
  // 找到所有的 <div class="boxleft"></div> 元素
  var boxleftElements = document.querySelectorAll('.boxleft');
  console.log("confirm whi ch exist",boxleftElements.length)

  // 用迴圈處理每個 boxleft 元素
  boxleftElements.forEach(function(boxleftElement) {
      // 創建一個新的 div 元素
      var ratingDiv = document.createElement('div');
      ratingDiv.classList.add('rating');

      // 添加評分元素
      ratingDiv.innerHTML = `
          <input value="5" name="rate" id="star5" type="radio">
          <label title="text" for="star5">★</label>
          <input value="4" name="rate" id="star4" type="radio">
          <label title="text" for="star4">★</label>
          <input value="3" name="rate" id="star3" type="radio">
          <label title="text" for="star3">★</label>
          <input value="2" name="rate" id="star2" type="radio">
          <label title="text" for="star2">★</label>
          <input value="1" name="rate" id="star1" type="radio">
          <label title="text" for="star1">★</label>
      `;

      // 把 ratingDiv 加入到 boxleft 元素中
      boxleftElement.appendChild(ratingDiv);

  });

  //串接數據
  find_star();

  var star_rate = document.querySelectorAll('.rating');
  console.log("confirm star",star_rate)

}
function text(id, layer) {
    var data = {
      id: id,
      layer: layer
    };
  
    // 将值转换为合法的JSON字符串
    var jsonData = JSON.stringify(data);
  
    console.log("json",jsonData)
  
      fetch('text.php', {
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
  
          var inputRating = result['n_star']
          console.log("reback",inputRating)
          if (inputRating >= 1 && inputRating <= 5) {
            // 選擇所有評分選項
            var ratingInputs = document.querySelectorAll('.rating input');
            
            // 將對應的評分選項選中
            ratingInputs[6 - inputRating - 1].checked = true;
          } else {
            var ratingInputs = document.querySelectorAll('.rating input');
            // 將所有評分選項的選中狀態重置為 false
            ratingInputs.forEach(function(input) {
              input.checked = false;
            });
              console.log('沒分');
          }
          
        })
      .catch(error => {
        // 處理錯誤
        console.log('error',error);
      });
  }
  function find_star(){
    fetch('find_star.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => {
        // 在這裡處理後端回傳的結果
        console.log('result:', result);
        
        window.star_num = result

        var star_rate = document.querySelectorAll('.rating');
        console.log("confirm star rating",star_rate)

      })
    .catch(error => {
      // 處理錯誤
      console.log('error',error);
    });
  }
let ids

function comment(id,box_x,box_y){
  // 在script.js文件中定义交互行为
  // const commentBox = document.querySelector('.comment_box');
  const commentDiv = document.querySelector('.comment');
  const closeButton = document.querySelector('#closeButton');
  const comment_content = document.querySelector('#comment_content');

  // console.log("value",id)

  ids = extractNumbersFromString(id)
  var comment_height = 0;

  hr_text(ids,1, comment_height, box_y)
  text(ids,2)

console.log(comment_height)
  // let isCommentVisible = false;

  commentDiv.style.display = 'block';

  commentDiv.style.left = (box_x - 340)+ 'px';

  closeButton.addEventListener('click', () => {
    commentDiv.style.display = 'none';

    // 選擇所有評分選項
    var ratingInputs = document.querySelectorAll('.rating input');

    // 將所有評分選項的選中狀態重置為 false
    ratingInputs.forEach(function(input) {
    input.checked = false;
  });

  });
}

//分數字
function extractNumbersFromString(inputString) {
  if (typeof inputString === 'number') {
    return inputString; // 如果輸入本身就是數字，直接返回該數字
  }
  
  var numberMatch = inputString.match(/\d+/);

  if (numberMatch) {
    var extractedNumber = parseInt(numberMatch[0], 10);
    return extractedNumber;
  } else {
    return null;
  }
}


const submit_btn = document.querySelector('#submit');

submit_btn.addEventListener('click', () => {
  const commentDiv = document.querySelector('.comment');
  const textarea = document.getElementById('comment_content');

  let layer = 2;
  let note = textarea.value;

  if (note === '') {
    alert('Please enter a comment before submitting.'); // 如果评论内容为空，弹出警告
    return; // 不执行后续代码
  }
  let star = window.star_num ;

  //console.log("mi,m,o,o",star)

  submit(ids,layer,note,star);

  // submit(data);

  //將一些數值初始化
  // 選擇所有評分選項
  var ratingInputs = document.querySelectorAll('.rating input');

  // 將所有評分選項的選中狀態重置為 false
  ratingInputs.forEach(function(input) {
    input.checked = false;
  });
  window.star_num = 0;
  console.log("成功")
  textarea.value = '';
  commentDiv.style.display = 'none';
  // alert("成功更改")

  var img_change = document.getElementById("comment_box_" + ids)
  img_change.setAttribute("fill", "url(#comment_fill)");
});

function text(id, layer) {
  var data = {
    id: id,
    layer: layer
  };

  const textarea = document.getElementById('comment_content');

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
        textarea.value = result['note']

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

const delete_btn = document.querySelector('#remove');

delete_btn.addEventListener('click', () => {
  const commentDiv = document.querySelector('.comment');
  const textarea = document.getElementById('comment_content');

  let layer = 2;
  let note = textarea.value;

  delete_note(ids,layer,note);

  // submit(data);
  console.log("成功")
  textarea.value = '';
  commentDiv.style.display = 'none';
  alert("Success delete")

  var img_change = document.getElementById("comment_box_" + ids);
  img_change.setAttribute("fill", "url(#comment_empty)")
});


//地一層的註解
function hr_text(id, layer, comment_height, box_y) {
  var data = {
    id: id,
    layer: layer
  };

  const textarea = document.getElementById('hr_content');

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
      // console.log('result:', result);
      comment_height = result['note'].split('<br>').length*17;
      document.getElementById('hr_content').style.height = comment_height + 'px';
      document.querySelector('.comment').style.height = comment_height + 235 + 'px';
      var commentDivID = document.getElementById("comment");
      var commentDivHeight = commentDivID.clientHeight;
      console.log("commentDivHeight",commentDivHeight);
      var countTop = (box_y - 60);
      if(countTop+commentDivHeight+10 >= window.innerHeight){
        countTop = window.innerHeight - (commentDivHeight+10);
      }
      console.log("height",countTop);
      commentDivID.style.top = countTop + 'px';
      result['note'] = result['note'].replace(/<br>/g,'\n')
      textarea.value = result['note']
    })
    .catch(error => {
      // 處理錯誤
      console.log('error',error);
    });
}

//星星部分
document.addEventListener('DOMContentLoaded', function() {
  const ratingInputs = document.querySelectorAll('.rating input');

  ratingInputs.forEach(input => {
    input.addEventListener('click', function() {
      const ratingValue = this.value;
      window.star_num = ratingValue
      console.log("惺數",window.star_num)      
      // saveRatingToDatabase(ratingValue);
    });
  });
});

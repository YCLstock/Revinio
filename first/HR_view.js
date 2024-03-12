// 2023/08/08 保險push
var prioritySchool = [];
var preferSchool = [];
var priorityWork = [];
var preferWork = [];
var elseSchool = [];
var elseWork = [];
var department = [];
var work_position = [];
var firstStop = 2.8;
var secondStop = 3.4;
var thirdStop = 3.8;
const VerticalSpacing = 17;
const HorizontalSpacing = 17;
const dotPerCol = 7;
var barwidth = '7.5vw';
var barhight = "22px";
var barTextbox_width = "34%";
var barChart_width = "66%";
var yBox0;
var xBox0 = 0;
var runtime = 1;
var boxHorizontal = 1;
var preferBoxLock = 0;
var priorityBoxLock = 0;
const clicked_id = [];
var is_it_mouseover = -1;
var is_it_click = -1;
var everyone_height;
var years_of_experience_first = 1;
var years_of_experience_second = 3;
var years_of_experience_third = 4;
var max_change_frequency = 0;
var content = "font-family: 'Open Sans', sans-serif;";
var startSelectX;
var startSelectY;
var endSelectX;
var endSelectY;
var divSelectedC_id = [];
var saveIdsAndCommentArray = [];
var Slider_lock = 0;
var Slider_work_lock = 0;
var data_filter_a = [];
var data_filter_w = [];
var filterCheck = 0;
var mouseOn;
var whatUWant = 0;
var whatUWant_w = 0;

function redirectToOtherPage() {
  const uniqueIdsSet = [];

  saveIdsAndCommentArray.forEach(item => {
    if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
      uniqueIdsSet.push(item.ids);
    }
  });
  const sumOfIds = uniqueIdsSet.length;

  if(sumOfIds < 30){
    alert("Please assist in selecting a minimum of 30 individuals!");
  }
  else{
    // 将页面的 URL 设置为您要切换到的目标链接
    window.location.href = "../second/department.html";
  }
}

function updateData(data){
  fetch('updateData.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      // 在這裡處理後端回傳的結果
      console.log('result:', result);
    })
    .catch(error => {
      // 處理錯誤
      console.log('error');
    });
}

function loadComment(note){
  if(note.length){
    var i = 0;
    while(note[i]){
      if(note[i].Note_View == 1){
        const data = {
          ids: note[i].C_id,
          comment: note[i].Note,
          check:1,
        }
        saveIdsAndCommentArray.push(data);
      }
      i++;
    }
  }
  var Already_choose = document.getElementById('Already_choose');
    Already_choose.innerHTML =
    `
    <div class="nextPageDiv">
      <span class="nextPageButtonText">Selected: ${saveIdsAndCommentArray.length}</span>
      <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
      </svg>
    </div>
    `;
}

function saveIdsAndComment(ids, comment) {
  if (ids.length > 0) {
    var i = 0;
    while(ids[i]){
      if(saveIdsAndCommentArray.some(item => item.ids == ids[i])){
        var j = 0;
        while(saveIdsAndCommentArray[j]){
          if(saveIdsAndCommentArray[j].ids == ids[i]){
            saveIdsAndCommentArray[j].comment = saveIdsAndCommentArray[j].comment + "<br>" + comment;
          }
          j++;
        }
      }
      else{
        const data = {
          ids: ids[i],
          comment: comment,
          check:1,
        };
        saveIdsAndCommentArray.push(data);
      }
      i++;
    }
  }
}

function removeIdsAndComment(idsToRemove) {
  saveIdsAndCommentArray = saveIdsAndCommentArray.filter(item => !idsToRemove.includes(item.ids));
}

function clickSaveIdsAndComment(ids, comment) {
  var i = 0;
  var check = 0;
  while(saveIdsAndCommentArray[i]){
    console.log(saveIdsAndCommentArray[i].ids == ids);
    if(saveIdsAndCommentArray[i].ids == ids){
      saveIdsAndCommentArray[i].comment = saveIdsAndCommentArray[i].comment + "<br>" + comment;
      check = 1;
      break;
    }
    i++;
  }
  if(check == 0){
    const data = {
      ids: ids,
      comment: comment,
      check: 1,
    };
    saveIdsAndCommentArray.push(data);
  }
}

function clickRemoveIdsAndComment(idsToRemove) {
  saveIdsAndCommentArray = saveIdsAndCommentArray.filter(item => item.ids !== idsToRemove);
}

function updateCircleStyle() {
  d3.selectAll("circle")
        // .style("r", function(d){
        //   if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1) || d.C_id == is_it_click) {
        //     return 4;
        //   }
        //   else{
        //     return 3;
        //   }
        // })
        .style("stroke-width",  function (d) {
          if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1) || d.C_id == is_it_click) {
            return 2;
          }
          else{
            return 1;
          }
        })
        .style("stroke", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1 || d.C_id == is_it_click) {
            return "#FF9999";
          }
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            return "#FF0000";
          }
          else{
            return "#000000";
          }
        })
        .style("fill", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1 || d.C_id == is_it_click) {
            return "#FF9999";
          }
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            return "#FF0000";
          }
          else{
            return "#000000";
          }
        })
        .style("filter", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1 || d.C_id == is_it_click) {
            return "drop-shadow(1px 2px #000000)";
          }
          else{
            return "drop-shadow(0 0 0 black)";
          }
        })
}

function selectCircle(){
  const selectionBox = document.createElement("div");
  selectionBox.id = "selectionBox";
  selectionBox.style.position = "absolute";
  selectionBox.style.border = "1px solid #FF0000";
  selectionBox.style.backgroundColor = "rgba(255, 181, 181, 0.2)";
  selectionBox.style.pointerEvents = "none";

  let startX, startY;

  document.addEventListener("mousedown", mouseOn = (e) => {
    if(!document.getElementById('commentBox') || filterCheck == 1){
      d3.selectAll("circle")
        .each(function(d){
          const circle = d3.select(this);
          const rect = circle.node().getBoundingClientRect();
          var locationX;
          var locationY;
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            locationX = rect.left + window.scrollX + 4;
            locationY = rect.top + window.scrollY + 4;
          }
          else{
            locationX = rect.left + window.scrollX + 3;
            locationY = rect.top + window.scrollY + 3;
          }
    
          d.locationX = locationX;
          d.locationY = locationY;
      })
      if(!document.getElementById('selectionBox')){
        document.body.appendChild(selectionBox);
      }
      startX = e.clientX;
      startY = e.clientY;

      selectionBox.style.left = startX + "px";
      selectionBox.style.top = startY + "px";
      selectionBox.style.width = "0";
      selectionBox.style.height = "0";

      divSelectedC_id = [];
      startSelectX = 0;
      startSelectY = 0;
      endSelectX = 0;
      endSelectY = 0;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
  });

  function onMove(e) {
    d3.selectAll("circle")
        .each(function(d){
          const circle = d3.select(this);
          const rect = circle.node().getBoundingClientRect();
          var locationX;
          var locationY;
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            locationX = rect.left + window.scrollX + 4;
            locationY = rect.top + window.scrollY + 4;
          }
          else{
            locationX = rect.left + window.scrollX + 3;
            locationY = rect.top + window.scrollY + 3;
          }
    
          d.locationX = locationX;
          d.locationY = locationY;
        })
    divSelectedC_id = [];
    selectionBox.style.display = "flex";
    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = currentX - startX;
    const height = currentY - startY;

    selectionBox.style.width = Math.abs(width) + "px";
    selectionBox.style.height = Math.abs(height) + "px";
    selectionBox.style.left = Math.min(startX, currentX) + "px";
    selectionBox.style.top = Math.min(startY, currentY) + "px";

    // 计算右下角的坐标
    endSelectX = Math.max(startX, currentX);
    endSelectY = Math.max(startY, currentY);

    // 计算左上角的坐标
    startSelectX = Math.min(startX, currentX);
    startSelectY = Math.min(startY, currentY);

    d3.selectAll("circle")
        .filter(function(d){
          // console.log("startSelectX:",startSelectX,"endSelectX:",endSelectX,"d.locationX:",d.locationX,"startSelectY:",startSelectY,"endSelectY:",endSelectY,"d.locationY:",d.locationY);
          return (startSelectX <= d.locationX && endSelectX > d.locationX && startSelectY <= d.locationY && endSelectY > d.locationY);
        })
        .each(function(d) {
          // 在这里将符合条件的 d.C_id 储存到 divSelectedC_id 数组中
          if (divSelectedC_id.indexOf(d.C_id) === -1) {
            divSelectedC_id.push(d.C_id);
          }
        });
    d3.selectAll("circle")
        // .style("r", function(d){
        //   if (divSelectedC_id.indexOf(d.C_id) != -1) {
        //     return 5;
        //   }
        //   if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
        //     return 4;
        //   }
        //   else{
        //     return 3;
        //   }
        // })
        .style("stroke-width", function (d) {
            return 1;
        })
        .style("stroke", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1) {
            return "#FF9999";
          }
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            return "#FF0000";
          }
          else{
            return "#000000";
          }
        })
        .style("fill", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1) {
            return "#FF9999";
          }
          if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
            return "#FF0000";
          }
          else{
            return "#000000";
          }
        })
        .style("filter", function (d) {
          if (divSelectedC_id.indexOf(d.C_id) != -1) {
            return "drop-shadow(1px 2px #000000)";
          }
          else {
            return "drop-shadow(0 0 0 black)";
          }
        })
        // .style("fill", function (d) {
        //   if (d.school_degree == "bachelor") {
        //     return "white";
        //   } else if (d.school_degree == "master") {
        //     return "grey";
        //   } else if (d.school_degree == "doctor" || d.school_degree == "PhD") {
        //     return "black";
        //   } else if (d.job_change_count == 1) {
        //     return "black";
        //   } else if (d.job_change_count > 1 && d.job_change_count <= 4) {
        //     return "grey";
        //   } else if (d.job_change_count > 4) {
        //     return "white";
        //   } else {
        //     return "green";
        //   }
        // });
    // 使用 Set 來去除重複的 ids
    const uniqueIdsSet = [];

    saveIdsAndCommentArray.forEach(item => {
      if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
        uniqueIdsSet.push(item.ids);
      }
    });
    for(var clicked_i = 0; clicked_i < clicked_id.length; clicked_i++){
      if (!uniqueIdsSet.includes(clicked_id[clicked_i])) {
        uniqueIdsSet.push(clicked_id[clicked_i]);
      }
    }
    for(var divSelectedC_id_i = 0; divSelectedC_id_i < divSelectedC_id.length; divSelectedC_id_i++){
      if (!uniqueIdsSet.includes(divSelectedC_id[divSelectedC_id_i])) {
        uniqueIdsSet.push(divSelectedC_id[divSelectedC_id_i]);
      }
    }
    const sumOfIds = uniqueIdsSet.length;

    var Already_choose = document.getElementById('Already_choose');
    Already_choose.innerHTML =
    `

    <div class="nextPageDiv">
      <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
      <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
      </svg>
    </div>
    `;
  }

  function onUp(e) {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    
    var mask = document.getElementById("mask");
    mask.style.pointerEvents = "fill";

    const commentBox = document.createElement("div");
    commentBox.id = "commentBox";
    commentBox.style.position = "absolute";
    commentBox.style.border = "1px solid #000";
    commentBox.style.backgroundColor = "gray";
    commentBox.style.width = "302px";
    commentBox.style.height = "190px";
    var commentBoxLeft = endSelectX;
    var commentBoxTop = endSelectY;
    if(commentBoxLeft+310 >= window.innerWidth){
      commentBoxLeft = window.innerWidth - 310;
    }
    if(commentBoxTop+200 >= window.innerHeight){
      commentBoxTop = window.innerHeight - 200;
    }
    commentBox.style.left = commentBoxLeft +'px';
    commentBox.style.top = commentBoxTop +'px';
    commentBox.style.zIndex = "10000";

    // Create the input element
    const inputElement = document.createElement("textarea");
    inputElement.placeholder = "Enter your comment here...";
    inputElement.style.margin = "3px"; // Optional: Add some margin for better appearance

    // 設置文本框的寬度和高度
    inputElement.style.width = "290px";
    inputElement.style.height = "120px";

    // 允許文本框自動換行
    inputElement.style.overflowWrap = "break-word";

    // Create the submit button
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.style.cursor = "pointer";
    submitButton.style.fontFamily = "'Belanosima', sans-serif";
    submitButton.style.margin = "2px"; // Optional: Add some margin for better appearance

    // Add a click event listener to the submit button
    submitButton.addEventListener("click", () => {
      const commentText = inputElement.value;

      if(commentText == ''){
        alert("Comment cannot be empty!");
      }
      else if(commentText != ''){
        saveIdsAndComment(divSelectedC_id, commentText);
        console.log(saveIdsAndCommentArray);

        divSelectedC_id = [];
        mask.style.pointerEvents = "none";
        document.body.removeChild(commentBox);
        document.body.removeChild(selectionBox);
        updateData(saveIdsAndCommentArray);
        updateCircleStyle();
        
        // 使用 Set 來去除重複的 ids
        const uniqueIdsSet = [];

        saveIdsAndCommentArray.forEach(item => {
          if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
            uniqueIdsSet.push(item.ids);
          }
        });
        const sumOfIds = uniqueIdsSet.length;
        
        var Already_choose = document.getElementById('Already_choose');
        Already_choose.innerHTML =
        `

        <div class="nextPageDiv">
          <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
          <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
          </svg>
        </div>
        `;
      }
    });

    // Create the cancel button
    const closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontFamily = "'Belanosima', sans-serif";
    closeButton.style.margin = "3px"; // Optional: Add some margin for better appearance
    closeButton.style.float = "right";

    // Add a click event listener to the cancel button
    closeButton.addEventListener("click", () => {
      divSelectedC_id = [];
      mask.style.pointerEvents = "none";
      document.body.removeChild(commentBox);
      document.body.removeChild(selectionBox);
      updateCircleStyle();
        
        // 使用 Set 來去除重複的 ids
        const uniqueIdsSet = [];

        saveIdsAndCommentArray.forEach(item => {
          if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
            uniqueIdsSet.push(item.ids);
          }
        });
        const sumOfIds = uniqueIdsSet.length;
      
        var Already_choose = document.getElementById('Already_choose');
        Already_choose.innerHTML =
        `

        <div class="nextPageDiv">
          <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
          <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
          </svg>
        </div>
        `;
    });

    // Create the Remove button
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.style.cursor = "pointer";
    removeButton.style.fontFamily = "'Belanosima', sans-serif";
    removeButton.style.margin = "2px"; // Optional: Add some margin for better appearance

    // Add a click event listener to the cancel button
    removeButton.addEventListener("click", () => {
      removeIdsAndComment(divSelectedC_id);
      console.log(saveIdsAndCommentArray);

      divSelectedC_id = [];
      mask.style.pointerEvents = "none";
      document.body.removeChild(commentBox);
      if(document.getElementById('selectionBox')){
        document.body.removeChild(selectionBox);
      }
      //removeAll
      updateData(saveIdsAndCommentArray);
      console.log('haha');
      updateCircleStyle();
      
      // 使用 Set 來去除重複的 ids
      const uniqueIdsSet = [];

      saveIdsAndCommentArray.forEach(item => {
        if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
          uniqueIdsSet.push(item.ids);
        }
      });
      const sumOfIds = uniqueIdsSet.length;
      
      var Already_choose = document.getElementById('Already_choose');
      Already_choose.innerHTML =
        `
        <div class="nextPageDiv">
          <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
          <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
          </svg>
        </div>
        `;
    });
      
    const commentBoxTitle = document.createElement("p");
    commentBoxTitle.innerText = "Comment:";
    commentBoxTitle.style.color = "#fff";
    commentBoxTitle.style.height = "10px";
    commentBoxTitle.style.width = "15px";
    commentBoxTitle.style.margin = "0px";
    commentBoxTitle.style.marginLeft = "5px";
    commentBoxTitle.style.display = "inline";
    commentBoxTitle.style.fontSize = "25px";

    if(!document.getElementById('commentBox') || !divSelectedC_id[0]){
      document.body.appendChild(commentBox);
      commentBox.appendChild(commentBoxTitle);
      commentBox.appendChild(closeButton);
      commentBox.appendChild(inputElement);
      commentBox.appendChild(submitButton);
      commentBox.appendChild(removeButton);
    }
    if(!divSelectedC_id[0]){
      mask.style.pointerEvents = "none";
      document.body.removeChild(commentBox);
      divSelectedC_id = [];
      if(document.getElementById('selectionBox')){
        document.body.removeChild(selectionBox);
      }
    }
  }
}
selectCircle();
function Filter_a(data){
  var num = 0;
  while(data[num]){
    data[num].school_degree = data[num].school_degree.toLowerCase();
    num++;
  }
  data_filter_a = data;
}
function toggleBigBox() {
  document.getElementsByClassName('graph')[0].style.pointerEvents= 'none';
  document.getElementById('Already_choose').style.pointerEvents = 'none';

  var parent;
  document.removeEventListener("mousedown",mouseOn)

  filterCheck = 1

  function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log(event.target.id)
  }

  var big_box = document.getElementById("big_box");
  if(window.getComputedStyle(big_box).getPropertyValue("display") == "none") {
    big_box.style.display = "flex"; // 显示大Div
    if(Slider_lock == 0){
      Slider();
      Slider_lock = 1;
    }
    var groupedData = Array.from(d3.group(data_filter_a, d => (d.school_name.toLowerCase() || d.school_name)), ([category, data_filter_a]) => {
      return {
        category: category.toUpperCase(),
        count: data_filter_a.length,
      }; // 返回包含分组信息和数量的对象
    });

    groupedData = groupedData.sort((a, b) =>{
      const A = a.category
      const B = b.category
      return A.localeCompare(B);
    })
    tagCreator()
    function tagCreator(){
      var max = 0;

      for (var i = 0; i < groupedData.length; i++) {
        var lengthCount = groupedData[i].count;
        if (lengthCount > max) {
          max = lengthCount;
        }
      }

      for(var i = 0; i < groupedData.length; i++){
        var percentage = groupedData[i].count/max*100 +'%';
        var departmentTag = document.createElement('div')
        departmentTag.id = groupedData[i].category;
        departmentTag.style.height = '30px';
        departmentTag.style.width = 'calc(33.33% - 10px)';
        departmentTag.style.margin = '1.3% 1.3%';
        departmentTag.style.backgroundColor = 'white';
        departmentTag.style.border = '2px solid black';
        departmentTag.style.borderRadius = '5px';
        departmentTag.style.fontSize = '12px';
        departmentTag.style.textAlign = 'center';
        departmentTag.style.justifyContent = 'center';
        departmentTag.style.cursor = 'grab';
        departmentTag.style.display = 'inline-block'
        departmentTag.draggable = 'true';
        departmentTag.ondragstart = drag;
        departmentTag.innerHTML = `<p style="border-bottom: 2px solid black; margin: 0; margin-top:1.5px; margin-bottom:1.5px;">${groupedData[i].category}</p>`;

        // 创建SVG元素
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '95%');
        svg.setAttribute('height', '95%');
        svg.style.margin = '2.5%';
       
        // 创建矩形元素
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('height', '8'); // y范围的值为50
        rect.setAttribute('width', percentage); // percentage

        if(prioritySchool.includes(groupedData[i].category.toLowerCase()) || prioritySchool.includes(groupedData[i].category)){
          rect.setAttribute('fill', 'black'); // 填充颜色
        }else if(preferSchool.includes(groupedData[i].category.toLowerCase()) || preferSchool.includes(groupedData[i].category)){
          rect.setAttribute('fill', '#555555'); // 填充颜色
        }else{
          rect.setAttribute('fill', '#AAAAAA'); // 填充颜色
        }
        // 将矩形添加到SVG中
        svg.appendChild(rect);

        // 将SVG添加到下半部分的div中
        departmentTag.appendChild(svg);
        // var departmentCount = document.createElement('div');
        // departmentCount.style.height = '50%';
        // departmentCount.style.width = '100%';
        // departmentCount.style.background = 'black';
        // departmentCount.style.borderRadius = 'px'

        // departmentTag.appendChild(departmentCount);

        if(prioritySchool.includes(groupedData[i].category.toLowerCase()) || prioritySchool.includes(groupedData[i].category)){

          parent = document.getElementById('priority_a');
        }else if(preferSchool.includes(groupedData[i].category.toLowerCase()) || preferSchool.includes(groupedData[i].category)){

          parent = document.getElementById('prefer_a');
        }else{

          parent = document.getElementById('else_a'); 
        }
        (function(index){

          var labelElement = document.createElement("label");
          labelElement.id = 'IDforfilterLabel';
          labelElement.className = 'filterLabel';
          labelElement.style.position = "absolute";
          labelElement.style.backgroundColor = "white";
          labelElement.style.padding = "5px";
          labelElement.style.border = "1px solid black";
          labelElement.style.display = "none"; // 初始隐藏 label

          departmentTag.addEventListener('mouseover', function(event){
            var numberOfPpl = groupedData[index].count;
            var labelContent = numberOfPpl; // 显示的内容可以根据需要调整

            // 设置 label 元素的文本内容和位置，并显示 label
            labelElement.textContent = labelContent + ' people';
            labelElement.style.left = (event.pageX + 2) + "px";
            labelElement.style.top = (event.pageY + 2) + "px";
            labelElement.style.fontFamily = "Open Sans, sans-serif";
            labelElement.style.fontSize = ''
            labelElement.style.userSelect = 'none';
            labelElement.style.zIndex = '1';

            document.body.appendChild(labelElement);
            labelElement.style.display = "block";
          })
          departmentTag.addEventListener("mouseout", function() {
            // 隐藏 labelElement 并从文档中移除
            document.body.removeChild(labelElement);
          });
          departmentTag.addEventListener('dragstart', function(){
            document.body.removeChild(labelElement);
          })
        })(i)
        parent.appendChild(departmentTag);
        if(document.getElementById('IDforfilterLabel')){
          document.body.removeChild(document.getElementById('IDforfilterLabel'));
        }
      }
    }
    const dropContainers = document.querySelectorAll(".school_horizontal_small_box");
    dropContainers.forEach(container => {
      container.addEventListener("dragover", function(event) {
        event.preventDefault();
      });
    
      container.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const containerId = event.currentTarget.id;
        const draggedElement = document.getElementById(data);
        const draggedElementParent = draggedElement.parentNode;

        if (!container.contains(draggedElement)) {
          container.appendChild(draggedElement);
        }
        if(containerId == 'priority_a'){
          if(draggedElementParent.id == 'prefer_a'){
            const index = preferSchool.indexOf(data);
            if(index != -1){
              preferSchool.splice(index,1);
            }
          }
          event.currentTarget.appendChild(draggedElement);
          prioritySchool.push(data);
          document.getElementById('prefer_a').innerHTML='';
          document.getElementById('priority_a').innerHTML='';
          document.getElementById('else_a').innerHTML='';
          tagCreator()
        }else if(containerId == 'prefer_a'){
          if(draggedElementParent.id == 'priority_a'){
            const index = prioritySchool.indexOf(data);
            if(index != -1){
              prioritySchool.splice(index,1);
            }
          }
          event.currentTarget.appendChild(draggedElement);
          preferSchool.push(data);
          document.getElementById('prefer_a').innerHTML='';
          document.getElementById('priority_a').innerHTML='';
          document.getElementById('else_a').innerHTML='';
          tagCreator()
        }else{
          if(draggedElementParent.id == 'priority_a'){
            const index = prioritySchool.indexOf(data);
            if(index != -1){
              prioritySchool.splice(index,1);
            }
            document.getElementById('prefer_a').innerHTML='';
            document.getElementById('priority_a').innerHTML='';
            document.getElementById('else_a').innerHTML='';
            tagCreator()
          }else if(draggedElementParent.id == 'prefer_a'){
            const index = preferSchool.indexOf(data);
            if(index != -1){
              preferSchool.splice(index,1);
            }
            document.getElementById('prefer_a').innerHTML='';
            document.getElementById('priority_a').innerHTML='';
            document.getElementById('else_a').innerHTML='';
            tagCreator()
          }
        }
      });
    });
  }
}

function closeToggleBigBox(){
  document.getElementsByClassName('graph')[0].style.pointerEvents= 'auto';
  document.getElementById('Already_choose').style.pointerEvents = 'auto';
  preferSchool = [];
  prioritySchool = [];
  preferSchool = Array.from(document.getElementById('prefer_a').children).map(child => child.id);
  prioritySchool = Array.from(document.getElementById('priority_a').children).map(child => child.id)
  document.getElementById('school_bar').innerHTML='';
  document.getElementById('prefer_a').innerHTML='';
  document.getElementById('priority_a').innerHTML='';
  document.getElementById('else_a').innerHTML='';
  big_box.style.display = "none"; // 隐藏大Div
  document.addEventListener("mousedown",mouseOn);
  filterCheck = 0;
  barChart(data_filter_a);
  more_div(data_filter_a);
}

function Filter_w(data){
  data_filter_w = data;
}
function toggleBigBox1() {
  document.getElementsByClassName('graph')[0].style.pointerEvents= 'none'
  document.getElementById('Already_choose').style.pointerEvents = 'none';

  var parent;
  document.removeEventListener("mousedown",mouseOn)

  filterCheck = 1

  function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  var big_box1 = document.getElementById("big_box1");
  if (window.getComputedStyle(big_box1).getPropertyValue("display") == "none") {
    big_box1.style.display = "flex"; // 显示大Div
    if(Slider_work_lock == 0){
      Slider_work();
      Slider_work_lock = 1; 
    }

    var groupedData = Array.from(d3.group(data_filter_w, d => (d.work_name)), ([category, data_filter_w]) => {
      return {
        category: category,
        count: data_filter_w.length,
      }; // 返回包含分组信息和数量的对象
    });

    groupedData = groupedData.sort((a, b) =>{
      const A = a.category
      const B = b.category
      return A.localeCompare(B);
    })
    tagCreator()
    function tagCreator(){
      var max = 0;

      for (var i = 0; i < groupedData.length; i++) {
        var lengthCount = groupedData[i].count;
        if (lengthCount > max) {
          max = lengthCount;
        }
      }

      for(var i = 0; i < groupedData.length; i++){
        var percentage = groupedData[i].count/max*100 +'%';
        var departmentTag = document.createElement('div')
        departmentTag.id = groupedData[i].category;
        departmentTag.style.height = '30px';
        departmentTag.style.maxWidth = 'calc(50% - 10px)';
        departmentTag.style.margin = '1.3% 1.3%';
        departmentTag.style.marginTop = '2%'
        departmentTag.style.backgroundColor = 'white';
        departmentTag.style.border = '2px solid black';
        departmentTag.style.borderRadius = '5px';
        departmentTag.style.fontSize = '12px';
        departmentTag.style.textAlign = 'center';
        departmentTag.style.justifyContent = 'center';
        departmentTag.style.cursor = 'grab';
        departmentTag.style.display = 'inline-block'
        departmentTag.draggable = 'true';
        departmentTag.ondragstart = drag;
        departmentTag.innerHTML = `<p class="departmentTag_P" style="border-bottom: 2px solid black; margin:3; margin-top:1.5px; margin-bottom:1.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${groupedData[i].category}</p>`

        // 创建SVG元素
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '95%');
        svg.setAttribute('height', '95%');
        svg.style.margin = '2.5%';

        // 创建矩形元素
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('height', '8'); 
        rect.setAttribute('width', percentage); // percentage

        if(priorityWork.includes(groupedData[i].category.toLowerCase()) || priorityWork.includes(groupedData[i].category)){
          rect.setAttribute('fill', 'black'); // 填充颜色
        }else if(preferWork.includes(groupedData[i].category.toLowerCase()) || preferWork.includes(groupedData[i].category)){
          rect.setAttribute('fill', '#555555'); // 填充颜色
        }else{
          rect.setAttribute('fill', '#AAAAAA'); // 填充颜色
        }
        // 将矩形添加到SVG中
        svg.appendChild(rect);

        // 将SVG添加到下半部分的div中
        departmentTag.appendChild(svg);

        if(priorityWork.includes(groupedData[i].category.toLowerCase()) || priorityWork.includes(groupedData[i].category) || priorityWork.includes(groupedData[i].category.toUpperCase())){
          // departmentTag.style.borderColor = '#0066CC';
          parent = document.getElementById('priority_w');
        }else if(preferWork.includes(groupedData[i].category.toUpperCase()) || preferWork.includes(groupedData[i].category)|| preferWork.includes(groupedData[i].category.toUpperCase())){
          // departmentTag.style.borderColor = '#0080FF';
          parent = document.getElementById('prefer_w');
        }else{
          // departmentTag.style.borderColor = '#D2E9FF';
          parent = document.getElementById('else_w'); 
        }
        
        (function(index){
          
          var labelElement = document.createElement("label");
          labelElement.id = 'IDforfilterLabel';
          labelElement.className = 'filterLabel';
          labelElement.style.position = "absolute";
          labelElement.style.backgroundColor = "white";
          labelElement.style.padding = "5px";
          labelElement.style.border = "1px solid black";
          labelElement.style.display = "none"; // 初始隐藏 label

          departmentTag.addEventListener('mouseover', function(event){
            var numberOfPpl = groupedData[index].count;
            var labelContent = numberOfPpl; // 显示的内容可以根据需要调整

            // 设置 label 元素的文本内容和位置，并显示 label
            labelElement.innerHTML = groupedData[index].category + '<br>' + labelContent + ' people';
            labelElement.style.left = (event.pageX + 10) + "px";
            labelElement.style.top = (event.pageY + 10) + "px";
            labelElement.style.fontFamily = "Open Sans, sans-serif";
            labelElement.style.fontSize = ''
            labelElement.style.userSelect = 'none';
            labelElement.style.zIndex = '99';

            document.body.appendChild(labelElement);
            labelElement.style.display = "block";
          })
          departmentTag.addEventListener("mouseout", function() {
            // 隐藏 labelElement 并从文档中移除
            document.body.removeChild(labelElement);
          });
          departmentTag.addEventListener('dragstart', function(){
            document.body.removeChild(labelElement);
          })
        })(i)
        // var element_p = document.querySelectorAll('.departmentTag_P');
        // element_p.forEach(function(element) {
        //   element.addEventListener('mouseover', function(event){
        //     var departmentName = groupedData[i].category;
        //     var labelContent = departmentName; // 显示的内容可以根据需要调整
    
        //     // 设置 label 元素的文本内容和位置，并显示 label
        //     labelElement.textContent = labelContent;
        //     labelElement.style.left = (event.pageX + 10) + "px";
        //     labelElement.style.top = (event.pageY + 10) + "px";
        //     labelElement.style.fontFamily = "Open Sans, sans-serif";
        //     labelElement.style.fontSize = ''
        //     labelElement.style.userSelect = 'none';
        //     labelElement.style.zIndex = '99';
    
        //     document.body.appendChild(labelElement);
        //     labelElement.style.display = "block";
        //   })
        //   element.addEventListener("mouseout", function() {
        //     // 隐藏 labelElement 并从文档中移除
        //     labelElement.style.display = "none";
        //     if (labelElement.parentNode) {
        //       labelElement.parentNode.removeChild(labelElement);
        //     }
        //   });
        // });
        

        parent.appendChild(departmentTag);
        if(document.getElementById('IDforfilterLabel')){
          document.body.removeChild(document.getElementById('IDforfilterLabel'));
        }
      }
    }

    const dropContainers = document.querySelectorAll(".work_horizontal_small_box");
      dropContainers.forEach(container => {
        container.addEventListener("dragover", function(event) {
          event.preventDefault();
        });
    
      container.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const containerId = event.currentTarget.id;
        const draggedElement = document.getElementById(data);
        const draggedElementParent = draggedElement.parentNode;

        if (!container.contains(draggedElement)) {
          container.appendChild(draggedElement);

        }
        if(containerId == 'priority_w'){
          if(draggedElementParent.id == 'prefer_w'){
            const index = preferWork.indexOf(data);
            if(index != -1){
              preferWork.splice(index,1);
            }
          }
          event.currentTarget.appendChild(draggedElement);
          priorityWork.push(data);
          document.getElementById('prefer_w').innerHTML='';
          document.getElementById('priority_w').innerHTML='';
          document.getElementById('else_w').innerHTML='';
          tagCreator()
        }else if(containerId == 'prefer_w'){
          if(draggedElementParent.id == 'priority_w'){
            const index = priorityWork.indexOf(data);
            if(index != -1){
              priorityWork.splice(index,1);
            }
          }
          event.currentTarget.appendChild(draggedElement);
          preferWork.push(data);
          document.getElementById('prefer_w').innerHTML='';
          document.getElementById('priority_w').innerHTML='';
          document.getElementById('else_w').innerHTML='';
          tagCreator()
        }else{
          if(draggedElementParent.id == 'priority_w'){
            const index = priorityWork.indexOf(data);
            if(index != -1){
              priorityWork.splice(index,1);
            }
            document.getElementById('prefer_w').innerHTML='';
            document.getElementById('priority_w').innerHTML='';
            document.getElementById('else_w').innerHTML='';
            tagCreator()
          }else if(draggedElementParent.id == 'prefer_w'){
            const index = preferWork.indexOf(data);
            if(index != -1){
              preferWork.splice(index,1);
            }
            document.getElementById('prefer_w').innerHTML='';
            document.getElementById('priority_w').innerHTML='';
            document.getElementById('else_w').innerHTML='';
            tagCreator()
          }
        }
        // if(containerId == 'priority_w'){
        //   prioritySchool.push(data);
        //   draggedElement.style.borderColor = '#0066CC';
        // }else if(containerId == 'prefer_w'){
        //   preferSchool.push(data);
        //   draggedElement.style.borderColor = '#0080FF';
        // }else{
        //   draggedElement.style.borderColor = '#D2E9FF';
        // }

        if (document.querySelectorAll(".filterLabel").parentNode) {
          document.querySelectorAll(".filterLabel").parentNode.removeChild(document.querySelectorAll(".filterLabel"))
        }
        // closeToggleBigBox1();
        // toggleBigBox1();
      });
    });
}
}
function closeToggleBigBox1(){
  document.getElementsByClassName('graph')[0].style.pointerEvents= 'auto'
  document.getElementById('Already_choose').style.pointerEvents = 'auto';
  big_box1.style.display = "none"; // 隐藏大Div
  preferWork = [];
  priorityWork = [];
  preferWork = Array.from(document.getElementById('prefer_w').children).map(child => child.id);
  priorityWork = Array.from(document.getElementById('priority_w').children).map(child => child.id)
  document.getElementById('work_bar').innerHTML='';
  document.getElementById('prefer_w').innerHTML='';
  document.getElementById('priority_w').innerHTML='';
  document.getElementById('else_w').innerHTML='';
  document.addEventListener("mousedown",mouseOn);
  filterCheck = 0;
  barChart_w(data_filter_w);
  more_div_work(data_filter_w);
}
function count_svg_width(num){
  if(num<7){
    return 1;
  }
  else{
    return Math.ceil(num/7);
  }
}

function dot(data, id) {
  console.log(data)
  var svg_width = count_svg_width(data.length)*17;
  // set the dimensions and margins of the graph
  const margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svg_width - margin.left - margin.right,
    height = everyone_height - margin.top - margin.bottom;
  yBox0 = height + VerticalSpacing;

  // append the svg object to the body of the page
  const svg = d3.select('#' + id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(8, 1)`);

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 4])
    .range([0, width]);

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 4])
    .range([height, 0]);

  // Add dots
  var myCircle = svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("cx", function (d) { //x位置
      yBox0 = yBox0 - VerticalSpacing;
      if (yBox0 <= height - (VerticalSpacing * dotPerCol)) {
        xBox0 = xBox0 + HorizontalSpacing;
        yBox0 = height;
        boxHorizontal++;
      }
      runtime = 1;
      return (xBox0);
    })
    .attr("cy", function (d) { //y位置
      if (runtime == 1) {
        yBox0 = height + VerticalSpacing;
        runtime = 0;
      }
      if (runtime == 0) {
        yBox0 = yBox0 - VerticalSpacing;
        if (yBox0 <= height - (VerticalSpacing * dotPerCol)) {
          yBox0 = height;
        }
        return (yBox0);
      }
    })
    .attr("r", function (d) {
      if (d.school_degree == "bachelor" || d.school_degree == "Bachelor") {
        return 2;
      } else if (d.school_degree == "master" || d.school_degree == "Master") {
        return 4;
      } else if (d.school_degree == "doctor" || d.school_degree == "Doctor" || d.school_degree == "PhD") {
        return 6;
      }
    })
    .style("fill", function (d) {
      if (divSelectedC_id.indexOf(d.C_id) != -1 || d.C_id == is_it_click) {
        return "#FF6400";
      }
      if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
        return "#FF0000";
      }
      else{
        return "#000000";
      }
    })
    .style("stroke", function (d) {
      if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)) {
        return "#FF0000";
      }
      else{
        return "#000000";
      }
    })
    .style("stroke-width", function (d) {
      if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)) {
        return 2;
      }
      else{
        return 1;
      }
    })

    .on('mouseover', function (event, d) {
      myCircle.each(function(d){
        const circle = d3.select(this);
        const rect = circle.node().getBoundingClientRect();
        const locationX = rect.left + window.scrollX + 14;
        const locationY = rect.top + window.scrollY + 3;
  
        d.locationX = locationX;
        d.locationY = locationY;
      })
      is_it_mouseover = d.C_id;
      d3.selectAll("circle")
        .filter(function(d) {
          return d.C_id === is_it_mouseover;
        })
        // .style("r", 5)
        .style("stroke-width", function (d) {
          return 1;
        })
        .style("stroke", function (d) {
          return "#FF9999";
        })
        .style("fill", function (d) {
          return "#FF9999";
        })
        .style("filter", function (d) {
          return "drop-shadow(1px 2px #000000)";
        })

      d3.select(this).style("cursor", "pointer");
    })
    .on('mouseout', function (event, d) {
      is_it_mouseover = -1;
      updateCircleStyle();
      d3.select(this).style("cursor", "default"); 
    })
    .on('click', function (event, d) {
      myCircle.each(function(d){
        const circle = d3.select(this);
        const rect = circle.node().getBoundingClientRect();
        const locationX = rect.left + window.scrollX + 14;
        const locationY = rect.top + window.scrollY + 3;
  
        d.locationX = locationX;
        d.locationY = locationY;
      })
      is_it_click = d.C_id;
      d3.selectAll("circle")
        .filter(function(d) {
          return d.C_id === is_it_click;
        })
        // .style("r", 5)
        .style("stroke-width", 1)
        .style("stroke", "#FF9999");

      var mask = document.getElementById("mask");
      mask.style.pointerEvents = "fill";

      const commentBox = document.createElement("div");
      commentBox.id = "commentBox";
      commentBox.style.position = "absolute";
      commentBox.style.border = "1px solid #000";
      commentBox.style.backgroundColor = "gray";
      commentBox.style.width = "302px";
      commentBox.style.height = "190px";
      var commentBoxLeft = d.locationX;
      var commentBoxTop = d.locationY;
      if(commentBoxLeft+310 >= window.innerWidth){
        commentBoxLeft = window.innerWidth - 310;
      }
      if(commentBoxTop+200 >= window.innerHeight){
        commentBoxTop = window.innerHeight - 200;
      }
      commentBox.style.left = commentBoxLeft +'px';
      commentBox.style.top = commentBoxTop +'px';
      commentBox.style.zIndex = "10000";

      // Create the input element
      const inputElement = document.createElement("textarea");
      inputElement.placeholder = "Enter your comment here...";
      inputElement.style.margin = "3px"; // Optional: Add some margin for better appearance

      // 設置文本框的寬度和高度
      inputElement.style.width = "290px";
      inputElement.style.height = "120px";

      // 允許文本框自動換行
      inputElement.style.overflowWrap = "break-word";

      // Create the submit button
      const submitButton = document.createElement("button");
      submitButton.innerText = "Submit";
      submitButton.style.cursor = "pointer";
      submitButton.style.fontFamily = "'Belanosima', sans-serif";
      submitButton.style.margin = "2px"; // Optional: Add some margin for better appearance

      // Add a click event listener to the submit button
      submitButton.addEventListener("click", () => {
        const commentText = inputElement.value;
        
        if(commentText == ''){
          alert("Comment cannot be empty!");
        }
        else if(commentText != ''){
          clickSaveIdsAndComment(d.C_id, commentText);
          console.log(saveIdsAndCommentArray);

          is_it_click = -1;
          mask.style.pointerEvents = "none";
          if(document.getElementById('detail')){
            document.body.removeChild(detail);
            var photoDiv = document.getElementById('photoDiv');
            if (photoDiv) {
              var parent = photoDiv.parentNode;
              parent.removeChild(photoDiv);
            }
          }
          document.body.removeChild(commentBox);
          updateData(saveIdsAndCommentArray);
          console.log('haha');
          updateCircleStyle();
          
          // 使用 Set 來去除重複的 ids
          const uniqueIdsSet = [];

          saveIdsAndCommentArray.forEach(item => {
            if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
              uniqueIdsSet.push(item.ids);
            }
          });
          const sumOfIds = uniqueIdsSet.length;
          
          var Already_choose = document.getElementById('Already_choose');
          Already_choose.innerHTML =
          `
          <div class="nextPageDiv">
            <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
            <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
            </svg>
          </div>
          `;
        }
      });

      // Create the cancel button
      const closeButton = document.createElement("button");
      closeButton.innerText = "X";
      closeButton.style.cursor = "pointer";
      closeButton.style.fontFamily = "'Belanosima', sans-serif";
      closeButton.style.margin = "3px"; // Optional: Add some margin for better appearance
      closeButton.style.float = "right";

      // Add a click event listener to the cancel button
      closeButton.addEventListener("click", () => {
        if(document.getElementById('detail')){
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
        is_it_click = -1;
        mask.style.pointerEvents = "none";
        document.body.removeChild(commentBox);
        updateCircleStyle();
          
          // 使用 Set 來去除重複的 ids
          const uniqueIdsSet = [];

          saveIdsAndCommentArray.forEach(item => {
            if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
              uniqueIdsSet.push(item.ids);
            }
          });
          const sumOfIds = uniqueIdsSet.length;
        
          var Already_choose = document.getElementById('Already_choose');
          Already_choose.innerHTML =
          `
          <div class="nextPageDiv">
            <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
            <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
            </svg>
          </div>
          `;
      });

      // Create the Remove button
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.style.cursor = "pointer";
      removeButton.style.fontFamily = "'Belanosima', sans-serif";
      removeButton.style.margin = "2px"; // Optional: Add some margin for better appearance

      // Add a click event listener to the cancel button
      removeButton.addEventListener("click", () => {
        clickRemoveIdsAndComment(d.C_id);
        console.log(saveIdsAndCommentArray);

        is_it_click = -1;
        mask.style.pointerEvents = "none";
        if(document.getElementById('detail')){
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
        document.body.removeChild(commentBox);
        updateData(saveIdsAndCommentArray);
        updateCircleStyle();
        
        // 使用 Set 來去除重複的 ids
        const uniqueIdsSet = [];

        saveIdsAndCommentArray.forEach(item => {
          if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
            uniqueIdsSet.push(item.ids);
          }
        });
        const sumOfIds = uniqueIdsSet.length;
        
        var Already_choose = document.getElementById('Already_choose');
        Already_choose.innerHTML =
        `

        <div class="nextPageDiv">
          <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
          <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
          </svg>
        </div>
        `;
      });
      
      const commentBoxTitle = document.createElement("p");
      commentBoxTitle.innerText = "Comment:";
      commentBoxTitle.style.color = "#fff";
      commentBoxTitle.style.height = "10px";
      commentBoxTitle.style.width = "15px";
      commentBoxTitle.style.margin = "0px";
      commentBoxTitle.style.marginLeft = "5px";
      commentBoxTitle.style.display = "inline";
      commentBoxTitle.style.fontSize = "25px";

      // Create the detail button
      const detailButton = document.createElement("button");
      detailButton.innerText = "Show Detail";
      detailButton.style.cursor = "pointer";
      detailButton.style.fontFamily = "'Belanosima', sans-serif";
      detailButton.style.margin = "2px"; // Optional: Add some margin for better appearance
      detailButton.style.marginLeft = "92px";

      // Add a click event listener to the cancel button
      detailButton.addEventListener("click", () => {
        if(!document.getElementById('detail')){
          const detail = document.createElement("div");

          detail.id = "detail";
          detail.style.position = "absolute";
          detail.style.backgroundColor = "#eee";
          detail.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          
          var letMeKnowWhatIsMyComment = saveIdsAndCommentArray.reduce((result, item) => {
            const { ids, comment } = item;
            if (!result[ids]) {
              result[ids] = [];
            }
            result[ids].push(comment);
            return result;
          }, {});

          var container = document.createElement("div");
          container.className = "container";
          document.body.appendChild(container);

          var detail_a = ``;
          var detail_a_i = 0;
          var num_detail_a = 0;
          var detail_w = ``;
          var detail_w_i = 0;
          var num_detail_w = 0;

          while(data_filter_a[detail_a_i]){
            if(detail_a_i == 0)
              detail_a = `<pre style="font-size:15px;margin-top:-15px;">`;
            if(d.C_id == data_filter_a[detail_a_i].C_id){
              detail_a += `${data_filter_a[detail_a_i].school_name} | ${data_filter_a[detail_a_i].original_department} | ${data_filter_a[detail_a_i].school_degree} | ${data_filter_a[detail_a_i].school_start_year}/${data_filter_a[detail_a_i].school_start_month}-${data_filter_a[detail_a_i].school_end_year}/${data_filter_a[detail_a_i].school_end_month} | ${data_filter_a[detail_a_i].GPA}<br>`;
              num_detail_a++;
            }
            if(data_filter_a[detail_a_i+1])
              detail_a += `</pre>`;

            detail_a_i++;
          }

          while(data_filter_w[detail_w_i]){
            if(detail_w_i == 0)
              detail_w = `<pre style="font-size:15px;margin-top:-15px;">`;
            if(d.C_id == data_filter_w[detail_w_i].C_id){
              detail_w += `${data_filter_w[detail_w_i].work_name} | ${data_filter_w[detail_w_i].original_position} | ${data_filter_w[detail_w_i].work_start_year}/${data_filter_w[detail_w_i].work_start_month}-${data_filter_w[detail_w_i].work_end_year}/${data_filter_w[detail_w_i].work_end_month}<br>`;
              num_detail_w++;
            }
            if(data_filter_w[detail_w_i+1])
              detail_w += `</pre>`;

            detail_w_i++;
          }

          var comment_height;
          if(letMeKnowWhatIsMyComment[d.C_id]){
            comment_height = (letMeKnowWhatIsMyComment[d.C_id][0].split('<br>').length*17)+20;
          }
          else{
            comment_height = 20;
          }
          var aNwDetail_height = ((num_detail_a+num_detail_w)*17)+40;
          detail.style.width = "auto";
          detail.style.height = (100+aNwDetail_height+comment_height)+"px";
          var detialLocationX = d.locationX;
          var detialLocationY = d.locationY+200;
          if(detialLocationY+(100+aNwDetail_height+comment_height) >= window.innerHeight){
            detialLocationY = commentBoxTop - (100+aNwDetail_height+comment_height) -10;
          }
          detail.style.top = detialLocationY+'px';

          var detailGPA = d.GPA;
          if(detailGPA == 0){
            detailGPA = "not mentioned";
          }
          if(!letMeKnowWhatIsMyComment[d.C_id]){
            detail.innerHTML = `
            <div style="padding:20px;margin-top:-20px;">
              <div class="container3_1">
                <h1 class="perinfotit">${d.C_name}</h1>
              </div>
            </div>
            <div style="padding:20px;margin-top:-32px;">
              <div style="border-radius:5px;background-color: #fff;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div class="container3m" style="height:${aNwDetail_height+comment_height}px;">
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">School</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_a}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Work</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_w}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Comment</h1>
                  <div style="font-size:16px;margin-left:15px;"></div>
                </div>
              </div>
            </div>
            `;
          }else{
            detail.innerHTML = `
            <div style="padding:20px;margin-top:-20px;">
              <div class="container3_1">
                <h1 class="perinfotit">${d.C_name}</h1>
              </div>
            </div>
            <div style="padding:20px;margin-top:-32px;">
              <div style="border-radius:5px;background-color: #fff;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div class="container3m" style="height:${aNwDetail_height+comment_height}px;">
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">School</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_a}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Work</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_w}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Comment</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${letMeKnowWhatIsMyComment[d.C_id]}</div>
                </div>
              </div>
            </div>
            `;
          }

          if(!document.getElementById('detail')){
            document.body.appendChild(detail);
          }
          var detailID = document.getElementById("detail");
          var detailWidth = detailID.clientWidth;
          if(detialLocationX+detailWidth+25 >= window.innerWidth){
            detialLocationX = window.innerWidth - detailWidth - 25;
          }
          detail.style.left = detialLocationX+'px';

          var photoDiv = document.createElement("div");

          photoDiv.id = "photoDiv";
          photoDiv.style.height = "100px";
          photoDiv.style.width = "100px";
          photoDiv.style.position = "absolute";
          photoDiv.style.backgroundColor = "#eee";
          photoDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          photoDiv.style.padding = "15px";
          photoDiv.style.left = detialLocationX-135+'px';
          photoDiv.style.top = detialLocationY+'px';
          photoDiv.innerHTML = `
            <img src="../ai_picture/square/${d.C_photo}" width="100px" height="100px" border="2px solid #000">
          `;

          if(!document.getElementById('photoDiv')){
            document.body.appendChild(photoDiv);
          }
        }
        else{
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
      });

      if(!document.getElementById('commentBox')){
        document.body.appendChild(commentBox);
        commentBox.appendChild(commentBoxTitle);
        commentBox.appendChild(closeButton);
        commentBox.appendChild(inputElement);
        commentBox.appendChild(submitButton);
        commentBox.appendChild(removeButton);
        commentBox.appendChild(detailButton);
      }

      // 使用 Set 來去除重複的 ids
      const uniqueIdsSet = [];

      saveIdsAndCommentArray.forEach(item => {
        if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
          uniqueIdsSet.push(item.ids);
        }
      });
      if(!uniqueIdsSet.includes(d.C_id)){
        uniqueIdsSet.push(d.C_id);
      }
      const sumOfIds = uniqueIdsSet.length;
      
      var Already_choose = document.getElementById('Already_choose');
      Already_choose.innerHTML =
      `
      <div class="nextPageDiv">
        <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
        <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
        </svg>
      </div>
      `;
    });
}

function changeDataSet() {
  var changeColor = document.getElementById("checkDataSet");

  if(whatUWant == 0){
    whatUWant = 1;
    changeColor.style.color = "black";
  }
  else if(whatUWant == 1){
    whatUWant = 0;
    changeColor.style.color = "#fff";
  }

  document.getElementById('school_bar').innerHTML='';
  barChart(data_filter_a);
  more_div(data_filter_a);
  updateCircleStyle();
}

function more_div(data) {
  var num = 0;
  while(data[num]){
    data[num].school_degree = data[num].school_degree.toLowerCase();
    num++;
  }
  var elements = document.querySelectorAll("[id^='dot_graph']");
  // 遍历元素列表并移除每个元素
  elements.forEach(function (element) {
    element.remove();
  });
  // 获取要插入的父元素
  var parentElement = document.getElementById('school_dot');

  //根據 GPA 排序資料
  data.sort((a, b) => a.GPA - b.GPA);

  const sortForChange = ["doctor", "master", "bachelor"];

  // 根据指定的字符串属性进行排序
  data.sort((a, b) => {
    const indexA = sortForChange.indexOf(a.school_degree);
    const indexB = sortForChange.indexOf(b.school_degree);
    return indexA - indexB;
  });
  console.log(data);
  if(whatUWant == 1){
    const idMap = {};
    const result = [];

    for (const item of data) {
      const C_id = item.C_id;
      if (!idMap[C_id]) {
        idMap[C_id] = true;
        result.push(item);
      }
    }

    data = result;
    console.log(data);
  }

  const sortOrder = ["bachelor", "master", "doctor"];

  // 根据指定的字符串属性进行排序
  data.sort((a, b) => {
    const indexA = sortOrder.indexOf(a.school_degree);
    const indexB = sortOrder.indexOf(b.school_degree);
    return indexA - indexB;
  });
  // 设置要创建的div的数量
  var numberOfDivs = department.length;

  // 循环创建div元素
  for (var i = 0; i < numberOfDivs; i++) {
    // 创建div元素
    var divElement = document.createElement('div');
    
    //filter資料
    var priorityBox = [];
    var preferBox = [];
    var noSelect = [];
    var everyone_height_lock = 0;
    var tmp_everyone_height = 0;
    for (var filter_i = 0; filter_i < 4; filter_i++) {
      if (filter_i == 0)
        priorityBox[filter_i] = data.filter(d => prioritySchool.includes(d.school_name) && d.school_department === department[i] && d.GPA <= firstStop);
      if (filter_i == 1)
        priorityBox[filter_i] = data.filter(d => prioritySchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > firstStop && d.GPA <= secondStop);
      if (filter_i == 2)
        priorityBox[filter_i] = data.filter(d => prioritySchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > secondStop && d.GPA <= thirdStop);
      if (filter_i == 3)
        priorityBox[filter_i] = data.filter(d => prioritySchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > thirdStop);
      if (filter_i == 0)
        preferBox[filter_i] = data.filter(d => preferSchool.includes(d.school_name) && d.school_department === department[i] && d.GPA <= firstStop);
      if (filter_i == 1)
        preferBox[filter_i] = data.filter(d => preferSchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > firstStop && d.GPA <= secondStop);
      if (filter_i == 2)
        preferBox[filter_i] = data.filter(d => preferSchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > secondStop && d.GPA <= thirdStop);
      if (filter_i == 3)
        preferBox[filter_i] = data.filter(d => preferSchool.includes(d.school_name) && d.school_department === department[i] && d.GPA > thirdStop);
      if(filter_i == 0)
        noSelect[filter_i] = data.filter(d => !preferSchool.includes(d.school_name) && !prioritySchool.includes(d.school_name) && d.school_department == department[i] && d.GPA <= firstStop);
      if(filter_i == 1)
        noSelect[filter_i] = data.filter(d => !preferSchool.includes(d.school_name) && !prioritySchool.includes(d.school_name) && d.school_department == department[i] && d.GPA > firstStop && d.GPA <= secondStop);
      if(filter_i == 2)
        noSelect[filter_i] = data.filter(d => !preferSchool.includes(d.school_name) && !prioritySchool.includes(d.school_name) && d.school_department == department[i] && d.GPA > secondStop && d.GPA <= thirdStop);
      if(filter_i == 3)
        noSelect[filter_i] = data.filter(d => !preferSchool.includes(d.school_name) && !prioritySchool.includes(d.school_name) && d.school_department == department[i] && d.GPA > thirdStop);   
      
      var max_height = 120;  
      if(everyone_height_lock == 0){
        if((priorityBox[filter_i].length >= preferBox[filter_i].length) && (priorityBox[filter_i].length > tmp_everyone_height)){
          tmp_everyone_height = priorityBox[filter_i].length;
          everyone_height = (max_height/dotPerCol)*priorityBox[filter_i].length;
          // if(priorityBox[filter_i].length < 3){
          //   everyone_height = (max_height/dotPerCol)*3;
          // }
        }
        if((preferBox[filter_i].length > priorityBox[filter_i].length) && (preferBox[filter_i].length > tmp_everyone_height)){
          tmp_everyone_height = preferBox[filter_i].length;
          everyone_height = (max_height/dotPerCol)*preferBox[filter_i].length;
          // if(preferBox[filter_i].length < 3){
          //   everyone_height = (max_height/dotPerCol)*3;
          // }
        }
        if((noSelect[filter_i].length > tmp_everyone_height)){
          tmp_everyone_height = noSelect[filter_i].length;
          everyone_height = (max_height/dotPerCol)*noSelect[filter_i].length;
        }
      }
      if(priorityBox[filter_i].length >= dotPerCol || preferBox[filter_i].length >= dotPerCol || noSelect[filter_i].length >= dotPerCol){
        everyone_height_lock = 1;
        everyone_height = max_height;
      }
    }

    // 设置div的内容和样式（可根据需求自定义）
    divElement.id = 'dot_graph' + i;
    divElement.style.height = everyone_height+3+'px';
    divElement.style.width = '460px';
    divElement.style.display = 'flex';
    divElement.style.flexDirection = 'row';
    divElement.style.marginBottom = '20px';
    // divElement.style.borderBottom = '5px solid black';

    // 将div元素插入父元素中
    parentElement.appendChild(divElement);
    var insideParentElement = document.getElementById('dot_graph' + i);
    var departmentText = document.createElement('div');

    departmentText.textContent = department[i];
    // departmentText.style.backgroundColor = 'white';
    departmentText.style.color = '';
    departmentText.style.fontSize = '16px';
    departmentText.style.height = everyone_height+'px';
    departmentText.style.minWidth = '54px';
    departmentText.style.display = 'flex';
    departmentText.style.textAlign = 'center';
    departmentText.style.alignItems = 'center';
    departmentText.style.justifyContent = 'center';
    departmentText.style.borderTop = '2px solid #F6F1F1'
    departmentText.style.boxShadow = ' 0 5px 0 black';        
    departmentText.style.userSelect = 'none';
    var spaceDiv = document.createElement('div');
    spaceDiv.style.height = everyone_height+'px';
    spaceDiv.style.minWidth = '15px';
    spaceDiv.style.borderTop = '2px solid #F6F1F1'
    spaceDiv.style.boxShadow = ' 0 5px 0 black'; 

    insideParentElement.appendChild(departmentText);
    insideParentElement.appendChild(spaceDiv);
    preferBoxLock = 0;
    priorityBoxLock = 0;
    noSelectBoxLock = 0;

    var temp = 0;
    var departmentDiv = 0;
    var prefer_Count = data.filter(d => preferSchool.includes(d.school_name) && d.school_department === department[i] );
    var priority_Count = data.filter(d => prioritySchool.includes(d.school_name) && d.school_department === department[i])
    for (var j = 0; j < 3; j++) {

      var insideDiv = document.createElement('div');
      insideDiv.id = 'dot_graph' + i + '_' + j;
      insideDiv.style.display = 'flex';
      insideDiv.style.height = everyone_height+'px';

      var insideDivHorizontal = 0;

      insideParentElement.appendChild(insideDiv);
      for (var k = 0; k < 4; k++) {
        boxHorizontal = 1;
        var box = document.createElement('div');
        var childelement = document.getElementById(insideDiv.id);

        box.id = 'box' + i + '_' + j + '_' + k;
        box.className = 'box' + k;
        box.style.height = everyone_height+'px';
        var box_color;
        if (k == 0) {
          box_color = 'white';
        }
        else if (k == 1) {
          box_color = '#BBFFBB';
        }
        else if (k == 2) {
          box_color = '#79FF79';
        }
        else if (k == 3) {
          box_color = '#00DB00';
        }

        box.style.backgroundColor = box_color;

        childelement.appendChild(box);

        if(noSelect[k].length != 0){
          if (j == 0){
            dot(noSelect[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        if (preferBox[k].length != 0) {
          if (j == 1) {
            dot(preferBox[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        if (priorityBox[k].length != 0) {
          if (j == 2) {
            dot(priorityBox[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        
        yBox0 = 80 + VerticalSpacing;
        xBox0 = 0;
      }
      insideDiv.style.width = (insideDivHorizontal * 17) + 'px';
      
      if (j == 0 && insideDivHorizontal != 0){
        if(prefer_Count.length != 0 || priority_Count.length != 0){
          var spaceDiv = document.createElement('div');
          spaceDiv.style.height = everyone_height+'px';
          spaceDiv.style.minWidth = '15px';
          spaceDiv.style.borderTop = '2px solid #F6F1F1'
          spaceDiv.style.boxShadow = ' 0 5px 0 black'; 
          insideParentElement.appendChild(spaceDiv);
        }
        insideDiv.style.border = '2px solid #AAAAAA';
        insideDiv.style.borderLeft = '10px solid #AAAAAA';
        insideDiv.style.borderBottom = '0px';
        insideDiv.style.boxShadow = ' 0 5px 0 black';        
      }
      
        if (j == 1 && insideDivHorizontal != 0){
          if(priority_Count.length != 0){
            var spaceDiv = document.createElement('div');
            spaceDiv.style.height = everyone_height+'px';
            spaceDiv.style.minWidth = '15px';
            spaceDiv.style.borderTop = '2px solid #F6F1F1'
            spaceDiv.style.boxShadow = ' 0 5px 0 black'; 
            insideParentElement.appendChild(spaceDiv);
          }
          insideDiv.style.border = '2px solid #555555';
          insideDiv.style.borderLeft = '10px solid #555555';
          insideDiv.style.borderBottom = '0px';
          insideDiv.style.boxShadow = ' 0 5px 0 black';        
          
        }

        if (j == 2 && insideDivHorizontal != 0){
          insideDiv.style.border = '2px solid #000000';
          insideDiv.style.borderLeft = '10px solid #000000';
          insideDiv.style.borderBottom = '0px';
          insideDiv.style.boxShadow = ' 0 5px 0 black';        
        }
      }
  }
}

//左邊 bar chart(academic)
function barChart(data) {
  const sortForChange = ["doctor", "master", "bachelor"];

  // 根据指定的字符串属性进行排序
  data.sort((a, b) => {
    const indexA = sortForChange.indexOf(a.school_degree);
    const indexB = sortForChange.indexOf(b.school_degree);
    return indexA - indexB;
  });

  if(whatUWant == 1){
    const idMap = {};
    const result = [];

    for (const item of data) {
      const C_id = item.C_id;
      if (!idMap[C_id]) {
        idMap[C_id] = true;
        result.push(item);
      }
    }

    data = result;
    console.log(data);
  }

  //分群
  var groupedData = data.filter(d => preferSchool.includes(d.school_name) || prioritySchool.includes(d.school_name) || preferSchool.includes(d.school_name.toLowerCase()) || prioritySchool.includes(d.school_name.toLowerCase()) || data_filter_a.some(item => item.school_name == d.school_name) || data_filter_a.some(item => item.school_name == d.school_name.toLowerCase()));

  groupedData = Array.from(d3.group(groupedData, d => (d.school_department.toLowerCase() || d.school_department)), ([category, groupData]) => {
    const originalDepartment = category.toLowerCase() === "other" ? "other" : groupData[0].original_department; // 判断是否为 'other'
    const group1 = groupData.filter(d => (preferSchool.includes(d.school_name.toLowerCase()) || preferSchool.includes(d.school_name))); // prefer的数据
    const group2 = groupData.filter(d => (prioritySchool.includes(d.school_name.toLowerCase()) || prioritySchool.includes(d.school_name))); // priority的数据
    const group3 = data.filter(d => (!preferSchool.includes(d.school_name.toLowerCase()) && !preferSchool.includes(d.school_name) && 
    !prioritySchool.includes(d.school_name.toLowerCase()) && !prioritySchool.includes(d.school_name) && d.school_department.toLowerCase() == category.toLowerCase()));
    return {
      category: category.toUpperCase(),
      originalDepartment,
      group1,
      group2,
      group3,
      preferCount: group1.length,
      priorityCount: group2.length,
      noSelect: group3.length
    }; // 返回包含分组信息和数量的对象
  });

  groupedData.sort((a, b) => (b.preferCount + b.priorityCount + b.noSelect) - (a.preferCount + a.priorityCount + a.noSelect));
  var max = 0;
  for (var i = 0; i < groupedData.length; i++) {
    var lengthCount = groupedData[i].preferCount + groupedData[i].priorityCount + groupedData[i].noSelect;
    if (lengthCount > max) {
      max = lengthCount;
    }
  }
  // 获取要插入的父元素
  var parentElement = document.getElementById('school_bar');

  // 创建 label 元素并设置样式
  const labelElement = document.createElement("label");
  labelElement.style.position = "absolute";
  // labelElement.style.backgroundColor = "white";
  labelElement.style.padding = "5px";
  labelElement.style.border = "1px solid black";
  labelElement.style.display = "none"; // 初始隐藏 label
  

  for (var i = 0; i < groupedData.length; i++) {
    var divElement = document.createElement('div');
    divElement.id = 'school_bar' + i;
    divElement.style.height = barhight;
    divElement.style.width = barwidth;
    divElement.style.marginBottom = '10px';
    divElement.style.display = 'flex';
    divElement.style.flexDirection = 'row';
    divElement.style.boxSizing = 'border-box';
    divElement.style.cursor = 'pointer';

    var departmentText = document.createElement('div');
    departmentText.textContent = groupedData[i].category;
    departmentText.style.fontSize = '12px';
    departmentText.style.height = '90%';
    departmentText.style.width = barTextbox_width;
    departmentText.style.display = 'flex';
    departmentText.style.textAlign = 'center';
    departmentText.style.alignItems = 'center';
    departmentText.style.justifyContent = 'center';
    if(department.includes(groupedData[i].category)){
      departmentText.style.borderBottom = '4px solid black';
    }else{
      departmentText.style.borderBottom = '2px solid grey';
    }
    
    departmentText.style.userSelect = 'none';
    departmentText.id = 'barText'+ i;

    var departmentBar = document.createElement('div');
    var percentage1 = (groupedData[i].noSelect / max) * 100; // 第一种颜色的百分比
    var percentage2 = (groupedData[i].preferCount / max) * 100; // 第二种颜色的百分比
    var percentage3 = (groupedData[i].priorityCount / max) * 100;
    var totalPercentage = percentage1 + percentage2 + percentage3;
    departmentBar.style.height = '90%';
    departmentBar.style.width = barChart_width;
    departmentBar.style.display = 'flex';
    departmentBar.id = 'barChart'+i;
    if(department.includes(groupedData[i].category)){
      departmentBar.style.borderBottom = '4px solid black';
    }else{
      departmentBar.style.borderBottom = '2px solid grey';
    }

    var noSelectBar = document.createElement('div');
    noSelectBar.style.height = '100%';
    noSelectBar.style.width = percentage1 + '%';
    noSelectBar.style.background = '#AAAAAA';
    
    var preferBar = document.createElement('div');
    preferBar.style.height = '100%';
    preferBar.style.width = percentage2 + '%';
    preferBar.style.background = '#555555';

    var priorityBar = document.createElement('div');
    priorityBar.style.height = '100%';
    priorityBar.style.width = percentage3 + '%';
    priorityBar.style.background = '#000000';

    (function (index) {
      divElement.onclick = function () {
        const hint = document.getElementById('main_graph_school_hint');
        var category = groupedData[index].category;
        var categoryIndex = department.indexOf(category);
        if (categoryIndex != -1) {
          department.splice(categoryIndex, 1);
          if(department == ''){
            hint.style.display = 'block';
          }else{
            hint.style.display = 'none';
          }
          more_div(data);
        } else {
          document.getElementById('barText'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart'+index).style.borderBottom = '4px solid black';
          department.push(category);
          hint.style.display = 'none';
          more_div(data);
        }
      };

      // 创建 label 元素并设置样式
      var labelElement = document.createElement("label");
      labelElement.style.position = "absolute";
      labelElement.style.backgroundColor = "white";
      labelElement.style.padding = "5px";
      labelElement.style.border = "1px solid black";
      labelElement.style.display = "none"; // 初始隐藏 label

      // 将 label 元素添加到 body 中
      document.body.appendChild(labelElement);
      // 添加 mouseover 事件监听器到每个 div 元素
      divElement.addEventListener("mouseover", function (event) {
        // document.getElementById('school_bar_space'+index).style.height = '8px';
        if(department.includes(groupedData[index].category)){
          document.getElementById('barText'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart'+index).style.borderBottom = '4px solid black';
        }else{
          document.getElementById('barText'+ index).style.borderBottom = '4px solid grey';
          document.getElementById('barChart'+index).style.borderBottom = '4px solid grey';
        }
        
      });

      divElement.addEventListener("mouseout", function () {
        // document.getElementById('school_bar_space'+index).style.height = '10px';
        // 鼠标移出时隐藏 label
        if(department.includes(groupedData[index].category)){
          document.getElementById('barText'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart'+index).style.borderBottom = '4px solid black';
        }else{
          document.getElementById('barText'+ index).style.borderBottom = '2px solid grey';
          document.getElementById('barChart'+index).style.borderBottom = '2px solid grey';
        }
      });
      departmentText.addEventListener("mouseover", function(event){
        var departmentName = groupedData[index].originalDepartment;
        var labelContent = "Department: " + departmentName; // 显示的内容可以根据需要调整

        // 设置 label 元素的文本内容和位置，并显示 label
        labelElement.textContent = labelContent;
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif";
        labelElement.style.userSelect = 'none';
        
      })
      departmentText.addEventListener("mouseout", function () {
        labelElement.style.display = "none";
      })

      noSelectBar.addEventListener("mouseover", function (event) {
        labelElement.textContent = 'Not Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      noSelectBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });

      preferBar.addEventListener("mouseover", function(event){
        labelElement.textContent = 'Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      preferBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });

      priorityBar.addEventListener("mouseover", function(event){
        labelElement.textContent = 'Most Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      priorityBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });
    })(i);

    parentElement.appendChild(divElement);
    // parentElement.appendChild(spaceDiv);
    var insideParentElement = document.getElementById(divElement.id);

    insideParentElement.appendChild(departmentText);
    insideParentElement.appendChild(departmentBar);
    departmentBar.appendChild(noSelectBar);
    departmentBar.appendChild(preferBar);
    departmentBar.appendChild(priorityBar);

  }
}

function create_work_dot(data, id) {
  var svg_width = count_svg_width(data.length)*17;
  // set the dimensions and margins of the graph
  const margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svg_width - margin.left - margin.right,
    height = everyone_height - margin.top - margin.bottom;
  yBox0 = height + VerticalSpacing;

  // append the svg object to the body of the page
  const svg = d3.select('#' + id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(8, 1)`);

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 4])
    .range([0, width]);

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 4])
    .range([height, 0]);

  // Add dots
  const myCircle = svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("cx", function (d) { //x位置
      yBox0 = yBox0 - VerticalSpacing;
      if (yBox0 <= height - (VerticalSpacing * dotPerCol)) {
        xBox0 = xBox0 + HorizontalSpacing;
        yBox0 = height;
        boxHorizontal++;
      }
      runtime = 1;
      return (xBox0);
    })
    .attr("cy", function (d) { //y位置
      if (runtime == 1) {
        yBox0 = height + VerticalSpacing;
        runtime = 0;
      }
      if (runtime == 0) {
        yBox0 = yBox0 - VerticalSpacing;
        if (yBox0 <= height - (VerticalSpacing * dotPerCol)) {
          yBox0 = height;
        }
        return (yBox0);
      }
    })
    .attr("r", function (d) {
      if (d.job_change_frequency < max_change_frequency*33.33/100) {
        return 2;
      } else if (d.job_change_frequency >= (max_change_frequency*33.33/100) && d.job_change_frequency < (max_change_frequency*66.66/100)) {
        return 4;
      } else if (d.job_change_frequency >= (max_change_frequency*66.66/100)) {
        return 6;
      }
    })
    .style("fill", function (d) {
      if (divSelectedC_id.indexOf(d.C_id) != -1 || d.C_id == is_it_click) {
        return "#FF6400";
      }
      if(saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)){
        return "#FF0000";
      }
      else{
        return "#000000";
      }
    })
    .style("stroke", function (d) {
      if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)) {
        return "#FF0000";
      }
      else{
        return "#000000";
      }
    })
    .style("stroke-width", function (d) {
      if (saveIdsAndCommentArray.some(item => item.ids == d.C_id && item.check == 1)) {
        return 2;
      }
      else{
        return 1;
      }
    })

    .on('mouseover', function (event, d) {  
      myCircle.each(function(d){
        const circle = d3.select(this);
        const rect = circle.node().getBoundingClientRect();
        const locationX = rect.left + window.scrollX + 14;
        const locationY = rect.top + window.scrollY + 3;
    
        d.locationX = locationX;
        d.locationY = locationY;
      })
      is_it_mouseover = d.C_id;
      d3.selectAll("circle")
        .filter(function(d) {
          return d.C_id === is_it_mouseover;
        })
        // .style("r", 5)
        .style("stroke-width", function (d) {
          return 1;
        })
        .style("stroke", function (d) {
          return "#FF9999";
        })
        .style("fill", function (d) {
          return "#FF9999";
        })
        .style("filter", function (d) {
          return "drop-shadow(1px 2px #000000)";
        })
      d3.select(this).style("cursor", "pointer");
    })
    .on('mouseout', function (event, d) {
      is_it_mouseover = -1;
      updateCircleStyle();
      d3.select(this).style("cursor", "default");
    })
    .on('click', function (event, d) {  
      myCircle.each(function(d){
        const circle = d3.select(this);
        const rect = circle.node().getBoundingClientRect();
        const locationX = rect.left + window.scrollX + 14;
        const locationY = rect.top + window.scrollY + 3;
  
        d.locationX = locationX;
        d.locationY = locationY;
      })
      is_it_click = d.C_id;
      d3.selectAll("circle")
        .filter(function(d) {
          return d.C_id === is_it_click;
        })
        // .style("r", 5)
        .style("stroke-width", 1)
        .style("stroke", "#FF9999");

      var mask = document.getElementById("mask");
      mask.style.pointerEvents = "fill";

      const commentBox = document.createElement("div");
      commentBox.id = "commentBox";
      commentBox.style.position = "absolute";
      commentBox.style.border = "1px solid #000";
      commentBox.style.backgroundColor = "gray";
      commentBox.style.width = "302px";
      commentBox.style.height = "190px";
      var commentBoxLeft = d.locationX;
      var commentBoxTop = d.locationY;
      if(commentBoxLeft+310 >= window.innerWidth){
        commentBoxLeft = window.innerWidth - 310;
      }
      if(commentBoxTop+200 >= window.innerHeight){
        commentBoxTop = window.innerHeight - 200;
      }
      commentBox.style.left = commentBoxLeft +'px';
      commentBox.style.top = commentBoxTop +'px';
      commentBox.style.zIndex = "10000";

      // Create the input element
      const inputElement = document.createElement("textarea");
      inputElement.placeholder = "Enter your comment here...";
      inputElement.style.margin = "3px"; // Optional: Add some margin for better appearance

      // 設置文本框的寬度和高度
      inputElement.style.width = "290px";
      inputElement.style.height = "120px";

      // 允許文本框自動換行
      inputElement.style.overflowWrap = "break-word";

      // Create the submit button
      const submitButton = document.createElement("button");
      submitButton.innerText = "Submit";
      submitButton.style.cursor = "pointer";
      submitButton.style.fontFamily = "'Belanosima', sans-serif";
      submitButton.style.margin = "2px"; // Optional: Add some margin for better appearance

      // Add a click event listener to the submit button
      submitButton.addEventListener("click", () => {
        const commentText = inputElement.value;

        if(commentText == ''){
          alert("Comment cannot be empty!");
        }
        else if(commentText != ''){
          clickSaveIdsAndComment(d.C_id, commentText);
          console.log(saveIdsAndCommentArray);

          is_it_click = -1;
          mask.style.pointerEvents = "none";
          document.body.removeChild(commentBox);
          if(document.getElementById('detail')){
            document.body.removeChild(detail);
            var photoDiv = document.getElementById('photoDiv');
            if (photoDiv) {
              var parent = photoDiv.parentNode;
              parent.removeChild(photoDiv);
            }
          }
          updateData(saveIdsAndCommentArray);
          console.log('haha');
          updateCircleStyle();
          
          // 使用 Set 來去除重複的 ids
          const uniqueIdsSet = [];

          saveIdsAndCommentArray.forEach(item => {
            if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
              uniqueIdsSet.push(item.ids);
            }
          });
          const sumOfIds = uniqueIdsSet.length;
          
          var Already_choose = document.getElementById('Already_choose');
          Already_choose.innerHTML =
          `

          <div class="nextPageDiv">
            <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
            <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
            </svg>
          </div>
          `;
        }
      });

      // Create the cancel button
      const closeButton = document.createElement("button");
      closeButton.innerText = "X";
      closeButton.style.cursor = "pointer";
      closeButton.style.fontFamily = "'Belanosima', sans-serif";
      closeButton.style.margin = "3px"; // Optional: Add some margin for better appearance
      closeButton.style.float = "right";

      // Add a click event listener to the cancel button
      closeButton.addEventListener("click", () => {
        is_it_click = -1;
        mask.style.pointerEvents = "none";
        document.body.removeChild(commentBox);
        if(document.getElementById('detail')){
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
        updateCircleStyle();
          
          // 使用 Set 來去除重複的 ids
          const uniqueIdsSet = [];

          saveIdsAndCommentArray.forEach(item => {
            if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
              uniqueIdsSet.push(item.ids);
            }
          });
          const sumOfIds = uniqueIdsSet.length;
        
          var Already_choose = document.getElementById('Already_choose');
          Already_choose.innerHTML =
          `

          <div class="nextPageDiv">
            <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
            <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
            </svg>
          </div>
          `;
      });

      // Create the Remove button
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.style.cursor = "pointer";
      removeButton.style.fontFamily = "'Belanosima', sans-serif";
      removeButton.style.margin = "2px"; // Optional: Add some margin for better appearance

      // Add a click event listener to the cancel button
      removeButton.addEventListener("click", () => {
        clickRemoveIdsAndComment(d.C_id);
        console.log(saveIdsAndCommentArray);

        is_it_click = -1;
        mask.style.pointerEvents = "none";
        document.body.removeChild(commentBox);
        if(document.getElementById('detail')){
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
        updateData(saveIdsAndCommentArray);
        console.log('haha');
        updateCircleStyle();
        
        // 使用 Set 來去除重複的 ids
        const uniqueIdsSet = [];

        saveIdsAndCommentArray.forEach(item => {
          if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
            uniqueIdsSet.push(item.ids);
          }
        });
        const sumOfIds = uniqueIdsSet.length;
        
        var Already_choose = document.getElementById('Already_choose');
        Already_choose.innerHTML =
        `

        <div class="nextPageDiv">
          <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
          <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
          </svg>
        </div>
        `;
      });
      
      const commentBoxTitle = document.createElement("p");
      commentBoxTitle.innerText = "Comment:";
      commentBoxTitle.style.color = "#fff";
      commentBoxTitle.style.height = "10px";
      commentBoxTitle.style.width = "15px";
      commentBoxTitle.style.margin = "0px";
      commentBoxTitle.style.marginLeft = "5px";
      commentBoxTitle.style.display = "inline";
      commentBoxTitle.style.fontSize = "25px";

      // Create the detail button
      const detailButton = document.createElement("button");
      detailButton.innerText = "Show Detail";
      detailButton.style.cursor = "pointer";
      detailButton.style.fontFamily = "'Belanosima', sans-serif";
      detailButton.style.margin = "2px"; // Optional: Add some margin for better appearance
      detailButton.style.marginLeft = "92px";

      // Add a click event listener to the cancel button
      detailButton.addEventListener("click", () => {
        if(!document.getElementById('detail')){
          const detail = document.createElement("div");

          detail.id = "detail";
          detail.style.position = "absolute";
          detail.style.backgroundColor = "#eee";
          detail.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          
          var letMeKnowWhatIsMyComment = saveIdsAndCommentArray.reduce((result, item) => {
            const { ids, comment } = item;
            if (!result[ids]) {
              result[ids] = [];
            }
            result[ids].push(comment);
            return result;
          }, {});

          var container = document.createElement("div");
          container.className = "container";
          document.body.appendChild(container);

          var detail_a = ``;
          var detail_a_i = 0;
          var num_detail_a = 0;
          var detail_w = ``;
          var detail_w_i = 0;
          var num_detail_w = 0;

          while(data_filter_a[detail_a_i]){
            if(detail_a_i == 0)
              detail_a = `<pre style="font-size:15px;margin-top:-15px;">`;
            if(d.C_id == data_filter_a[detail_a_i].C_id){
              detail_a += `${data_filter_a[detail_a_i].school_name} | ${data_filter_a[detail_a_i].original_department} | ${data_filter_a[detail_a_i].school_degree} | ${data_filter_a[detail_a_i].school_start_year}/${data_filter_a[detail_a_i].school_start_month}-${data_filter_a[detail_a_i].school_end_year}/${data_filter_a[detail_a_i].school_end_month} | ${data_filter_a[detail_a_i].GPA}<br>`;
              num_detail_a++;
            }
            if(data_filter_a[detail_a_i+1])
              detail_a += `</pre>`;

            detail_a_i++;
          }

          while(data_filter_w[detail_w_i]){
            if(detail_w_i == 0)
              detail_w = `<pre style="font-size:15px;margin-top:-15px;">`;
            if(d.C_id == data_filter_w[detail_w_i].C_id){
              detail_w += `${data_filter_w[detail_w_i].work_name} | ${data_filter_w[detail_w_i].original_position} | ${data_filter_w[detail_w_i].work_start_year}/${data_filter_w[detail_w_i].work_start_month}-${data_filter_w[detail_w_i].work_end_year}/${data_filter_w[detail_w_i].work_end_month}<br>`;
              num_detail_w++;
            }
            if(data_filter_w[detail_w_i+1])
              detail_w += `</pre>`;

            detail_w_i++;
          }

          var comment_height;
          if(letMeKnowWhatIsMyComment[d.C_id]){
            comment_height = (letMeKnowWhatIsMyComment[d.C_id][0].split('<br>').length*17)+20;
          }
          else{
            comment_height = 20;
          }
          var aNwDetail_height = ((num_detail_a+num_detail_w)*17)+40;
          detail.style.width = "auto";
          detail.style.height = (100+aNwDetail_height+comment_height)+"px";
          var detialLocationX = d.locationX;
          var detialLocationY = d.locationY+200;
          if(detialLocationY+(100+aNwDetail_height+comment_height) >= window.innerHeight){
            detialLocationY = commentBoxTop - (100+aNwDetail_height+comment_height) -10;
          }
          detail.style.top = detialLocationY+'px';

          var detailGPA = d.GPA;
          if(detailGPA == 0){
            detailGPA = "not mentioned";
          }
          if(!letMeKnowWhatIsMyComment[d.C_id]){
            detail.innerHTML = `
            <div style="padding:20px;margin-top:-20px;">
              <div class="container3_1">
                <h1 class="perinfotit">${d.C_name}</h1>
              </div>
            </div>
            <div style="padding:20px;margin-top:-32px;">
              <div style="border-radius:5px;background-color: #fff;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div class="container3m" style="height:${aNwDetail_height+comment_height}px;">
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">School</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_a}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Work</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_w}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Comment</h1>
                  <div style="font-size:16px;margin-left:15px;"></div>
                </div>
              </div>
            </div>
            `;
          }else{
            detail.innerHTML = `
            <div style="padding:20px;margin-top:-20px;">
              <div class="container3_1">
                <h1 class="perinfotit">${d.C_name}</h1>
              </div>
            </div>
            <div style="padding:20px;margin-top:-32px;">
              <div style="border-radius:5px;background-color: #fff;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div class="container3m" style="height:${aNwDetail_height+comment_height}px;">
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">School</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_a}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Work</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${detail_w}</div>
                  <h1 style="font-size:18px;margin:0px;margin-left:5px;">Comment</h1>
                  <div style="font-size:16px;margin-left:15px;white-space: nowrap;">${letMeKnowWhatIsMyComment[d.C_id]}</div>
                </div>
              </div>
            </div>
            `;
          }

          if(!document.getElementById('detail')){
            document.body.appendChild(detail);
          }
          var detailID = document.getElementById("detail");
          var detailWidth = detailID.clientWidth;
          if(detialLocationX+detailWidth+25 >= window.innerWidth){
            detialLocationX = window.innerWidth - detailWidth - 25;
          }
          detail.style.left = detialLocationX+'px';
          
          var photoDiv = document.createElement("div");

          photoDiv.id = "photoDiv";
          photoDiv.style.height = "100px";
          photoDiv.style.width = "100px";
          photoDiv.style.position = "absolute";
          photoDiv.style.backgroundColor = "#eee";
          photoDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          photoDiv.style.padding = "15px";
          photoDiv.style.left = detialLocationX-135+'px';
          photoDiv.style.top = detialLocationY+'px';
          photoDiv.innerHTML = `
            <img src="../ai_picture/square/${d.C_photo}" width="100px" height="100px" border="2px solid #000">
          `;

          if(!document.getElementById('photoDiv')){
            document.body.appendChild(photoDiv);
          }
        }
        else{
          document.body.removeChild(detail);
          var photoDiv = document.getElementById('photoDiv');
          if (photoDiv) {
            var parent = photoDiv.parentNode;
            parent.removeChild(photoDiv);
          }
        }
      });

      if(!document.getElementById('commentBox')){
        document.body.appendChild(commentBox);
        commentBox.appendChild(commentBoxTitle);
        commentBox.appendChild(closeButton);
        commentBox.appendChild(inputElement);
        commentBox.appendChild(submitButton);
        commentBox.appendChild(removeButton);
        commentBox.appendChild(detailButton);
      }

      // 使用 Set 來去除重複的 ids
      const uniqueIdsSet = [];

      saveIdsAndCommentArray.forEach(item => {
        if (item.check === 1 && !uniqueIdsSet.includes(item.ids)) {
          uniqueIdsSet.push(item.ids);
        }
      });
      if(!uniqueIdsSet.includes(d.C_id)){
        uniqueIdsSet.push(d.C_id);
      }
      const sumOfIds = uniqueIdsSet.length;
      
      var Already_choose = document.getElementById('Already_choose');
      Already_choose.innerHTML =
      `

      <div class="nextPageDiv">
        <span class="nextPageButtonText">Selected: ${sumOfIds}</span>
        <svg class="arrow" viewBox="0 0 448 512" height="2em" xmlns="http://www.w3.org/2000/svg">
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
        </svg>
      </div>
      `;
    });
}

function changeDataSet_w() {
  var changeColor = document.getElementById("checkDataSet_w");

  if(whatUWant_w == 0){
    whatUWant_w = 1;
    changeColor.style.color = "black";
  }
  else if(whatUWant_w == 1){
    whatUWant_w = 0;
    changeColor.style.color = "#fff";
  }

  document.getElementById('work_bar').innerHTML='';
  barChart_w(data_filter_w);
  more_div_work(data_filter_w);
  updateCircleStyle();
}

function more_div_work(data) {
  data.sort((a, b) => a.work_end_month - b.work_end_month);
  data.sort((a, b) => a.work_end_year - b.work_end_year);

  if(whatUWant_w == 1){
    const idMap = {};
    const result = [];

    for (const item of data) {
      const C_id = item.C_id;
      if (!idMap[C_id]) {
        idMap[C_id] = true;
        result.push(item);
      }
    }

    data = result;
    console.log(data);
  }

  var elements = document.querySelectorAll("[id^='work_dot_graph']");
  // 遍历元素列表并移除每个元素
  elements.forEach(function (element) {
    element.remove();
  });

  data.forEach((item) => {
    const startYear = parseInt(item.work_start_year);
    const startMonth = parseInt(item.work_start_month);
    const endYear = parseInt(item.work_end_year);
    const endMonth = parseInt(item.work_end_month);
  
    // 计算年资
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    const years_of_experience = totalMonths / 12; // 向下取整，得到年资
  
    // 将年资添加到数组项中
    item.years_of_experience = years_of_experience;
  });

  const idCountMap = {};
  data.forEach((item) => {
    const id = item.C_id;
  
    // 如果该 id 在 idCountMap 中不存在，则设置初始值为 1，表示第一次出现
    if (!idCountMap[id]) {
      idCountMap[id] = 1;
    } else {
      // 如果该 id 在 idCountMap 中已经存在，则工作次数加 1
      idCountMap[id]++;
    }
  
    // 将工作次数添加到数组项中
    item.job_change_count = idCountMap[id];
  });

  // 创建一个对象来存储每个 ID 的总工作时间和工作更换次数
  const idInfoMap = {};

  data.forEach((item) => {
    const id = item.C_id;
    const yearsOfExperience = item.years_of_experience;

    // 如果该 ID 在 idInfoMap 中不存在，则初始化
    if (!idInfoMap[id]) {
      idInfoMap[id] = {
        totalYears: yearsOfExperience,
        jobChangeCount: 1,
      };
    } else {
      // 如果该 ID 在 idInfoMap 中已经存在，则累加工作时间和工作更换次数
      idInfoMap[id].totalYears += yearsOfExperience;
      idInfoMap[id].jobChangeCount++;
    }
  });

  // 将计算出的频率添加到数据数组中
  data.forEach((item) => {
    const id = item.C_id;
    const idInfo = idInfoMap[id];
    
    // 计算频率（总工作时间 / 工作更换次数），并将结果添加到数据项中
    item.job_change_frequency =  idInfo.jobChangeCount/idInfo.totalYears;
    // console.log(id, idInfo.totalYears);
  });

  // 获取要插入的父元素
  var parentElement = document.getElementById('work_dot');

  //根據 years_of_experience和job_change_count 排序資料
  data.sort((a, b) => a.years_of_experience - b.years_of_experience);
  data.sort((a, b) => b.job_change_frequency - a.job_change_frequency);

  max_change_frequency = data[0].job_change_frequency;

  // 设置要创建的div的数量
  var numberOfDivs = work_position.length;
  // 循环创建div元素
  for (var i = 0; i < numberOfDivs; i++) {
    //filter資料
    console.log(data)
    console.log()
    var priorityBox = [];
    var preferBox = [];
    var noSelect = [];
    var everyone_height_lock = 0;
    var tmp_everyone_height = 0;
    for (var filter_i = 0; filter_i < 4; filter_i++) {
      if (filter_i == 0)
        priorityBox[filter_i] = data.filter(d => priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience < years_of_experience_first);
      if (filter_i == 1)
        priorityBox[filter_i] = data.filter(d => priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_first && d.years_of_experience < years_of_experience_second);
      if (filter_i == 2)
        priorityBox[filter_i] = data.filter(d => priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_second && d.years_of_experience < years_of_experience_third);
      if (filter_i == 3)
        priorityBox[filter_i] = data.filter(d => priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_third);
      if (filter_i == 0)
        preferBox[filter_i] = data.filter(d => preferWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience < years_of_experience_first);
      if (filter_i == 1)
        preferBox[filter_i] = data.filter(d => preferWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_first && d.years_of_experience < years_of_experience_second);
      if (filter_i == 2)
        preferBox[filter_i] = data.filter(d => preferWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_second && d.years_of_experience < years_of_experience_third);
      if (filter_i == 3)
        preferBox[filter_i] = data.filter(d => preferWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_third);
      if(filter_i == 0)
        noSelect[filter_i] = data.filter(d => !preferWork.includes(d.work_name) && !priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience < years_of_experience_first);
      if(filter_i == 1)
        noSelect[filter_i] = data.filter(d => !preferWork.includes(d.work_name) && !priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_first && d.years_of_experience < years_of_experience_second);
      if(filter_i == 2)
        noSelect[filter_i] = data.filter(d => !preferWork.includes(d.work_name) && !priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_second && d.years_of_experience < years_of_experience_third);
      if(filter_i == 3)
        noSelect[filter_i] = data.filter(d => !preferWork.includes(d.work_name) && !priorityWork.includes(d.work_name) && d.work_position === work_position[i] && d.years_of_experience >= years_of_experience_third);   
      console.log(noSelect);
        var max_height = 120;  
      if(everyone_height_lock == 0){
        if((priorityBox[filter_i].length >= preferBox[filter_i].length) && (priorityBox[filter_i].length > tmp_everyone_height)){
          tmp_everyone_height = priorityBox[filter_i].length;
          everyone_height = (max_height/dotPerCol)*priorityBox[filter_i].length;
          // if(priorityBox[filter_i].length < 3){
          //   everyone_height = (max_height/dotPerCol)*3;
          // }
        }
        if((preferBox[filter_i].length > priorityBox[filter_i].length) && (preferBox[filter_i].length > tmp_everyone_height)){
          tmp_everyone_height = preferBox[filter_i].length;
          everyone_height = (max_height/dotPerCol)*preferBox[filter_i].length;
          // if(preferBox[filter_i].length < 3){
          //   everyone_height = (max_height/dotPerCol)*3;
          // }
        }
        if(noSelect[filter_i].length > tmp_everyone_height){
          tmp_everyone_height = noSelect[filter_i].length;
          everyone_height = (max_height/dotPerCol)*noSelect[filter_i].length;
        }
      }
      if(priorityBox[filter_i].length >= dotPerCol || preferBox[filter_i].length >= dotPerCol || noSelect[filter_i].length >= dotPerCol){
        everyone_height_lock = 1;
        everyone_height = max_height;
      }
    }

    // 创建div元素
    var divElement = document.createElement('div');

    // 设置div的内容和样式（可根据需求自定义）
    divElement.id = 'work_dot_graph' + i;
    divElement.style.height = everyone_height+'px';
    divElement.style.width = '460px';
    divElement.style.display = 'flex';
    divElement.style.flexDirection = 'row';
    divElement.style.marginBottom = '20px';


    // 将div元素插入父元素中
    parentElement.appendChild(divElement);
    var insideParentElement = document.getElementById('work_dot_graph' + i);
    var departmentText = document.createElement('div');

    departmentText.textContent = work_position[i].toUpperCase();
    // departmentText.style.backgroundColor = 'white';
    departmentText.style.color = 'black';
    departmentText.style.fontSize = '16px';
    departmentText.style.height = everyone_height+'px';
    departmentText.style.minWidth = '54px';
    departmentText.style.display = 'flex';
    departmentText.style.textAlign = 'center';
    departmentText.style.alignItems = 'center';
    departmentText.style.justifyContent = 'center';
    departmentText.style.borderTop = '2px solid #F6F1F1'
    departmentText.style.boxShadow = ' 0 5px 0 black'; 
    departmentText.style.userSelect = 'none';
    var spaceDiv = document.createElement('div');
    spaceDiv.style.height = everyone_height+'px';
    spaceDiv.style.minWidth = '15px';
    spaceDiv.style.borderTop = '2px solid #F6F1F1';
    spaceDiv.style.boxShadow = ' 0 5px 0 black'; 

    insideParentElement.appendChild(departmentText);
    insideParentElement.appendChild(spaceDiv);
    preferBoxLock = 0;
    priorityBoxLock = 0;
    noSelectBoxLock = 0;

    
    
    for (var j = 0; j < 3; j++) {
      var prefer_Count = data.filter(d => preferWork.includes(d.work_name) && d.work_position === work_position[i]);
      var priority_Count = data.filter(d => priorityWork.includes(d.work_name) && d.work_position === work_position[i])
      

      var insideDiv = document.createElement('div');
      insideDiv.id = 'work_dot_graph' + i + '_' + j;
      insideDiv.style.display = 'flex';
      insideDiv.style.height = everyone_height+'px';

      var insideDivHorizontal = 0;

      insideParentElement.appendChild(insideDiv);
      for (var k = 0; k < 4; k++) {
        boxHorizontal = 1;
        var box = document.createElement('div');
        var childelement = document.getElementById(insideDiv.id);

        box.id = 'work_box' + i + '_' + j + '_' + k;
        box.className = 'work_box' + k;
        box.style.height = everyone_height+'px';
        var box_color;
        if (k == 0) {
          box_color = 'white';
        }
        else if (k == 1) {
          box_color = '#C4E1FF';
        }
        else if (k == 2) {
          box_color = '#84C1FF';
        }
        else if (k == 3) {
          box_color = '#2894FF';
        }

        box.style.backgroundColor = box_color;

        childelement.appendChild(box);

        if (noSelect[k].length != 0) {
          if (j == 0) {
            create_work_dot(noSelect[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        if (preferBox[k].length != 0) {
          if (j == 1) {
            create_work_dot(preferBox[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        if (priorityBox[k].length != 0) {
          if (j == 2) {
            create_work_dot(priorityBox[k], box.id);
            box.style.width = (boxHorizontal * 17) + 'px';
            insideDivHorizontal = insideDivHorizontal + boxHorizontal;
          }
        }
        yBox0 = 80 + VerticalSpacing;
        xBox0 = 0;
      }
      insideDiv.style.width = (insideDivHorizontal * 17) + 'px';
      
      if (j == 0 && insideDivHorizontal != 0){
        insideDiv.style.border = '2px solid #AAAAAA';
        insideDiv.style.borderLeft = '10px solid #AAAAAA';
        insideDiv.style.borderBottom = '0px';
        insideDiv.style.boxShadow = ' 0 5px 0 black'; 

        if(prefer_Count.length != 0 || priority_Count.length != 0){
          var spaceDiv = document.createElement('div');
          spaceDiv.style.height = everyone_height+'px';
          spaceDiv.style.minWidth = '15px';
          spaceDiv.style.borderTop = '2px solid #F6F1F1'
          spaceDiv.style.boxShadow = ' 0 5px 0 black'; 
          insideParentElement.appendChild(spaceDiv);
        }
      }
      
      if (j == 1 && insideDivHorizontal != 0){
        insideDiv.style.border = '2px solid #555555';
        insideDiv.style.borderLeft = '10px solid #555555';
        insideDiv.style.borderBottom = '0px';
        insideDiv.style.boxShadow = ' 0 5px 0 black'; 

        if(priority_Count.length != 0){
          var spaceDiv = document.createElement('div');
          spaceDiv.style.height = everyone_height+'px';
          spaceDiv.style.minWidth = '15px';
          spaceDiv.style.borderTop = '2px solid #F6F1F1'
          spaceDiv.style.boxShadow = ' 0 5px 0 black'; 
          insideParentElement.appendChild(spaceDiv);
        }
      }
      if (j == 2 && insideDivHorizontal != 0){
        insideDiv.style.border = '2px solid #000000';
        insideDiv.style.borderLeft = '10px solid #000000';
        insideDiv.style.borderBottom = '0px';
        insideDiv.style.boxShadow = ' 0 5px 0 black'; 
      }
    }
  }
}

window.onload = function() {
  var firstStop = 2.8;
  var secondStop = 3.4;
  var thirdStop = 3.8;
  var years_of_experience_first = 1;
  var years_of_experience_second = 3;
  var years_of_experience_third = 4;

  function returnvalue(a, b) {
    return a + "-" + b;
  }

  function returnvalue_1(c) {
    return c + "++";
  }

  function returnvalue_2(d) {
    return "< " + d;
  }

  var result_0 = returnvalue_2(firstStop);
  var result_1 = returnvalue(firstStop, secondStop);
  var result_2 = returnvalue(secondStop, thirdStop);
  var result_3 = returnvalue_1(thirdStop);
  var result_0_w = returnvalue_2(years_of_experience_first);
  var result_1_w = returnvalue(years_of_experience_first, years_of_experience_second);
  var result_2_w = returnvalue(years_of_experience_second, years_of_experience_third);
  var result_3_w = returnvalue_1(years_of_experience_third);

  document.getElementById("result_zero").innerText = result_0;
  document.getElementById("result_first").innerText = result_1;
  document.getElementById("result_second").innerText = result_2;
  document.getElementById("result_third").innerText = result_3;
  document.getElementById("result_zero_w").innerText = result_0_w;
  document.getElementById("result_first_w").innerText = result_1_w;
  document.getElementById("result_second_w").innerText = result_2_w;
  document.getElementById("result_third_w").innerText = result_3_w;
};

function barChart_w(data){
  data.sort((a, b) => a.work_end_month - b.work_end_month);
  data.sort((a, b) => a.work_end_year - b.work_end_year);

  if(whatUWant_w == 1){
    const idMap = {};
    const result = [];

    for (const item of data) {
      const C_id = item.C_id;
      if (!idMap[C_id]) {
        idMap[C_id] = true;
        result.push(item);
      }
    }

    data = result;
    console.log(data);
  }

  //分群
  var groupedData = data.filter(d => preferWork.includes(d.work_name) || priorityWork.includes(d.work_name) || preferWork.includes(d.work_name.toLowerCase()) || priorityWork.includes(d.work_name.toLowerCase()) || data_filter_w.some(item => item.work_name == d.work_name) || data_filter_w.some(item => item.work_name == d.work_name.toLowerCase()));

  groupedData = Array.from(d3.group(groupedData, d => (d.work_position.toLowerCase() || d.work_position)), ([category, groupData]) => {
    const originalPosition = category.toLowerCase() === "other" ? "other" : groupData[0].original_position; // 判断是否为 'other'
    const group1 = groupData.filter(d => (preferWork.includes(d.work_name.toLowerCase()) || preferWork.includes(d.work_name))); // prefer的数据
    const group2 = groupData.filter(d => (priorityWork.includes(d.work_name.toLowerCase()) || priorityWork.includes(d.work_name))); // priority的数据
    const group3 = data.filter(d =>(!preferWork.includes(d.work_name.toLowerCase()) && !preferWork.includes(d.work_name)) &&
    !priorityWork.includes(d.work_name.toLowerCase()) && !priorityWork.includes(d.work_name) && d.work_position.toLowerCase() == category.toLowerCase());
    return {
      category: category.toUpperCase(),
      originalPosition,
      group1,
      group2,
      group3,
      preferCount: group1.length,
      priorityCount: group2.length,
      noSelect: group3.length
    }; // 返回包含分组信息和数量的对象
  });

  groupedData.sort((a, b) => (b.preferCount + b.priorityCount + b.noSelect) - (a.preferCount + a.priorityCount + a.noSelect));
  var max = 0;
  for (var i = 0; i < groupedData.length; i++) {
    var lengthCount = groupedData[i].preferCount + groupedData[i].priorityCount + groupedData[i].noSelect;
    if (lengthCount > max) {
      max = lengthCount;
    }
  }
  // 获取要插入的父元素
  var parentElement = document.getElementById('work_bar');

  // 创建 label 元素并设置样式
  const labelElement = document.createElement("label");
  labelElement.style.position = "absolute";
  labelElement.style.backgroundColor = "white";
  labelElement.style.padding = "5px";
  labelElement.style.border = "1px solid black";
  labelElement.style.display = "none"; // 初始隐藏 label

  for (var i = 0; i < groupedData.length; i++) {
    var divElement = document.createElement('div');
    divElement.id = 'work_bar' + i;
    divElement.style.height = barhight;
    divElement.style.width = barwidth;
    divElement.style.marginBottom = '10px';
    divElement.style.display = 'flex';
    divElement.style.flexDirection = 'row';
    divElement.style.boxSizing = 'border-box';
    divElement.style.cursor = 'pointer';

    var departmentText = document.createElement('div');
    departmentText.textContent = groupedData[i].category;
    departmentText.style.fontSize = '12px';
    departmentText.style.height = '90%';
    departmentText.style.width = barTextbox_width;
    departmentText.style.display = 'flex';
    departmentText.style.textAlign = 'center';
    departmentText.style.alignItems = 'center';
    departmentText.style.justifyContent = 'center';
    if(work_position.includes(groupedData[i].category)){
      departmentText.style.borderBottom = '4px solid black';
    }else{
      departmentText.style.borderBottom = '2px solid grey';
    }
    console.log(work_position);
    departmentText.style.userSelect = 'none';
    departmentText.id = 'barText_work'+ i;

    var departmentBar = document.createElement('div');
    var percentage1 = (groupedData[i].noSelect / max) * 100; // 第一种颜色的百分比
    var percentage2 = (groupedData[i].preferCount / max) * 100; // 第二种颜色的百分比
    var percentage3 = (groupedData[i].priorityCount / max) * 100;
    var totalPercentage = percentage1 + percentage2 + percentage3;
    departmentBar.style.height = '90%';
    departmentBar.style.width = barChart_width;
    if(work_position.includes(groupedData[i].category)){
      departmentBar.style.borderBottom = '4px solid black';
    }else{
      departmentBar.style.borderBottom = '2px solid grey';
    }
    departmentBar.style.display = 'flex';
    departmentBar.id = 'barChart_work'+i;

    var noSelectBar = document.createElement('div');
    noSelectBar.style.height = '100%';
    noSelectBar.style.width = percentage1 + '%';
    noSelectBar.style.background = '#AAAAAA';
    
    var preferBar = document.createElement('div');
    preferBar.style.height = '100%';
    preferBar.style.width = percentage2 + '%';
    preferBar.style.background = '#555555';

    var priorityBar = document.createElement('div');
    priorityBar.style.height = '100%';
    priorityBar.style.width = percentage3 + '%';
    priorityBar.style.background = '#000000';
    (function (index) {
      divElement.onclick = function () {
        const hint = document.getElementById('main_graph_work_hint');
        var category = groupedData[index].category;
        var categoryIndex = work_position.indexOf(category);
        if (categoryIndex != -1) {
          work_position.splice(categoryIndex, 1);
          if(work_position == ''){
            hint.style.display = 'block';
          }else{
            hint.style.display = 'none';
          }
          more_div_work(data);
        } else {
          work_position.push(category);
          more_div_work(data);
          document.getElementById('barText_work'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart_work'+index).style.borderBottom = '4px solid black';
          hint.style.display = 'none';
        }
      };

      // 创建 label 元素并设置样式
      var labelElement = document.createElement("label");
      labelElement.style.position = "absolute";
      labelElement.style.backgroundColor = "white";
      labelElement.style.padding = "5px";
      labelElement.style.border = "1px solid black";
      labelElement.style.display = "none"; // 初始隐藏 label

      // 将 label 元素添加到 body 中
      document.body.appendChild(labelElement);

      // 添加 mouseover 事件监听器到每个 div 元素
      divElement.addEventListener("mouseover", function () {
        if(work_position.includes(groupedData[index].category)){
          document.getElementById('barText_work'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart_work'+index).style.borderBottom = '4px solid black';
        }else{
          document.getElementById('barText_work'+ index).style.borderBottom = '4px solid grey';
          document.getElementById('barChart_work'+index).style.borderBottom = '4px solid grey';
        }
      });

      divElement.addEventListener("mouseout", function () {
        // 鼠标移出时隐藏 label
        if(work_position.includes(groupedData[index].category)){
          document.getElementById('barText_work'+ index).style.borderBottom = '4px solid black';
          document.getElementById('barChart_work'+index).style.borderBottom = '4px solid black';
        }else{
          document.getElementById('barText_work'+ index).style.borderBottom = '2px solid grey';
          document.getElementById('barChart_work'+index).style.borderBottom = '2px solid grey';
        }
      });

      departmentText.addEventListener("mouseover", function(event){
        var positionName = groupedData[index].originalPosition;
        var labelContent = "Work Position: " + positionName; // 显示的内容可以根据需要调整

        // 设置 label 元素的文本内容和位置，并显示 label
        labelElement.textContent = labelContent;
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      departmentText.addEventListener("mouseout", function () {
        labelElement.style.display = "none";
      });

      noSelectBar.addEventListener("mouseover", function (event) {
        labelElement.textContent = 'Not Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      noSelectBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });

      preferBar.addEventListener("mouseover", function(event){
        labelElement.textContent = 'Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      preferBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });

      priorityBar.addEventListener("mouseover", function(event){
        labelElement.textContent = 'Most Prefer'
        labelElement.style.left = (event.pageX + 10) + "px";
        labelElement.style.top = (event.pageY + 10) + "px";
        labelElement.style.display = "block";
        labelElement.style.fontFamily = "Open Sans, sans-serif"
      });
      priorityBar.addEventListener("mouseout", function () {
        labelElement.style.display = 'none';
      });
    })(i);

    parentElement.appendChild(divElement);
    var insideParentElement = document.getElementById(divElement.id);

    insideParentElement.appendChild(departmentText);
    insideParentElement.appendChild(departmentBar);
    departmentBar.appendChild(noSelectBar);
    departmentBar.appendChild(preferBar);
    departmentBar.appendChild(priorityBar);
  }
}

function noteBox() {
  var note_box = document.getElementById("note_box");
  if (window.getComputedStyle(note_box).getPropertyValue("display") == "none") {
    note_box.style.display = "flex"; // 显示大Div
  } else {
    note_box.style.display = "none"; // 隐藏大Div
  }
}

function noteBox1() {
  var note_box = document.getElementById("note_box_1");
  if (window.getComputedStyle(note_box).getPropertyValue("display") == "none") {
    note_box.style.display = "flex"; // 显示大Div
  } else {
    note_box.style.display = "none"; // 隐藏大Div
  }
}

function noteBox2() {
  var note_box = document.getElementById("note_box_2");
  if (window.getComputedStyle(note_box).getPropertyValue("display") == "none") {
    note_box.style.display = "flex"; // 显示大Div
  } else {
    note_box.style.display = "none"; // 隐藏大Div
  }
}

function noteBox3() {
  var note_box = document.getElementById("note_box_3");
  if (window.getComputedStyle(note_box).getPropertyValue("display") == "none") {
    note_box.style.display = "flex"; // 显示大Div
  } else {
    note_box.style.display = "none"; // 隐藏大Div
  }
}

function Slider(){
  const school_vertical_small_box = document.getElementById('school_vertical_small_box');

  noUiSlider.create(school_vertical_small_box, {
    start: [firstStop, secondStop, thirdStop],
    connect: [false,true, true, true],
    range: {
      'min': 0,
      'max': 4
    },
    pips: {
      mode: 'count',
      values: 5
    },
    format: {
      to: value => value.toFixed(2), // 将数值格式化为带有两位小数的字符串
      from: value => parseFloat(value)
    },
  });
  // 设置不同的连接部分颜色
  school_vertical_small_box.querySelectorAll('.noUi-connect').forEach((connect, index) => {
    if (index === 0) {
      connect.style.background = 'rgb(187, 255, 187)'; // 第一个连接部分的颜色
    } else if (index === 1) {
      connect.style.background = 'rgb(121, 255, 121)'; // 第二个连接部分的颜色
    } else if (index === 2) {
      connect.style.background = 'rgb(0, 219, 0)'; // 第三个连接部分的颜色
    }
  });
  
  var tipHandles = school_vertical_small_box.getElementsByClassName("noUi-handle")
  var tooltips = [];
  // Add divs to the slider handles.
  for (var i = 0; i < tipHandles.length; i++) {
    tooltips[i] = document.createElement("div");
    tooltips[i].setAttribute("class", "tooltipdiv");
    tipHandles[i].appendChild(tooltips[i]);
  }
  school_vertical_small_box.noUiSlider.on('update', (values, handle) => {
    const formattedValue = values[handle];
    if (handle === 0) {
      tooltips[handle].innerHTML = formattedValue;
      firstStop = formattedValue;
    } 
    else if(handle === 1){
      tooltips[handle].innerHTML = formattedValue;
      secondStop = formattedValue;
    }
    else{
      tooltips[handle].innerHTML = formattedValue;
      thirdStop = formattedValue;
    }
  });
}

function Slider_work(){
  const work_vertical_small_box = document.getElementById('work_vertical_small_box');

  noUiSlider.create(work_vertical_small_box, {
    start: [years_of_experience_first, years_of_experience_second, years_of_experience_third],
    connect: [false,true, true, true],
    range: {
      'min': 0,
      'max': 10
    },
    pips: {
      mode: 'count',
      values: 6
    },
    format: {
      to: value => value.toFixed(2), // 将数值格式化为带有两位小数的字符串
      from: value => parseFloat(value)
    }
  });
  work_vertical_small_box.querySelectorAll('.noUi-connect').forEach((connect, index) => {
    if (index === 0) {
      connect.style.background = 'rgb(196, 225, 255)'; // 第一个连接部分的颜色
    } else if (index === 1) {
      connect.style.background = 'rgb(132, 193, 255)'; // 第二个连接部分的颜色
    } else if (index === 2) {
      connect.style.background = 'rgb(40, 148, 255)'; // 第三个连接部分的颜色
    }
  });
  // 获取用于显示数值的元素
  var tipHandles = work_vertical_small_box.getElementsByClassName("noUi-handle")
  var tooltips = [];
  // Add divs to the slider handles.
  for (var i = 0; i < tipHandles.length; i++) {
    tooltips[i] = document.createElement("div");
    tooltips[i].setAttribute("class", "tooltipdiv");
    tipHandles[i].appendChild(tooltips[i]);
  }

  work_vertical_small_box.noUiSlider.on('update', (values, handle) => {
    const formattedValue = values[handle];
    if (handle === 0) {
      tooltips[handle].innerHTML = formattedValue;
      years_of_experience_first = formattedValue;
    } 
    else if(handle === 1){
      tooltips[handle].innerHTML = formattedValue;
      years_of_experience_second = formattedValue;
    }
    else{
      tooltips[handle].innerHTML = formattedValue;
      years_of_experience_third = formattedValue;
    }
  });
}


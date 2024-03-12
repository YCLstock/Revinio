//設定sorting的基本資料抓取以及各種不同sorting的呼叫
function sorting(datas, people){
  var data = [datas['basic_information'],
              datas['academic'], 
              datas['work_experience'], 
              datas['other_experience'], 
              datas['relation_table_we_s'], 
              datas['skill'], 
              datas['relation_table_oe_s']];

  //定義讀入的資料並存入陣列
  var ppl = [];
  var i;
  if(people == undefined){
    for(i = 1; i < 51; i++){
      ppl.push(i);
    }
  }
  else{
    ppl = people;
  }

  window['ppl'] = ppl;
  window['ppl_reverse'] = 1;

  //將此層的五十人的資料抓出
  var all_data = [], temp = [], temp2 = [];
  for(p = 0; p < ppl.length; p++){
      for(k = 0; k < 6; k++){
          for(j = 0; j < data[k].length; j++){
            if(Number(data[k][j]['C_id']) == ppl[p]){
              temp.push(data[k][j]);
            }
          }
          temp2.push(temp);
          temp = [];
      }

      all_data.push(temp2);
      temp2 = [];
  }

  //將這個all_data存到痊癒變數
  window.all_data_world = all_data;


  //下拉式選單設定
  const dropdownBtn = document.getElementById("btn");
  const dropdownBtnText = document.getElementById("btn_text");
  const dropdownMenu = document.getElementById("dropdown");
  const toggleArrow = document.getElementById("arrow");

  // Toggle dropdown function
  const toggleDropdown = function () {
    dropdownMenu.classList.toggle("show");
    toggleArrow.classList.toggle("arrow");
  };

  // Toggle dropdown open/close when dropdown button is clicked
  dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
  });

  // Close dropdown when dom element is clicked
  document.documentElement.addEventListener("click", function () {
    if (dropdownMenu.classList.contains("show")) {
      toggleDropdown();
    }
  });

  document.getElementById("default_sorting").addEventListener("click", function () {
    dropdownBtnText.innerText = "Name"
    window['ppl_reverse'] = 1;
    animation(datas, ppl)
    sorting_switch.attr("xlink:href", function(){
      return "../website_image/arrow" + window['ppl_reverse'] + ".png"
    })
  });

  document.getElementById("jobtime_sorting").addEventListener("click", function () {
    dropdownBtnText.innerText = "Seniority"
    animation(datas, job_time_sort(ppl, all_data))
    window['ppl_reverse'] = 1;
    sorting_switch.attr("xlink:href", function(){
      return "../website_image/arrow" + window['ppl_reverse'] + ".png"
    })
  });

  document.getElementById("education_sorting").addEventListener("click", function () {
    dropdownBtnText.innerText = "Education"
    animation(datas, education_sort(ppl, all_data))
    window['ppl_reverse'] = 1;
    sorting_switch.attr("xlink:href", function(){
      return "../website_image/arrow" + window['ppl_reverse'] + ".png"
    })
  });

  document.getElementById("skillamount_sorting").addEventListener("click", function () {
    dropdownBtnText.innerText = "Skill amount"
    animation(datas, skill_amount_sort(ppl, all_data))
    window['ppl_reverse'] = 1;
    sorting_switch.attr("xlink:href", function(){
      return "../website_image/arrow" + window['ppl_reverse'] + ".png"
    })
  });

  document.getElementById("skilllayer_sorting").addEventListener("click", function () {
    dropdownBtnText.innerText = "Selected skill amount"
    skilllayer_animation(datas, skill_layer(ppl, all_data))
    window['ppl_reverse'] = 1;
    sorting_switch.attr("xlink:href", function(){
      return "../website_image/arrow" + window['ppl_reverse'] + ".png"
    })
  });

  d3.select("#skilllayer_sorting").style("pointer-events", "none");
  if(d3.select("#skilllayer_sorting").style("pointer-events") == "none"){
    d3.select("#skilllayer_sorting").style("color", "#D3D3D3")
    
  }

  //sorting的按鍵設置
  //設定sorting區域的svg
  // const margin = {top: 2, right: 2, bottom: 2, left: 2};
  const sort_Section = document.querySelector(".container");
  const Width = (sort_Section.getBoundingClientRect().width );
  const Height = (sort_Section.getBoundingClientRect().height );
  // var sorting_ways = ['job_time_sort', 'education_sort', 'skill_amount_sort', 'skill_layer']; //所有sorting方法置於此

  // const svg_title = d3.select(".sub-section-1-1")
  //   .append("svg")
  //     .attr("id","sorting_title")
  //     .attr("width", Width + margin.left + margin.right)
  //     .attr("height", 35)
  //   .append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const svg = d3.select(".container")
    .append("svg")
      .attr("id","sorting_svg")
      .attr("width", 25)
      .attr("height", Height)
    // .append("g")

  // //創建y的比例尺
  // const y = d3.scaleBand()
  //   .domain(Array.from(Array(sorting_ways.length).keys()))
  //   .range([ 0, Height]);

  // //繪製標題
  // svg_title.append("text")
  //     .attr("x", 0)
  //     .attr("y", 24)
  //     .attr("fill", "black")
  //     .style("font-size", 24)
  //     .style("pointer-events", "none")
  //     .style("font-family", "Belanosima")
  //     .text("Sorting")

  // 繪製大小排序箭頭圖
  var sorting_switch = svg.append("image")
      .attr("id", "sorting_arrow")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 22)
      .attr("height", Height)
      .attr("xlink:href", "../website_image/arrow1.png")
      .style("cursor", "pointer")
      .on("click", function(event, d){
        window['ppl_reverse'] = window['ppl_reverse'] * -1
        animation(datas, window['ppl'].reverse())
        sorting_switch.attr("xlink:href", function(){
          return "../website_image/arrow" + window['ppl_reverse'] + ".png"
        })
      })
  
  //   //繪製rect
  // svg.selectAll(".sorting_button")
  //   .data(sorting_ways)
  //   .join("rect")
  //     .attr("id", function(d){ return d + '_button'})
  //     .attr("x", 0)
  //     .attr("y", (d, i) => y(i))
  //     .attr("width", Width-20)
  //     .attr("height", 35)
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 0.5)
  //     .attr("fill", "white")
  //     .on("click", function(event, d) {
  //       animation(datas, window[d](ppl, all_data))
        // window['ppl_reverse'] = 1;
        // sorting_switch.attr("xlink:href", function(){
        //   return "../website_image/arrow" + window['ppl_reverse'] + ".png"
        // })
  //     });

  // //繪製按鈕內文字
  // svg.selectAll(".sorting_button")
  //   .data(sorting_ways)
  //   .join("text")
  //     .attr("x", Width / 2 - 10)
  //     .attr("y", (d, i) => y(i) + 20)
  //     .attr("fill", "black")
  //     .attr("text-anchor", "middle")
  //     .style("pointer-events", "none")
  //     .style("font-family", "Belanosima")
  //     .style("font-size", "16px")
  //     .text(d => d)


  
  // job_time_sort(ppl, all_data)

  //console.log(all_data)
}

function overlapCheck(start_date1, end_date1, start_date2, end_date2){
// console.log(start_date1, end_date1)
// console.log('-')
// console.log(start_date2, end_date2)
if(start_date1 < end_date2 && start_date2 < end_date1){ //判斷重疊類型
  if(start_date1 > start_date2 && end_date1 > end_date2){ //後者部分重疊 右邊突出
    return 1;
  }
  else if(start_date1 < start_date2 && end_date1 < end_date2){ //後者部分重疊 左邊突出
    return 2;
  }
  else if(start_date1 < start_date2 && end_date1 > end_date2){ //後者大到包起來
    return 3;
  }
  else{ //後者小布拉姬
    return 4;
  }
}
else{
  return 0;
}
}

function default_sort(ppl, all_data){
console.log(all_data)
var default_array = all_data.map(function(value){
  var ppl_id = value[0][0].C_id;

  return {
    id: ppl_id,
    name: value[0][0].C_name
  }
})

default_array.sort(function(a, b){
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
})

return default_array
}

function job_time_sort(ppl, all_data){ 

  var i, j, sum, sum_timeline = [], o_check;
  var temp_timeline;
  var work_time_array = all_data.map(function(value){

      if(value[2].length == 0){
        return {
          id: value[0][0].C_id,
          work_time: 0
        };
      }
      else{
        sum = 0, sum_timeline = [];
        //先將所有時間軸整合成一統合的時間軸
        for(i = 0; i < value[2].length; i++){ //依據每個人的工作經驗數跑的迴圈
          temp_timeline = [new Date(value[2][i].work_start_year, value[2][i].work_start_month, 1), new Date(value[2][i].work_end_year, value[2][i].work_end_month, 1)]
          o_check = 0;
          for(j = 0; j < sum_timeline.length; j++){ //比對當前整合完成的時間軸 來去將當前的時間軸進行處理 

            o_check = overlapCheck(temp_timeline[0], temp_timeline[1], sum_timeline[j][0], sum_timeline[j][1]);
            if(o_check == 1){
              temp_timeline = [sum_timeline[j][0], temp_timeline[1]];
              sum_timeline.splice(j, 1);
              j = j - 1;
            }
            else if(o_check == 2){
              temp_timeline = [temp_timeline[0], sum_timeline[j][1]];
              sum_timeline.splice(j, 1);
              j = j - 1;
            }
            else if(o_check == 3){
              sum_timeline.splice(j, 1);
              j = j - 1;
            }
            
          }

          //將當前的暫存時間軸丟入整合的時間軸
          if(o_check != 4){ //這個重疊狀況直接將暫存的時間軸捨棄即可
            sum_timeline.push(temp_timeline);
            sum_timeline = sum_timeline.sort(function(a, b){
              return a[0] - b[0];
            })
          }

        }

        //將整合好的時間軸計算成總時間
        for(i = 0; i < sum_timeline.length; i++){
          sum = sum + (sum_timeline[i][1] - sum_timeline[i][0]);
        }

        return {
          id: value[0][0].C_id,
          work_time: sum
        };

      }
  })

  work_time_array = work_time_array.sort(function(a, b){
    return b.work_time - a.work_time;
  })

  return work_time_array

}

function education_sort(ppl, all_data){
//console.log(all_data)
var education_array = all_data.map(function(value){
  var ppl_id = value[0][0].C_id;
  var edu_point = 0;
  var i;

  for(i = 0; i < value[1].length; i++){
    var edu_length = (new Date(value[1][i].school_end_year, value[1][i].school_end_month, 1) - new Date(value[1][i].school_start_year, value[1][i].school_start_month, 1)) / (1000 * 60 * 60 * 24 * 365);
    
    switch(value[1][i].school_degree){
      case 'Bachelor':
        edu_point = edu_point + edu_length;
        break;

      case 'Master':
        edu_point = edu_point + (edu_length * 100);
        break;

      case 'Doctor': 
      case 'PhD':
        edu_point = edu_point + (edu_length * 10000);
        break;
    }
  }

  return {
    id: ppl_id,
    edu_point: edu_point
  }
})

education_array.sort(function(a, b){
  return b.edu_point - a.edu_point;
})

return education_array
}

function skill_amount_sort(ppl, all_data){
// console.log(all_data)
var skill_array = all_data.map(function(value){
  return {
    id: value[0][0].C_id,
    skill_num: value[5].length
  }
})

skill_array.sort(function(a, b){
  return b.skill_num - a.skill_num;
})

return skill_array;
}

function skill_layer(ppl, all_data){
// console.log(all_data)
var skill_layer_array = all_data.map(function(value){
  return {
    id: value[0][0].C_id,
    skill_amount: 0
  }
})

var i, j, k;
for(i = 0; i < selected_skills.length; i++){ //找出所有人匹配的技能數量
  for(j = 0; j < selected_skills[i].C_id.length; j++){
    for(k = 0; k < skill_layer_array.length; k++){
      if(skill_layer_array[k].id == selected_skills[i].C_id[j]){
        skill_layer_array[k].skill_amount = skill_layer_array[k].skill_amount + 1;
      }
    }
  }
}

skill_layer_array = skill_layer_array.sort(function(a, b){
  return b.skill_amount - a.skill_amount
})

return skill_layer_array
}

function animation(datas, ppl){
  //將ppl整合為只有id的"最新"版本
  if(typeof(ppl[0]) == 'object'){
    window['ppl'] = ppl.map(function(value){
      return Number(value.id);
    })
  }
  else{
    window['ppl'] = ppl;
  }

  //把不顯示出來的咚咚放到最後面
  var i;
  for(i = 0; i < window.eye_select.length; i++){
    window.ppl.splice(window.ppl.indexOf(window.eye_select[i]), 1);
  }
  for(i = 0; i < window.eye_select.length; i++){
    window.ppl.push(window.eye_select[i]);
  }

  console.log(window['ppl'])


  d3.select("#space_svg").remove();
  main_graph(datas, window['ppl']);

  d3.select("#simple_svg").remove();
  simple_graph(datas, window['ppl']);

  d3.select("#high_svg").remove();

  move(selected_skills,skillAssigner.assignments);

}

function skilllayer_animation(datas, ppl){
  //將ppl整合為只有id的"最新"版本
  if(typeof(ppl[0]) == 'object'){
    window['ppl'] = ppl.map(function(value){
      return Number(value.id);
    })

    //將ppl裡面不要的人剔除，以免他們干擾技能方塊繪製
    for(i = 0; i < window.eye_select.length; i++){
      ppl.splice(ppl.map(e => Number(e.id)).indexOf(window.eye_select[i]), 1);
    }
  }
  else{
    window['ppl'] = ppl;
    //將ppl裡面不要的人剔除，以免他們干擾技能方塊繪製
    for(i = 0; i < window.eye_select.length; i++){
      ppl.splice(window.ppl.indexOf(window.eye_select[i]), 1);
    }
  }

  console.log(ppl)

  //把不顯示出來的咚咚放到最後面
  var i;
  for(i = 0; i < window.eye_select.length; i++){
    window.ppl.splice(window.ppl.indexOf(window.eye_select[i]), 1);
  }
  for(i = 0; i < window.eye_select.length; i++){
    window.ppl.push(window.eye_select[i]);
  }

  console.log(window['ppl'])

  //繪製簡圖區的技能數表示
  const height = document.querySelector("#drag-area").getBoundingClientRect().height;
  const rect_height = height / (ppl.length + window.eye_select.length);
  console.log(rect_height)

  // const y = d3.scaleBand()
  //     .domain(Array.from(Array(ppl.length).keys()))
  //     .range([ 0, height])
  //     .padding(.1);

  //設定技能符合數參考陣列
  var skill_data_temp = Array.from(new Array(ppl[0].skill_amount + 1).keys());
  skill_data_temp = skill_data_temp.reverse();
  var skill_data = [], i;
  for(i = 0; i < skill_data_temp.length; i++){
    skill_data.push({
      amount: skill_data_temp[i],
      start: ppl.map(e => e.skill_amount).indexOf(skill_data_temp[i]),
      len: ppl.filter(e => (e.skill_amount == skill_data_temp[i])).length
    });
  }

  console.log(skill_data)


  d3.select("#space_svg").remove();
  main_graph(datas, window['ppl']);

  d3.select("#simple_svg").remove();
  simple_graph(datas, window['ppl']);

  d3.select("#high_svg").remove();

  //繪製技能的東東
  d3.selectAll("body")
    .append("div")
      .attr("id", "high_div")
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0)
      .style("background-color", "transparent")
      .style("pointer-events", "none")
    .append("svg")
      .attr("id", "high_svg")
      .attr("width", document.querySelector("#app").getBoundingClientRect().width)
      .attr("height", document.querySelector("#app").getBoundingClientRect().height)
    .append("g")
      .attr("id", "skill_a_g");

  var skill_a_rect = d3.select("#skill_a_g").selectAll("#skill_a_g")
    .data(skill_data)
    .join("rect")
    .attr("x", document.querySelector(".section-1").getBoundingClientRect().width + document.querySelector(".section-2").getBoundingClientRect().width - 12)
    .attr("y", function(d){ return d.start * rect_height + document.querySelector(".sub-section-1-1").getBoundingClientRect().height + 1})
    .attr("width", 12)
    .attr("height", function(d){ return d.len * rect_height})
    .attr("fill", "#FAE6FA")
    .attr("stroke", "black")
    .attr("stroke-width", 1)

  var skill_a_word = d3.select("#skill_a_g").selectAll("#skill_a_g")
    .data(skill_data)
    .join("text")
    .attr("x", document.querySelector(".section-1").getBoundingClientRect().width + document.querySelector(".section-2").getBoundingClientRect().width - 6)
    .attr("y", function(d){ return Math.ceil(d.start + d.len / 2) * rect_height + document.querySelector(".container").getBoundingClientRect().height})
    .style("font-size", "14px")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .style("opacity", function(d){
      if(d.len == 0){
        return 0
      }
      else{
        return 1;
      }
    })
    .text(function(d){ return d.amount})
    

  move(selected_skills,skillAssigner.assignments);

  // skill_a_rect.raise();
  // skill_a_word.raise();
}

//合併演算法的排序用function
// function merge(left, right){
//   let result = [];

//   while (left.length&&right.length){
//     //左右兩陣列第一個元素進行比較，較小的推入result
//     if (left[0] < right[0]){
//       result.push(left.shift());
//     }else{
//       result.push(right.shift());
//     }
//   }

//   //while迴圈跳出時，表示左右陣列其中一個為空，因此左右判斷concat哪邊
//   result = left.length ? result.concat(left) : result.concat(right)

//   return result;
// }

// function mergeSort(array){

//   if(array.length < 2){
//     return array;
//   }

//   let mid = Math.floor(array.length/2);
//   let leftArray = array.slice(0, mid);
//   let rightArray = array.slice(mid, array.length);

//   //用遞迴一直切到最後一個元素再合併
//   return merge(mergeSort(leftArray), mergeSort(rightArray))
// }
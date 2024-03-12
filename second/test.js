var ppl_default;

function main_graph(datas, people){
  var all_data = [];

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
  
  console.log(ppl)

  const middleSection = document.querySelector(".space");
    const middleWidth = middleSection.getBoundingClientRect().width;
    const middleHeight = middleSection.getBoundingClientRect().height;
    
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 60, left: 10},                  //調整圖的高低
        width = middleWidth - margin.left - margin.right,
        height = middleHeight + (ppl.length) * 135;

  // set the dimensions and margins of the graph
  // const margin = {top: 20, right: 30, bottom: 40, left: 90},
  //     width = 1920 - margin.left - margin.right,
  //     height = 910 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  const svg = d3.select(".space")
    .append("svg")
      .attr("id","space_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      

      
  // Parse the Data

  var data = [datas['basic_information'],
              datas['academic'], 
              datas['work_experience'], 
              datas['other_experience'], 
              datas['relation_table_we_s'], 
              datas['skill'], 
              datas['relation_table_oe_s'],
              datas['note_check']];
  console.log(data)

  //抓出所有人的時間軸data
  var all_time_data = [], p, k, j, temp = [];
  for(k = 1; k < 4; k++){
      for(p = 0; p < ppl.length; p++){
          for(j = 0; j < data[k].length; j++){
            if(Number(data[k][j]['C_id']) == ppl[p]){
              temp.push(data[k][j]);
            }
          }
      }
      all_time_data.push(temp)
      temp = [];
  }

  //將此層的五十人的資料抓出
  var all_name_data = [], temp = [], temp2 = [];
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

  // 照名字排序(如果是名字排序的話)
  if(document.getElementById("btn_text").innerText == "Name"){
    if(window.all_data_world == undefined){
      var all_name_data = [], temp = [], temp2 = [];
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

          all_name_data.push(temp2);
          temp2 = [];
      }
      var ppl_temp = default_sort(ppl, all_name_data);
    }else{
      var ppl_temp = default_sort(ppl, all_data_world);
    }
    ppl = ppl_temp.map(function(value){
      return Number(value.id);
    })
    console.log(window['ppl_reverse'])
    if(window['ppl_reverse'] == -1){
      ppl = ppl.reverse();
    }
    window['ppl'] = ppl;
  }

  //找出當前所有時間軸的最小年份
  var min_date_temp = [], min_year
  min_date_temp.push(Number(all_time_data[0].reduce((pre, curr) => {
    return new Date(curr.school_start_year, curr.school_start_month, 1) < new Date(pre.school_start_year, pre.school_start_month) ? curr : pre;
  }).school_start_year))

  min_date_temp.push(Number(all_time_data[1].reduce((pre, curr) => {
    return new Date(curr.work_start_year, curr.work_start_month, 1) < new Date(pre.work_start_year, pre.work_start_month) ? curr : pre;
  }).work_start_year))

  min_date_temp.push(Number(all_time_data[2].reduce((pre, curr) => {
    return new Date(curr.exp_start_year, curr.exp_start_month, 1) < new Date(pre.exp_start_year, pre.exp_start_month) ? curr : pre;
  }).exp_start_year))

  min_year = Math.min(...min_date_temp)
  window.min_year = min_year;
  

  // Add X axis

  console.log(width)

    const x = d3.scaleTime()
      .domain([new Date(min_year, 0, 1), new Date(2023, 12, 1)])
      .range([ 10, width - 180 + margin.left + margin.right]);
    svg.append("g")
      .attr("id", "ouo")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
    svg.selectAll("path")
        .attr("stroke", "black")
    svg.selectAll("line")
        .attr("stroke", "black")
        .attr("class", "domain")
    svg.selectAll("text")
        .attr("fill", "black")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
      .domain(Array.from(Array(ppl.length).keys()))
      .range([ 0, height])
      .padding(.1);
    // svg.append("g")
    //   .call(d3.axisLeft(y))
    
    //給每個時間軸一個獨立的g
    var p, j, k, temp_id;
    var temp = [], data_temp = [];

    //紀錄所有重疊狀況發生的array 用以進行翻頁時的抓取判斷
    var all_overlap = [];

    svg.append("defs")
      .append("pattern")
      .attr("id", "bg_openeye")
      .attr("width", 30)
      .attr("height", 30)
      .append("image")
      .attr("xlink:href", "../website_image/openeye.png")
      .attr("width", 30)
      .attr("height", 30);

    svg.append("defs")
      .append("pattern")
      .attr("id", "bg_closeeye")
      .attr("width", 30)
      .attr("height", 30)
      .append("image")
      .attr("xlink:href", "../website_image/closeeye.png")
      .attr("width", 30)
      .attr("height", 30);

    svg.append("defs")
      .append("pattern")
      .attr("id", "comment_empty")
      .attr("width", 30)
      .attr("height", 30)
      .append("image")
      .attr("xlink:href", "./img/comment_empty.png")
      .attr("width", 30)
      .attr("height", 30);

    svg.append("defs")
      .append("pattern")
      .attr("id", "comment_fill")
      .attr("width", 30)
      .attr("height", 30)
      .append("image")
      .attr("xlink:href", "./img/comment_fill.png")
      .attr("width", 30)
      .attr("height", 30);

    //將每個不同的人的時間軸都分別包進不同的g裡面(處理重疊問題會比較方便)
    for(p = 0; p < ppl.length; p++){
      svg.append("g")
        .attr("id", "resume" + ppl[p]) //定義個別不同人g的ID

      //將該人的學校、工作、其他經歷資料獨立整理出來，並存到變數data_temp陣列裡面
      for(k = 0; k < 8; k++){
        for(j = 0; j < data[k].length; j++){
          if(Number(data[k][j]['C_id']) == ppl[p]){
            temp.push(data[k][j]);
          }
        }
        data_temp.push(temp);
        temp = [];
      }
      
      //console.log(data_temp)
      //把這些資料分別存到新的變數裡面(好啦我知道這邊有點多餘，但看起來比較爽)
      var data_bi = data_temp[0];
      var data_a = data_temp[1];
      var data_we = data_temp[2];
      var data_oe = data_temp[3];
      var data_rel_we_s = data_temp[4];
      var data_s = data_temp[5];
      var data_rel_oe_s = data_temp[6];
      var data_note_check = data_temp[7];
      var temp_date = [], overlap_check = [], overlap_temp = 0; //用途分別是：紀錄這人的所有時間軸範圍的陣列 / 紀錄這個人時間軸範圍是否有重疊的陣列 / 暫時紀錄某特定時間軸與幾個時間軸重疊的變數
      all_data.push(data_temp);
      data_temp = []; // 重製暫存區
    
      
      //處理學校經歷部分的時間軸
      var academic = svg.select("#resume" + ppl[p]).selectAll(".resume" + ppl[p]) //選擇該人特定的g區來進行繪製
        .data(data_a)
        .join("rect")
        .attr("id", function(d, i){ return "a" + ppl[p] + '_' + i}) //賦予時間軸特定的ID，方便之後抓出來處理重疊跟翻頁
        .attr("x", d => x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //給個開始的時間
        .attr("y", function(d, i){ //處理邏輯：先判斷這是不是新的一個人，如果是的話進行一些初始化的動作，如果不是的話就主要進行時間軸是否重疊的比對
          if(temp_id != d.C_id){
            temp_id = d.C_id; //紀錄新的人的ID
            temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1), "a" + ppl[p] + '_' + i]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
            overlap_check.push(0); //紀錄此時間軸沒有與其他時間軸重疊(因為是這個人的第一個)

            return y(p); //因為沒有重疊，所以就照順序擺就好
          }
          else{
            overlap_temp = 0; //重置變數
            tempID = ''; //重置ID
            var tempid_arr = [];
            for(k = 0; k < temp_date.length; k++){ //迴圈比對所有已經紀錄的時間軸範圍，如果這個時間軸有跟其他時間軸重疊，則將紀錄重疊次數的變數++，最後會得到此時間軸與幾個時間軸重疊
              if(temp_date[k][0] < new Date(Number(d.school_end_year), Number(d.school_end_month), 1) && new Date(Number(d.school_start_year), Number(d.school_start_month), 1) < temp_date[k][1]){ 
                tempID = temp_date[k][2]; //紀錄出現重疊狀況的時間軸的前一個時間軸ID為何
                tempid_arr.push(temp_date[k]);
                // overlap_temp ++;
              }
            }

            //尋找前一時間軸是否已經出現在重疊時間軸上
            var overlapFind = function(el){
              if(typeof(el) == 'object'){
                return el.findIndex(el => el == tempID) != -1
              }
              else{
                return el == tempID
              }
            }

            var check_overlap = all_overlap.findIndex(function(e){
              return e.findIndex(overlapFind) != -1
            })
            
            if(check_overlap != -1){
              var overlap_last_index = all_overlap[check_overlap].findIndex(overlapFind)
              overlap_temp = overlap_last_index + 1;

              if(all_overlap[check_overlap][overlap_temp] == undefined){
                all_overlap[check_overlap].push("a" + ppl[p] + '_' + i)
              }
              else if(typeof(all_overlap[check_overlap][overlap_temp]) == 'object'){
                all_overlap[check_overlap][overlap_temp].push("a" + ppl[p] + '_' + i)
              }
              else{
                all_overlap[check_overlap][overlap_temp] = [all_overlap[check_overlap][overlap_temp]];
                all_overlap[check_overlap][overlap_temp].push("a" + ppl[p] + '_' + i)
              }
            }
            else if(tempid_arr.length == 1){
              overlap_temp = 1;

              all_overlap.push([tempID, "a" + ppl[p] + '_' + i]);
            }
            else if(tempid_arr.length > 1){
              var z, overlap_counter = 1, overlap_counter_max = 1, not_overlap_same_place = [tempID];
              for(k = 0; k < tempid_arr.length; k++){
                overlap_counter_max = 1
                for(z = 0; z < tempid_arr.length; z++){
                  if(tempid_arr[z][0] < tempid_arr[k][1] && tempid_arr[k][0] < tempid_arr[z][1]){
                    if(k != z){
                      overlap_counter_max ++;
                    }
                  }
                  else{
                    if(tempid_arr[k][2] != tempID){
                      not_overlap_same_place.unshift(tempid_arr[k][2]);
                    }
                  }
                }

                if(overlap_counter_max > overlap_counter){
                  overlap_counter = overlap_counter_max;
                }
              }

              overlap_temp = overlap_counter;
              tempID = not_overlap_same_place;

              //確認重複的位置 並且將它放在相對位置的陣列之中
              if(overlap_temp == 1){
                all_overlap.push([tempID, "a" + ppl[p] + '_' + i]);
                // console.log(all_overlap, p);
              }
              else if(overlap_temp > 1){
                all_overlap.find(x => x[overlap_temp - 1] == tempID).push("a" + ppl[p] + '_' + i);
              }
            }
            
            // console.log(all_overlap, p)
            // //確認重複的位置 並且將它放在相對位置的陣列之中
            // if(overlap_temp == 1){
            //   all_overlap.push([tempID, "a" + ppl[p] + '_' + i]);
            //   // console.log(all_overlap, p);
            // }
            // else if(overlap_temp > 1){
            //   all_overlap.find(x => x[overlap_temp - 1] == tempID).push("a" + ppl[p] + '_' + i);
            // }
            
            temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1), "a" + ppl[p] + '_' + i]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
            overlap_check.push(overlap_temp); //紀錄此時間軸的重疊狀況

            return y(p) - 8 * overlap_temp; //如果沒有重疊，那overlap_tmep就會是0，那他的高度就不會變；若有重疊，則高度就會隨著他重疊的時間軸數量呈現正比成長

            
          }
        })
        .attr("width", d => x(new Date(Number(d.school_end_year), Number(d.school_end_month), 1)) - x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //就依照日期長度繪製時間軸長度
        .attr("height", 80)
        .attr("fill", function(d, i){
          // if(d.school_degree == 'bachelor'){
          //   return "#c6ffc6"
          // }
          // else if(d.school_degree == 'master'){
          //   return "#93FF93" 
          // }
          // else{
          //   return "#47ff47"
          // }
          return "#79FF79"
        })
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1)
        .on("mouseover", handleClick_ac);

      //學校學歷線條
      svg.select("#resume" + ppl[p]).selectAll("#resume" + ppl[p]) //選擇該人特定的g區來進行繪製
        .data(data_a)
        .join("line")
          .attr("id", function(d, i){ return "aline" + ppl[p] + '_' + i})
          .attr("x1", function(d, i){ return d3.selectAll("#a" + ppl[p] + '_' + i).attr("x")})
          .attr("y1", function(d, i){ return d3.selectAll("#a" + ppl[p] + '_' + i).attr("y")})
          .attr("x2", function(d, i){ return Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("x")) + Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("width"))})
          .attr("y2", function(d, i){ return d3.selectAll("#a" + ppl[p] + '_' + i).attr("y")})
          .style("stroke", "black")
          .style("stroke-width", function(d, i){
            if(d.school_degree == 'Bachelor'){
              return "0px"
            }
            else{
              return "3px"
            }
          })

      svg.select("#resume" + ppl[p]).selectAll("#resume" + ppl[p]) //選擇該人特定的g區來進行繪製
        .data(data_a)
        .join("line")
          .attr("id", function(d, i){ return "alines" + ppl[p] + '_' + i})
          .attr("x1", function(d, i){ return d3.selectAll("#a" + ppl[p] + '_' + i).attr("x")})
          .attr("y1", function(d, i){ return Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("y")) + 5})
          .attr("x2", function(d, i){ return Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("x")) + Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("width"))})
          .attr("y2", function(d, i){ return Number(d3.selectAll("#a" + ppl[p] + '_' + i).attr("y")) + 5})
          .style("stroke", "black")
          .style("stroke-width", function(d, i){
            if(d.school_degree == 'Master' || d.school_degree == 'Bachelor'){
              return "0px"
            }
            else{
              return "3px"
            }
          })

      //所有的學校文字輸入 包含學位與科系
      for(k = 0; k < data_a.length; k++){
        svg.selectAll("#resume" + ppl[p])
          .append("text") //校名
            .attr("id", "atext" + ppl[p] + '_' + k)
            .style("pointer-events", "none")
            .style("font-family", "Belanosima")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("y")) + 25)
            .attr("font-size", "20px")
            .style("opacity", 1.0)
            .text(data_a[k]['school_name'])
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width"))
              
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })
        svg.selectAll("#resume" + ppl[p])
          .append("text") //學位
            .attr("id", "a_dgtext" + ppl[p] + '_' + k)
            .style("pointer-events", "none")
            .style("font-family", "Open Sans")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("y")) + 50)
            .attr("font-size", "13px")
            .style("opacity", 1.0)
            .text(data_a[k]['school_degree'])
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width"))
              
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })

          svg.selectAll("#resume" + ppl[p])
            .data(data_a)
            .append("rect")
            .attr("id", "a_dpbox" + ppl[p] + '_' + k)
            .attr("x", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("x")))
            .attr("y", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("y")) + 55)
            .style("fill", "black")
            .style("opacity", "0.05")
            .attr("width", d => Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width")))
            .attr("height", 25)
            .style("stroke", "blue")
            .style("stroke-width", 1)

        svg.selectAll("#resume" + ppl[p])
          .append("text") //科系
            .attr("id", "a_dptext" + ppl[p] + '_' + k)
            .style("pointer-events", "none")
            .style("font-family", "Open Sans")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("y")) + 74)
            .attr("font-size", "13px")
            .style("opacity", 1.0)
            .text(function(){
              if(data_a[k]['school_department'].indexOf("department_of_")){
                return data_a[k]['school_department'].replace('department of ', '')
              }
              else{
                return data_a[k]['school_department']
              }
            })
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("a" + ppl[p] + '_' + k).getAttribute("width"))
              
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })
      }

      for(k = 0; k < overlap_check.length; k++){ //確認時間軸是否有重疊，如果有重疊，就把該特定ID的時間軸移到所有學校時間軸的最下面；如果沒有，則上面加上文字。
        if(overlap_check[k] > 0){
          svg.selectAll("#atext" + ppl[p] + '_' + k).style("opacity", 0.8);
          svg.selectAll("#a_dgtext" + ppl[p] + '_' + k).style("opacity", 0.8);
          svg.selectAll("#a_dptext" + ppl[p] + '_' + k).style("opacity", 0.8);
          svg.selectAll("#atext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#a_dgtext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#a_dpbox" + ppl[p] + '_' + k).style("opacity",  0);
          svg.selectAll("#a_dptext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#a" + ppl[p] + '_' + k).lower();
        }
      }

      // console.log(temp_date)

      overlap_check = []; //重置"重疊檢查陣列"

      //工作時間軸的處理(邏輯概念跟上面一樣 不贅述了)
      var work = svg.select("#resume" + ppl[p]).selectAll(".resume" + ppl[p])
        .data(data_we)
        .join("rect")
        .attr("id", function(d, i){ return"we" + ppl[p] + '_' + i})
        .attr("x", d => x(new Date(Number(d.work_start_year), Number(d.work_start_month), 1)))
        .attr("y", function(d, i){
          if(temp_id != d.C_id){
            temp_id = d.C_id;
            temp_date.push([new Date(Number(d.work_start_year), Number(d.work_start_month), 1), new Date(Number(d.work_end_year), Number(d.work_end_month), 1), "we" + ppl[p] + '_' + i]);
            overlap_check.push(0);

            return y(p);
          }
          else{
            overlap_temp = 0;
            tempID = ''; //重置ID
            var tempid_arr = [];
            for(k = 0; k < temp_date.length; k++){
              if(temp_date[k][0] < new Date(Number(d.work_end_year), Number(d.work_end_month), 1) && new Date(Number(d.work_start_year), Number(d.work_start_month), 1) < temp_date[k][1]){
                tempID = temp_date[k][2]; //紀錄出現重疊狀況的時間軸的前一個時間軸ID為何
                tempid_arr.push(temp_date[k]);
                // overlap_temp ++;
              }
            }

            //尋找前一時間軸是否已經出現在重疊時間軸上
            var overlapFind = function(el){
              if(typeof(el) == 'object'){
                return el.findIndex(el => el == tempID) != -1
              }
              else{
                return el == tempID
              }
            }

            var check_overlap = all_overlap.findIndex(function(e){
              return e.findIndex(overlapFind) != -1
            })
            
            if(check_overlap != -1){
              var overlap_last_index = all_overlap[check_overlap].findIndex(overlapFind)
              overlap_temp = overlap_last_index + 1;

              if(all_overlap[check_overlap][overlap_temp] == undefined){
                all_overlap[check_overlap].push("we" + ppl[p] + '_' + i)
              }
              else if(typeof(all_overlap[check_overlap][overlap_temp]) == 'object'){
                all_overlap[check_overlap][overlap_temp].push("we" + ppl[p] + '_' + i)
              }
              else{
                all_overlap[check_overlap][overlap_temp] = [all_overlap[check_overlap][overlap_temp]];
                all_overlap[check_overlap][overlap_temp].push("we" + ppl[p] + '_' + i)
              }
            }
            else if(tempid_arr.length == 1){
              overlap_temp = 1;

              all_overlap.push([tempID, "we" + ppl[p] + '_' + i]);
            }
            else if(tempid_arr.length > 1){
              console.log(ppl[p])
              var z, overlap_counter = 1, overlap_counter_max = 1, not_overlap_same_place = [tempID];
              for(k = 0; k < tempid_arr.length; k++){
                overlap_counter_max = 1
                for(z = 0; z < tempid_arr.length; z++){
                  if(tempid_arr[z][0] < tempid_arr[k][1] && tempid_arr[k][0] < tempid_arr[z][1]){
                    if(k != z){
                      overlap_counter_max ++;
                    }
                  }
                  else{
                    if(tempid_arr[k][2] != tempID){
                      not_overlap_same_place.unshift(tempid_arr[k][2]);
                    }
                  }
                }

                if(overlap_counter_max > overlap_counter){
                  overlap_counter = overlap_counter_max;
                }
              }

              overlap_temp = overlap_counter;
              tempID = not_overlap_same_place;

              //確認重複的位置 並且將它放在相對位置的陣列之中
              if(overlap_temp == 1){
                all_overlap.push([tempID, "we" + ppl[p] + '_' + i]);
              }
              else if(overlap_temp > 1){
                all_overlap.find(x => x[overlap_temp - 1] == tempID).push("we" + ppl[p] + '_' + i);
              }
            }

            //確認重複的位置 並且將它放在相對位置的陣列之中
            // if(overlap_temp == 1){
            //   all_overlap.push([tempID, "we" + ppl[p] + '_' + i]);
            // }
            // else if(overlap_temp > 1){
            //   all_overlap.find(x => x[overlap_temp - 1] == tempID).push("we" + ppl[p] + '_' + i);
            // }
            
            temp_date.push([new Date(Number(d.work_start_year), Number(d.work_start_month), 1), new Date(Number(d.work_end_year), Number(d.work_end_month), 1), "we" + ppl[p] + '_' + i]);
            overlap_check.push(overlap_temp);

            return y(p) - 8 * overlap_temp;
            
          }
        })
        .attr("width", d => x(new Date(Number(d.work_end_year), Number(d.work_end_month), 1)) - x(new Date(Number(d.work_start_year), Number(d.work_start_month), 1)))
        .attr("height", 80)
        .attr("fill", "#84C1FF")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1)
        .on("mouseover", handleClick_work)

      //所有的工作文字輸入
      for(k = 0; k < data_we.length; k++){
        svg.selectAll("#resume" + ppl[p])
          .append("text")
          .attr("id", "wetext" + ppl[p] + '_' + k)
          .style("pointer-events", "none")
          .style("font-family", "Belanosima")
          .attr("text-anchor", "middle")
          .attr("x", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width")) / 2)
          .attr("y", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("y")) + 25)
          .attr("font-size", "20px")
          .style("opacity", 1.0)
          .text(data_we[k]['work_name'])
          .each(function(){
            var text_width = this.getComputedTextLength();
            var original_text = d3.select(this).text();
            var rect_width = Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width"))
            
            if(text_width > rect_width){
              var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
              d3.select(this).text(new_text);
            }
          })

          svg.selectAll("#resume" + ppl[p])
          .append("text") //職位
            .attr("id", "we_postext" + ppl[p] + '_' + k)
            .style("pointer-events", "none")
            .style("font-family", "Open Sans")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("y")) + 50)
            .attr("font-size", "13px")
            .style("opacity", 1.0)
            .text(data_we[k]['work_position'])
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width"))
              
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })
      }

      for(k = 0; k < overlap_check.length; k++){
        if(overlap_check[k] > 0){
          svg.selectAll("#wetext" + ppl[p] + '_' + k).style("opacity", 0.8)
          svg.selectAll("#wetext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#we_postext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#we" + ppl[p] + '_' + k).lower();
          
        }
        else{
          
        }
      }
      // 畫方塊的下面技能
      // 透過這個人的經驗id去對比全部的經驗, 找到並用id的動態陣列(temp_sid)記錄下對應的技能id, 並且用count記錄這是這個人第幾個經驗
      var count1 = 0;
      for(i=0; i<data_we.length; i++){
        window['temp_sid' + i] = [];
        for(j=0; j<data[4].length; j++){
          if( data_we[i]['work_id'] == data[4][j]['work_id']){
            window['temp_sid' + i].push(data[4][j]['skill_id']);
          }
        }
        count1 += 1;
      }      

      // 利用找到的id將技能寫進技能的動態陣列(temp_skill)
      for( i=0; i<count1; i++){
        var count2 = 0;
        window['we_skill_' + ppl[p] + '_' + i] = [];     
        for(j=0; j<data_s.length; j++){
          if(window['temp_sid' + i][count2] == data_s[j]['skill_id']){
            window['we_skill_' + ppl[p] + '_' + i].push(data_s[j]['skill_name']);
            count2 += 1;
          }
        }
      }

      // 第一個svg為畫出方格, 第二個svg為寫上技能
      for(k = 0; k < data_we.length; k++){
        for(i=0; i<window['we_skill_' + ppl[p] + '_' + k].length; i++){
          svg.selectAll("#resume" + ppl[p])
            .data(data_we)
            .append("rect")
              .attr("id", "weskbox" + ppl[p] + '_' + k + '_' + i)
              .attr("x", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("x")) + 
                        Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width")) * i/window['we_skill_' + ppl[p] + '_' + k].length)
              .attr("y", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("y")) + 55)
              .style("fill", "black")
              .style("opacity", "0.05")
              .attr("width", d => Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width"))/window['we_skill_' + ppl[p] + '_' + k].length)
              .attr("height", 25)
              .style("stroke", "blue")
              .style("stroke-width", 1)
          svg.selectAll("#resume" + ppl[p])
            .append("text")
            .attr("id", "wesktext" + ppl[p] + '_' + k + '_' + i)
            .style("pointer-events", "none")
            .style("font-family", "Open Sans")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("x")) + 
                      Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width")) * (2*i+1)/(2*window['we_skill_' + ppl[p] + '_' + k].length))
            .attr("y", Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("y")) + 74)
            .attr("font-size", "13px")
            .style("opacity", 1.0)
            .text(window['we_skill_' + ppl[p] + '_' + k][i])
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("we" + ppl[p] + '_' + k).getAttribute("width")/window['we_skill_' + ppl[p] + '_' + k].length)
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })
        }
      }

      for(k = 0; k < overlap_check.length; k++){
        if(overlap_check[k] > 0){
          svg.selectAll("#we" + ppl[p] + k).lower();
          for(i=0; i<window['we_skill_' + ppl[p] + '_' + k].length; i++){
            svg.selectAll("#weskbox" + ppl[p] + '_' + k + '_' + i).style("opacity", 0)
            svg.selectAll("#wesktext" + ppl[p] + '_' + k + '_' + i).style("opacity", 0)
          }
        }
      }
      overlap_check = []; //重置"重疊檢查陣列"

      //其他經驗時間軸的處理(邏輯概念跟上面一樣 不贅述了)
      var exp = svg.select("#resume" + ppl[p]).selectAll(".resume" + ppl[p])
        .data(data_oe)
        .join("rect")
        .attr("id", function(d, i){ return "exp" + ppl[p] + '_' + i})
        .attr("x", d => x(new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1)))
        .attr("y", function(d, i){
          if(temp_id != d.C_id){
            temp_id = d.C_id;
            temp_date.push([new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1), new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1), "exp" + ppl[p] + '_' + i]);
            overlap_check.push(0);
            
            return y(p);
          }
          else{
            overlap_temp = 0;
            tempID = ''; //重置ID
            var tempid_arr = [];
            for(k = 0; k < temp_date.length; k++){
              if(temp_date[k][0] < new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1) && new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1) < temp_date[k][1]){
                tempID = temp_date[k][2]; //紀錄出現重疊狀況的時間軸的前一個時間軸ID為何
                tempid_arr.push(temp_date[k]);

                // overlap_temp ++;
              }
            }

            //尋找前一時間軸是否已經出現在重疊時間軸上
            var overlapFind = function(el){
              if(typeof(el) == 'object'){
                return el.findIndex(el => el == tempID) != -1
              }
              else{
                return el == tempID
              }
            }

            var check_overlap = all_overlap.findIndex(function(e){
              return e.findIndex(overlapFind) != -1
            })
            
            if(check_overlap != -1){
              var overlap_last_index = all_overlap[check_overlap].findIndex(overlapFind)
              overlap_temp = overlap_last_index + 1;

              if(all_overlap[check_overlap][overlap_temp] == undefined){
                all_overlap[check_overlap].push("exp" + ppl[p] + '_' + i)
              }
              else if(typeof(all_overlap[check_overlap][overlap_temp]) == 'object'){
                all_overlap[check_overlap][overlap_temp].push("exp" + ppl[p] + '_' + i)
              }
              else{
                all_overlap[check_overlap][overlap_temp] = [all_overlap[check_overlap][overlap_temp]];
                all_overlap[check_overlap][overlap_temp].push("exp" + ppl[p] + '_' + i)
              }
            }
            else if(tempid_arr.length == 1){
              overlap_temp = 1;

              all_overlap.push([tempID, "exp" + ppl[p] + '_' + i]);
            }
            else if(tempid_arr.length > 1){
              var z, overlap_counter = 1, overlap_counter_max = 1, not_overlap_same_place = [tempID];
              // console.log(tempid_arr)
              for(k = 0; k < tempid_arr.length; k++){
                overlap_counter_max = 1
                for(z = 0; z < tempid_arr.length; z++){
                  if(tempid_arr[z][0] < tempid_arr[k][1] && tempid_arr[k][0] < tempid_arr[z][1]){
                    if(k != z){
                      overlap_counter_max ++;
                    }
                  }
                  else{
                    if(tempid_arr[k][2] != tempID){
                      not_overlap_same_place.unshift(tempid_arr[k][2])
                    }
                  }
                }
                // console.log(overlap_counter_max)
                if(overlap_counter_max > overlap_counter){
                  overlap_counter = overlap_counter_max;
                }
              }
              
              overlap_temp = overlap_counter;
              tempID = not_overlap_same_place;
            }

            // console.log(overlap_temp, ppl[p])

            //確認重複的位置 並且將它放在相對位置的陣列之中
            // console.log(all_overlap)
            // if(overlap_temp == 1){
            //   all_overlap.push([tempID, "exp" + ppl[p] + '_' + i]);
            // }
            // else if(overlap_temp > 1){
            //   all_overlap.find(x => x[overlap_temp - 1] == tempID).push("exp" + ppl[p] + '_' + i);
            // }
            
            temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1), "exp" + ppl[p] + '_' + i]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
            overlap_check.push(overlap_temp); //紀錄此時間軸的重疊狀況

            return y(p) - 8 * overlap_temp; //如果沒有重疊，那overlap_tmep就會是0，那他的高度就不會變；若有重疊，則高度就會隨著他重疊的時間軸數量呈現正比成長

            
          }
        })
        .attr("width", d => x(new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1)) - x(new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1)))
        .attr("height", 80)
        .attr("fill", "#7FE0BC")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1)
        .on("mouseover", handleClick_otherexp);

      //所有的其他經驗文字輸入
      for(k = 0; k < data_oe.length; k++){
        svg.selectAll("#resume" + ppl[p])
          .append("text")
          .attr("id", "exptext" + ppl[p] + '_' + k)
          .style("pointer-events", "none")
          .style("font-family", "Belanosima")
          .attr("text-anchor", "middle")
          .attr("x", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("x")) + Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width")) / 2)
          .attr("y", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("y")) + 25)
          .attr("font-size", "20px")
          .style("opacity", 1.0)
          .text(data_oe[k]['exp_name'])
          .each(function(){
            var text_width = this.getComputedTextLength();
            var original_text = d3.select(this).text();
            var rect_width = Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width"))
            
            if(text_width > rect_width){
              var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
              d3.select(this).text(new_text);
            }
          })
      }
      
      for(k = 0; k < overlap_check.length; k++){
        if(overlap_check[k] > 0){
          svg.selectAll("#exptext" + ppl[p] + '_' + k).style("opacity", 0.8);
          svg.selectAll("#exptext" + ppl[p] + '_' + k).lower();
          svg.selectAll("#exp" + ppl[p] + '_' + k).lower();
          
        }
        else{
          
        }
      }

      // 畫方塊的下面技能
      // 透過這個人的經驗id去對比全部的經驗, 找到並用id的動態陣列(temp_sid)記錄下對應的技能id, 並且用count記錄這是這個人第幾個經驗
      var count1 = 0;
      for(i=0; i<data_oe.length; i++){
        window['temp_sid' + i] = [];
        for(j=0; j<data[6].length; j++){
          if( data_oe[i]['exp_id'] == data[6][j]['exp_id']){
            window['temp_sid' + i].push(data[6][j]['skill_id']);
          }
        }
        count1 += 1;
      }

      // 利用找到的id將技能寫進技能的動態陣列(temp_skill)
      for( i=0; i<count1; i++){
        var count2 = 0;
        window['exp_skill_' + ppl[p] + '_' + i] = [];  
        for(j=0; j<data_s.length; j++){
          if(window['temp_sid' + i][count2] == data_s[j]['skill_id']){
            window['exp_skill_' + ppl[p] + '_' + i].push(data_s[j]['skill_name']);
            count2 += 1;
          }
        }
      }

      // 第一個svg為畫出方格, 第二個svg為寫上技能
      for(k = 0; k < data_oe.length; k++){
        for(i=0; i<window['exp_skill_' + ppl[p] + '_' + k].length; i++){
          svg.selectAll("#resume" + ppl[p])
            .data(data_oe)
            .append("rect")
              .attr("id", "expskbox" + ppl[p] + '_' + k + '_' + i)
              .attr("x", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("x")) + 
                        Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width")) * i/window['exp_skill_' + ppl[p] + '_' + k].length)
              .attr("y", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("y")) + 55)
              .style("fill", "black")
              .style("opacity", "0.3")
              .attr("width", d => Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width"))/window['exp_skill_' + ppl[p] + '_' + k].length)
              .attr("height", 25)
              .style("stroke", "blue")
              .style("stroke-width", 1)
          svg.selectAll("#resume" + ppl[p])
            .append("text")
            .attr("id", "expsktext" + ppl[p] + '_' + k + '_' + i)
            .style("pointer-events", "none")
            .style("font-family", "Open Sans")
            .attr("text-anchor", "middle")
            .attr("x", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("x")) + 
                      Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width")) * (2*i+1)/(2*window['exp_skill_' + ppl[p] + '_' + k].length))
            .attr("y", Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("y")) + 74)
            .attr("font-size", "13px")
            .style("opacity", 1.0)
            .text(window['exp_skill_' + ppl[p] + '_' + k][i])
            .each(function(){
              var text_width = this.getComputedTextLength();
              var original_text = d3.select(this).text();
              var rect_width = Number(document.getElementById("exp" + ppl[p] + '_' + k).getAttribute("width")/window['exp_skill_' + ppl[p] + '_' + k].length)
              if(text_width > rect_width){
                var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width) - 5) + "...";
                d3.select(this).text(new_text);
              }
            })
        }
      }

      for(k = 0; k < overlap_check.length; k++){
        if(overlap_check[k] > 0){
          svg.selectAll("#exp" + ppl[p] + '_' + k).lower();
          for(i=0; i<window['exp_skill_' + ppl[p] + '_' + k].length; i++){
            svg.selectAll("#expskbox" + ppl[p] + '_' + k + '_' + i).style("opacity", 0)
            svg.selectAll("#expsktext" + ppl[p] + '_' + k + '_' + i).style("opacity", 0)
          }
        }
      }

      //繪製照片區
      svg.append("g")
        .attr("id", "picture" + ppl[p]);

      const radius = 50;

      var pic_text = svg.append("text")
          .attr("id","ttt" + ppl[p])
          .attr("text-anchor", "middle")
          .attr("x", width - 70)
          .attr("y", y(p) + 97)
          .text(data_bi[0]['C_name'])
          .attr("font-size", "18px")
          .style("pointer-events", "none")
          .style("font-family", "Belanosima")
          
      var picture = svg.select("#picture" + ppl[p]).selectAll(".picture")
        .data(data_bi)
        .join("circle")
          .attr("id","C_id"+data_bi[0]['C_id'])
          .attr("cx", width - 70)
          .attr("cy", y(p) + 29)
          .attr("r", 50)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("fill", "white")
          .style("opacity", 1);

        const mask = svg.append("mask")
          .attr("id", "circle-mask" + ppl[p]);
        
        mask.append("circle")
          .attr("cx", width - 70)
          .attr("cy", y(p) + 29)
          .attr("r", 50)
          .attr("fill", "white");

      // 載入圖片
      // const imageURL = "http://localhost/Project/ai_picture/101.jpg";     測試用
      const imageWidth = radius * 2+60;
      const imageHeight = radius * 2+30;

      // console.log(data_bi)
      // 在SVG中建立一個<image>元素，將圖片放入圓形中心
      const image = svg.append("image")
        .attr("class", "person_pic")
        .attr("id", "person_pic_" + ppl[p])
        .attr("xlink:href", "../ai_picture/"+data_bi[0]['C_photo'])
        .attr("x", width -70 - radius-30)
        .attr("y", y(p) + 29 - radius-20)
        .attr("width", imageWidth)
        .attr("height", imageHeight)
        .attr("mask", "url(#circle-mask" + ppl[p] + ")");

      //為checkbox包一層div
      svg.append("g")
        .attr("id", "check_g_" + ppl[p])
  
      var check = d3.select("#check_g_" + ppl[p])
        .append("foreignObject")
          .attr("class", "checkbox_div_" + ppl[p])
          // .style("position", "absolute")
          .attr("width", 50)
          .attr("height", 50)
          .attr("x", width - 145)
          .attr("y", y(p) - 25)
          .style("background-color", "transparent")
          .html(function(){
            var check_confirm = (already_selected.find(e => e == ppl[p]) ? 'checked' : '')
            return '<input type="checkbox" class="ui-checkbox" name="checkbox_' + ppl[p] + '" ' + check_confirm + ' style="position: relative; top: 20%; left: 20%;" onclick="selected_ppl(' + ppl[p] + ', ' + ppl[p] + ', this.checked,event)" />'
          })
          // .on("click", function(){

          //   var confirm = document.getElementsByName("checkbox_" + ppl[p])[0].checked;
          //   console.log("confff",confirm)

          //   var elementClass = this.getAttribute("class");
          //   dep(elementClass, 2); // 傳遞 class 名稱給 dep() 函數
          //   console.log(this);
          //   console.log("選擇");
          // })

      //為eyes包一層div(暫時捨棄)
      // svg.append("g")
      //   .attr("id", "eyes_g_" + ppl[p])

      // var eye_button = d3.select("#eyes_g_" + ppl[p])
      //     .append("rect")
      //       .attr("class", "eye_display")
      //       .attr("id", "eye_display_" + ppl[p])
      //       .attr("width", 30)
      //       .attr("height", 30)
      //       .attr("x", width - 160)
      //       .attr("y", y(p) + 20)
      //       .attr("fill", function(){
      //         if(window.eye_select.indexOf(ppl[p]) == -1){
      //           return "url(#bg_openeye)";
      //         }
      //         else{
      //           return "url(#bg_closeeye)";
      //         }
      //       })
      //       .attr("rx", 5)
      //       .attr("ry", 5)
      //       .attr("stroke", "#d9d9d9")
      //       .attr("stroke-width", 1)
      //       .on("click", function(){
      //         display_click(this.id);
      //       })

          //註解區

      //為註解包一層div

      var comment_button = svg
        .append("rect")
        .attr("class", "comment_box")
        .attr("id", "comment_box_" + ppl[p])
        .attr("x", width - 135)
        .attr("y", y(p) + 55)
        .attr("width", 30)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", function(){
          for(i=0; i<data_note_check.length; i++){
            if(data_note_check[i]['Note_View'] == 2){
              if(data_note_check[i]['Note'] != ''){
                return "url(#comment_fill)";
              }else{
                return "url(#comment_empty)";
              }
            }
          }
          return "url(#comment_empty)";
        })
        .attr("stroke", "#d9d9d9")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", function(){
          var svgElement = document.querySelector('.section-3');
          var rect = this.getBoundingClientRect();
          var xPos = rect.left;
          var yPos = rect.top;
          comment(this.id, xPos, yPos);
          console.log("一次")
          console.log("x",xPos,"y",yPos)
        })

      // 註解完
   
    }

    //進行將該隱藏起來的resume透明的步驟
    for(i = 0; i < window.eye_select.length; i++){
      d3.selectAll("#resume" + window.eye_select[i]).style("opacity", 0.2)
    }
    
    //進行all_overlap的後處理，防止同一重疊層的時間軸bug
    console.log(all_overlap)
    var overlap_bug_check = 0;
    for(i = 0; i < all_overlap.length; i++){
      for(j = 0; j < all_overlap[i].length; j++){
        if(typeof(all_overlap[i][j]) != 'object'){
          all_overlap[i][j] = [all_overlap[i][j]];
        }
        if(i != 0 && all_overlap[i - 1][j] != undefined){
          if(all_overlap[i][j][0] == all_overlap[i - 1][j][0]){
            overlap_bug_check = 1;
          }
        }
      }

      if(overlap_bug_check == 1){

        for(j = 0; j < all_overlap[i].length; j++){ //將重複的兩個重疊判定陣列結合
          if(all_overlap[i - 1][j][0] != all_overlap[i][j][0]){
            if(all_overlap[i - 1][j] != undefined){
              all_overlap[i - 1][j].push(all_overlap[i][j][0]);
            }
          }
        }

        for(j = i; j < all_overlap.length; j++){
          all_overlap[j] = all_overlap[j + 1];
          
        }
        all_overlap.pop();
        i = i - 1;
      }

      overlap_bug_check = 0;
    }

    console.log(all_overlap)

    //tooltip的處理
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltipForDetail")

  function handleClick_ac(event, d) {
    // 顯示 tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
    
    // 更新 tooltip 內容
    tooltip.html(`
    <div class="detail">
        <div class="detail_title">
          <h2>${d.school_name}</h2>
        </div>
        <div class="detail_content">
          <h3>${d.school_department}</h3>
          <p>
            Degree: ${d.school_degree}<br>
            GPA: ${d.GPA}<br>
            Time: ${d.school_start_year} ~ ${d.school_end_year}<br>
          </p>
        </div>
    </div>
      `)
      .style("left", function(){
        var countX = event.pageX + 10;
        if(countX + 570 >= window.innerWidth){
          countX = window.innerWidth - 570;
        }
        return (countX + "px");
      })
      .style("top", function(){
        var countY = event.pageY - 10;
        var tooltipElement = document.getElementById("tooltipForDetail");
        var tooltipHeight = tooltipElement.clientHeight;
        if(countY + tooltipHeight + 10 >= window.innerHeight){
          countY = window.innerHeight - (tooltipHeight + 10);
        }
        return (countY + "px");
      })
      .style("display", "block");
  }

  function handleClick_work(event, d) {

    var temp_sid = []
    for(i=0; i<data[4].length; i++){
      if(d.work_id == data[4][i]['work_id']){
        temp_sid.push(data[4][i]['skill_id'])
      }
    }
    var temp_skill = []
    for(i=0; i<temp_sid.length; i++){
      for(j=0; j<data[5].length; j++){
        if(temp_sid[i] == data[5][j]['skill_id']){
          temp_skill.push(data[5][j]['skill_name']);
        }
      }
    }

    var detail1 = d.work_detail.replace('1.', '')
    var detail2 = detail1.replace('2.', '<br>')
    var detail3 = detail2.replace('3.', '<br>')
    var detail4 = detail3.replace('4.', '<br>')
    var detail5 = detail4.replace('5.', '<br>')
    console.log(detail5)

    // 顯示 tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
    
    // 更新 tooltip 內容
    tooltip.html(`
    <div class="detail">
      <div class="detail_title">
        <h2>${d.work_name}</h2>
      </div>

      <div class="detail_content">
        <h3>${d.work_position}</h3>
        <p>
            Time: ${d.work_start_year}/${d.work_start_month} ~ ${d.work_end_year}/${d.work_end_month} <br>
            Skill: ${temp_skill}<br>
        </p>
        <h3>Detail:</h3>
        <p>${detail5}</p>
      </div>
    </div>
      `)
      .style("left", function(){
        var countX = event.pageX + 10;
        if(countX + 570 >= window.innerWidth){
          countX = window.innerWidth - 570;
        }
        return (countX + "px");
      })
      .style("top", function(){
        var countY = event.pageY - 10;
        var tooltipElement = document.getElementById("tooltipForDetail");
        var tooltipHeight = tooltipElement.clientHeight;
        if(countY + tooltipHeight + 10 >= window.innerHeight){
          countY = window.innerHeight - (tooltipHeight + 10);
        }
        return (countY + "px");
      })
      .style("display", "block");
  }

  function handleClick_otherexp(event, d){

    var temp_sid = []
    for(i=0; i<data[6].length; i++){
      if(d.exp_id == data[6][i]['exp_id']){
        temp_sid.push(data[6][i]['skill_id'])
      }
    }
    console.log(temp_sid)
    var temp_skill = []
    for(i=0; i<temp_sid.length; i++){
      for(j=0; j<data[5].length; j++){
        if(temp_sid[i] == data[5][j]['skill_id']){
          temp_skill.push(data[5][j]['skill_name']);
        }
      }
    }
    console.log(temp_skill)
    // 顯示 tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
      
    // 更新 tooltip 內容
    tooltip.html(`
    <div class="detail">
      <div class="detail_title">
          <h2>${d.exp_name}</h2>
      </div>
      <div class="detail_content">
        <p>
          Time: ${d.exp_start_year}/${d.exp_start_month} ~ ${d.exp_end_year}/${d.exp_end_month} <br>
          Skill: ${temp_skill}<br>
        </p>
      </div>
    </div>
      `)
      .style("left", function(){
        var countX = event.pageX + 10;
        if(countX + 570 >= window.innerWidth){
          countX = window.innerWidth - 570;
        }
        return (countX + "px");
      })
      .style("top", function(){
        var countY = event.pageY - 10;
        var tooltipElement = document.getElementById("tooltipForDetail");
        var tooltipHeight = tooltipElement.clientHeight;
        if(countY + tooltipHeight + 10 >= window.innerHeight){
          countY = window.innerHeight - (tooltipHeight + 10);
        }
        return (countY + "px");
      })
      .style("display", "block");
  }
  

  d3.select("body").on("mouseover", function() {
    tooltip
    .style("opacity", 0);
  });
    console.log(all_data)


  
  //繪製切換頁面按鈕//繪製切換頁面按鈕//繪製切換頁面按鈕//繪製切換頁面按鈕
  for(i = 0; i < all_overlap.length; i++){
    
    var this_id, this_id_full;
    if(typeof(all_overlap[i][0][0]) == 'object'){
      this_id = all_overlap[i][0][0][0].match(/\d+/)[0];
      this_id_full = all_overlap[i][0][0][0];
    }
    else{
      this_id = all_overlap[i][0][0].match(/\d+/)[0];
      this_id_full = all_overlap[i][0][0];
    }
    // console.log(this_id)

    var changeTimeLeft = svg.selectAll("#resume" + this_id) //切換上一頁的時間軸
      .append("image")
      .attr("id", "CTL_" + i)
      .attr("xlink:href", "../website_image/leftarrow.png")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", Number(document.getElementById(this_id_full).getAttribute("x")))
      .attr("y", Number(document.getElementById(this_id_full).getAttribute("y")) + Number(document.getElementById(this_id_full).getAttribute("height")) + 5)
      .style("cursor", "pointer")
      .on("click", function(){
        var overlap_array = all_overlap[Number(this.id.substr(4))];
        var x, y, tempAngle;
        var temp_array = [];

        
        
        for(j = 0; j < overlap_array.length; j++){
          
          if(j == overlap_array.length - 1){

            for(k = 0; k < overlap_array[j].length; k++){
              var first_y = overlap_array[j];
              var overlap_length = overlap_array.length;

              svg.selectAll("#" + overlap_array[j][k])
              .transition()
              .duration(300)
              .attrTween("transform", function() {
                return function(t) {
                  angle = 360 * t;

                  tempAngle = ((angle + 90) * Math.PI) / 180;
                  x =  30 * (Math.sin(tempAngle) - 1);
                  y =  30 * Math.cos(tempAngle);

                  //console.log(x)

                  return "translate(" + x + ", " + y + ")"
                };
              });
              
              if(overlap_array[j][k][0] =='a'){
                svg.selectAll("#aline" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                  .transition()
                  .duration(300)
                  .attrTween("transform", function() {
                    return function(t) {
                      angle = 360 * t;

                      tempAngle = ((angle + 90) * Math.PI) / 180;
                      x =  30 * (Math.sin(tempAngle) - 1);
                      y =  30 * Math.cos(tempAngle);

                      //console.log(x)

                      return "translate(" + x + ", " + y + ")"
                    };
                  });

                  svg.selectAll("#alines" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                  .transition()
                  .duration(300)
                  .attrTween("transform", function() {
                    return function(t) {
                      angle = 360 * t;

                      tempAngle = ((angle + 90) * Math.PI) / 180;
                      x =  30 * (Math.sin(tempAngle) - 1);
                      y =  30 * Math.cos(tempAngle);

                      //console.log(x)

                      return "translate(" + x + ", " + y + ")"
                    };
                  });
              }
            }
            
              
            d3.timeout(function(){
              for(p = 0; p < first_y.length; p++){
                svg.selectAll("#" + document.getElementById(first_y[p]).getAttribute("id")).attr("y", Number(document.getElementById(first_y[p]).getAttribute("y")) + (8 * (overlap_length - 1)));
                svg.selectAll("#" + document.getElementById(first_y[p]).getAttribute("id")).raise();

                if(first_y[p][0] == 'a'){
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y1", Number(document.getElementById("aline" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y1")) + (8 * (overlap_length - 1)));
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y2", Number(document.getElementById("aline" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y2")) + (8 * (overlap_length - 1)));
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).raise();

                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y1", Number(document.getElementById("alines" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y1")) + (8 * (overlap_length - 1)));
                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y2", Number(document.getElementById("alines" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y2")) + (8 * (overlap_length - 1)));
                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).raise();
                }
              }
                
            }, 150);
            
            //處理陣列在調整過位置後的順序位置
            temp_array[0] = overlap_array[j]; 
          }
          else{
            for(k = 0; k < overlap_array[j].length; k++){
              svg.selectAll("#" + overlap_array[j][k]).transition().duration(300).attr("y", (Number(document.getElementById(overlap_array[j][k]).getAttribute("y")) - 8));

              if(overlap_array[j][k][0] == 'a'){
                var the_temp_array = overlap_array[j][k]
                svg.selectAll("#aline" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition().tween("y", function(){
                  var i1 = d3.interpolate(Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")), Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")) - 8);
                  var i2 = d3.interpolate(Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")), Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")) - 8);
                  return function(t) {d3.select(this).attr("y1", i1(t)).attr("y2", i2(t))};
                })

                svg.selectAll("#alines" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition().tween("y", function(){
                  var i1 = d3.interpolate(Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")), Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")) - 8);
                  var i2 = d3.interpolate(Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")), Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")) - 8);
                  return function(t) {d3.select(this).attr("y1", i1(t)).attr("y2", i2(t))};
                })

                
              }
            }

            //處理陣列在調整過位置後的順序位置
            temp_array[j + 1] = overlap_array[j]; 
          }
        }


        all_overlap[Number(this.id.substr(4))] = temp_array;
        
        //處理文字的變更
        overlap_array = all_overlap[Number(this.id.substr(4))];

        var delay_bug_temp = [];

        for(k = 0; k < overlap_array[1].length; k++){
          
          var changeText_q = overlap_array[1][k].match(/\d[0-9_]*/)[0].length;

          console.log(overlap_array[1][k].match(/\d[0-9_]*/)[0])

          var SKILLID = overlap_array[1][k].replace(overlap_array[1][k].slice(changeText_q * -1),
                        "_skill_" + overlap_array[1][k].slice(changeText_q * -1))

          var changeTextID = overlap_array[1][k].replace(overlap_array[1][k].slice(changeText_q * -1), 
                            "text" + overlap_array[1][k].slice(changeText_q * -1));
                  
          var changeTextSuffix = overlap_array[1][k].slice(changeText_q * -1)

          svg.selectAll("#" + changeTextID)
            .transition()
            .attr("y", Number(document.getElementById(overlap_array[1][k]).getAttribute("y")) + 25 - 1 * 8) // -(overlap_length-1)*8
            .style("opacity", 0.8)

          //svg.selectAll("#" + changeTextID).lower();

          if(changeTextID.substr(0, 1) == 'a'){
            svg.selectAll("#a_dgtext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[1][k]).getAttribute("y")) + 50 - 1 * 8)
              .style("opacity", 0.8)

           // svg.selectAll("#a_dgtext" + changeTextSuffix).lower();

            svg.selectAll("#a_dptext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[1][k]).getAttribute("y")) + 74 - 1 * 8)
              .style("opacity", 0.8)

           // svg.selectAll("#a_dptext" + changeTextSuffix).lower();

            svg.selectAll("#a_dpbox" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[1][k]).getAttribute("y")) + 55 - 1 * 8)
              .style("opacity", 0.05)

           // svg.selectAll("#a_dptext" + changeTextSuffix).lower();
          }
          else if(changeTextID.substr(0, 1) == 'w'){
            svg.selectAll("#we_postext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[1][k]).getAttribute("y")) + 50 - 1 * 8)
              .style("opacity", 0.8)
          }


          if(window[SKILLID] != undefined ){
            for(i=0; i<window[SKILLID].length; i++){
              var changeTextID_skill = overlap_array[1][k].replace(overlap_array[1][k].slice(changeText_q * -1),
                                      "sktext" + overlap_array[1][k].slice(changeText_q * -1) + '_' + i);
              var changeTextID_skillbox = overlap_array[1][k].replace(overlap_array[1][k].slice(changeText_q * -1),
                                      "skbox" + overlap_array[1][k].slice(changeText_q * -1) + '_' + i);                        
              svg.selectAll("#" + changeTextID_skill)
                .style("opacity", 0)
              svg.selectAll("#" + changeTextID_skillbox)
                .style("opacity", 0)
            }
          }
          
        }

        for(k = 0; k < overlap_array[0].length; k++){
          
          var nextText_q = overlap_array[0][k].match(/\d[0-9_]*/)[0].length;

          var SKILLID = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1),
                        "_skill_" + overlap_array[0][k].slice(nextText_q * -1))


          var nextTextID = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1), "text" + overlap_array[0][k].slice(nextText_q * -1));
          console.log(nextTextID)

          var nextTextSuffix = overlap_array[0][k].slice(nextText_q * -1);

          svg.selectAll("#" + nextTextID)
            .transition()
            .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 25)
            .style("opacity", 1.0);


          if(nextTextID.substr(0, 1) == 'a'){
            svg.selectAll("#a_dgtext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 50)
              .style("opacity", 1.0);

            svg.selectAll("#a_dpbox" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")))
              .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 55)
              .style("opacity", 0.05);

            svg.selectAll("#a_dptext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 74)
              .style("opacity", 1.0);
          }
          else if(changeTextID.substr(0, 1) == 'w'){
            svg.selectAll("#we_postext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 50)
              .style("opacity", 1.0);
          }


          if(window[SKILLID] != undefined ){
            for(i=0; i<window[SKILLID].length; i++){
              var nextTextID_skill = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1),
                                    "sktext" + overlap_array[0][k].slice(nextText_q * -1) + '_' + i);
              var nextTextID_skillbox = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1),
                                      "skbox" + overlap_array[0][k].slice(nextText_q * -1) + '_'  + i);
              svg.selectAll("#" + nextTextID_skill)
                .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) * (2*i+1)/(2*window[SKILLID].length))
                .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 74)
                .style("opacity", 1.0);
              svg.selectAll("#" + nextTextID_skillbox)
                .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) * i/window[SKILLID].length)
                .attr("y", Number(document.getElementById(overlap_array[1][0]).getAttribute("y")) + 55)
                .style("opacity", 0.05);

              if(window[SKILLID][0] != undefined){
                delay_bug_temp.push([nextTextID, nextTextID_skill, nextTextID_skillbox]);
              }

              // console.log(nextTextID_skill)
              // console.log(nextTextID_skillbox)
            }
            if(window[SKILLID][0] == undefined){ //如果其他經驗沒有技能 則另外處裡
              delay_bug_temp.push([nextTextID, '', '']);
            }
          }else{
            delay_bug_temp.push([nextTextID, '', '']);
          }
          
        }


        d3.timeout(function(){
          for(k = 0; k < delay_bug_temp.length; k++){
            svg.selectAll("#" + delay_bug_temp[k][0]).raise(); //nextTextID

            if(delay_bug_temp[k][0].substr(0, 1) == 'a'){ //處理學歷科系的換位
              
              console.log(delay_bug_temp[k][0])
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dpbox')).raise();
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dptext')).raise();
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dgtext')).raise();
            }
            else if(delay_bug_temp[k][0].substr(0, 1) == 'w'){ //處理學歷科系的換位
              
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_postext')).raise();
              svg.selectAll("#" + delay_bug_temp[k][1]).raise(); //nextTextID_skill
              svg.selectAll("#" + delay_bug_temp[k][2]).raise(); //nextTextID_skillbox
            }
            else if(delay_bug_temp[k][1] != ''){ //處理具有技能欄位的其他經驗之換位
              svg.selectAll("#" + delay_bug_temp[k][1]).raise(); //nextTextID_skill
              svg.selectAll("#" + delay_bug_temp[k][2]).raise(); //nextTextID_skillbox
            }
            console.log(delay_bug_temp[k])
          }
        }, 150);
      });

    var changeTimeRight = svg.selectAll("#resume" + this_id) //切換下一頁的時間軸
      .append("image")
      .attr("id", "CTR_" + i)
      .attr("xlink:href", "../website_image/rightarrow.png")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", Number(document.getElementById(this_id_full).getAttribute("x")) + 25)
      .attr("y", Number(document.getElementById(this_id_full).getAttribute("y")) + Number(document.getElementById(this_id_full).getAttribute("height")) + 5)
      .style("cursor", "pointer")
      .on("click", function(){
        var overlap_array = all_overlap[Number(this.id.substr(4))];
        var x, y, tempAngle;
        var temp_array = [];

        for(j = 0; j < overlap_array.length; j++){
          
          if(j == 0){

            for(k = 0; k < overlap_array[j].length; k++){
              var first_y = overlap_array[j];
              var overlap_length = overlap_array.length;

              svg.selectAll("#" + overlap_array[j][k])
                .transition()
                .duration(300)
                .attrTween("transform", function() {
                  return function(t) {
                    angle = 360 * Math.abs(t - 1);

                    tempAngle = ((angle + 90) * Math.PI) / 180;
                    x =  30 * (Math.sin(tempAngle) - 1);
                    y =  30 * Math.cos(tempAngle);

                    //console.log(x)

                    return "translate(" + x + ", " + y + ")"
                  };
                });

              if(overlap_array[j][k][0] =='a'){
                svg.selectAll("#aline" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition()
                .duration(300)
                .attrTween("transform", function() {
                  return function(t) {
                    angle = 360 * Math.abs(t - 1);

                    tempAngle = ((angle + 90) * Math.PI) / 180;
                    x =  30 * (Math.sin(tempAngle) - 1);
                    y =  30 * Math.cos(tempAngle);

                    //console.log(x)

                    return "translate(" + x + ", " + y + ")"
                  };
                });

                svg.selectAll("#alines" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition()
                .duration(300)
                .attrTween("transform", function() {
                  return function(t) {
                    angle = 360 * Math.abs(t - 1);

                    tempAngle = ((angle + 90) * Math.PI) / 180;
                    x =  30 * (Math.sin(tempAngle) - 1);
                    y =  30 * Math.cos(tempAngle);

                    //console.log(x)

                    return "translate(" + x + ", " + y + ")"
                  };
                });
              }
            }
            
            d3.timeout(function(){
              for(p = 0; p < first_y.length; p++){
                if(first_y[p][0] == 'a'){
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y1", Number(document.getElementById("aline" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y1")) - (8 * (overlap_length - 1)));
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y2", Number(document.getElementById("aline" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y2")) - (8 * (overlap_length - 1)));
                  svg.selectAll("#aline" + first_y[p].match(/\d[0-9_]*/)[0]).lower();

                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y1", Number(document.getElementById("alines" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y1")) - (8 * (overlap_length - 1)));
                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).attr("y2", Number(document.getElementById("alines" + first_y[p].match(/\d[0-9_]*/)[0]).getAttribute("y2")) - (8 * (overlap_length - 1)));
                  svg.selectAll("#alines" + first_y[p].match(/\d[0-9_]*/)[0]).lower();
                }
              
                svg.selectAll("#" + document.getElementById(first_y[p]).getAttribute("id")).attr("y", Number(document.getElementById(first_y[p]).getAttribute("y")) - (8 * (overlap_length - 1)));

                svg.selectAll("#" + document.getElementById(first_y[p]).getAttribute("id")).lower();

              }
            }, 150);
            //處理陣列在調整過位置後的順序位置
            temp_array[overlap_length - 1] = overlap_array[j];

          }
          else{
            for(k = 0; k < overlap_array[j].length; k++){
              svg.selectAll("#" + overlap_array[j][k]).transition().duration(300).attr("y", (Number(document.getElementById(overlap_array[j][k]).getAttribute("y")) + 8));

              if(overlap_array[j][k][0] == 'a'){
                var the_temp_array = overlap_array[j][k]
                svg.selectAll("#aline" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition().tween("y", function(){
                  var i1 = d3.interpolate(Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")), Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")) + 8);
                  var i2 = d3.interpolate(Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")), Number(document.getElementById("aline" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")) + 8);
                  return function(t) {d3.select(this).attr("y1", i1(t)).attr("y2", i2(t))};
                })

                svg.selectAll("#alines" + overlap_array[j][k].match(/\d[0-9_]*/)[0])
                .transition().tween("y", function(){
                  var i1 = d3.interpolate(Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")), Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y1")) + 8);
                  var i2 = d3.interpolate(Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")), Number(document.getElementById("alines" + the_temp_array.match(/\d[0-9_]*/)[0]).getAttribute("y2")) + 8);
                  return function(t) {d3.select(this).attr("y1", i1(t)).attr("y2", i2(t))};
                })

                
              }
            }
            //處理陣列在調整過位置後的順序位置
            temp_array[j - 1] = overlap_array[j]; 
          }
        }

        all_overlap[Number(this.id.substr(4))] = temp_array;
        
        //處理文字的變更
        //確認id的數字有多少 以便進行字串處理

        var delay_bug_temp = [];

        overlap_array = all_overlap[Number(this.id.substr(4))];

        for(k = 0; k < overlap_array[overlap_array.length - 1].length; k++){
                    
          var changeText_q = overlap_array[overlap_array.length - 1][k].match(/\d[0-9_]*/)[0].length;

          var SKILLID = overlap_array[overlap_array.length - 1][k].replace(overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1), 
                        "_skill_" + overlap_array[overlap_array.length - 1][k].slice(changeText_q* -1))

          var changeTextID = overlap_array[overlap_array.length - 1][k].replace(overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1), 
                            "text" + overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1));
                            
          var changeTextSuffix = overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1);


          svg.selectAll("#" + changeTextID)
            .transition()
            .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][k]).getAttribute("y")) + 25 - 1 * 8) //- (overlap_length - 1) * 8)
            .style("opacity", 0.8)

          //svg.selectAll("#" + changeTextID).lower()

          if(changeTextID.substr(0, 1) == 'a'){
            
            svg.selectAll("#a_dpbox" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][k]).getAttribute("y")) + 55 - 1 * 8)
              .style("opacity", 0.05)

            //svg.selectAll("#a_dgtext" + changeTextSuffix).lower()
            svg.selectAll("#a_dptext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][k]).getAttribute("y")) + 74 - 1 * 8)
              .style("opacity", 0.8)

            //svg.selectAll("#a_dptext" + changeTextSuffix).lower()

            svg.selectAll("#a_dgtext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][k]).getAttribute("y")) + 50 - 1 * 8)
              .style("opacity", 0.8)

            //svg.selectAll("#a_dgtext" + changeTextSuffix).lower()
          }
          else if(changeTextID.substr(0, 1) == 'w'){
            svg.selectAll("#we_postext" + changeTextSuffix)
              .transition()
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][k]).getAttribute("y")) + 50 - 1 * 8)
              .style("opacity", 0.8)
          }

          if(window[SKILLID] != undefined ){
            for(i=0; i<window[SKILLID].length; i++){
              var changeTextID_skill = overlap_array[overlap_array.length - 1][k].replace(overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1), 
                                    "sktext" + overlap_array[overlap_array.length - 1][k].slice(changeText_q* -1) + '_' + i);
              var changeTextID_skillbox = overlap_array[overlap_array.length - 1][k].replace(overlap_array[overlap_array.length - 1][k].slice(changeText_q * -1), 
                                    "skbox" + overlap_array[overlap_array.length - 1][k].slice(changeText_q* -1) + '_' + i);
              svg.selectAll("#" + changeTextID_skill)
                .style("opacity", 0)
              svg.selectAll("#" + changeTextID_skillbox)
                .style("opacity", 0)
            }
          }

          delay_bug_temp.push([changeTextID]);
        }

        d3.timeout(function(){
          for(k = 0; k < delay_bug_temp.length; k++){
            svg.selectAll("#" + delay_bug_temp[k][0]).lower(); //nextTextID

            if(delay_bug_temp[k][0].substr(0, 1) == 'a'){ //處理學歷科系的換位

              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dpbox')).lower();
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dptext')).lower();
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_dgtext')).lower();
            }
            else if(delay_bug_temp[k][0].substr(0, 1) == 'w'){ //處理學歷科系的換位
              
              svg.selectAll("#" + delay_bug_temp[k][0].replace('text', '_postext')).lower();
            }
            // else{
            //   svg.selectAll("#" + delay_bug_temp[k][1]).raise(); //nextTextID_skill
            //   svg.selectAll("#" + delay_bug_temp[k][2]).raise(); //nextTextID_skillbox
            // }
            console.log(delay_bug_temp[k][0].replace('text', '_dptext'))
          }
        }, 100);
      

        for(k = 0; k < overlap_array[0].length; k++){
          
          var nextText_q = overlap_array[0][k].match(/\d[0-9_]*/)[0].length;

          var SKILLID = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1), 
                        "_skill_" + overlap_array[0][k].slice(nextText_q * -1))

          var nextTextID = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1), "text" + overlap_array[0][k].slice(nextText_q * -1));

          var nextTextSuffix = overlap_array[0][k].slice(nextText_q * -1);

          svg.selectAll("#" + nextTextID)
            .transition()
            .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
            .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 25)
            .style("opacity", 1.0);

          svg.selectAll("#" + nextTextID).raise()

          if(nextTextID.substr(0, 1) == 'a'){
            
            svg.selectAll("#a_dpbox" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")))
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 55)
              .style("opacity", 0.05);

            svg.selectAll("#a_dptext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 74)
              .style("opacity", 1.0);

            svg.selectAll("#a_dgtext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 50)
              .style("opacity", 1.0);
          }
          else if(nextTextID.substr(0, 1) == 'w'){
            svg.selectAll("#we_postext" + nextTextSuffix)
              .transition()
              .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) / 2)
              .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 50)
              .style("opacity", 1.0);

          }

          if(window[SKILLID] != undefined ){
            for(i=0; i<window[SKILLID].length; i++){
              var nextTextID_skill = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1), 
                                    "sktext" + overlap_array[0][k].slice(nextText_q * -1) + '_' + i);
              var nextTextID_skillbox = overlap_array[0][k].replace(overlap_array[0][k].slice(nextText_q * -1), 
                                      "skbox" + overlap_array[0][k].slice(nextText_q * -1) + '_' + i);
  
              svg.selectAll("#" + nextTextID_skill)
                .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) * (2*i+1)/(2*window[SKILLID].length))
                .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 74)
                .style("opacity", 1.0);
              svg.selectAll("#" + nextTextID_skillbox)
                .attr("x", Number(document.getElementById(overlap_array[0][k]).getAttribute("x")) + Number(document.getElementById(overlap_array[0][k]).getAttribute("width")) * i/window[SKILLID].length)
                .attr("y", Number(document.getElementById(overlap_array[overlap_array.length - 1][0]).getAttribute("y")) + 55)
                .style("opacity", 0.05);
            }
          }
        }
        console.log(all_overlap)
      });
  }

  skill_strength(datas,ppl)
  // console.log(window['skill_point_10'])
  // console.log(window['skill_object_1'])

  skill_strength_average(datas,ppl)
  // console.log(window['skill_point_average_1'])
  // console.log(window['skill_object_average_1'])

  skill_strength111(datas,ppl)
  // console.log(skill_point)
  // console.log(skill_object)

  // console.log(window.already_selected)

  
}

//懶得開一個新的js檔
function redirectToOtherPage(){
  //把選擇的人傳送過去
  localStorage.setItem("second_selected", JSON.stringify(window.already_selected));

  window.location.href = "../third/Final.html";
}
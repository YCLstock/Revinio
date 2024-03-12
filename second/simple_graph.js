function simple_graph(datas, people){

  const dragBox = document.querySelector('#drag-box');
  const middle = document.querySelector('#drag-area');
  const right = document.querySelector('.section-3');
  const space_svg = document.querySelector('#space_svg');
  const down = document.querySelector('.sub-section-1-1');

  const rightHeight = space_svg.getBoundingClientRect().height;
  const scroll_Height = right.clientHeight;
  const middleHeight = middle.getBoundingClientRect().height;
  const dragBoxHeight = dragBox.getBoundingClientRect().height;
  const downHeight = down.getBoundingClientRect().height;

  let scale = (rightHeight-scroll_Height)/(middleHeight-dragBoxHeight);                    //計算縮放量
  var sim_height = 80/scale;

  // console.log("靠北市數學",scale)

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
  

    const middleSection = document.querySelector("#drag-area");
      var middleWidth = middleSection.getBoundingClientRect().width;
      const MiddleHeight1 = middleSection.getBoundingClientRect().height;

      // console.log(middleHeight)
      //動態調整dragbox的寬度
      if(document.getElementById("btn_text").innerText == "Selected skill amount"){
        middleWidth = Number(middleWidth) - 10;
        console.log("fuck you")
      }
      
      // set the dimensions and margins of the graph
      const margin = {top: 10/9.375, right: 30, bottom: 60, left: 10},                  //調整圖的高低
          width = middleWidth - margin.left - margin.right,
          height = MiddleHeight1;                                                   //orgin: ppl.length * 14.4
  
    // set the dimensions and margins of the graph+

    const change = document.getElementById('drag-box');                                      //調整drag的長度
    const change_height = (height/ppl.length)*5;
    change.style.height = change_height +'px';                                                //在這裡更改樣式
    const change_width = document.getElementById('drag-box');  
    change_width.style.width = middleWidth +'px'; 

    // const margin = {top: 20, right: 30, bottom: 40, left: 90},
    //     width = 1920 - margin.left - margin.right,
    //     height = 910 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#drag-area")
      .append("svg")
        .attr("id", "simple_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
    // Parse the Data
  
    var data = [datas['basic_information'], datas['academic'], datas['work_experience'], datas['other_experience']];
    console.log(data)

    // 照名字排序(如果是名字排序的話)
    if(document.getElementById("btn_text").innerText == "Name"){
      if(window.all_data_world == undefined){
        var all_name_data = [], temp = [], temp2 = [];
        for(p = 0; p < ppl.length; p++){
            for(k = 0; k < 3; k++){
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
      if(window['ppl_reverse'] == -1){
        ppl = ppl.reverse();
      }
      window['ppl'] = ppl;
    }
  
    //定義讀入的資料數量
    
  
    // Add X axis
  
      const x = d3.scaleTime()
        .domain([new Date(window.min_year, 0, 1), new Date(2023, 12, 1)])
        .range([ 0, width + margin.left + margin.right-30]);
      svg.append("g")
        .attr("id", "ouo")
        .attr("transform", `translate(0, ${height})`)
        // .call(d3.axisBottom(x))
      // svg.selectAll("path")
      //     .attr("stroke", "black")
      // svg.selectAll("line")
      //     .attr("stroke", "black")
      // svg.selectAll("text")
      //     .attr("fill", "black")
      //     .attr("transform", "translate(-10,0)rotate(-45)")
      //     .style("text-anchor", "end");
  
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
      //將每個不同的人的時間軸都分別包進不同的g裡面(處理重疊問題會比較方便)
      for(p = 0; p < ppl.length; p++){
        svg.append("g")
          .attr("id", "s_resume" + ppl[p]) //定義個別不同人g的ID
  
        //將該人的學校、工作、其他經歷資料獨立整理出來，並存到變數data_temp陣列裡面
        for(k = 0; k < 4; k++){
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
        var temp_date = [], overlap_check = [], overlap_temp = 0; //用途分別是：紀錄這人的所有時間軸範圍的陣列 / 紀錄這個人時間軸範圍是否有重疊的陣列 / 暫時紀錄某特定時間軸與幾個時間軸重疊的變數
        data_temp = []; // 重製暫存區
        
        
        
        //處理學校經歷部分的時間軸
        var academic = svg.select("#s_resume" + ppl[p]).selectAll(".resume" + ppl[p]) //選擇該人特定的g區來進行繪製
          .data(data_a)
          .join("rect")
          .attr("id", function(d, i){ return "s_a" + ppl[p] + "_" + i}) //賦予時間軸特定的ID，方便之後抓出來處理重疊跟翻頁
          .attr("x", d => x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //給個開始的時間
          .attr("y", function(d){ //處理邏輯：先判斷這是不是新的一個人，如果是的話進行一些初始化的動作，如果不是的話就主要進行時間軸是否重疊的比對
            if(temp_id != d.C_id){
              temp_id = d.C_id; //紀錄新的人的ID
              temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1)]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
              overlap_check.push(0); //紀錄此時間軸沒有與其他時間軸重疊(因為是這個人的第一個)
  
              return y(p); //因為沒有重疊，所以就照順序擺就好
            }
            else{
              overlap_temp = 0; //重置變數
              for(k = 0; k < temp_date.length; k++){ //迴圈比對所有已經紀錄的時間軸範圍，如果這個時間軸有跟其他時間軸重疊，則將紀錄重疊次數的變數++，最後會得到此時間軸與幾個時間軸重疊
                if(temp_date[k][0] < new Date(Number(d.school_end_year), Number(d.school_end_month), 1) && new Date(Number(d.school_start_year), Number(d.school_start_month), 1) < temp_date[k][1]){ 
                  overlap_temp ++;
                }
              }
              
              temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1)]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
              overlap_check.push(overlap_temp); //紀錄此時間軸的重疊狀況
  
              return y(p) - 2 * overlap_temp; //如果沒有重疊，那overlap_tmep就會是0，那他的高度就不會變；若有重疊，則高度就會隨著他重疊的時間軸數量呈現正比成長
              
            }
          })
          .attr("width", d => x(new Date(Number(d.school_end_year), Number(d.school_end_month), 1)) - x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //就依照日期長度繪製時間軸長度
          .attr("height", sim_height)
          .attr("fill", "#79FF79")
          //.attr("stroke", "black")
          .attr("stroke-width", 2)
  
        for(k = 0; k < overlap_check.length; k++){ //確認時間軸是否有重疊，如果有重疊，就把該特定ID的時間軸移到所有學校時間軸的最下面
          if(overlap_check[k] > 0){
            svg.selectAll("#s_a" + ppl[p] + "_" + k).lower();
          }
        //   else{
        //     svg.selectAll("#s_resume" + ppl[p])
        //       .append("text")
        //       .attr("text-anchor", "middle")
        //       .attr("x", Number(document.getElementById("a" + ppl[p] + k).getAttribute("x")) + Number(document.getElementById("a" + ppl[p] + k).getAttribute("width")) / 2)
        //       .attr("y", Number(document.getElementById("a" + ppl[p] + k).getAttribute("y")) + 30)
        //       .attr("font-size", "28px")
        //       .text(data_a[k]['school_name'])
        //   }
        }
  
        // console.log(temp_date)

        //學校學歷線條
      svg.select("#s_resume" + ppl[p]).selectAll("#s_resume" + ppl[p]) //選擇該人特定的g區來進行繪製
      .data(data_a)
      .join("line")
        .attr("id", function(d, i){ return "s_aline" + ppl[p] + '_' + i})
        .attr("x1", function(d, i){ return d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("x")})
        .attr("y1", function(d, i){ return d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("y")})
        .attr("x2", function(d, i){ return Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("x")) + Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("width"))})
        .attr("y2", function(d, i){ return d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("y")})
        .style("stroke", "black")
        .style("stroke-width", function(d, i){
          if(d.school_degree == 'Bachelor'){
            return "0px"
          }
          else{
            return "1px"
          }
        })

    svg.select("#s_resume" + ppl[p]).selectAll("#s_resume" + ppl[p]) //選擇該人特定的g區來進行繪製
      .data(data_a)
      .join("line")
        .attr("id", function(d, i){ return "s_aline" + ppl[p] + '_' + i})
        .attr("x1", function(d, i){ return d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("x")})
        .attr("y1", function(d, i){ return Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("y")) + (sim_height / 4)})
        .attr("x2", function(d, i){ return Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("x")) + Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("width"))})
        .attr("y2", function(d, i){ return Number(d3.selectAll("#s_a" + ppl[p] + '_' + i).attr("y")) + (sim_height / 4)})
        .style("stroke", "black")
        .style("stroke-width", function(d, i){
          if(d.school_degree == 'Master' || d.school_degree == 'Bachelor'){
            return "0px"
          }
          else{
            return "1px"
          }
        })
  
        overlap_check = []; //重置"重疊檢查陣列"
  
        //工作時間軸的處理(邏輯概念跟上面一樣 不贅述了)
        var work = svg.select("#s_resume" + ppl[p]).selectAll(".resume" + ppl[p])
          .data(data_we)
          .join("rect")
          .attr("id", function(d, i){ return"s_we" + ppl[p] + "_" + i})
          .attr("x", d => x(new Date(Number(d.work_start_year), Number(d.work_start_month), 1)))
          .attr("y", function(d){
            if(temp_id != d.C_id){
              temp_id = d.C_id;
              temp_date.push([new Date(Number(d.work_start_year), Number(d.work_start_month), 1), new Date(Number(d.work_end_year), Number(d.work_end_month), 1)]);
              overlap_check.push(0);
  
              return y(p);
            }
            else{
              overlap_temp = 0;
              for(k = 0; k < temp_date.length; k++){
                if(temp_date[k][0] < new Date(Number(d.work_end_year), Number(d.work_end_month), 1) && new Date(Number(d.work_start_year), Number(d.work_start_month), 1) < temp_date[k][1]){
                  overlap_temp ++;
                }
              }
              
              temp_date.push([new Date(Number(d.work_start_year), Number(d.work_start_month), 1), new Date(Number(d.work_end_year), Number(d.work_end_month), 1)]);
              overlap_check.push(overlap_temp);
  
              return y(p) - 2 * overlap_temp;
              
            }
          })
          .attr("width", d => x(new Date(Number(d.work_end_year), Number(d.work_end_month), 1)) - x(new Date(Number(d.work_start_year), Number(d.work_start_month), 1)))
          .attr("height", sim_height)
          .attr("fill", "	#84C1FF")
          //.attr("stroke", "black")
          .attr("stroke-width", 2)
  
        for(k = 0; k < overlap_check.length; k++){
          if(overlap_check[k] > 0){
            svg.selectAll("#s_we" + ppl[p] + "_" + k).lower();
          }
        //   else{
        //     svg.selectAll("#s_resume" + ppl[p])
        //       .append("text")
        //       .attr("text-anchor", "middle")
        //       .attr("x", Number(document.getElementById("we" + ppl[p] + k).getAttribute("x")) + Number(document.getElementById("we" + ppl[p] + k).getAttribute("width")) / 2)
        //       .attr("y", Number(document.getElementById("we" + ppl[p] + k).getAttribute("y")) + 30)
        //       .attr("font-size", "28px")
        //       .text(data_we[k]['work_name'])
        //   }
        }
  
        overlap_check = []; //重置"重疊檢查陣列"
  
        //其他經驗時間軸的處理(邏輯概念跟上面一樣 不贅述了)
        var exp = svg.select("#s_resume" + ppl[p]).selectAll(".resume" + ppl[p])
          .data(data_oe)
          .join("rect")
          .attr("id", function(d, i){ return "s_exp" + ppl[p] + "_" + i})
          .attr("x", d => x(new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1)))
          .attr("y", function(d){
            if(temp_id != d.C_id){
              temp_id = d.C_id;
              temp_date.push([new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1), new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1)]);
              overlap_check.push(0);
              console.log("A")
              return y(p);
            }
            else{
              overlap_temp = 0;
              for(k = 0; k < temp_date.length; k++){
                if(temp_date[k][0] < new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1) && new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1) < temp_date[k][1]){
                  overlap_temp ++;
                }
              }
              
              temp_date.push([new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1), new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1)]);
              overlap_check.push(overlap_temp);
              
              return y(p) - 2 * overlap_temp;
              
            }
          })
          .attr("width", d => x(new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1)) - x(new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1)))
          .attr("height", sim_height)
          .attr("fill", "#7FE0BC")
          //.attr("stroke", "black")
          .attr("stroke-width", 2)
        
  
        for(k = 0; k < overlap_check.length; k++){
          if(overlap_check[k] > 0){
            svg.selectAll("#s_exp" + ppl[p] + "_" + k).lower();
          }
        //   else{
        //     svg.selectAll("#s_resume" + ppl[p])
        //       .append("text")
        //       .attr("text-anchor", "middle")
        //       .attr("x", Number(document.getElementById("exp" + ppl[p] + k).getAttribute("x")) + Number(document.getElementById("exp" + ppl[p] + k).getAttribute("width")) / 2)
        //       .attr("y", Number(document.getElementById("exp" + ppl[p] + k).getAttribute("y")) + 30)
        //       .attr("font-size", "28px")
        //       .text(data_we[k]['exp_name'])
        //   }
        }

        svg.append("g")
          .attr("id", "selected_index_g" + ppl[p])

        svg.selectAll("#selected_index_g" + ppl[p])
          .append("image")
          .attr("id", "selected_index" + ppl[p])
          .attr("xlink:href", "../website_image/select.png")
          .attr("width", 8.5)
          .attr("height", 8,5)
          .attr("x", width + 10)
          .attr("y", y(p))
          .style("opacity", (already_selected.find(e => e == ppl[p]) ? 1 : 0));
  
          
      }
   
      //進行將該隱藏的時間軸透明化的後處理
      for(i = 0; i < window.eye_select.length; i++){
        d3.selectAll("#s_resume" + window.eye_select[i]).style("opacity", 0.2)
      }
  
  
  }
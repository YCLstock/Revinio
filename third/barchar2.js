function simple_graph(datas, people, ppl, currentPhotoId) {
    var sim_height = 10;
    //定義讀入的資料並存入陣列
    var i;

    d3.select('#simple_svg').remove();

    

    const middleSection = document.querySelector("#sub-section-1-2");
    const middleWidth = middleSection.getBoundingClientRect().width;
    const MiddleHeight1 = middleSection.getBoundingClientRect().height-10;
    // console.log(middleHeight)
    // set the dimensions and margins of the graph
    const margin = { top: 10 , right: 30, bottom: 60, left: 10 },                  //調整圖的高低
        width = middleWidth - margin.left - margin.right,
        height = MiddleHeight1;                                                   //orgin: ppl.length * 14.4
   
    // append the svg object to the body of the page
    const svg = d3.select("#sub-section-1-2")
        .append("svg")
        .attr("id", "simple_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // Parse the Data
    var data = [datas['basic_information'], datas['academic'], datas['work_experience'], datas['other_experience']];
    console.log(data)
    //定義讀入的資料數量

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
    const x = d3.scaleTime()
        .domain([new Date(min_year, 1, 1), new Date(2023, 7, 1)])
        .range([0, width + margin.left + margin.right - 40]);
    svg.append("g")
        .attr("id", "ouo")
        .attr("transform", `translate(0, ${height})`)
    // Y axis
    const y = d3.scaleBand()
        .domain(Array.from(Array(ppl.length).keys()))
        .range([0, height-10])
        .padding(.1);
    //給每個時間軸一個獨立的g
    var p, j, k, temp_id;
    var temp = [], data_temp = [];
    //將每個不同的人的時間軸都分別包進不同的g裡面(處理重疊問題會比較方便)
    for (p = 0; p < ppl.length; p++) {
        svg.append("g")
            .attr("id", "s_resume" + ppl[p]) //定義個別不同人g的ID
        //將該人的學校、工作、其他經歷資料獨立整理出來，並存到變數data_temp陣列裡面
        for (k = 0; k < 4; k++) {
            for (j = 0; j < data[k].length; j++) {
                if (Number(data[k][j]['C_id']) == ppl[p]) {
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
            .attr("id", function (d, i) { return "s_a" + ppl[p] + "_" + i }) //賦予時間軸特定的ID，方便之後抓出來處理重疊跟翻頁
            .attr("x", d => x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //給個開始的時間
            .attr("y", function (d) { //處理邏輯：先判斷這是不是新的一個人，如果是的話進行一些初始化的動作，如果不是的話就主要進行時間軸是否重疊的比對
                if (temp_id != d.C_id) {
                    temp_id = d.C_id; //紀錄新的人的ID
                    temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1)]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
                    overlap_check.push(0); //紀錄此時間軸沒有與其他時間軸重疊(因為是這個人的第一個)

                    return y(p); //因為沒有重疊，所以就照順序擺就好
                }
                else {
                    overlap_temp = 0; //重置變數
                    for (k = 0; k < temp_date.length; k++) { //迴圈比對所有已經紀錄的時間軸範圍，如果這個時間軸有跟其他時間軸重疊，則將紀錄重疊次數的變數++，最後會得到此時間軸與幾個時間軸重疊
                        if (temp_date[k][0] < new Date(Number(d.school_end_year), Number(d.school_end_month), 1) && new Date(Number(d.school_start_year), Number(d.school_start_month), 1) < temp_date[k][1]) {
                            overlap_temp++;
                        }
                    }

                    temp_date.push([new Date(Number(d.school_start_year), Number(d.school_start_month), 1), new Date(Number(d.school_end_year), Number(d.school_end_month), 1)]); //將當前的時間軸範圍丟進變數紀錄起來，方便之後比對
                    overlap_check.push(overlap_temp); //紀錄此時間軸的重疊狀況

                    return y(p) - 2 * overlap_temp; //如果沒有重疊，那overlap_tmep就會是0，那他的高度就不會變；若有重疊，則高度就會隨著他重疊的時間軸數量呈現正比成長

                }
            })
            .attr("width", d => x(new Date(Number(d.school_end_year), Number(d.school_end_month), 1)) - x(new Date(Number(d.school_start_year), Number(d.school_start_month), 1))) //就依照日期長度繪製時間軸長度
            .attr("height", sim_height)
            .attr("fill", "	#79FF79")
            .attr("stroke-width", function(){
                if(currentPhotoId == ppl[p]){
                    return 3
                }
                return 0.5
            })
            .attr("stroke", function(){
                if(currentPhotoId == ppl[p]){
                    return 'red'
                }
                return 'black'
            })
            
            .classed("selected", function (d) {
                // 如果cid匹配currentPhotoId，添加一个名为"selected"的类-----------------------------------------------------------
                return d.C_id == currentPhotoId;
            })

            .on('mouseover', function () {
                const matchedppls = this.id.match(/\d+/)[0];
                console.clear(); // 清除console.log
                console.log("符合條件的: ", matchedppls);

                const element = document.getElementById(matchedppls)
                if (element) {
                    element.classList.add('highlight'); // 假設 'highlight' 是你想應用的 CSS class
                }
                d3.select(event.target).attr('opacity', 0.7);
            })
            .on("mouseout", () => {
                console.clear(); // 清除console.log
                // 重置擁有該技能的人的ID
                app.matchedppls = '';
          
                // 遍歷之前高亮的元素，並移除 'highlight' CSS class
                const highlightedElements = document.querySelectorAll('.highlight');
                highlightedElements.forEach(element => {
                  element.classList.remove('highlight');
                });
                // 移除陰影效果
                d3.select(event.target).attr('opacity', 1);
              })
            
        for (k = 0; k < overlap_check.length; k++) { //確認時間軸是否有重疊，如果有重疊，就把該特定ID的時間軸移到所有學校時間軸的最下面
            if (overlap_check[k] > 0) {
                svg.selectAll("#s_a" + ppl[p] + "_" + k).lower();
            }
        }
        // console.log(temp_date)
        overlap_check = []; //重置"重疊檢查陣列"
        //工作時間軸的處理(邏輯概念跟上面一樣 不贅述了)
        var work = svg.select("#s_resume" + ppl[p]).selectAll(".resume" + ppl[p])
            .data(data_we)
            .join("rect")
            .attr("id", function (d, i) { return "s_we" + ppl[p] + "_" + i })
            .attr("x", d => x(new Date(Number(d.work_start_year), Number(d.work_start_month), 1)))
            .attr("y", function (d) {
                if (temp_id != d.C_id) {
                    temp_id = d.C_id;
                    temp_date.push([new Date(Number(d.work_start_year), Number(d.work_start_month), 1), new Date(Number(d.work_end_year), Number(d.work_end_month), 1)]);
                    overlap_check.push(0);

                    return y(p);
                }
                else {
                    overlap_temp = 0;
                    for (k = 0; k < temp_date.length; k++) {
                        if (temp_date[k][0] < new Date(Number(d.work_end_year), Number(d.work_end_month), 1) && new Date(Number(d.work_start_year), Number(d.work_start_month), 1) < temp_date[k][1]) {
                            overlap_temp++;
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
            .attr("stroke-width", function(){
                if(currentPhotoId == ppl[p]){
                    return 3
                }
                return 0.5
            })
            .attr("stroke", function(){
                if(currentPhotoId == ppl[p]){
                    return 'red'
                }
                return 'black'
            })
            .on('mouseover', function () {
                const matchedppls = this.id.match(/\d+/)[0];
                console.clear(); // 清除console.log
                console.log("符合條件的: ", matchedppls);

                const element = document.getElementById(matchedppls)
                if (element) {
                    element.classList.add('highlight'); // 假設 'highlight' 是你想應用的 CSS class
                }
                d3.select(event.target).attr('opacity', 0.7);
            })
            .on("mouseout", () => {
                console.clear(); // 清除console.log
                // 重置擁有該技能的人的ID
                app.matchedppls = '';
          
                // 遍歷之前高亮的元素，並移除 'highlight' CSS class
                const highlightedElements = document.querySelectorAll('.highlight');
                highlightedElements.forEach(element => {
                  element.classList.remove('highlight');
                });
                // 移除陰影效果
                d3.select(event.target).attr('opacity', 1);
              })
            

        for (k = 0; k < overlap_check.length; k++) {
            if (overlap_check[k] > 0) {
                svg.selectAll("#s_we" + ppl[p] + "_" + k).lower();
            }
        }
        overlap_check = []; //重置"重疊檢查陣列"
        //其他經驗時間軸的處理(邏輯概念跟上面一樣 不贅述了)
        var exp = svg.select("#s_resume" + ppl[p]).selectAll(".resume" + ppl[p])
            .data(data_oe)
            .join("rect")
            .attr("id", function (d, i) { return "s_exp" + ppl[p] + "_" + i })
            .attr("x", d => x(new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1)))
            .attr("y", function (d) {
                if (temp_id != d.C_id) {
                    temp_id = d.C_id;
                    temp_date.push([new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1), new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1)]);
                    overlap_check.push(0);
                    console.log("A")
                    return y(p);
                }
                else {
                    overlap_temp = 0;
                    for (k = 0; k < temp_date.length; k++) {
                        if (temp_date[k][0] < new Date(Number(d.exp_end_year), Number(d.exp_end_month), 1) && new Date(Number(d.exp_start_year), Number(d.exp_start_month), 1) < temp_date[k][1]) {
                            overlap_temp++;
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
            .attr("stroke-width", function(){
                if(currentPhotoId == ppl[p]){
                    return 3
                }
                return 0.5
            })
            .attr("stroke", function(){
                if(currentPhotoId == ppl[p]){
                    return 'red'
                }
                return 'black'
            })
            .on('mouseover', function () {
                const matchedppls = this.id.match(/\d+/)[0];
                console.clear(); // 清除console.log
                console.log("符合條件的: ", matchedppls);

                const element = document.getElementById(matchedppls)
                if (element) {
                    element.classList.add('highlight'); // 假設 'highlight' 是你想應用的 CSS class
                }
                d3.select(event.target).attr('opacity', 0.7);
            })
            .on("mouseout", () => {
                console.clear(); // 清除console.log
                // 重置擁有該技能的人的ID
                app.matchedppls = '';
          
                // 遍歷之前高亮的元素，並移除 'highlight' CSS class
                const highlightedElements = document.querySelectorAll('.highlight');
                highlightedElements.forEach(element => {
                  element.classList.remove('highlight');
                });
                // 移除陰影效果
                d3.select(event.target).attr('opacity', 1);
              })
            
        for (k = 0; k < overlap_check.length; k++) {
            if (overlap_check[k] > 0) {
                svg.selectAll("#s_exp" + ppl[p] + "_" + k).lower();
            }
        }
    }
}
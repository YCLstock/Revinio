function move(data,diction){

    // 創建一個陣列來存放顏色值
    const colorArray = [
        "#28004D",
        "#4B0091",
        "#6F00D2",
        "#921AFF",
        "#B26BFF",
        "#CA8EFF"
    ];
  
    // 使用 reverse() 方法反轉陣列中的元素順序
    colorArray.reverse();

    console.log(diction)

    const target = d3.selectAll(".skill_temp");
    target.remove();

    var svg = document.getElementById('space_svg');
    // console.log(svg)

    const result = {};

    // 迭代原始資料陣列
    data.forEach((item) => {
    const { skillName, C_id } = item;

    // 迭代 C_id 陣列
    C_id.forEach((id) => {
        // 如果 result 物件中還沒有這個 C_id，則創建一個空物件
        if (!result[id]) {
        result[id] = {
            C_id: id, // 儲存 C_id 到對應的物件中
            count: 0,
            skillName: [],
        };
        }

        // 增加 C_id 對應的技能計數，並將 skillName 加入到對應的陣列中
        result[id].count++;
        result[id].skillName.push(skillName);
    });
    });

    // 將結果轉換成陣列（如果需要）
    const resultArray = Object.values(result);

    // 打印整理後的結果
    console.log("結果",resultArray);

    //依序取出技能
    for (let i = 0; i < resultArray.length; i++) {
        const skill = resultArray[i].skillName;
        const people = resultArray[i].C_id;
        const count = resultArray[i].count;

        // console.log(skill)
        // console.log(skill,people,count)        
        //放入正方形 等等要加入for 迴圈

        var pic_text = d3.select("#C_id"+people);   
        // console.log(pic_text.attr("cx"),pic_text.attr("cy"))

        //svg
        var svg = d3.select("#space_svg");   
        // console.log(svg)


        //設置X、Y
        const rect_x = parseFloat(pic_text.attr("cx"))+70
        // console.log(rect_x)
        const rect_y = parseFloat(pic_text.attr("cy"))-30

        for(let i = 0; i < count; i++){
            //畫圖
            console.log("window",window)
            let text_color = (window['skill_object_'+people][skill[i]])-1
            // console.log('強度',text_color)  
            // console.log('顏色',colorArray[text_color])
            let rec_color = colorArray[text_color]
            // let rec_color = 'black'

            var rect = svg.append("rect")
                .attr("id","skill_temp_"+people)
                .attr("class","skill_temp")
                .attr("x", rect_x)                          //根据需要调整位置
                .attr("y", rect_y+22*i)                     // 根据需要调整位置
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", rec_color);                     // 设置正方形的颜色，您可以根据需要进行更改 
                
            //文字    
            var label = svg.append("text")
                .attr("id","skill_temp"+people)
                .attr("class","skill_temp")
                .attr("x", rect_x+5)                          //根据需要调整位置
                .attr("y", rect_y+22*i+15)                  // 根据需要调整位置
                .attr("fill", "white")                      // 將文字填充顏色設為白色
                .style("font-size", "13px")
                .style("font-family", "Belanosima")
                .style("pointer-events", "none")
                .style("opacity", 0.8)
                .text(diction[skill[i]]);               
            
            // console.log(diction[skill[i]])
            
        }

    }



}
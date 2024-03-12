var eye_select = [];

function display_click(click_id){
    //基礎資料設定
    // var data = [datas['basic_information'],
    //             datas['academic'], 
    //             datas['work_experience'], 
    //             datas['other_experience'], 
    //             datas['relation_table_we_s'], 
    //             datas['skill'], 
    //             datas['relation_table_oe_s']];

    
    var ppl = window.ppl;
    var ppl_id = click_id.match(/\d+/)[0]
    var click_button = d3.selectAll("#" + click_id)

    //設定顯示按鈕點擊後的觸發動作
    if(click_button.attr("fill") == "url(#bg_openeye)"){
        click_button.attr("fill", "url(#bg_closeeye)");
        d3.selectAll("#resume" + ppl_id).style("opacity", 0.2)
        d3.selectAll("#s_resume" + ppl_id).style("opacity", 0.2)

        //朝陣列添加元素 並處理其在陣列中的順序
        eye_select.push(Number(ppl_id));
        move_resume(ppl_id, 49);
        window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1)
        window.ppl.push(Number(ppl_id))
        console.log(window.ppl)
        if(document.getElementById("btn_text").innerText == "Selected skill"){
            new_skill_rect(skill_layer(window.ppl, window.all_data_world));
        }

    }
    else if(click_button.attr("fill") == "url(#bg_closeeye)"){
        click_button.attr("fill", "url(#bg_openeye)");
        d3.selectAll("#resume" + ppl_id).style("opacity", 1);
        d3.selectAll("#s_resume" + ppl_id).style("opacity", 1);
        
        //將時間軸依照當前的排序方式丟回去
        var sorting_method = document.getElementById("btn_text").innerText;
        var sorted_array, remove_index, i, position_index
        if(sorting_method == "Default"){
            move_resume(ppl_id, ppl.length - eye_select.length); //移動時間軸
            window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1); //調整陣列中的id位置
            window.ppl.splice(ppl.length - eye_select.length + 1, 0, Number(ppl_id));
            console.log(window.ppl)
        }
        else if(sorting_method == "Job time"){
            //阿哩布達的陣列處理
            sorted_array = job_time_sort(window.ppl, window.all_data_world);
            for(i = 0; i < eye_select.length; i++){
                if(eye_select[i] != ppl_id){
                    remove_index = sorted_array.indexOf(sorted_array.find(e => e.id == eye_select[i]));
                    sorted_array.splice(remove_index, 1)
                }
            }
            position_index = sorted_array.indexOf(sorted_array.find(e => e.id == ppl_id));

            //移動時間軸 把陣列中的id位置調整調整的東東
            move_resume(ppl_id, position_index);
            window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1);
            window.ppl.splice(position_index, 0, Number(ppl_id));
            console.log(window.ppl)
        }
        else if(sorting_method == "Education"){
            //阿哩布達的陣列處理
            sorted_array = education_sort(window.ppl, window.all_data_world);
            for(i = 0; i < eye_select.length; i++){
                if(eye_select[i] != ppl_id){
                    remove_index = sorted_array.indexOf(sorted_array.find(e => e.id == eye_select[i]));
                    sorted_array.splice(remove_index, 1)
                }
            }
            position_index = sorted_array.indexOf(sorted_array.find(e => e.id == ppl_id));
            
            //移動時間軸 把陣列中的id位置調整調整的東東
            move_resume(ppl_id, position_index);
            window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1);
            window.ppl.splice(position_index, 0, Number(ppl_id));
            console.log(window.ppl)
        }
        else if(sorting_method == "Skill amount"){
            //阿哩布達的陣列處理
            sorted_array = skill_amount_sort(window.ppl, window.all_data_world);
            for(i = 0; i < eye_select.length; i++){
                if(eye_select[i] != ppl_id){
                    remove_index = sorted_array.indexOf(sorted_array.find(e => e.id == eye_select[i]));
                    sorted_array.splice(remove_index, 1)
                }
            }
            position_index = sorted_array.indexOf(sorted_array.find(e => e.id == ppl_id));
            
            //移動時間軸 把陣列中的id位置調整調整的東東
            move_resume(ppl_id, position_index);
            window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1);
            window.ppl.splice(position_index, 0, Number(ppl_id));
            console.log(window.ppl)
        }
        else if(sorting_method == "Selected skill"){
            //阿哩布達的陣列處理
            sorted_array = skill_layer(window.ppl, window.all_data_world);
            for(i = 0; i < eye_select.length; i++){
                if(eye_select[i] != ppl_id){
                    remove_index = sorted_array.indexOf(sorted_array.find(e => e.id == eye_select[i]));
                    sorted_array.splice(remove_index, 1)
                }
            }
            position_index = sorted_array.indexOf(sorted_array.find(e => e.id == ppl_id));
            
            //移動時間軸 把陣列中的id位置調整調整的東東
            move_resume(ppl_id, position_index);
            window.ppl.splice(window.ppl.indexOf(Number(ppl_id)), 1);
            window.ppl.splice(position_index, 0, Number(ppl_id));
            console.log(sorted_array)
        }
        

        //移除陣列的元素
        eye_select.splice(eye_select.indexOf(Number(ppl_id)), 1)
        //重畫技能方塊
        if(sorting_method == "Selected skill"){
            new_skill_rect(skill_layer(window.ppl, window.all_data_world));
        }
    }

    console.log(eye_select) 
}

function move_resume(p_id, target_index){
    var ppl = window.ppl;
    // console.log(ppl)
    //求出履歷與履歷間的距離
    var std_padding = Number(d3.select("#circle-mask" + ppl[1]).selectAll("circle").attr("cy")) - Number(d3.select("#circle-mask" + ppl[0]).selectAll("circle").attr("cy"))
    var std_padding_s = Number(d3.selectAll("#selected_index" + ppl[1]).attr("y")) - Number(d3.selectAll("#selected_index" + ppl[0]).attr("y"));
    var p_index = window.ppl.indexOf(Number(p_id))

    if(p_index < target_index){
        var move_diff = (target_index - p_index) * std_padding;
        //時間軸移位(目標對象的部分
        //main_graph
        d3.select("#resume" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.select("#check_g_" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.select("#eyes_g_" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.selectAll("#ttt" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.select("#circle-mask" + p_id).selectAll("circle").each(function(d, i){
            d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) + move_diff)
        })
        d3.select("#picture" + p_id).selectAll("circle").each(function(d, i){
            d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) + move_diff)
        })
        d3.selectAll("#person_pic_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.selectAll("#comment_box_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.selectAll("#skill_temp_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        d3.selectAll("#skill_temp" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff)
        })
        //simple_graph
        var move_diff_s = (target_index - p_index) * std_padding_s;
        d3.select("#s_resume" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + move_diff_s)
        })
        d3.selectAll("#selected_index" + p_id).each(function(d, i){
            d3.select(this).attr("y", Number(d3.select(this).attr("y")) + move_diff_s)
        })

        // 將時間軸移位(其他雜項的部分)
        var i;
        for(i = p_index + 1; i <= target_index; i++){
            //main_graph
            d3.select("#resume" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.select("#check_g_" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.select("#eyes_g_" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.selectAll("#ttt" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.select("#circle-mask" + ppl[i]).selectAll("circle").each(function(d, i){
                d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) - std_padding)
            })
            d3.select("#picture" + ppl[i]).selectAll("circle").each(function(d, i){
                d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) - std_padding)
            })
            d3.selectAll("#person_pic_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.selectAll("#comment_box_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.selectAll("#skill_temp_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            d3.selectAll("#skill_temp" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding)
            })
            //simple_graph
            d3.select("#s_resume" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - std_padding_s)
            })
            d3.selectAll("#selected_index" + ppl[i]).each(function(d, i){
                d3.select(this).attr("y", Number(d3.select(this).attr("y")) - std_padding_s)
            })
        }
    }
    else if(p_index > target_index){
        var move_diff = (p_index - target_index) * std_padding;
        //時間軸移位(目標對象的部分
        //main_graph
        d3.select("#resume" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.select("#check_g_" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.select("#eyes_g_" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.selectAll("#ttt" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.select("#circle-mask" + p_id).selectAll("circle").each(function(d, i){
            d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) - move_diff)
        })
        d3.select("#picture" + p_id).selectAll("circle").each(function(d, i){
            d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) - move_diff)
        })
        d3.selectAll("#person_pic_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.selectAll("#comment_box_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.selectAll("#skill_temp_" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        d3.selectAll("#skill_temp" + p_id).each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff)
        })
        //simple_graph
        var move_diff_s = (p_index - target_index) * std_padding_s;
        d3.select("#s_resume" + p_id).selectAll("*").each(function(d, i){
            d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) - move_diff_s)
        })
        d3.selectAll("#selected_index" + p_id).each(function(d, i){
            d3.select(this).attr("y", Number(d3.select(this).attr("y")) - move_diff_s)
        })

        // 將時間軸移位(其他雜項的部分)
        var i;
        for(i = p_index - 1; i >= target_index; i--){
            //main_graph
            d3.select("#resume" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.select("#check_g_" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.select("#eyes_g_" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.selectAll("#ttt" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.select("#circle-mask" + ppl[i]).selectAll("circle").each(function(d, i){
                d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) + std_padding)
            })
            d3.select("#picture" + ppl[i]).selectAll("circle").each(function(d, i){
                d3.select(this).transition().attr("cy", Number(d3.select(this).attr("cy")) + std_padding)
            })
            d3.selectAll("#person_pic_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.selectAll("#comment_box_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.selectAll("#skill_temp_" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            d3.selectAll("#skill_temp" + ppl[i]).each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding)
            })
            //simple_graph
            d3.select("#s_resume" + ppl[i]).selectAll("*").each(function(d, i){
                d3.select(this).transition().attr("y", Number(d3.select(this).attr("y")) + std_padding_s)
            })
            d3.selectAll("#selected_index" + ppl[i]).each(function(d, i){
                d3.select(this).attr("y", Number(d3.select(this).attr("y")) + std_padding_s)
            })
        }
    }
}

function new_skill_rect(ppl){
    d3.select("#high_svg").remove();

    //將ppl裡面不要的人剔除，以免他們干擾技能方塊繪製
    for(i = 0; i < window.eye_select.length; i++){
        ppl.splice(ppl.map(e => Number(e.id)).indexOf(window.eye_select[i]), 1);
    }

    const height = document.querySelector("#drag-area").getBoundingClientRect().height;
        const rect_height = height / (ppl.length + window.eye_select.length);

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
    .attr("x", document.querySelector(".section-1").getBoundingClientRect().width + document.querySelector(".section-2").getBoundingClientRect().width - 7)
    .attr("y", function(d){ return d.start * rect_height + document.querySelector(".sub-section-1-1").getBoundingClientRect().height + 1})
    .attr("width", 14)
    .attr("height", function(d){ return d.len * rect_height})
    .attr("fill", "#FAE6FA")
    .attr("stroke", "black")
    .attr("stroke-width", 1)

  var skill_a_word = d3.select("#skill_a_g").selectAll("#skill_a_g")
    .data(skill_data)
    .join("text")
    .attr("x", document.querySelector(".section-1").getBoundingClientRect().width + document.querySelector(".section-2").getBoundingClientRect().width)
    .attr("y", function(d){ return Math.ceil(d.start + d.len / 2) * rect_height + document.querySelector(".container").getBoundingClientRect().height})
    .style("font-size", "20px")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text(function(d){ return d.amount})

  move(selected_skills,skillAssigner.assignments);
}
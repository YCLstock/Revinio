function skill_strength(datas,people){
    
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

    console.log(ppl)

    var p, j, k, temp_id;
    var temp = [], data_temp = [];

    var skill_board = []
    

    for(p = 0; p < ppl.length; p++){
        
        //將該人的學校、工作、其他經歷資料獨立整理出來，並存到變數data_temp陣列裡面
        for(k = 0; k < 6; k++){
            for(j = 0; j < data[k].length; j++){
                if(Number(data[k][j]['C_id']) == ppl[p]){
                    temp.push(data[k][j]);
                }
            }
            data_temp.push(temp);
            temp = [];
        }

        var data_bi = data_temp[0];
        var data_a = data_temp[1];
        var data_we = data_temp[2];
        var data_oe = data_temp[3];
        var data_rel_we_s = data_temp[4];
        var data_s = data_temp[5];
        var data_rel_oe_s = data_temp[6];
        data_temp = []; // 重製暫存區

        // console.log(ppl[p])
        // console.log(data[0][p]['C_id'])
        window['skill_point_' + ppl[p]] = []
        

        for(i=0; i<data_s.length; i++){ 
            window['skill_react_work_' + i] = [];
            for(j=0; j<data[4].length; j++){
                if(data_s[i]['skill_id'] == data[4][j]['skill_id']){
                    window['skill_react_work_' + i].push(data[4][j]['work_id'])
                }
            }
            for(j=0; j<data[6].length; j++){
                if(data_s[i]['skill_id'] == data[6][j]['skill_id']){
                    window['skill_react_work_' + i].push(data[6][j]['exp_id'])
                }
            }
            window['skill_point_' + ppl[p]][i] = [data_s[i]['skill_name'], 0]
        }

        for(i=0; i<data_s.length; i++){
            window['time_count_' + i] = 0;
            for(j=0; j<window['skill_react_work_' + i].length; j++){
                for(k=0; k<data_we.length; k++){
                    if(window['skill_react_work_' + i][j] == data_we[k]['work_id']){
                        window['time_count_'+ i] = 
                            new Date(Number(data_we[k]['work_end_year']), Number(data_we[k]['work_end_month']), 1) - 
                            new Date(Number(data_we[k]['work_start_year']), Number(data_we[k]['work_start_month']), 1) + window['time_count_'+ i]
                    }
                }
                for(k=0; k<data_oe.length; k++){
                    if(window['skill_react_work_' + i][j] == data_oe[k]['exp_id']){
                        window['time_count_'+ i] = 
                            new Date(Number(data_oe[k]['exp_end_year']), Number(data_oe[k]['exp_end_month']), 1) - 
                            new Date(Number(data_oe[k]['exp_start_year']), Number(data_oe[k]['exp_start_month']), 1) + window['time_count_'+ i]
                    }
                }
            }
            window['skill_point_' + ppl[p]][i][1] = window['time_count_' + i]
        }

        for(i=0; i<window['skill_point_' + ppl[p]].length; i++){
            var index = 0
            for(j=0; j<skill_board.length; j++){
                
                if(window['skill_point_' + ppl[p]][i][0] == skill_board[j][0]){
                    index = 1
                    
                    if(window['skill_point_' + ppl[p]][i][1] > skill_board[j][1]){
                        skill_board[j][1] = window['skill_point_' + ppl[p]][i][1] //這裡window['skill_point_0']會跑掉 不知道why
                    }
                }  
            }
            if(index == 0){
                var temp123 = window['skill_point_' + ppl[p]][i];
                skill_board.push([temp123[0], temp123[1]]);
            }
        }
        
    }

    for(p = 0; p < ppl.length; p++){
        for(i=0; i<window['skill_point_' + ppl[p]].length; i++){
            for(j=0; j<skill_board.length; j++){
                if(window['skill_point_' + ppl[p]][i][0] == skill_board[j][0]){

                    if(0 <= window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 1/6){
                        window['skill_point_' + ppl[p]][i][1] = 1
                    }else if(skill_board[j][1] * 1/6 < window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 2/6){
                        window['skill_point_' + ppl[p]][i][1] = 2
                    }else if(skill_board[j][1] * 2/6 < window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 3/6){
                        window['skill_point_' + ppl[p]][i][1] = 3
                    }else if(skill_board[j][1] * 3/6 < window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 4/6){
                        window['skill_point_' + ppl[p]][i][1] = 4
                    }else if(skill_board[j][1] * 4/6 < window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 5/6){
                        window['skill_point_' + ppl[p]][i][1] = 5
                    }else if(skill_board[j][1] * 5/6 < window['skill_point_' + ppl[p]][i][1] && window['skill_point_' + ppl[p]][i][1] <= skill_board[j][1] * 6/6){
                        window['skill_point_' + ppl[p]][i][1] = 6
                    }else{
                        console.log('他噴錯了哭阿')
                    }
                    
                }
            }
        }
        // console.log(window['skill_point_' + ppl[p]])
    }

    for(p = 0; p < ppl.length; p++){
        window['skill_object_' + ppl[p]] = new Object
        for(i=0 ;i<window['skill_point_' + ppl[p]].length; i++){
            window['skill_object_' + ppl[p]][window['skill_point_' + ppl[p]][i][0]] = window['skill_point_' + ppl[p]][i][1]
        }
        // console.log(window['skill_object_' + ppl[p]])
    }

    // console.log(window['skill_point_1'])
    // console.log(window['skill_object_1'])

    // return function(){
    //     for(p = 0; p < ppl.length; p++){
    //         window['skill_point_' + ppl[p]]
    //         window['skill_object_' + ppl[p]]
    //     }
    // }
    let skill_point =[]
    window.skill_point = skill_point
    for(p = 0; p < ppl.length; p++){
        skill_point[p] = window['skill_point_' + ppl[p]]
    }

    let skill_object =[]
    window.skill_object = skill_object
    for(p = 0; p < ppl.length; p++){
        skill_point[p] = window['skill_object_' + ppl[p]]
    }


    
}

function skill_strength111(datas,people){

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

    var p, j, k, temp_id;
    var temp = [], data_temp = [];

    var skill_board = []

    var skill_point = [];
    window.skill_point = skill_point;

    for(p = 0; p < ppl.length; p++){
        
        //將該人的學校、工作、其他經歷資料獨立整理出來，並存到變數data_temp陣列裡面
        for(k = 0; k < 6; k++){
            for(j = 0; j < data[k].length; j++){
                if(Number(data[k][j]['C_id']) == ppl[p]){
                    temp.push(data[k][j]);
                }
            }
            data_temp.push(temp);
            temp = [];
        }

        var data_bi = data_temp[0];
        var data_a = data_temp[1];
        var data_we = data_temp[2];
        var data_oe = data_temp[3];
        var data_rel_we_s = data_temp[4];
        var data_s = data_temp[5];
        var data_rel_oe_s = data_temp[6];
        data_temp = []; // 重製暫存區

        

        var skill_react_work = []
        var temp_skill_name_2d_array =[]

        for(i=0; i<data_s.length; i++){ 
            var temp_react_work = []
            for(j=0; j<data[4].length; j++){
                if(data_s[i]['skill_id'] == data[4][j]['skill_id']){
                    temp_react_work.push(data[4][j]['work_id'])
                }
            }
            for(j=0; j<data[6].length; j++){
                if(data_s[i]['skill_id'] == data[6][j]['skill_id']){
                    temp_react_work.push(data[6][j]['exp_id'])
                }
            }
            skill_react_work[i] = temp_react_work

            var temp_skill_name_array = [data_s[i]['skill_name'], 0]
            temp_skill_name_2d_array[i] = temp_skill_name_array

        }
        skill_point[ppl[p]] = temp_skill_name_2d_array
        // console.log(skill_point)



        for(i=0; i<data_s.length; i++){
            var temp_time_count = []
            temp_time_count[i] = 0
            for(j=0; j<skill_react_work[i].length; j++){

                for(k=0; k<data_we.length; k++){
                    if(skill_react_work[i][j] == data_we[k]['work_id']){
                        temp_time_count[i] =
                            new Date(Number(data_we[k]['work_end_year']), Number(data_we[k]['work_end_month']), 1) - 
                            new Date(Number(data_we[k]['work_start_year']), Number(data_we[k]['work_start_month']), 1) + temp_time_count[i]
                    }
                }
                for(k=0; k<data_oe.length; k++){
                    if(skill_react_work[i][j] == data_oe[k]['exp_id']){
                        temp_time_count[i] = 
                            new Date(Number(data_oe[k]['exp_end_year']), Number(data_oe[k]['exp_end_month']), 1) - 
                            new Date(Number(data_oe[k]['exp_start_year']), Number(data_oe[k]['exp_start_month']), 1) + temp_time_count[i]
                    }
                }
            }
            skill_point[ppl[p]][i][1] = temp_time_count[i]
        }



        for(i=0; i<skill_point[ppl[p]].length; i++){
            var index = 0
            for(j=0; j<skill_board.length; j++){
                
                if(skill_point[ppl[p]][i][0] == skill_board[j][0]){
                    index = 1
                    
                    if(skill_point[ppl[p]][i][1] > skill_board[j][1]){
                        skill_board[j][1] = skill_point[ppl[p]][i][1]
                    }
                }  
            }
            if(index == 0){
                var tempcopy = skill_point[ppl[p]][i];
                skill_board.push([tempcopy[0], tempcopy[1]]);
            }
        }
    }



    for(p = 0; p < ppl.length; p++){
        for(i=0; i<skill_point[ppl[p]].length; i++){
            for(j=0; j<skill_board.length; j++){
                if(skill_point[ppl[p]][i][0] == skill_board[j][0]){

                    if(0 <= skill_point[ppl[p]][i][1] && 
                        skill_point[ppl[p]][i][1] <= skill_board[j][1] * 1/6){
                        skill_point[ppl[p]][i][1] = 1
                    }else if(skill_board[j][1] * 1/6 < skill_point[ppl[p]][i][1] && 
                            skill_point[ppl[p]][i][1] <= skill_board[j][1] * 2/6){
                        skill_point[ppl[p]][i][1] = 2
                    }else if(skill_board[j][1] * 2/6 < skill_point[ppl[p]][i][1] && 
                            skill_point[ppl[p]][i][1] <= skill_board[j][1] * 3/6){
                        skill_point[ppl[p]][i][1] = 3
                    }else if(skill_board[j][1] * 3/6 < skill_point[ppl[p]][i][1] && 
                            skill_point[ppl[p]][i][1] <= skill_board[j][1] * 4/6){
                        skill_point[ppl[p]][i][1] = 4
                    }else if(skill_board[j][1] * 4/6 < skill_point[ppl[p]][i][1] && 
                            skill_point[ppl[p]][i][1] <= skill_board[j][1] * 5/6){
                        skill_point[ppl[p]][i][1] = 5
                    }else if(skill_board[j][1] * 5/6 < skill_point[ppl[p]][i][1] && 
                            skill_point[ppl[p]][i][1] <= skill_board[j][1] * 6/6){
                        skill_point[ppl[p]][i][1] = 6
                    }else{
                        console.log('他噴錯了哭阿')
                    }
                    
                }
            }
        }
        // console.log(skill_point[ppl[p]])
    }

    var skill_object = [];
    window.skill_object = skill_object;

    for(p = 0; p < ppl.length; p++){
        skill_object[ppl[p]] = new Object
        for(i=0 ;i<skill_point[ppl[p]].length; i++){
            skill_object[ppl[p]][skill_point[ppl[p]][i][0]] = skill_point[ppl[p]][i][1]
        }
        // console.log(skill_object[ppl[p]])
    }
}
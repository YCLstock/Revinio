function skill_strength_average(datas,people){
    
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

        window['skill_point_average_' + data[0][p]['C_id']] = []

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
            window['skill_point_average_' + data[0][p]['C_id']][i] = [data_s[i]['skill_name'], 0]
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
            window['skill_point_average_' + data[0][p]['C_id']][i][1] = window['time_count_' + i]
        }

        for(i=0; i<window['skill_point_average_' + data[0][p]['C_id']].length; i++){
            var index = 0
            for(j=0; j<skill_board.length; j++){
                
                if(window['skill_point_average_' + data[0][p]['C_id']][i][0] == skill_board[j][0]){
                    index = 1
                    
                    skill_board[j][1] = skill_board[j][1] + window['skill_point_average_' + data[0][p]['C_id']][i][1]
                    skill_board[j][2] = skill_board[j][2] + 1

                }  
            }
            if(index == 0){
                var temp123 = window['skill_point_average_' + data[0][p]['C_id']][i];
                skill_board.push([temp123[0], temp123[1], 1, 0]);
            }
        }

    }

    function std(arr) {
        const n = arr.length;
        const mean = arr.reduce((a, b) => a + b) / n;
        const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
        const stdDev = Math.sqrt(variance);
        return stdDev;
    }

    for(i=0; i<skill_board.length; i++){
        window['skill_deviation_' + i] = []
        for(p=0; p<ppl.length; p++){
            for(j=0; j<window['skill_point_average_' + data[0][p]['C_id']].length; j++){
                if(skill_board[i][0] == window['skill_point_average_' + data[0][p]['C_id']][j][0]){
                    window['skill_deviation_' + i].push(window['skill_point_average_' + data[0][p]['C_id']][j][1])
                }
            }
        }
        // console.log(window['skill_deviation_' + i])
        skill_board[i][1] = skill_board[i][1] / skill_board[i][2]
        skill_board[i][3] = std(window['skill_deviation_' + i])
    }
    // console.log(window['skill_deviation_7'])
    // console.log(skill_board)

    for(p = 0; p < ppl.length; p++){
        for(i=0; i<window['skill_point_average_' + data[0][p]['C_id']].length; i++){
            for(j=0; j<skill_board.length; j++){
                if(window['skill_point_average_' + data[0][p]['C_id']][i][0] == skill_board[j][0]){

                    if(window['skill_point_average_' + data[0][p]['C_id']][i][1] < skill_board[j][1] - 2*skill_board[j][3]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 1
                    }
                    else if(skill_board[j][1] - 2*skill_board[j][3] <= window['skill_point_average_' + data[0][p]['C_id']][i][1] && 
                            window['skill_point_average_' + data[0][p]['C_id']][i][1] < skill_board[j][1] - 1*skill_board[j][3]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 2
                    }
                    else if(skill_board[j][1] - 1*skill_board[j][3] <= window['skill_point_average_' + data[0][p]['C_id']][i][1] && 
                            window['skill_point_average_' + data[0][p]['C_id']][i][1] < skill_board[j][1] - 0*skill_board[j][3]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 3
                    }
                    else if(skill_board[j][1] - 0*skill_board[j][3] <= window['skill_point_average_' + data[0][p]['C_id']][i][1] && 
                            window['skill_point_average_' + data[0][p]['C_id']][i][1] < skill_board[j][1] + 1*skill_board[j][3]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 4
                    }
                    else if(skill_board[j][1] + 1*skill_board[j][3] <= window['skill_point_average_' + data[0][p]['C_id']][i][1] && 
                            window['skill_point_average_' + data[0][p]['C_id']][i][1] < skill_board[j][1] + 2*skill_board[j][3]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 5
                    }
                    else if(skill_board[j][1] + 2*skill_board[j][3] <= window['skill_point_average_' + data[0][p]['C_id']][i][1]){
                        window['skill_point_average_' + data[0][p]['C_id']][i][1] = 6
                    }
                    else{
                        console.log('他噴錯了哭阿')
                    }
                    
                }
            }
        }
        // console.log(window['skill_point_average_' + data[0][p]['C_id']])
    }

    for(p = 0; p < ppl.length; p++){
        window['skill_object_average_' + data[0][p]['C_id']] = new Object
        for(i=0 ;i<window['skill_point_average_' + data[0][p]['C_id']].length; i++){
            window['skill_object_average_' + data[0][p]['C_id']][window['skill_point_average_' + data[0][p]['C_id']][i][0]] = window['skill_point_average_' + data[0][p]['C_id']][i][1]
        }
        // console.log(window['skill_object_average_' + data[0][p]['C_id']])
    }
}
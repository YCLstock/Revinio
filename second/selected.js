var already_selected = [];

function already(cid_ppl){
    already_selected = cid_ppl;
    document.getElementsByClassName("nextPageButtonText")[0].innerHTML = "Selected: " + already_selected.length;
}

function selected_ppl(C_id, p, checked,event){


    var x = event.clientX-15; // 獲取滑鼠點擊的 x 位置
    var y = event.clientY+50; // 獲取滑鼠點擊的 y 位置
    console.log("典籍位置",x,y,C_id)

    if(checked){
        if(already_selected.length >= 10){
            alert("You can't select more than 10 people.");

            document.getElementsByName("checkbox_" + C_id)[0].checked = false;

            
        }
        else{
            d3.selectAll("#selected_index" + p).style("opacity", 1);

            already_selected.push(C_id);
            
            document.getElementsByClassName("nextPageButtonText")[0].innerHTML = "Selected: " + already_selected.length;

            // 較評語出來
            comment(C_id,x,y);

            console.log("diddiid",C_id)

            dep(C_id,2);

        }
        
    }
    else{
        unselected_i = already_selected.findIndex(d => d == C_id);
        d3.selectAll("#selected_index" + p).style("opacity", 0);

        already_selected.splice(unselected_i, 1);

        document.getElementsByClassName("nextPageButtonText")[0].innerHTML = "Selected: " + already_selected.length

        de_dep(C_id,2);

    }

    // console.log(already_selected)

    
}
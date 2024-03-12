
function choose_id(datas){
    console.log(datas);

    // 分要顯示目前的選的

    const filteredselect = datas.note_check.filter(note_check => {
      // 篩選 C_id 在 1 到 50 之間的技能
      return note_check.N_check == '1' && note_check.Note_View == '2';
    });
    var select_cId = [];

    filteredselect.forEach(function(item) {
      select_cId.push(item.C_id);
    });

    already(select_cId);
    //分玩了

    // 使用物件來分類技能
    const filteredSkills = datas.note_check.filter(note_check => {
    // 篩選 C_id 在 1 到 50 之間的技能
      return note_check.N_check == '1' && note_check.Note_View == '1';
    });

    // console.log(filteredSkills)   //確認傳來的東西

    // 建立一個空陣列來存放 C_id 屬性的值
    var cIdArray = [];

    // 使用 forEach 遍歷每個物件並將 C_id 值推送到 cIdArray 中
    filteredSkills.forEach(function(item) {
    cIdArray.push(item.C_id);
    });

    // console.log(cIdArray)

    //頁面初始化之呼叫
    main_graph(datas, cIdArray);
    simple_graph(datas, cIdArray);
    sorting(datas, cIdArray);
    skill(datas, cIdArray);
    lan(datas, cIdArray); 

}
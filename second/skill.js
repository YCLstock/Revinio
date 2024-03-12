let selected_skills = [];                    //選擇的技能

window.selected_skills = selected_skills;

class SkillAssigner {
  constructor() {
    this.assignments = {};
    this.alphabetArray = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
  }

  addSkill(skillName) {
    const freeLetters = this.getFreeLetters();
    if (freeLetters.length > 0) {
      const letter = freeLetters[0];
      this.assignments[skillName] = letter;
    } else {
      // If there are no free letters, we will not assign a letter to this new skill.
      // You can add custom logic here if needed.
      console.log('No free letters available for assignment.');
    }
  }

  removeSkill(skillName) {
    if (this.assignments[skillName]) {
      delete this.assignments[skillName];
    } else {
      console.log(`Skill "${skillName}" not found.`);
    }
  }

  getFreeLetters() {
    const assignedLetters = Object.values(this.assignments);
    return this.alphabetArray.filter(letter => !assignedLetters.includes(letter));
  }

  getAssignments() {
    return this.assignments;
  }
}

const skillAssigner = new SkillAssigner();   //創建物件

window.skillAssigner = skillAssigner; // 設定為全局變數

function skill(datas, people){
  var data = [datas['basic_information'],
              datas['academic'], 
              datas['work_experience'], 
              datas['other_experience'], 
              datas['relation_table_we_s'], 
              datas['skill'], 
              datas['relation_table_oe_s']];

  console.log(window)
    
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


  //選取
    const skill_Section = document.querySelector(".skill");
    const skill_Width = (skill_Section.getBoundingClientRect().width );

    console.log("skill ",skill_Width)

    // const Height = Section.getBoundingClientRect().height;           用不到

  // 使用物件來分類技能
  const filteredSkills = datas.skill.filter(skill => {
    return people.includes(skill.C_id);
  });

const skillsByType = {};

filteredSkills.forEach(skill => {
  const skillType = skill.skill_type;
  const skillName = skill.skill_name;
  const C_id = skill.C_id;

  if (!skillsByType[skillType]) {
      // 如果這個技能類別尚未建立，則創建一個新的陣列
      skillsByType[skillType] = [];
  }

  // 檢查技能是否已存在於陣列中，如果不存在才加入
  const existingSkill = skillsByType[skillType].find(skillObj => skillObj.skillName === skillName);
  if (!existingSkill) {
      // 技能尚未存在於陣列中，新增一個包含 C_id 陣列的物件
      skillsByType[skillType].push({ skillName, C_id: [C_id] });
  } else {
      // 技能已存在於陣列中，將當前 C_id 加入到現有技能物件的 C_id 陣列中
      existingSkill.C_id.push(C_id);
  }
});

// 現在 skillsByType 物件中的資料結構是按技能類別分組，且每個技能類別中包含 C_id 在 1 到 50 之間的技能及其擁有者
console.log(skillsByType);


    //下面為完整

    all_skill = skillsByType['skill'];                      //取出'技能'類別
    skill_num = skillsByType["skill"].length;               //算總數
    
    console.log(all_skill)

    // set the dimensions and margins of the graph
     const margin = {top: 2, right: 30, bottom: 60, left: 2},                  //調整圖的高低
     width = skill_Width - margin.left - margin.right,
     height = (skill_num) * 37;

    // 創建svg
    const svg = d3.select(".skill_content")
    .append("svg")
      .attr("class","skill_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //創建y的比例尺
    const y = d3.scaleBand()
      .domain(Array.from(Array(skill_num).keys()))
      .range([ 0, height-15])
      .padding(.3);




    // 創建多個 <rect> 元素
    const rec = svg
        .selectAll(".skill-info") // 使用 selectAll() 來選擇尚不存在的元素
        .data(all_skill) // 綁定資料
        .enter() // 進入 enter selection，處理尚不存在的資料項目
        .append("rect") // 創建多個 <rect> 元素
        .attr("x", 0)
        .style("cursor", "pointer")
        .attr("y", (d, i) => y(i)) // 設定每個 <rect> 元素在 y 軸上的位置
        .attr("class", "skill-info")
        .attr("id", (d, i) => "skill-info" + i)
        .attr("width", skill_Width-20)
        .attr("height", 35)
        .attr("fill", "white") // 將填充顏色設定為 "none"，表示不填充任何顏色
        .attr("stroke", "black") // 設定邊框顏色為黑色
        .attr("stroke-width", 0.5) // 設定邊框寬度為1個單位
        .on("click", function(i, d) {
            const textID = d3.selectAll(".check").filter((data) => data === d) // 選擇與資料 d 相符的元素
            const sqareID = d3.selectAll(".skill-check").filter((data) => data === d) // 選擇與資料 d 相符的元素
            const currentColor = sqareID.attr("fill");

            if(currentColor=="white"){
              d3.select(this)                          // 選取被點擊的長方形
                .attr("fill", "white");                 // 變更長方形的填充顏色（你可以設定任何你喜歡的顏色）
                selected_skills.push(d);
                skillAssigner.addSkill(d.skillName);
                // console.log('d',d)
              
                // console.log(skillAssigner.getAssignments(),"select",selected_skills);
                // console.log("Selected Skills:", selected_skills);
                move(selected_skills,skillAssigner.getAssignments());

                const letter = skillAssigner.getAssignments()[d.skillName]
              console.log(letter)
              textID.text(letter); 
              sqareID.attr("fill", "#B15BFF")

              //處理技能同步改變畫面問題
              if(document.getElementById("btn_text").innerText == "Selected skill amount"){
                
                skilllayer_animation(datas, skill_layer(ppl, all_data));
              }

              //處理排序問題
              if(d3.select("#skilllayer_sorting").style("pointer-events") == "none"){
                d3.select("#skilllayer_sorting").style("pointer-events", "auto");
                d3.select("#skilllayer_sorting").style("color", null);
              }

            }
            else{
              d3.select(this)                          // 選取被點擊的長方形
                .attr("fill", "white");                 // 變更長方形的填充顏色（你可以設定任何你喜歡的顏色）
              selected_skills = selected_skills.filter((item) => item !== d);
              // console.log("Selected Skills:", selected_skills);
              skillAssigner.removeSkill(d.skillName);
              console.log(skillAssigner.getAssignments());
              move(selected_skills,skillAssigner.getAssignments());
              textID.text(""); 
              sqareID.attr("fill", "white")

              //處理技能同步改變畫面問題
              if(document.getElementById("btn_text").innerText == "Selected skill amount"){
                
                skilllayer_animation(datas, skill_layer(ppl, all_data));
              }

              //處理排序問題
              if(selected_skills[0] == undefined){
                d3.select("#skilllayer_sorting").style("pointer-events", "none");
                d3.select("#skilllayer_sorting").style("color", "#D3D3D3");
              }
            }
        })
        .on("mouseover",function(event,d){
          d3.select("#tooltip")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + "px")
            .html(`<p>${d.skillName}</p>`)
            .style("pointer-events", "none")
            .style("font-family", "Belanosima")
            .style("opacity", 1);
        })
        .on("mouseout", function(event, d) {
          
          d3.select("#tooltip").style("opacity", 0);         
          });

    //設定最大寬度
    // const rect_width = 11;
    //創建文字
    const labels = svg
        .selectAll("text")
        .data(all_skill) // 綁定資料
        .enter() // 進入 enter selection，處理尚不存在的資料項目
        .append("text")
        .attr("x", skill_Width/6) // 設定文字的 x 軸位置（假設左側留出 10 個單位的空間）
        .attr("y", (d, i) => y(i)+20) // 設定文字的 y 軸位置（假設文字在長方形的中央位置）
        .attr("fill", "black") // 將文字填充顏色設為白色
        .text(d => d.skillName) // 將文字設為技能名稱
        .each(function(){
            var text_width = this.getComputedTextLength();
            var original_text = d3.select(this).text();
            var rect_width = skill_Width;
            if(text_width > rect_width){
                // console.log(text_width)
                // console.log(skill_Width)
              var new_text = original_text.substring(0, Math.floor(original_text.length * rect_width / text_width)) + "...";
              d3.select(this).text(new_text);
            }
        })
        .style("font-size", "16px")
        .style("font-family", "Belanosima")
        .style("pointer-events", "none")
        .style("opacity", 1);

    //創建格子
    const sqare = svg
      .selectAll(".skill-check") // 使用 selectAll() 來選擇尚不存在的元素
      .data(all_skill) // 綁定資料
      .enter() // 進入 enter selection，處理尚不存在的資料項目
      .append("rect") // 創建多個 <rect> 元素
      .attr("x", 3)
      .attr("y", (d, i) => y(i)+7) // 設定每個 <rect> 元素在 y 軸上的位置
      .attr("class", "skill-check")
      .attr("width", 18)
      .attr("height", 18)
      .style("cursor", "pointer")
      .attr("fill", "white") // 將填充顏色設定為 "none"，表示不填充任何顏色
      .attr("stroke", "black") // 設定邊框顏色為黑色
      .attr("stroke-width", 0.5) // 設定邊框寬度為1個單位
      .on('click', function(event, d) {
              
        const sqareID = d3.selectAll(".skill-info").filter((data) => data === d) // 選擇與資料 d 相符的元素
        const lan_id ="#" + sqareID.attr("id")

        d3.selectAll(lan_id)
          .dispatch('click');
      });

    let check = svg
        .selectAll("check")
        .data(all_skill) // 綁定資料
        .enter() // 進入 enter selection，處理尚不存在的資料項目
        .append("text") // 創建多個 <rect> 元素
        .attr("x", 7)
        .attr("y", (d, i) => y(i)+20) // 設定每個 <rect> 元素在 y 軸上的位置
        .attr("class", "check")
        .text("")
        .attr("fill", "white") // 將文字填充顏色設為白色
        .style("font-size", "15px")
        .style("font-family", "Belanosima")
        .style("pointer-events", "none")
        .style("opacity", 1);

      //set toolip data
      d3.select("body")
          .append("div")
          .attr("id", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("padding", "5px")
          .style("border", "1px solid #191818")
          .style("pointer-event","none")
          ;

}


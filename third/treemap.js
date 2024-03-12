const drawTreemap = (data, skill, currentPhotoId, uniqueCIds) => {

  const middleSection = document.querySelector(".sub-section-1-3");
  const middleWidth = middleSection.getBoundingClientRect().width;
  const MiddleHeight = middleSection.getBoundingClientRect().height;

  const width = middleWidth;
  const height = MiddleHeight;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // 清除先前的 SVG 元素
  d3.select('#simple_svg1').remove();

  const svg = d3.select('.sub-section-1-3')
    .append('svg')
    .attr('id',"simple_svg1")
    .attr('width', width)
    .attr('height', height);

  const treemap = d3
    .treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  const root = d3
    .hierarchy({ children: data })
    .sum((d) => d.count)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  const cell = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  cell
    .append("rect")
    .attr("fill", (d) => {
      // 檢查技能是否與選中圖片的技能匹配
      const selectedSkills = skill.filter(item => item.C_id === currentPhotoId && item.skill_name === d.data.name);
      if (selectedSkills.length > 0) {
        return "red"; // 匹配時使用橘色
      }
      return "#AAAAAA"; // 未選中的技能使用灰色
    })
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mouseover", (event, d) => {
      const peopleWithSkill = uniqueCIds.filter(id => {
        return skill.some(item => item.C_id === id && item.skill_name === d.data.name);
      });
      console.log("People with skill:", peopleWithSkill);
      // 更新擁有該技能的人的ID
      app.peopleWithSkillIds = peopleWithSkill;
      peopleWithSkill.forEach(id => {
        const element = document.getElementById(id); // 或者使用其他方法獲取元素
        if (element) {
          element.classList.add('highlight'); // 假設 'highlight' 是你想應用的 CSS class
        }
      });
      // 添加陰影效果
      d3.select(event.target).attr('stroke', 'orange');
      d3.select(event.target).attr('stroke-width', '5px');
    })
    .on("mouseout", () => {
      console.clear(); // 清除console.log
      // 重置擁有該技能的人的ID
      app.peopleWithSkillIds = [];

      // 遍歷之前高亮的元素，並移除 'highlight' CSS class
      const highlightedElements = document.querySelectorAll('.highlight');
      highlightedElements.forEach(element => {
        element.classList.remove('highlight');
      });
      // 移除陰影效果
      d3.select(event.target).attr('stroke', null);
    });

  cell
    .append("text")
    .attr("fill", "white")
    .attr("font-size", 12)
    .attr("x", 3)
    .attr("y", 12)
    .text((d) => `${d.data.name}`);
  //.text((d) => `${d.data.name} (${d.data.count})`);
};

/** for treemap.html
 const drawTreemap = (data) => {
 const width = 480;
 const height = 200;
 const color = d3.scaleOrdinal(d3.schemeCategory10);
 
 const treemap = d3
   .treemap()
   .size([width, height])
   .padding(1)
   .round(true);
 
 const root = d3
   .hierarchy({ children: data })
   .sum((d) => d.count)
   .sort((a, b) => b.value - a.value);
 
 treemap(root);
 
 const cell = svg
   .selectAll("g")
   .data(root.leaves())
   .join("g")
   .attr("transform", (d) => `translate(${d.x0},${d.y0})`);
 
 cell
   .append("rect")
   .attr("fill", "gray")
   .attr("width", (d) => d.x1 - d.x0)
   .attr("height", (d) => d.y1 - d.y0);
 
 cell
   .append("text")
   .attr("fill", "black")
   .attr("font-size", 12)
   .attr("x", 3)
   .attr("y", 12)
   .text((d) => `${d.data.name} (${d.data.count})`);
};
*/
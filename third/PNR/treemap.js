const drawTreemap = (data, skill, currentPhotoId) => {
  const width = 500;
  const height = 220;
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
    .attr("fill", (d) => {
      // 檢查技能是否與選中圖片的技能匹配
      const selectedSkills = skill.filter(item => item.C_id === currentPhotoId && item.skill_name === d.data.name);
      if (selectedSkills.length > 0) {
        return "orange"; // 匹配時使用橘色
      }
      return "gray"; // 未選中的技能使用灰色
    })
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
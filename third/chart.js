console.log(data)
groupedData.forEach((group, key) => {
  const groupContainer = svg.append("g")
    .attr("class", "bar-group")
    .attr("transform", () => {
      const yPosition = yScale(key.split(" - ")[0]);
      const xPosition = xScale(key.split(" - ")[1]);
      return `translate(${xPosition}, ${yPosition})`;
    });

  // 為每個 degree 創建 sub bar
  group.forEach(d => {
    groupContainer.append("rect")
      .attr("class", "sub-bar")
      .attr("x", 0)
      .attr("y", () => {
        const degreeIndex = group.indexOf(d);
        return degreeIndex * (yScale.bandwidth() - 10);
      })
      .attr("width", xScaleDynamic(d.count))
      .attr("height", yScale.bandwidth() - 12)
      .attr("fill", () => {
        // 根據學歷不同選擇不同顏色
        if (d.name.includes("bachelor")) {
          return "blue";
        } else if (d.name.includes("master")) {
          return "green";
        } else if (d.name.includes("doctor")) {
          return "purple";
        } else {
          return "gray";
        }
      })
      .append("title")

  });
});

svg.selectAll(".bar-group")  // 新增 ".bar-group" 的選擇器
  .data(data)
console.log(data)
  .enter()
  .append("g")
  .attr("class", "bar-group")
  .attr("transform", d => `translate(${xScale(d.name.split(" - ")[1]) - 8}, ${yScale(d.name.split(" - ")[0])})`)
  .selectAll(".sub-bar")  // 在每個 ".bar-group" 中再新增 ".sub-bar" 的選擇器
  .data(d => {
    const schoolName = d.name.split(" - ")[0];
    const departmentName = d.name.split(" - ")[1];

    const resultForSchoolAndDepartment = result.find(item => item.school === schoolName && item.department === departmentName);

    const resultArray = Array.from({ length: resultForSchoolAndDepartment ? resultForSchoolAndDepartment.degreeCount : 1 }, (_, i) => {
      const schoolName = d.name.split(" - ")[0];
      const departmentName = d.name.split(" - ")[1];
      const degree = d.name.split(" - ")[2];
      const count = d.count;

      return {
        index: i,
        schoolName: schoolName,
        departmentName: departmentName,
        degree: degree,
        count: count
      };
    });
    console.log(resultArray)
    return resultArray;
  })
  .enter()
  .append("rect")
  .attr("class", "sub-bar")
  .attr("x", 0)
  .attr("y", (d, i) => i * (yScale.bandwidth() - 10))
  .attr("width", d => xScaleDynamic(d.count))
  .attr("height", yScale.bandwidth() - 12)
  .attr("fill", d => {
    // 檢查是否與選中圖片的學校、科系和學歷匹配
    const selectedSchool = academic.filter(item =>
      item.C_id === currentPhotoId &&
      item.school_name === d.schoolName &&
      item.school_department === d.departmentName &&
      item.school_degree === d.degree
    );

    if (selectedSchool.length > 0) {
      return "orange"; // 匹配時使用橘色
    } else {

      // 根據學歷不同選擇不同顏色
      if (d.degree === "bachelor") {
        return "blue";
      } else if (d.degree === "master") {
        return "green";
      } else if (d.degree === "doctor") {
        return "purple";
      } else {
        return "gray"; // 未選中的資料使用灰色
      }
      //return "gray"; // 未選中的資料使用灰色
    }
  })
  .append("title")
  .text(d => d.degree);
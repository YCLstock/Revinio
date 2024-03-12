const drawBarChart = (data, academic, currentPhotoId) => {
    // 定義 bar chart 的寬高
    const width = 500;
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };

    // 清除先前的 SVG 元素
    d3.select('#barchar').selectAll("svg").remove();

    const schools = data.map(item => item.name.split(" - ")[0]); // 用" - "分割name，取第一個元素作為學校名稱
    const departments = data.map(item => item.name.split(" - ")[1]); // 用" - "分割name，取第二個元素作為科系名稱
    const counts = data.map(item => item.count); // 取count作為人數

    const getTextColor = (d) => {
        return (item => item.C_id === currentPhotoId && item.school_name === d.name.split(" - ")[0] && item.school_department === d.name.split(" - ")[1]) ? "white" : "orange";
    };
    console.log(schools);
    console.log(departments);
    console.log(counts);
    // 計算 x 軸與 y 軸的刻度尺度
    const xScale = d3.scaleBand()
        .domain(uniqueDepartments)
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(uniqueSchools)
        .range([height - margin.bottom, margin.top])
        .padding(0.1);
    // 建立 SVG 元素
    const svg = d3.select("#barchar")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // 加入 x 軸
    svg.append("g")
        .attr("transform", `translate(0, ${margin.top})`) // 将x轴移到最上方
        .call(d3.axisTop(xScale))
        .selectAll("text")
        .style("text-anchor", "middle") // 将文本锚点设为中间
        .attr("dy", "-0.5em") // 垂直偏移量，使文本位置上移
        .attr("transform", "rotate(0)"); // 旋转文本

    // 加入 x 軸標籤
    svg.append("text")
        .attr("x", width - margin.right)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "end")
    //.text("科系名稱");

    // 加入 y 軸
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // 加入 y 軸標籤
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "start")
    //.text("學校名稱");

    // 添加垂直分隔线
    svg.append("g")
        .selectAll("line")
        .data(uniqueDepartments)
        .enter()
        .append("line")
        .attr("x1", d => xScale(d) + xScale.bandwidth())
        .attr("y1", margin.top)
        .attr("x2", d => xScale(d) + xScale.bandwidth())
        .attr("y2", height - margin.bottom)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2,2");

    // 添加水平分隔线
    svg.append("g")
        .selectAll("line")
        .data(uniqueSchools)
        .enter()
        .append("line")
        .attr("x1", margin.left)
        .attr("y1", d => yScale(d) + yScale.bandwidth())
        .attr("x2", width - margin.right)
        .attr("y2", d => yScale(d) + yScale.bandwidth())
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2,2");
    // 添加矩形條
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.name.split(" - ")[1]))
        .attr("y", d => yScale(d.name.split(" - ")[0]))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        //.attr("fill", d => (d.id === selectedPhotoId) ? "orange" : "steelblue") // Change color based on the matching ID
        .attr("fill", (d) => {
            // 檢查技能是否與選中圖片的技能匹配
            const selectedSchool = academic.filter(item => item.C_id === currentPhotoId && item.school_name === d.name.split(" - ")[0] && item.school_department === d.name.split(" - ")[1])
            if (selectedSchool.length > 0) {
                return "orange"; // 匹配時使用橘色
            }
            return "gray"; // 未選中的技能使用灰色
        })
    // 添加人數標籤
    svg.selectAll(".countLabel")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "countLabel")
        .attr("x", d => xScale(d.name.split(" - ")[1]) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.name.split(" - ")[0]) + yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", d => getTextColor(d)) // Set fill attribute based on selectedPhotoId
        .text(d => d.count);
};

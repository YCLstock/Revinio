const drawBarChart = (data, academic, currentPhotoId, uniqueCIds) => {

    const middleSection = document.querySelector(".sub-section-1-1");
    const middleWidth = middleSection.getBoundingClientRect().width;
    const MiddleHeight = middleSection.getBoundingClientRect().height;

    // 定義 bar chart 的寬高
    const width = middleWidth;
    const height = MiddleHeight;

    const margin = { top: 40, right: 10, bottom: 35, left: 60 };
    //const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    // 清除先前的 SVG 元素
    d3.select('#barchar1').remove();

    const schools = data.map(item => item.name.split(" - ")[0]); // 用" - "分割name，取第一個元素作為學校名稱
    const departments = data.map(item => item.name.split(" - ")[1]); // 用" - "分割name，取第二個元素作為科系名稱
    const degree = data.map(item => item.name.split(" - ")[2]); // 用" - "分割name，取第三個元素作為學歷高低名稱
    const counts = data.map(item => item.count); // 取count作為人數

    const groupedData = d3.group(data, d => `${d.name.split(" - ")[0]} - ${d.name.split(" - ")[1]}`);
    
    // 計算 x 軸與 y 軸的刻度尺度
    const xScale = d3.scaleBand()
        .domain(uniqueDepartments)
        .range([margin.left, width - margin.right])
        .padding(0);


    const yScale = d3.scaleBand()
        .domain(uniqueSchools)
        .range([height - margin.bottom, margin.top])
        .padding(0);

    const fontSize = Math.min(yScale.bandwidth() / 4 + 3); // 設置字體大小為最大值為 12 像素，或者矩形高度的三分之一，取其中較小的一個
    const fontSizeX = Math.min(yScale.bandwidth() / 5 + 5); // 設置字體大小為最大值為 12 像素，或者矩形高度的三分之一，取其中較小的一個
    const fontSizeY = Math.min(yScale.bandwidth() / 4 + 3); // 設置字體大小為最大值為 12 像素，或者矩形高度的三分之一，取其中較小的一個

    // 動態計算矩形條的寬度 (基於 count)
    const countMax = d3.max(data, d => d.count) + 1;

    const xScaleDynamic = d3.scaleLinear()
        .domain([0, countMax])
        .range([0, xScale.bandwidth()]);

    // 建立 SVG 元素
    const svg = d3.select(".sub-section-1-1")
        .append('svg')
        .attr("id", "barchar1")
        .attr('width', width)
        .attr('height', height);
    // 加入 x 軸
    svg.append("g")
        .attr("transform", `translate(0, ${margin.top})`)
        .call(d3.axisTop(xScale).tickSizeOuter(0))
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dy", function (d, i) {
            if (uniqueDepartments.size > 20) {
                return i % 2 === 0 ? "-1em" : "0em"; // 控制奇偶行的垂直偏移量
            }
            else {
                return "-0.5em";
            }
        })
        .style("font-size", `${fontSizeX}px`);
    // 加入 y 軸
    const yAxisGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));
    // 調整 y 軸刻度標籤的位置
    yAxisGroup.selectAll(".tick text")
        .attr("x", -margin.left + 13)  // 往左移動，讓刻度標籤顯示在主條的左側
        .style("text-anchor", "start")  // 設定文本錨點為開始，以對齊左側
        .style("font-size", `${fontSizeY}px`)
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
        .attr("stroke-dasharray", "none")
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
        .attr("stroke-dasharray", "none");
    //分組矩形
    console.log(yScale.bandwidth())
    console.log(xScale.bandwidth())
    groupedData.forEach((group, key) => {
        const groupContainer = svg.append("g")
            .attr("class", "bar-group")
            .attr("transform", () => {
                const yPosition = yScale(key.split(" - ")[0]);
                const xPosition = xScale(key.split(" - ")[1]);
                return `translate(${xPosition}, ${yPosition})`;
            });
        group.forEach(d => {
            const schoolName = d.name.split(" - ")[0];
            const departmentName = d.name.split(" - ")[1];
            const degree = d.name.split(" - ")[2];
            const count = d.count;
            const selectedSchool = academic.filter(item =>
                item.C_id === currentPhotoId &&
                item.school_name === schoolName &&
                item.school_department === departmentName &&
                item.school_degree === degree
            );
            const isMatched = selectedSchool.length > 0;
            groupContainer.append("rect")
                .attr("class", "sub-bar")
                .attr("x", 0)
                .attr("y", () => {
                    const degreeIndex = group.indexOf(d);
                    return degreeIndex * (yScale.bandwidth() / 3);
                })
                .attr("width", xScaleDynamic(count))
                .attr("height", yScale.bandwidth() / 3)
                .attr("fill", () => {
                    if (degree === "Bachelor") {
                        return "#AAAAAA";
                    } else if (degree === "Master") {
                        return "#555555";
                    } else if (degree === "Doctor") {
                        return "#000000";
                    } else {
                        return "gray";
                    }
                })
                .attr("stroke", () => {
                    if (isMatched) {
                        return "red"; // 給符合條件的bar添加紅色框線
                    } else {
                        return "none"; // 其他bar無框線
                    }
                })
                .attr("stroke-width", () => {
                    if (isMatched) {
                        return 3; // 設定符合條件的bar框線為2個單位的粗度
                    } else {
                        return 1; // 設定其他bar的框線為1個單位的粗度
                    }
                })
                .on('mouseover', function () {
                    const matchedUniqueIds = uniqueCIds.filter(id => {
                        return academic.some(item =>
                            item.C_id === id &&
                            item.school_name === schoolName &&
                            item.school_department === departmentName &&
                            item.school_degree === degree
                        );
                    });
                    console.clear(); // 清除console.log
                    console.log("符合條件的 uniqueId: ", matchedUniqueIds);
                    matchedUniqueIds.forEach(id => {
                        const element = document.getElementById(id); // 或者使用其他方法獲取元素
                        if (element) {
                            element.classList.add('highlight'); // 假設 'highlight' 是你想應用的 CSS class
                        }
                    });
                    d3.select(event.target).attr('opacity', 0.7);
                })
                .on("mouseout", () => {
                    console.clear(); // 清除console.log
                    // 重置擁有該技能的人的ID
                    app.matchedUniqueIds = [];

                    // 遍歷之前高亮的元素，並移除 'highlight' CSS class
                    const highlightedElements = document.querySelectorAll('.highlight');
                    highlightedElements.forEach(element => {
                        element.classList.remove('highlight');
                    });
                    // 移除陰影效果
                    d3.select(event.target).attr('opacity', 1);
                })
                .append("title")
                .text(degree);
                /*
            groupContainer.append("text")
                .attr("class", "count-label")
                .attr("x", xScaleDynamic(count) + 5)  // 調整文字的x位置
                .attr("y", () => {
                    const degreeIndex = group.indexOf(d);
                    return degreeIndex * (yScale.bandwidth() / 3) + (yScale.bandwidth() / 3); // 調整文字的y位置
                })
                .attr("font-size", `${fontSize}px`)  // 設置字體大小
                .text(`${count}`); // 將 count 值設置為文字內容*/
        });
    });
    // 新增刻度

    svg.selectAll(".ticks")
        .data(uniqueDepartments)
        .enter()
        .append("g")
        .attr("class", "ticks")
        .attr("transform", d => `translate(${xScale(d)}, ${height - margin.bottom})`)
        .call(d3.axisBottom(d3.scaleLinear().domain([0, countMax]).range([0, xScale.bandwidth()])).ticks(countMax).tickSizeOuter(0))
        .each(function () {
            d3.select(this).select(".tick:last-child").remove();
        });
    /* 
    svg.selectAll(".ticks")
        .data(uniqueDepartments)
        .enter()
        .append("g")
        .attr("class", "ticks")
        .attr("transform", d => `translate(${xScale(d)}, ${height - margin.bottom})`)
        .call(d3.axisBottom(d3.scaleLinear().domain([0, countMax - 1]).range([0, xScale.bandwidth() * 0.9])).ticks(5).tickSizeOuter(0));
    */
    /* 
    // 添加x軸底部刻度標示
    svg.selectAll(".bar-length-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-length-label")
        .attr("x", d => xScale(d.name.split(" - ")[1]) + xScaleDynamic(d.count)*0.9)
        .attr("y", height - margin.bottom + 15) // 調整刻度標示的 y 座標位置
        .attr("text-anchor", "middle")
        .text(d => d.count);
*/
};

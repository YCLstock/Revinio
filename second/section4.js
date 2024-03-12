function x_axis(datas){
    const middleSection = document.querySelector(".section-4");
    const middleWidth = middleSection.getBoundingClientRect().width;
    const middleHeight = middleSection.getBoundingClientRect().height;

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 60, left: 10},                  //調整圖的高低
        width = middleWidth,
        height = middleHeight;

    console.log(width, height)

    // set the dimensions and margins of the graph
    // const margin = {top: 20, right: 30, bottom: 40, left: 90},
    //     width = 1920 - margin.left - margin.right,
    //     height = 910 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(".section-4")
        .append("svg")
        .attr("width", width - 180)
        .attr("height", height)
        // .append("g")
        // .attr("transform", `translate(${margin.left}, ${margin.top})`);

    console.log(width)


    const x = d3.scaleTime()
        .domain([new Date(window.min_year, 0, 1), new Date(2023, 7, 1)])
        .range([ 10, width - 180]);
    svg.append("g")
        .attr("id", "ouo")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisBottom(x).ticks(d3.timeYear))
    svg.selectAll("path")
        .attr("stroke", "black")
    svg.selectAll("line")
        .attr("stroke", "black")
    svg.selectAll("text")
        .attr("fill", "black")
        .attr("transform", "translate(5,0)rotate(45)")
        .style("text-anchor", "start");
}

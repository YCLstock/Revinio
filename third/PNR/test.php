<head>
    <title>forth distence</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="cv.css">  -->

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v6.js"></script>
    <script src="https://unpkg.com/vue@next"></script>

    <style>
        /* Define CSS styles here */
        .circle {
            cursor: pointer;
        }

        .circle:hover {
            stroke-width: 5px;
            stroke: #9EA4FF;
        }

        .circle.active {
            stroke-width: 5px;
            stroke: #6D6CFF;
        }
    </style>
</head>

<body>
    <script>
        // Define an array to store the 10 names
        var names = ["101", "102", "103", "104", "105", "106", "107", "201", "202", "203"];

        // Set the dimensions and margins of the SVG element
        var margin = { top: 50, right: 20, bottom: 20, left: 20 },
            width = 1920 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

        // Create an SVG element and append it to the body
        var svg = d3
            .select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create a scale for the y position of the circles
        var y = d3.scaleBand().range([10, height]).padding(0.1).domain(names);

        // Create a defs element
        var defs = svg.append("defs");

        // Append a pattern element for each name in the array
        defs
            .selectAll(".pattern")
            .data(names)
            .enter()
            .append("pattern")
            .attr("class", "pattern")
            .attr("id", function (d) {
                return d;
            })
            .attr("width", 60)
            .attr("height", 60)
            .append("image")
            .attr("xlink:href", function (d) {
                return "ai_picture/" + d + ".jpg";
            })
            .attr("width", 60)
            .attr("height", 60);

        // Append a circle element for each name in the array
        var teamicon = svg
            .selectAll(".circle")
            .data(names)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("id", d => d)
            .attr("cx", 10)
            .attr("cy", function (d) {
                return y(d) + 100;
            })
            .attr("r", 30)
            .style("fill", function (d) {
                return "url(#" + encodeURI(d) + ")";
            })
            .on("click", function (d) {
                clickteam(d3.select(this).attr("id"));

                teamicon.classed("active", false);
                d3.select(this).classed("active", true);
            });

        function clickteam(id) {
            console.log("Clicked team:", id);
            // Add your desired logic for handling the click event here
        }
    </script>
</body>

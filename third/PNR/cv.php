<!DOCTYPE html>
<html lang="en">

<head>
    <title>forth distence</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="cv.css">  -->

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v6.js"></script>
    <script src="https://unpkg.com/vue@next"></script>
    <script src="test.js"></script>

    <link rel="stylesheet" type="text/css" href="styles.css">
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
    <div id="app">
        <!-- <div>{{ basic_information }}</div> -->

        <!-- 放置照片區域 -->
        <div class="section section-photo">
            <script>
                // Define an array to store the 10 names
                var names = ["101", "102", "103", "104", "105", "106", "107", "201", "202", "203"];

                // Set the dimensions and margins of the SVG element
                var margin = { top: 0, right: 20, bottom: 20, left: 20 },
                    width = 300 - margin.left - margin.right,
                    height = 1080 - margin.top - margin.bottom;

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
                    .attr("width", 40)
                    .attr("height", 40)
                    .append("image")
                    .attr("xlink:href", function (d) {
                        return "../ai_picture/" + d + ".jpg";
                    })
                    .attr("width", 100)
                    .attr("height", 130);

                // Append a circle element for each name in the array
                var teamicon = svg
                    .selectAll(".circle")
                    .data(names)
                    .enter()
                    .append("circle")
                    .attr("class", "circle")
                    .attr("id", d => d)
                    .attr("cx",40)
                    .attr("cy", function (d) {
                        return y(d) + 100;
                    })
                    .attr("r", 50)
                    .style("fill", function (d) {
                        return "url(#" + encodeURI(d) + ")";
                    })
                    .on("click", function (d) {
                        clickteam(d3.select(this).attr("id"));

                        teamicon.classed("active", false);
                        d3.select(this).classed("active", true);
                    });

                function clickteam(id) {
                    console.log("Clicked id:", id);
                    // Add your desired logic for handling the click event here
                }
            </script>
        </div>
    </div>
</body>
</div>
<!-- 放置照片區域 -->


<!-- 評論區區域 -->
<div class="section section-comment">
    <p> comment </p>
</div>
<!-- 評論區區域 -->


<!-- 履歷區域 -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cv.css">
    <title>Resume</title>
</head>

<body>
    <div class="body">
        <div class="resume">
            <div class="info">
                <div class="deco"></div><img class="avator"
                    src="https://img.ixintu.com/upload/jpg/20210525/067a843d13c9335c9c52581c1b80091a_60415_800_650.jpg!con" />
                <h1 class="name">
                    <?php
                    // Create a connection to the database
                    $conn = mysqli_connect("localhost", "root", "", "vrs");
                    // Check if the connection is successful
                    if (!$conn) {
                        die("Connection failed: " . mysqli_connect_error());
                    }
                    // Query the database to get the name
                    $sql = "SELECT C_name FROM basic_information";
                    $result = mysqli_query($conn, $sql);
                    // Check if the query is successful and there is a result
                    if ($result && mysqli_num_rows($result) > 0) {
                        // Fetch the first row of the result as an associative array
                        $row = mysqli_fetch_assoc($result);
                        // Echo the name from the array
                        echo $row["C_name"];
                    }
                    // Close the connection
                    mysqli_close($conn);
                    ?>
                </h1><span class="jobPosition">VISUAL DESIGNER??</span>
                <ul class="contact">
                    <li>
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT C_email FROM basic_information";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["C_email"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?>
                    </li>
                    <li>
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT C_phone FROM basic_information";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["C_phone"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?>
                    </li>
                </ul><a class="btn" href="https://www.behance.net/d0332b4f" target="_blank">Be</a>
                <div class="pocket"></div>
            </div>
            <div class="bgBlock">
                <div class="block brief">
                    <h4>ABOUT ME</h4>
                    <h2>關於我</h2>
                    <p>熱愛學習、充滿好奇心、自我成長與突破。具有約4年的設計相關經驗，善於視覺設計，並涉足影片剪輯動畫後製與網頁切版相關經驗。其中也具備半年以上UI設計經驗，曾參與內部系統APP專案優化及POS機台介面設計等專案，建立Design
                        System、介面設計、流程優化到最後的交付設計。期許自己能成為兼顧美感與體驗的設計人。</p>
                </div>
                <div class="block">
                    <h4>EDUCATION</h4>
                    <h2>學歷</h2>
                    <h3>
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT school_name FROM academic";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["school_name"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?>｜
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT school_department FROM academic";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["school_department"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?>
                    </h3><span>
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT school_start_year FROM academic";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["school_start_year"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?> -
                        <?php
                        // Create a connection to the database
                        $conn = mysqli_connect("localhost", "root", "", "vrs");
                        // Check if the connection is successful
                        if (!$conn) {
                            die("Connection failed: " . mysqli_connect_error());
                        }
                        // Query the database to get the name
                        $sql = "SELECT school_end_year FROM academic";
                        $result = mysqli_query($conn, $sql);
                        // Check if the query is successful and there is a result
                        if ($result && mysqli_num_rows($result) > 0) {
                            // Fetch the first row of the result as an associative array
                            $row = mysqli_fetch_assoc($result);
                            // Echo the name from the array
                            echo $row["school_end_year"];
                        }
                        // Close the connection
                        mysqli_close($conn);
                        ?>
                    </span>
                </div>
                <div class="block">
                    <div class="block">
                        <h4>SUMMARY</h4>
                        <h2>專業技能</h2>
                        <ul class="list listSummary">
                            <?php
                            // Create a connection to the database
                            $conn = mysqli_connect("localhost", "root", "", "vrs");
                            // Check if the connection is successful
                            if (!$conn) {
                                die("Connection failed: " . mysqli_connect_error());
                            }
                            // Query the database to get the skills
                            $sql = "SELECT skill_name FROM skill WHERE skill_id LIKE '001%'";
                            $result = mysqli_query($conn, $sql);
                            // Check if the query is successful and there is a result
                            if ($result && mysqli_num_rows($result) > 0) {
                                // Loop through the result as an associative array
                                while ($row = mysqli_fetch_assoc($result)) {
                                    // Echo a LI element with the skill name from the array
                                    echo "<li>" . $row["skill_name"] . "</li>";
                                }
                            }
                            // Close the connection
                            mysqli_close($conn);
                            ?>
                        </ul>
                    </div>
                    <div class="block">
                        <h4>SKILLS</h4>
                        <h2>軟體技能</h2>
                        <ul class="list listSkill">
                            <li class="skill1"></li>
                            <li class="skill2"></li>
                            <li class="skill3"></li>
                            <li class="skill4"></li>
                            <li class="skill5"></li>
                            <li class="skill6"></li>
                            <li class="skill7"></li>
                            <li class="skill8"></li>
                            <li class="skill9"></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="bgBlock">
                <h4>EXPERIENCE</h4>
                <h2>工作經歷</h2>
                <ul class="listExperience">
                    <?php
                    // Create a connection to the database
                    $conn = mysqli_connect("localhost", "root", "", "vrs");
                    // Check if the connection is successful
                    if (!$conn) {
                        die("Connection failed: " . mysqli_connect_error());
                    }
                    // Query the database to get the work experience
                    $sql = "SELECT work_position, work_name, work_start_year, work_start_month, work_end_year, work_end_month, work_detail FROM work_experience WHERE work_id LIKE '001%'";
                    $result = mysqli_query($conn, $sql);
                    // Check if the query is successful and there is a result
                    if ($result && mysqli_num_rows($result) > 0) {
                        // Loop through the result as an associative array
                        while ($row = mysqli_fetch_assoc($result)) {
                            // Echo a LI element with the work position and name from the array
                            echo "<li class='year'><h3>" . $row["work_position"] . "｜" . $row["work_name"] . "</h3>";
                            // Echo a H4 element with the work start and end year and month from the array
                            echo "<h4>" . $row["work_start_year"] . "." . $row["work_start_month"] . " - " . $row["work_end_year"] . "." . $row["work_end_month"] . "</h4>";
                            // Echo a UL element with the class exp
                            echo "<ul class='exp'>";
                            // Use explode() function to split the work detail by newline character into an array
                            $work_detail_array = explode("\n", $row["work_detail"]);
                            // Use foreach loop to iterate over the array
                            foreach ($work_detail_array as $detail) {
                                // Echo a LI element with the detail from the array
                                echo "<li>" . $detail . "</li>";
                            }
                            // Echo a closing UL tag
                            echo "</ul>";
                            // Echo a closing LI tag
                            echo "</li>";
                        }
                    }
                    // Close the connection
                    mysqli_close($conn);
                    ?>
                </ul>
                <h2>其他經歷</h2>
                <ul class="listExperience">
                    <?php
                    // Create a connection to the database
                    $conn = mysqli_connect("localhost", "root", "", "vrs");
                    // Check if the connection is successful
                    if (!$conn) {
                        die("Connection failed: " . mysqli_connect_error());
                    }
                    // Query the database to get the exp experience
                    $sql = "SELECT exp_name,exp_start_year, exp_start_month, exp_end_year, exp_end_month FROM other_experience WHERE exp_id LIKE '001%'";
                    $result = mysqli_query($conn, $sql);
                    // Check if the query is successful and there is a result
                    if ($result && mysqli_num_rows($result) > 0) {
                        // Loop through the result as an associative array
                        while ($row = mysqli_fetch_assoc($result)) {
                            // Echo a LI element with the exp position and name from the array
                            echo "<li class='year'><h3>" . $row["exp_name"] . "</h3>";
                            // Echo a H4 element with the exp start and end year and month from the array
                            echo "<h4>" . $row["exp_start_year"] . "." . $row["exp_start_month"] . " - " . $row["exp_end_year"] . "." . $row["exp_end_month"] . "</h4>";
                            // Echo a UL element with the class exp
                            echo "<ul class='exp'>";
                            // Echo a closing UL tag
                            echo "</ul>";
                            // Echo a closing LI tag
                            echo "</li>";
                        }
                    }
                    // Close the connection
                    mysqli_close($conn);
                    ?>
                </ul>
            </div>
        </div>
    </div>
</body>

</html>
<!-- 履歷區域 -->


<!-- D3視覺化圖 -->
<div class="section section-1">
    <div class="sub-section sub-section-1">

        <!-- D3視覺化圖-1 -->
        <div class="sub-section sub-section-1-1">
            <div v-if="basic_information.C_name">{{ basic_information[0] }}</div>
            School
        </div>
        <!-- D3視覺化圖-1 -->

        <!-- D3視覺化圖-2 -->
        <div class="sub-section sub-section-1-2">
            EXPERIENCE
        </div>
        <!-- D3視覺化圖-2 -->

    </div>

    <!-- D3視覺化圖-3 -->
    <div class="sub-section sub-section-3">
        ALL Skills
    </div>
    <!-- D3視覺化圖-3 -->\

</div>
<!-- D3視覺化圖 -->

</div>

<script src="index.js"></script>

</body>

</html>
// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 100,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.abbr = data.abbr;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(healthData, d => d.poverty)+3])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare + 3)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var graph = chartGroup.append("g");

    // Step 5: Create Circles
    // ==============================
    // var circlesGroup = graph.selectAll("circle")
    var foreignGroup = graph.selectAll("foreignObject")
    .data(healthData)
    .enter()
    .append("foreignObject")
    // .attr("id", function(d) {
    //     return (`${d.abbr}`).toLowerCase();
    //   })
    .attr("x", d => xLinearScale(d.poverty)-10)
    .attr("y", d => yLinearScale(d.healthcare)-20)
    // .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .html(function(d) {
        var blah = (`${d.abbr}`).toLowerCase();
        return (`<i class="mg map-us-${blah} mg-2x"></i>`);
      });

    // Step 5B: Append Text to Circles
    // ==============================
    graph.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .text(function(d) { return d.abbr; })
    .attr("x", function(d) {
        return xLinearScale(d.poverty);
      })
    .attr("y", function(d) {
        return yLinearScale(d.healthcare);
      })
    .attr("font-family", "arial")
    .attr("font-size", "11px")
    .attr("fill", "black");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      // .offset([80, -60])
      .html(function(d) {
        return (`<br>State:${d.state} <br>Healthcare_low:${d.healthcareLow} <br>Healthcare_high:${d.healthcareHigh}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    foreignGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  });
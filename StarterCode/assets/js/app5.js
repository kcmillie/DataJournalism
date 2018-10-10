// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) - 3, d3.max(data, d => d[chosenYAxis] + 3)])
        .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// new circles
function renderforeign(foreignGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {
  foreignGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis])-25)
    .attr("y", d => newYScale(d[chosenYAxis])-22);
  return foreignGroup;
}

function tipXLabel(chosenXAxis){
  if (chosenXAxis === "poverty") {
      var label = "In Poverty(%):";
  } else if (chosenXAxis === "age") {
      var label = "Age(Median):";
  } else {
      var label = "Household Income(Median): ";
  }
  return label;
}

function tipYLabel(chosenYAxis){
  if (chosenYAxis === "healthcare") {
      var label = "Lacks Healthcare (%):";
  } else if (chosenYAxis === "smokes") {
      var label = "Smokes(%):";
  } else {
      var label = "Obesity(%): ";
  }
  return label;
}

// function used for updating circles group with a transition to
// new circles
function renderLetters(lettersGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {
  lettersGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
  return lettersGroup;
}

// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(healthData) {


    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity
      data.abbr = data.abbr;
      // console.log(data.obesity)
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(healthData, chosenXAxis);

    var yLinearScale = yScale(healthData, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      // .attr("transform", `translate(0, 0)`)
      .call(leftAxis);

    var graph = chartGroup.append("g");

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = graph.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "12")
      .attr("opacity", ".8")
      .attr("class", "stateCircle");

    // Step 5: Create foreignobjects
    // ==============================
    var foreignGroup = graph.selectAll("foreignObject")
      .data(healthData)
      .enter()
      .append("foreignObject")
      .attr("x", d => xLinearScale(d[chosenXAxis])-25)
      .attr("y", d => yLinearScale(d[chosenYAxis])-22)
      .attr("opacity", ".5")
      .attr("class", "stateShape")
      .html(function(d) {
        var blah = (`${d.abbr}`).toLowerCase();
        return (`<i class="mg map-us-${blah} mg-3x"></i>`);
      });

    // Step 5B: Append Text to Circles
    // ==============================
    var lettersGroup = graph.selectAll("text")
      .data(healthData)
      .enter()
      .append("text")
      .text(function(d) { return d.abbr; })
      .attr("x", function(d) {
          return xLinearScale(d[chosenXAxis]);
        })
      .attr("y", function(d) {
          return yLinearScale(d[chosenYAxis]);
        })
      // .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("class", "stateText");

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty(%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age(Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income(Median)");

    // Create group for  2 y- axis labels
    var labelsYGroup = chartGroup.append("g");
    // .attr("transform", `translate(${width/2}, ${height + 20})`);

    // Create y axes labels
    var healthcareLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare(%)");

    var smokesLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes(%)");

    var obesityLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese(%)");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      // .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state} <br>${tipXLabel(chosenXAxis)} ${d[chosenXAxis]}<br>${tipYLabel(chosenYAxis)} ${d[chosenYAxis]}`);
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

    // x axis labels event listener
    labelsGroup.selectAll("text").on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //updates letters with new x values
        lettersGroup = renderLetters(lettersGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //updates states
        foreignGroup = renderforeign(foreignGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if(chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
    // console.log(healthData)
    labelsYGroup.selectAll("text").on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      // console.log(value)
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //updates states
        foreignGroup = renderforeign(foreignGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //updates letters with new x values
        lettersGroup = renderLetters(lettersGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if(chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
  });

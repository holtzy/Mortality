function plotLoli(){


// ======================= //
// DATA AND SVG AREAS
// ======================= //

// Get filtered data
data_filter = data_MRR.filter(function(d){ return d.mentalDis == "Any Disorder" & d.sex == "both"})

// set the dimensions and margins of the graph
var margin = {top: 40, right: 30, bottom: 100, left: 180},
    width = 810 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_loli")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



// ======================= //
// AXIS AND SCALES
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 20])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .style("text-anchor", "end");

// Add X axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top)
    .text("Mortality Rate Ratio");

// Y axis
var smallGap = 80
var bigGap = 300
var posYaxis = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300 ]
var y = d3.scalePoint()
  .range([0, height])
  .domain(bothCOD)
var yAxis = svg.append("g")
  .call(d3.axisLeft(y).tickSize(0))
yAxis.select(".domain").remove()
yAxis.selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 14)



// ======================= //
// BUILD BUTTON
// ======================= //

// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allDisorder)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button




// ======================= //
// LINES AND CIRCLES
// ======================= //

// Lines between CI?
var myLines = svg.selectAll("myline")
  .data(data_filter)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.MRR_left); })
    .attr("x2", function(d) { return x(d.MRR_right); })
    .attr("y1", function(d) { return y(d.COD); })
    .attr("y2", function(d) { return y(d.COD); })
    .attr("stroke", "grey")

// Circles
var myCircles = svg.append('g')
  .selectAll("mycircle")
  .data(data_filter)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { return y(d.COD); })
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")



// ======================= //
// INTERACTIVITY
// ======================= //

// Function that update the chart for a group
function updateChart(selectedGroup) {
  var selectedData = data_MRR.filter(function(d){ return d.mentalDis == selectedGroup & d.sex == "both"})
  myCircles
    .data(selectedData)
    .transition()
    .duration(1000)
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { return y(d.COD); })

  myLines
    .data(selectedData)
    .transition()
    .duration(1000)
    .attr("x1", function(d) { return x(d.MRR_left); })
    .attr("x2", function(d) { return x(d.MRR_right); })
    .attr("y1", function(d) { return y(d.COD); })
    .attr("y2", function(d) { return y(d.COD); })
  }

// Listen to the slider?
d3.select("#selectButton").on("change", function(d){
  selectedGroup = this.value
  updateChart(selectedGroup)
})



}

plotLoli()

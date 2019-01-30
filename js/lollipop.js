function plotLoli(){


// ======================= //
// DATA, SVG AREAS
// ======================= //

// Get filtered data
data_filter = data_MRR.filter(function(d){ return d.mentalDis == "Any Disorder" & d.sex == "both"})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_loli")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 20])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data_MRR.map(function(d) { return d.COD; }))
  .padding(1);
svg.append("g")
  .call(d3.axisLeft(y))

// Lines between CI?
svg.selectAll("myline")
  .data(data_filter)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.MRR_left); })
    .attr("x2", function(d) { return x(d.MRR_right); })
    .attr("y1", function(d) { return y(d.COD); })
    .attr("y2", function(d) { return y(d.COD); })
    .attr("stroke", "grey")

// Circles
svg.selectAll("mycircle")
  .data(data_filter)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { return y(d.COD); })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")



}

plotLoli()

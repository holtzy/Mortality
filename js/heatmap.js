function plotHeatmap(){



// ======================= //
// DATA, SVG AREAS
// ======================= //

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 130, left: 120},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = allCOD
var myVars = allDisorder



// ======================= //
// AXIS and SCALES
// ======================= //

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(0))
xAxis.selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
xAxis.select(".domain").remove()

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
var yAxis = svg.append("g")
  .call(d3.axisLeft(y).tickSize(0))
yAxis.selectAll("text")
  .style("font-size", "12px")
yAxis.select(".domain").remove();


// Build color scales
var myColorMRR = d3.scaleLinear()
  .range(["white", "#ED3A3B"])
  .domain([1,10])

var myColorLYL = d3.scaleSequential(d3.interpolatePuOr)
  .domain([-3,10])


console.log(data_MRR)
console.log(data_LYL_long)




// ======================= //
// SHAPES
// ======================= //


// Add squares for MRR
svg.selectAll()
    .data(data_MRR.filter(function(d){ return d.sex == "women" }))
    .enter()
    .append("rect")
      .attr("class", "MRR")
      .attr("x", function(d) { return x(d.COD) })
      .attr("y", function(d) { return y(d.mentalDis) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColorMRR(d.MRR)} )
      .attr("opacity", 0)

// Add squares for LYL
svg.selectAll()
    .data(data_LYL_long.filter(function(d){ return d.sex == "Females" }))
    .enter()
    .append("rect")
      .attr("class", "LYL")
      .attr("x", function(d) { return x(d.COD) })
      .attr("y", function(d) { return y(d.mentalDis) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { console.log(d) ; console.log(x(d.COD)) ; return myColorLYL(+d.LYL)} )
      .attr("opacity", 1)




}


// A function that shows MRR and hide LYL
function showMRR() {
  d3.selectAll(".MRR").transition().duration(1000).style("opacity",1)
  d3.selectAll(".LYL").transition().duration(1000).style("opacity",0)
}
function showLYL() {
  d3.selectAll(".MRR").transition().duration(1000).style("opacity",0)
  d3.selectAll(".LYL").transition().duration(1000).style("opacity",1)
}

d3.selectAll("input").on("change", function(){
    console.log(this.value)
});


plotHeatmap()
showMRR()

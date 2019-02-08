function plotStackedbar(){


// ======================= //
// DATA, SVG AREAS
// ======================= //

// Get filtered data
data_filtered = data_LYL.filter(function(d){ return d.sex == "Males" })
// Order data


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_stackedBar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// List of subgroups = Cause of Death
var subgroups = allCOD

// List of groups = List of Mental Disorder
var groups = allDisorder

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(d3.schemeSet3);




// ======================= //
// AXIS
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([-3, 15])
  .range([0, width])
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSizeOuter(0));

// Add Y axis
var y = d3.scaleBand()
    .domain(groups)
    .range([ height, 0 ])
    .padding([0.4])
svg.append("g")
  .call(d3.axisLeft(y));




// ======================= //
// BARS
// ======================= //

//stack the data? --> stack per subgroup
var stackedData = d3.stack()
  .keys(subgroups)
  .offset(d3.stackOffsetDiverging)
  (data_filtered)

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.mentalDis) } )
      .attr("height", y.bandwidth())
      .attr("x", function(d) {  return x(d[0]); })
      .attr("width", function(d) { return Math.abs(x(d[1]) - x(d[0])); })
      .style("border-radius", 20)

}



plotStackedbar()

function plotLine(){


// ======================= //
// DATA, SVG AREAS
// ======================= //

// Get filtered data
data_filter = data_MRRage.filter(function(d){ return d.dx2 == "Any Disorder" & d.cod_label == "All Causes" & d.sex2 == "Males" & d.specific > 15})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 460 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgLeft = d3.select("#my_MR")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
var svgRight = d3.select("#my_MRR")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



// ======================= //
// X and Y AXIS AND SCALES
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([5, d3.max(data_filter, function(d) { return +d.specific; }) ])
  .range([ 0, width ]);
svgLeft.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
svgRight.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add X axis labels:
svgLeft.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 30)
    .text("Age (in years)");
svgRight.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 30)
    .text("Age (in years)");

// Left: Add Y axis and scales
var yLeft = d3.scaleLog()
  .domain([1, 500000])
  .range([ height, 0 ]);
svgLeft.append("g")
  .call(d3.axisLeft(yLeft).ticks(5, ",").tickSizeOuter(0))

// Left Add Y axis labels:
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 10)
    .text("Mortality rates")
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 30)
    .text("per 100,000 person-years")
    .style("opacity", ".6")
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 50)
    .text("(95% CI)")
    .style("opacity", ".6")


// Right: Add Y axis and scale
var yRight = d3.scaleLinear()
  .domain([0, 13])
  .range([ height, 0 ]);
svgRight.append("g")
  .call(d3.axisLeft(yRight).ticks(5).tickFormat(function(d) { return d + "%"; }).tickSizeOuter(0))

// Left Add Y axis labels:
svgRight.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 10)
    .text("Mortality rate ratio")
svgRight.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 30)
    .text("(95% CI)")
    .style("opacity", ".6")


// Add legend
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 270)
    .attr("y", 350)
    .style("fill", "steelblue")
    .text("No diagnosis")
    .style("alignment-baseline", "middle")
svgLeft.append("line")
    .attr("x1", 230)
    .attr("x2", 260)
    .attr("y1", 350)
    .attr("y2", 350)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .style("stroke-dasharray", ("3, 3"))  // <== This line here!!
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 270)
    .attr("y", 320)
    .style("fill", "steelblue")
    .text("Mental disorder")
    .style("alignment-baseline", "middle")
svgLeft.append("line")
    .attr("x1", 230)
    .attr("x2", 260)
    .attr("y1", 320)
    .attr("y2", 320)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)





// ======================= //
// CURVES OF LEFT AND RIGHT
// ======================= //

// Add the diagnosed line
var diagnosedLine = svgLeft.append("path")
  .datum( data_filter )
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.specific) })
    .y(function(d) { return yLeft(d.diagnosed) })
    )

// Add the UNdiagnosed line
svgLeft.append("path")
  .datum( data_filter )
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .style("stroke-dasharray", ("3, 3"))  // <== This line here!!
  .attr("d", d3.line()
    .x(function(d) { return x(d.specific) })
    .y(function(d) { return yLeft(d.undiagnosed) })
    )

// Add confindence interval
svgRight.append("path")
  .datum( data_filter )
  .attr("fill", "#cce5df")
  .attr("stroke", "none")
  .attr("stroke-width", 1.5)
  .attr("d", d3.area()
    .x(function(d) { return x(d.specific) })
    .y0(function(d) { return yRight(d.left) })
    .y1(function(d) { return yRight(d.right) })
    )

// Add the diagnosed line
svgRight.append("path")
  .datum( data_filter )
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.specific) })
    .y(function(d) { return yRight(d.irr) })
    )







// ======================= //
// ADD THE ANNOTATION WHEN HOVER
// ======================= //

// This allows to find the closest X index of the mouse:
var bisect = d3.bisector(function(d) { return d.specific; }).left;

// Create the circle that travels along the curve of right chart
var focusRight = svgRight.append('g')
  .append('circle')
    .style("fill", "none")
    .attr("stroke", "black")
    .attr('r', 8.5)
    .style("opacity", 0)

// Create the text along the curve of left chart
var textRight = svgRight.append('g')
  .append('text')
    .style("fill", "black")
    .style("opacity", 0)
    .attr("text-anchor", "middle")

// Create the circle that travels along the curve of left chart
var focusLeftTop = svgLeft.append('g')
  .append('circle')
    .style("fill", "black")
    .attr('r', 3.5)
    .style("opacity", 0)

// Create the text along the curve of left chart
var textLeftTop = svgLeft.append('g')
  .append('text')
    .style("fill", "black")
    .style("opacity", 0)
    .attr("text-anchor", "end")

// Create the circle that travels along the curve of left chart
var focusLeftBottom = svgLeft.append('g')
  .append('circle')
    .style("fill", "black")
    .attr('r', 3.5)
    .style("opacity", 0)

// Create the text along the curve of left chart
var textLeftBottom = svgLeft.append('g')
  .append('text')
    .style("fill", "black")
    .style("opacity", 0)
    .attr("text-anchor", "start")

// Create the Line that travels along both curves of left chart
var focusLeftLine = svgLeft.append('g')
  .append('line')
    .style("stroke", "black")
    .style("opacity", 0)

// Create 2 rect on top of each of the svg areas: this rectangle recovers mouse position
svgRight.append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

svgLeft.append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
  focusRight.style("opacity", 1)
  focusLeftTop.style("opacity", 1)
  focusLeftBottom.style("opacity", 1)
  focusLeftLine.style("opacity", 1)
  textLeftTop.style("opacity", 1)
  textLeftBottom.style("opacity", 1)
  textRight.style("opacity",1)
}

function mousemove() {
  // recover coordinate we need
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisect(data_filter, x0, 1);
  selectedData = data_filter[i]
  focusRight
    .attr("cx", x(selectedData.specific))
    .attr("cy", yRight(selectedData.irr))
  textRight
    .text(Math.round(selectedData.irr)+" %")
    .attr("x", function(){ if(selectedData.specific<35){
        return x(selectedData.specific)-25
      }else{
        return x(selectedData.specific)+25
    }})
    .attr("y", yRight(selectedData.irr))
  focusLeftTop
    .attr("cx", x(selectedData.specific))
    .attr("cy", yLeft(selectedData.undiagnosed))
  focusLeftBottom
    .attr("cx", x(selectedData.specific))
    .attr("cy", yLeft(selectedData.diagnosed))
  focusLeftLine
    .attr("x1", x(selectedData.specific))
    .attr("x2", x(selectedData.specific))
    .attr("y1", yLeft(selectedData.undiagnosed))
    .attr("y2", yLeft(selectedData.diagnosed))
  textLeftTop
    .text(Math.round(selectedData.diagnosed))
    .attr("x",x(selectedData.specific)-10)
    .attr("y", yLeft(selectedData.diagnosed))
  textLeftBottom
    .text(Math.round(selectedData.undiagnosed))
    .attr("x",x(selectedData.specific)+10)
    .attr("y", yLeft(selectedData.undiagnosed))
}
function mouseout() {
  focusRight.style("opacity", 0)
  focusLeftTop.style("opacity", 0)
  focusLeftBottom.style("opacity", 0)
  focusLeftLine.style("opacity", 0)
  textLeftTop.style("opacity", 0)
  textLeftBottom.style("opacity", 0)
  textRight.style("opacity",0)
}






// ======================= //
// SHOW 2 LINES FOR SEX IF BUTTON IS CLICKED
// ======================= //

// A function to switch to complete color scale
var showSexLinechartFunction = function(){
  diagnosedLine
    .transition()
    .duration(1000)
    .style("opacity",0)
};

document.getElementById("showSexLinechart").onclick = showSexLinechartFunction;






}
plotLine()

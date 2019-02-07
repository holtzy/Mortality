function plotHeatmap(){



// ======================= //
// DATA, SVG AREAS
// ======================= //

// set the dimensions and margins of the graph
var margin = {top: 30, right: 80, bottom: 130, left: 160},
  width = 660 - margin.left - margin.right,
  height = 540 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = bothCOD
var myVars = allDisorder



// ======================= //
// AXIS and SCALES
// ======================= //

// A scale to add padding between groups
var gap = 20
var gaps = [0, gap, gap, gap, gap, gap*2, gap*2, gap*2, gap*2, gap*2, gap*2, gap*2, gap*2, gap*2 ]
var myPadding = d3.scaleOrdinal()
  .domain(myGroups)
  .range(gaps);

// Build X scales:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);

// add the X Labels
var xLabels = svg
  .selectAll("Xlabels")
  .data(bothCOD)
  .enter()
  .append("text")
    .text(function(d){ return d})
    .attr("x", 0)
    .attr("y", 0)
    .style("text-anchor", "end")
    .style("font-size", 14)
    .style("fill", 'grey')
    .attr("transform", function(d){ return( "translate(" + (x(d) + myPadding(d) + 18) + "," + (height+11) + ")rotate(-45)")})
    .attr('class', function(d,i){ cod = bothCOD[i] ; if( typeCOD.includes(cod)){return 'myMainLabel'} })

// Custom labels of main groups
svg.selectAll('.myMainLabel')
    .style("font-size", 16)
    .style("fill", 'black')
    .attr('x', -10)

// Build Y scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
var yAxis = svg.append("g")
  .call(d3.axisLeft(y).tickSize(0))
yAxis.selectAll("text")
    .style("font-size", 14)
    .style("fill", 'grey')
yAxis.select(".domain").remove();



// Build color scales
var myColorMRR = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0,10])

var myColorLYL = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([-3,10])







// ======================= //
// TOOLTIP
// ======================= //

// create a tooltip
var tooltip = d3.select("#my_heatmap")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("font-size", "16px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 1)
  tooltip
      .html("<span style='color:grey'>M. Disorder: </span>" + d.mentalDis + "<br>" + "<span style='color:grey'>Cause of death: </span>" + d.COD + "<br>" + "MRR: " + Math.round(d.MRR*100)/100 + " [" + Math.round(d.MRR_left*100)/100 + "-" + Math.round(d.MRR_right*100)/100 + "]") // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
      .style("top", (event.pageY)+"px")
      .style("left",(event.pageX+20)+"px")
}
var mousemove = function(d) {
  tooltip
    .style("top", (event.pageY)+"px")
    .style("left",(event.pageX+20)+"px")
}
var mouseleave = function(d) {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}



// ======================= //
// SHAPES
// ======================= //

// Prepare data
var data_MRR_filter = data_MRR.filter(function(d){ return d.sex == "women" })
var data_LYL_filter = data_LYL_long.filter(function(d){ return d.sex == "women" })

// Add squares for MRR
svg.selectAll()
    .data(data_MRR_filter)
    .enter()
    .append("rect")
      .attr("class", "MRR")
      .attr("x", function(d) { return x(d.COD)+myPadding(d.COD) })
      .attr("y", function(d) { return y(d.mentalDis) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColorMRR(d.MRR)} )
      .attr("opacity", 1)
      .style("stroke-width", 1)
      .style("stroke", "black")
      .style("opacity", 0.8)
      .attr("rx", 0)
      .attr("ry", 0)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

// Add squares for LYL
svg.selectAll()
    .data(data_LYL_filter)
    .enter()
    .append("rect")
      .attr("class", "LYL")
      .attr("x", function(d) { return x(d.COD)+myPadding(d.COD) })
      .attr("y", function(d) { return y(d.mentalDis) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColorLYL(+d.LYL)} )
      .attr("opacity", 0)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

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

// An event listener to the radio button
d3.select("#form").on("click", function(){
    var radioValue = $("input[name='controlHeatmapType']:active").val();
    if(radioValue == "MRR"){
      showMRR()
    } else {
      showLYL()
    }

})


plotHeatmap()

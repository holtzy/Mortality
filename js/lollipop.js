function plotLoli(){


// ======================= //
// DATA AND SVG AREAS
// ======================= //

// Get filtered data
data_filter = data_MRR.filter(function(d){ return d.mentalDis == "Any Disorder" & d.sex == "both"})

// set the dimensions and margins of the graph
var margin = {top: 70, right: 30, bottom: 100, left: 180},
    width = 810 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;

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

// Y 'axis': prepare position of each group
var smallGap = 30
var bigGap = 60
var posYaxis = [0, bigGap, bigGap+smallGap, bigGap+smallGap*2, bigGap+smallGap*3, bigGap*2+smallGap*3, bigGap*2+smallGap*4, bigGap*2+smallGap*5, bigGap*2+smallGap*6, bigGap*2+smallGap*7, bigGap*2+smallGap*8, bigGap*2+smallGap*9, bigGap*2+smallGap*10, bigGap*2+smallGap*11 ]

// Add the labels
var myYLabels = svg.selectAll("myYLabels")
  .data(posYaxis)
  .enter()
  .append("text")
    .attr('x', -20)
    .attr('y', function(d,i){return posYaxis[i]})
    .text( function(d,i){return bothCOD[i]})
    .attr("text-anchor", "end")
    .style("font-size", 14)
    .style("fill", 'grey')
    .attr('class', function(d,i){ cod = bothCOD[i] ; if( typeCOD.includes(cod)){return 'myMainLabel'} })
    .style('alignment-baseline', 'middle')

// Custom labels of main groups
svg.selectAll('.myMainLabel')
    .style("font-size", 16)
    .style("fill", 'black')
    .attr('x', 0)



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
    .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("stroke", "grey")
    .style('opacity', function(d,i){ if(typeCOD.includes(d.COD)){opacity = 1}else{opacity = .6} ; return opacity  })

// Circles
var myCircles = svg.append('g')
  .selectAll("mycircle")
  .data(data_filter)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr('r', function(d,i){ if(typeCOD.includes(d.COD)){size = 9}else{size=6} ; return size  })
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
    .style('opacity', function(d,i){ if(typeCOD.includes(d.COD)){opacity = 1}else{opacity = .6} ; return opacity  })

// Lines from baseline
var myBaselines = svg.selectAll("myBaseline")
  .data(data_filter)
  .enter()
  .append("line")
    .attr("x1", function(d) { return 10; })
    .attr("x2", function(d) { return x(d.MRR); })
    .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("stroke", "grey")
    .style('opacity', function(d,i){ if(typeCOD.includes(d.COD)){opacity = 1}else{opacity = 0} ; return opacity  })
    .style("stroke-dasharray", ("3, 3"))



// ======================= //
// INTERACTIVITY
// ======================= //

// Function that update the chart for a disorder
function updateChart(selectedGroup) {
  var selectedData = data_MRR.filter(function(d){ return d.mentalDis == selectedGroup })
  myCircles
    .data(selectedData)
    .transition()
    .duration(1000)
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })

  myLines
    .data(selectedData)
    .transition()
    .duration(1000)
    .attr("x1", function(d) { return x(d.MRR_left); })
    .attr("x2", function(d) { return x(d.MRR_right); })
    .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })

  myBaselines
    .data(selectedData)
    .transition()
    .duration(1000)
    .attr("x1", function(d) { return 10; })
    .attr("x2", function(d) { return x(d.MRR); })
    .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })
    .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] })

  }

// Listen to the mental disorder selection button
d3.select("#selectButton").on("change", function(d){
  selectedGroup = this.value
  updateChart(selectedGroup)
})

// Function that update the chart to show or hide sex?


}

plotLoli()

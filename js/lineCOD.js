function plotLineFocus(){


// ======================= //
// DATA, SVG AREAS, GENERAL STUFF
// ======================= //

// Get filtered data
data_codSpecific = data_MRRage.filter(function(d){ return d.type == "CODspecific" & d.specific > 15 & d.specific <= 90})

// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 50, left: 20},
    width = 340 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgLeft = d3.select("#my_MR_focusCODLeft")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("overflow", "visible")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
var svgCenter = d3.select("#my_MR_focusCODRight")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("overflow", "visible")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
var svgRight = d3.select("#my_MRR_focusCOD")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("overflow", "visible")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");






// ======================= //
// X AXIS
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([5, 100 ])
  .range([ 0, width ]);
svgLeft.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
svgCenter.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
svgRight.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add X axis labels:
svgRight.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 30)
    .text("Age (in years)");





// ======================= //
// Y AXIS
// ======================= //

// Left: Add Y axis and scales
var yLeft = d3.scaleLog()
  .domain([1, 500000])
  .range([ height, 0 ]);
svgLeft.append("g")
  .call(d3.axisLeft(yLeft).ticks(5, ",").tickSizeOuter(0))
var yCenter = d3.scaleLog()
  .domain([1, 500000])
  .range([ height, 0 ]);
svgCenter.append("g")
  .call(d3.axisLeft(yLeft).ticks(5, ",").tickSizeOuter(0))


// Left Add Y axis labels:
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 10)
    .text("Natural Causes")
    .style("fill" , myColorCOD("Natural Causes"))
    .style("font-size", 17)
svgLeft.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 30)
    .text("Mortality rate")
    .style("opacity", ".6")

// Center Add Y axis labels:
svgCenter.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 10)
    .text("Unnatural Causes")
    .style("fill" , myColorCOD("Unnatural Causes"))
    .style("font-size", 17)
svgCenter.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 30)
    .text("Mortality rate")
    .style("opacity", ".6")

// Right: Add Y axis and scale
var yRight = d3.scaleLinear()
  .domain([0, 13])
  .range([ height, 0 ]);
svgRight.append("g")
  .call(d3.axisLeft(yRight).ticks(5).tickFormat(function(d) { return d ; }).tickSizeOuter(0))

// Left Add Y axis labels:
svgRight.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 10)
    .text("MRR")
svgRight.append("text")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 30)
    .text("(95% CI)")
    .style("opacity", ".6")




// ======================= //
// LEGEND
// ======================= //

svgLeft
  .append("text")
  .text("Mental")
  .attr("x", 272)
  .attr("y", 38)
  .attr("fill", myColorCOD("Natural"))
  .style("font-size", 12)
svgLeft
  .append("text")
  .text("disorder")
  .attr("x", 272)
  .attr("y", 55)
  .attr("fill", myColorCOD("Natural"))
  .style("font-size", 12)

svgLeft
  .append("text")
  .text("No mental")
  .attr("x", 272)
  .attr("y", 80)
  .attr("fill", myColorCOD("Natural"))
  .attr("opacity", .8)
  .style("font-size", 12)
svgLeft
  .append("text")
  .text("disorder")
  .attr("x", 272)
  .attr("y", 97)
  .attr("fill", myColorCOD("Natural"))
  .attr("opacity", .8)
  .style("font-size", 12)

svgCenter
  .append("text")
  .text("Mental")
  .attr("x", 272)
  .attr("y", 111)
  .attr("fill", myColorCOD("Unnatural"))
  .style("font-size", 12)
svgCenter
  .append("text")
  .text("disorder")
  .attr("x", 272)
  .attr("y", 128)
  .attr("fill", myColorCOD("Unnatural"))
  .style("font-size", 12)
svgCenter
  .append("text")
  .text("No mental")
  .attr("x", 272)
  .attr("y", 148)
  .attr("fill", myColorCOD("Unnatural"))
  .attr("opacity", .8)
  .style("font-size", 12)
svgCenter
  .append("text")
  .text("disorder")
  .attr("x", 272)
  .attr("y", 165)
  .attr("fill", myColorCOD("Unnatural"))
  .attr("opacity", .8)
  .style("font-size", 12)






// ======================= //
// CURVES BOTH SIDES
// ======================= //

function updateChart(data){

  // Nest the data = group per sex and COD
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d){ return d.cod_label;})
    .entries(data);

  // Add the diagnosed line LEFT
  var diagnosedLineLeft = svgLeft
      .selectAll(".lineDiag")
      .data(sumstat.filter(function(d){ return d.key=="Natural Causes"}))
  diagnosedLineLeft
      .enter()
      .append("path")
      .merge(diagnosedLineLeft)
      .transition()
      .duration(1000)
        .attr("class", "lineDiag")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorCOD(d.key) })
        .attr("stroke-width", 1.5)
        .style("opacity", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.specific) })
            .y(function(d) { return yLeft(d.diagnosed) })
            (d.values)
        })

  // Add the diagnosed line CENTER
  var diagnosedLineCenter = svgCenter
      .selectAll(".lineDiag")
      .data(sumstat.filter(function(d){ return d.key=="Unnatural Causes"}))
  diagnosedLineCenter
      .enter()
      .append("path")
      .merge(diagnosedLineCenter)
      .transition()
      .duration(1000)
        .attr("class", "lineDiag")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorCOD(d.key) })
        .attr("stroke-width", 1.5)
        .style("opacity", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.specific) })
            .y(function(d) { return yLeft(d.diagnosed) })
            (d.values)
        })

  // Add the UNdiagnosed line LEFT
  var undiagnosedLineLeft = svgLeft
      .selectAll(".lineUndiag")
      .data(sumstat.filter(function(d){ return d.key=="Natural Causes"}))
  undiagnosedLineLeft
      .enter()
      .append("path")
      .merge(undiagnosedLineLeft)
      .transition()
      .duration(1000)
        .attr("class", "lineUndiag")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorCOD(d.key) })
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width", 1.5)
        .style("opacity", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.specific) })
            .y(function(d) { return yLeft(d.undiagnosed) })
            (d.values)
        })

  // Add the UNdiagnosed line CENTER
  var undiagnosedLineCenter = svgCenter
      .selectAll(".lineUndiag")
      .data(sumstat.filter(function(d){ return d.key=="Unnatural Causes"}))
  undiagnosedLineCenter
      .enter()
      .append("path")
      .merge(undiagnosedLineCenter)
      .transition()
      .duration(1000)
        .attr("class", "lineUndiag")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorCOD(d.key) })
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width", 1.5)
        .style("opacity", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.specific) })
            .y(function(d) { return yLeft(d.undiagnosed) })
            (d.values)
        })


  // Add MRR confidence interval
  var confidenceLine = svgRight
      .selectAll(".lineConfidence")
      .data(sumstat)
  confidenceLine
      .enter()
      .append("path")
      .merge(confidenceLine)
      .style("opacity", .5)
      .transition()
      .duration(1000)
        .attr("class", "lineConfidence")
        .attr("fill", function(d){ return myColorCOD(d.key) })
        .attr("stroke", "none")
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.area()
          .x(function(d) { return x(d.specific) })
          .y0(function(d) { return yRight(d.left) })
          .y1(function(d) { return yRight(d.right) })
          (d.values)
        })


  // Add the MRR line
  var mrrLine = svgRight
      .selectAll(".lineMrr")
      .data(sumstat)
  mrrLine
      .enter()
      .append("path")
      .merge(mrrLine)
      .transition()
      .duration(1000)
        .attr("class", "lineMrr")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorCOD(d.key) })
        .attr("stroke-width", 1.5)
        .style("opacity", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.specific) })
            .y(function(d) { return yRight(d.irr) })
            (d.values)
        })






  // ======================= //
  // ANNOTATION ON HOVER
  // ======================= //

  // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function(d) { return d.specific; }).left;

  // Create the circle and texts that travels along the curves of right chart
  var focusRightMales = svgRight.append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 0)
  var textRightMales = svgRight.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "middle")
  var focusRightFemales = svgRight.append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 0)
  var textRightFemales = svgRight.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "middle")
  var textRightAge = svgRight.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "middle")


  // LEFT CHART: text and circles
  var focusLeftTop = svgLeft.append('g')
    .append('circle')
      .style("fill", "black")
      .attr('r', 3.5)
      .style("opacity", 0)
  var textLeftTop = svgLeft.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "end")
  var focusLeftBottom = svgLeft.append('g')
    .append('circle')
      .style("fill", "black")
      .attr('r', 3.5)
      .style("opacity", 0)
  var textLeftBottom = svgLeft.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "start")
  var focusLeftLine = svgLeft.append('g')
    .append('line')
      .style("stroke", "black")
      .style("opacity", 0)
  // and the age
  var textLeftAge = svgLeft.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "middle")

  // CENTER CHART: text and circles
  var focusCenterTop = svgCenter.append('g')
    .append('circle')
      .style("fill", "black")
      .attr('r', 3.5)
      .style("opacity", 0)
  var textCenterTop = svgCenter.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "end")
  var focusCenterBottom = svgCenter.append('g')
    .append('circle')
      .style("fill", "black")
      .attr('r', 3.5)
      .style("opacity", 0)
  var textCenterBottom = svgCenter.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "start")
  var focusCenterLine = svgCenter.append('g')
    .append('line')
      .style("stroke", "black")
      .style("opacity", 0)
  // and the age
  var textCenterAge = svgCenter.append('g')
    .append('text')
      .style("fill", "black")
      .style("opacity", 0)
      .attr("text-anchor", "middle")

  // Create 3 rects on top of each of the svg areas: this rectangle recovers mouse position
  svgRight.append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
  svgCenter.append('rect')
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
    focusRightMales.style("opacity", 1)
    textRightMales.style("opacity",1)
    focusRightFemales.style("opacity", 1)
    textRightFemales.style("opacity",1)
    textRightAge.style("opacity",1)

    focusLeftTop.style("opacity", 1)
    focusLeftBottom.style("opacity", 1)
    focusLeftLine.style("opacity", 1)
    textLeftTop.style("opacity", 1)
    textLeftBottom.style("opacity", 1)
    textLeftAge.style("opacity",1)

    focusCenterTop.style("opacity", 1)
    focusCenterBottom.style("opacity", 1)
    focusCenterLine.style("opacity", 1)
    textCenterTop.style("opacity", 1)
    textCenterBottom.style("opacity", 1)
    textCenterAge.style("opacity",1)
  }

  function mousemove() {
    // recover the X coordinate we need and the corresponding age
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);
    var age = data[i].specific

    // Find the corresponding age
    selectedDataMales = data_codSpecific.filter(function(d){ return (d.cod_label=="Unnatural Causes"  && d.specific==age) })[0]
    selectedDataFemales = data_codSpecific.filter(function(d){ return (d.cod_label=="Natural Causes"  && d.specific==age) })[0]

    focusRightMales
      .attr("cx", x(selectedDataMales.specific))
      .attr("cy", yRight(selectedDataMales.irr))
    textRightMales
      .text((Math.round(selectedDataMales.irr*10)/10).toFixed(1))
      .attr("x", function(){ if(selectedDataMales.specific<35){
          return x(selectedDataMales.specific)-25
        }else{
          return x(selectedDataMales.specific)+25
      }})
      .attr("y", yRight(selectedDataMales.irr))

    focusRightFemales
      .attr("cx", x(selectedDataFemales.specific))
      .attr("cy", yRight(selectedDataFemales.irr))
    textRightFemales
      .text((Math.round(selectedDataFemales.irr*10)/10).toFixed(1))
      .attr("x", function(){ if(selectedDataFemales.specific<35){
          return x(selectedDataFemales.specific)+25
        }else{
          return x(selectedDataFemales.specific)-25
      }})
      .attr("y", yRight(selectedDataFemales.irr))
    textRightAge
      .text("Age: " + selectedDataFemales.specific)
      .attr("x", function(){ if(selectedDataFemales.specific<35){
          return x(selectedDataFemales.specific)+25
        }else{
          return x(selectedDataFemales.specific)-25
      }})
      .attr("y", function(){ min=Math.min(selectedDataFemales.irr, selectedDataMales.irr) ; return yRight(min)+30 }  )


    focusLeftTop
      .attr("cx", x(selectedDataFemales.specific))
      .attr("cy", yLeft(selectedDataFemales.undiagnosed))
    focusLeftBottom
      .attr("cx", x(selectedDataFemales.specific))
      .attr("cy", yLeft(selectedDataFemales.diagnosed))
    focusLeftLine
      .attr("x1", x(selectedDataFemales.specific))
      .attr("x2", x(selectedDataFemales.specific))
      .attr("y1", yLeft(selectedDataFemales.undiagnosed))
      .attr("y2", yLeft(selectedDataFemales.diagnosed))
    textLeftTop
      .text(Math.round(selectedDataFemales.diagnosed))
      .attr("x",x(selectedDataFemales.specific)-10)
      .attr("y", yLeft(selectedDataFemales.diagnosed))
    textLeftBottom
      .text(Math.round(selectedDataFemales.undiagnosed))
      .attr("x",x(selectedDataFemales.specific)+10)
      .attr("y", yLeft(selectedDataFemales.undiagnosed))
    textLeftAge
      .text("Age: " + selectedDataFemales.specific)
      .attr("x",x(selectedDataFemales.specific)+10)
      .attr("y", yLeft(selectedDataFemales.undiagnosed)+25 )

    focusCenterTop
      .attr("cx", x(selectedDataMales.specific))
      .attr("cy", yCenter(selectedDataMales.undiagnosed))
    focusCenterBottom
      .attr("cx", x(selectedDataMales.specific))
      .attr("cy", yCenter(selectedDataMales.diagnosed))
    focusCenterLine
      .attr("x1", x(selectedDataMales.specific))
      .attr("x2", x(selectedDataMales.specific))
      .attr("y1", yCenter(selectedDataMales.undiagnosed))
      .attr("y2", yCenter(selectedDataMales.diagnosed))
    textCenterTop
      .text(Math.round(selectedDataMales.diagnosed))
      .attr("x",x(selectedDataMales.specific)-10)
      .attr("y", yCenter(selectedDataMales.diagnosed))
    textCenterBottom
      .text(Math.round(selectedDataMales.undiagnosed))
      .attr("x",x(selectedDataMales.specific)+10)
      .attr("y", yCenter(selectedDataMales.undiagnosed))
    textCenterAge
      .text("Age: " + selectedDataMales.specific)
      .attr("x",x(selectedDataMales.specific)+10)
      .attr("y", yLeft(selectedDataMales.undiagnosed)+25 )
  }
  function mouseout() {
    focusRightMales.style("opacity", 0)
    textRightMales.style("opacity",0)
    focusRightFemales.style("opacity", 0)
    textRightFemales.style("opacity",0)
    textRightAge.style("opacity", 0)

    focusLeftTop.style("opacity", 0)
    focusLeftBottom.style("opacity", 0)
    focusLeftLine.style("opacity", 0)
    textLeftTop.style("opacity", 0)
    textLeftBottom.style("opacity", 0)
    textLeftAge.style("opacity", 0)

    focusCenterTop.style("opacity", 0)
    focusCenterBottom.style("opacity", 0)
    focusCenterLine.style("opacity", 0)
    textCenterTop.style("opacity", 0)
    textCenterBottom.style("opacity", 0)
    textCenterAge.style("opacity", 0)

  }

// Close the update chart function
}

// Initialise the chart
updateChart(data_codSpecific)





}
plotLineFocus()

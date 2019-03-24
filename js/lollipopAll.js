function plotLoliAll(){


// ======================= //
// DATA AND SVG AREAS
// ======================= //

// set the dimensions and margins of the graph
var margin = {top: 37, right: 10, bottom: 3, left: 20},
    width = 260 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;

// group the data: I want to draw one line per group
var data_filter = data_MRR.filter(function(d){ return d.sex == "both" })
var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  .key(function(d) { return d.mentalDis;})
  .entries(data_filter);

// What is the list of groups?
allKeys = sumstat.map(function(d){return d.key})

// append the svg object to the body of the page
var svg = d3.select("#my_loliAll")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("overflow", "visible")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")" )

// Add background
svg
    .append("rect")
      .attr("x",0)
      .attr("y",-16)
      .attr("width",width)
      .attr("height",height+16)
      .style("fill", "grey")
      .style("opacity", .1)

// Add titles to each subplot with disorder Name
svg
  .append("text")
  .attr("text-anchor", "start")
  .attr("y", -22)
  .attr("x", 0)
  .text(function(d){ return(d.key)})






// ======================= //
// X SCALE AND AXIS
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([1, 22])
  .range([ 0, width]);

// Add vertical lines
xTickPos = [5,10,15,20]
var verticalLines = svg.selectAll("xTicks")
  .data(xTickPos)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d); })
    .attr("x2", function(d) { return x(d); })
    .attr("y1", -20 )
    .attr("y2", height)
    .attr("stroke", "#F8F8F8")
    .attr("stroke-width", 2)

// Add the labels
var xAxisLabels = svg
  .filter(function(d){return (d.key=="Intellectual Disabilities" || d.key=="Developmental Disorders" || d.key == "Behavioral Disorders" || d.key == "Personality Disorders" ) })
  .selectAll("myXLabels")
  .data(xTickPos)
  .enter()
  .append("text")
    .attr('x', function(d){ return x(d) })
    .attr('y', height+12)
    .text( function(d){return d} )
    .attr("text-anchor", "center")
    .style("font-size", 9)
    .style("fill", 'grey')

// add Vert line value = 1
var vertLine1 = svg
  .append("line")
    .attr("x1", function(d) { return x(1); })
    .attr("x2", function(d) { return x(1); })
    .attr("y1", -10 )
    .attr("y2", height)
    .attr("stroke", "orange")
    .style("stroke-dasharray", ("8, 6"))

// ======================= //
// Y SCALE AND AXIS
// ======================= //

// Y 'axis': prepare position of each group
var smallGap = 13
var bigGap = 31
var posYaxis = [0, bigGap, bigGap+smallGap, bigGap+smallGap*2, bigGap+smallGap*3, bigGap*2+smallGap*3, bigGap*2+smallGap*4, bigGap*2+smallGap*5, bigGap*2+smallGap*6, bigGap*2+smallGap*7, bigGap*2+smallGap*8, bigGap*2+smallGap*9, bigGap*2+smallGap*10, bigGap*2+smallGap*11 ]

// Add the labels
var myYLabels = svg
  .filter(function(d){return (d.key=="Any Disorder" || d.key=="Mood Disorders" || d.key == "Intellectual Disabilities") })
  .selectAll("myYLabels")
  .data(posYaxis)
  .enter()
  .append("text")
    .attr('x', -10)
    .attr('y', function(d,i){return posYaxis[i]})
    .text( function(d,i){return bothCOD[i]})
    .attr("text-anchor", "end")
    .style("font-size", 9)
    .style("fill", 'grey')
    .attr('class', function(d,i){
      cod = bothCOD[i] ;
      cod_clean = cod.replace(/\s/g, '')
      if( typeCOD.includes(cod)){
        return 'yAxisLabel' + ' ' + 'myMainLabel'+ ' ' + cod_clean
      }else{
        return 'yAxisLabel' + ' ' + cod_clean
      }
    })
    .style('alignment-baseline', 'middle')

// Custom labels of main groups
svg.selectAll('.myMainLabel')
    .style("font-size", 13)
    .style("fill", 'black')
    .attr('x', -20)

// Scale to slightly modify sexes on the Y axis
var myPositionLolliSex = d3.scaleOrdinal()
  .domain(["both", "men", "women"])
  .range([0, -3, 3])





// ======================= //
// INTERACTIVITY
// ======================= //

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  // recover the class = the COD of the circle
  selectedClass = d3.select(this).attr("class")
  svg.selectAll(".yAxisLabel")
    .style("opacity",0)
  svg
    .selectAll("circle:not(." + selectedClass + ")")
    .classed('hideLollipop', true)
  svg
    .selectAll("."+selectedClass)
    .classed('highlightLollipop', true)
  }

// What happens when hover is over
var mouseleave = function(d) {
  svg.selectAll(".yAxisLabel")
    .style("opacity",1)
  svg
    .selectAll(".hideLollipop")
    .classed("hideLollipop", false)
  svg
    .selectAll(".highlightLollipop")
    .classed("highlightLollipop", false)
  }




// ======================= //
// SHAPES
// ======================= //

function updateChart() {

  // Recover the SEX option?
  selectedSexOption = $("input[name='controlLolliSexAll']:checked").val();

  // Create the filtered dataset
  var selectedData = data_MRR.filter(function(d){ return d.mentalDis == selectedMentalDisOption })
  if(selectedSexOption == "both"){
    selectedData = selectedData.filter(function(d){ return d.sex == "both" })
  }else{
    selectedData = selectedData.filter(function(d){ return d.sex != "both" })
  }
  
  // Log scale or Linear scale?
  selectedLogOption = $("input[name='controlLolliLogAll']:checked").val();
  if(selectedLogOption == "normal"){
    var x = d3.scaleLinear().range([ 0, width]).domain([0, 25]);
  }else{
    var x = d3.scaleLog().range([ 0, width]).domain([1, 25]);
  }

  // Update vertical bars
  verticalLines
    .transition()
    .duration(1000)
      .attr("x1", function(d) { return x(d); })
      .attr("x2", function(d) { return x(d); })

  // Update X axis labels
  xAxisLabels
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(d); })

  // update MRR=1 line
  vertLine1
    .transition()
    .duration(1000)
    .attr("x1", function(d) { return x(1); })
    .attr("x2", function(d) { return x(1); })

  // Update circle position
  var u = svg.selectAll('circle')
    .data( function(d){ return(d.values)} )
  u
    .enter()
    .append("circle")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
    .merge(u)
    .transition()
    .duration(1000)
      .attr("class", "myLolliCircles")
      .attr("cx", function(d) { return x(d.MRR); })
      .attr("cy", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
      .attr('r', function(d,i){ if(typeCOD.includes(d.COD)){size = 5}else{size=5} ; return size  })
      .style("fill", function(d){ return myColorCOD(d.COD) })
      .attr("class", function(d) { return d.COD.replace(/\s/g, ''); })
  u
    .exit()
    .transition()
    .duration(1000)
    .style("opacity",0)
    .remove()



  // Update Label position
  var w = svg.selectAll('.labelHover')
    .data( function(d){ return(d.values)} )
  w
    .enter()
    .append("text")
    .merge(w)
    .transition()
    .duration(1000)
      .text( function(d) { return Math.round(d.MRR*100)/100; } )
      .attr("x", function(d) { return x(d.MRR)+15; })
      .attr("y", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
      .attr("class", function(d) { return "labelHover " + d.COD.replace(/\s/g, ''); })
      .attr("alignment-baseline", "middle")
      .style("opacity", 0)
  w
    .exit()
    .transition()
    .duration(1000)
    .style("opacity",0)
    .remove()


  // // Add text annotation
  // svg
  //   .selectAll('myAnnot')
  //   .data( function(d){ return(d.values)} )
  //   .enter()
  //   .append("text")
  //     .text( function(d) { return Math.round(d.MRR*100)/100; } )
  //     .attr("x", function(d) { return x(d.MRR)+15; })
  //     .attr("y", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
  //     .attr("class", function(d) { return d.COD.replace(/\s/g, ''); })
  //     .attr("alignment-baseline", "middle")
  //     .style("opacity", 0)
  //


  // lolli horiz line position
  var v = svg.selectAll('.lolliHorizLine')
    .data( function(d){ return(d.values)} )
  v
    .enter()
    .append("line")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
    .merge(v)
    .transition()
    .duration(1000)
      .attr("class", function(d) { return d.COD.replace(/\s/g, ''); })
      .attr("x1", 0)
      .attr("x2", function(d) { return x(d.MRR); })
      .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
      .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
      .attr("class", function(d) { return "lolliHorizLine " + d.COD.replace(/\s/g, ''); })
      .attr("stroke", function(d) { return myColorCOD(d.COD) })
      .attr("stroke-width", 1)
      .style("opacity",.5)
  v
    .exit()
    .transition()
    .duration(1000)
    .style("opacity",0)
    .remove()

// close the update chart function
}




// ======================= //
// EVENT LISTENER
// ======================= //


// An event listener to the radio button for Lollipop SEX
d3.select("#controlLolliSexAll").on("change", updateChart)

// An event listener to the radio button for LOG choice
d3.select("#controlLolliLogAll").on("change", updateChart)

// Initialize
updateChart()







// Add an empty svg at the very end to make the total number of plot dividible by 4.
d3.select("#my_loliAll")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


// Close the plotLoliAll function
}

plotLoliAll()

function plotStackedbar(){


// ======================= //
// DATA, SVG AREAS
// ======================= //

// List of groups = List of Mental Disorder
var groups = ["Any Disorder","Intellectual Disabilities", "Substance Use", "Eating Disorders","Schizophrenia", "Developmental Disorders","Personality Disorders", "Behavioral Disorders", "Mood Disorders", "Neurotic Disorders", "Organic Disorders"]

// List of subgroups
var subgroups = ["Natural Causes","Unnatural Causes"]

console.log(data_LYL)
// Get filtered data
data_filtered = data_LYL.filter(function(d){ return d.sex == "Males" })
console.log(data_filtered)

// Order data following groups
var data_filtered = data_filtered.sort(function(a,b) {
    return groups.indexOf( a.mentalDis ) > groups.indexOf( b.mentalDis );
});

// set the dimensions and margins of the graph
var margin = {top: 100, right: 30, bottom: 90, left: 150},
    width = 600 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

// svg = for the stacked Barchart
var svg = d3.select("#my_stackedBar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// And this is for the barplot
var svgBar = d3.select("#my_stackedBarFocus")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");






// ======================= //
// X AXIS AND SCALE
// ======================= //

// Add X axis for stacked bar
var x = d3.scaleLinear()
  .domain([0, 15])
  .range([0, width])

// Add X axis for Barchart
var xBar = d3.scaleBand()
  .range([ 0, width ])
  .domain(bothCOD)
  .padding(0.2);
// svgBar.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(xBar))
//   .selectAll("text")
//     .attr("transform", "translate(-10,0)rotate(-45)")
//     .style("text-anchor", "end");




// ======================= //
// Y AXIS AND SCALE
// ======================= //

// Add Y axis
var y = d3.scaleBand()
    .domain(groups)
    .range([ 0, height ])
    .padding([0.4])

// A scale to add padding between groups
var gap = 30
var gaps = [0, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap ]
var myPadding = d3.scaleOrdinal()
  .domain(groups)
  .range(gaps);

// For barplot
var yBar = d3.scaleLinear()
  .domain([-10, 15])
  .range([height, 0])
// svgBar.append("g")
//     .call(d3.axisLeft(yBar))





// ======================= //
// TOOLTIP
// ======================= //

// create a tooltip
var tooltip = d3.select("#my_stackedBar")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("font-size", "16px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  tooltip
      .html(
        "Being diagnosed with " + d.data.mentalDis + " results in " + Math.round((d.data["Natural Causes"]+d.data["Unnatural Causes"])*10)/10 + " Years of life lost" + "<br>" +
        "<ul><li>" + Math.round(d.data["Natural Causes"]*10)/10 + " years are lost due to natural causes of death</li><li>" + Math.round(d.data["Unnatural Causes"]*10)/10 + " to Unnatural causes of death</li></ul>" +
        "Click the bar for more details"
        )
      // + " &rarr; " + subgroupName + "<br>" + "<span style='color:grey'>Here I could add a barplot to <br>efficiently compare the different cause<br> of death linked to this mental<br> disorder</span>")
      .style("opacity", 1)
}
var mousemove = function(d) {
  tooltip
      .style("top", d3.mouse(this)[1]-1600)
      .style("left", d3.mouse(this)[0])
}
var mouseleave = function(d) {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}


var mouseclick = function(d) {
  // Remove the empty tab on the left to put stack chart on the left
  d3.select("#myGhostCol")
    .style("display", "none")
  // Make bar chart visible
  d3.select("#my_stackedBarFocus")
    .style("display", "inline")
  // Build the barplot for the good group
  var subgroupName = d3.select(this.parentNode).datum().key;
  updateBar(d.data.mentalDis)
}



// ======================= //
// BARS OF STACKED BARPLOT
// ======================= //

//stack the data? --> stack per subgroup
var stackedData = d3.stack()
  .keys(subgroups)
  (data_filtered)

// Show the bars
var allBars = svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return myColorCOD(d.key); })
    .style("opacity", .7)
    .attr("stroke", function(d) { return myColorCOD(d.key); })
    .attr("class", function(d){return "myRect " + d.key.replace(/\s/g, '')})
allBars
  .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter()
    .append("rect")
      .attr("y", function(d) { return y(d.data.mentalDis)+myPadding(d.data.mentalDis) } )
      .attr("height", y.bandwidth())
      .attr("x", function(d) {  return x(d[0]); })
      .attr("width", function(d) { return Math.abs(x(d[1]) - x(d[0])); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", mouseclick)







// ======================= //
// BARS OF BARPLOT
// ======================= //

// Initialize the bars
svgBar
  .selectAll(".myBarsBarplot")
  .data(bothCOD)
    .enter()
    .append("rect")
      .attr("x", function(d) { return xBar(d); })
      .attr("height",0)
      .attr("y",yBar(0))
      .attr("class", "myBarsBarplot")
      .attr("fill", function(d){return myColorCOD(d)})
      .attr("rx", "2")
      .attr("ry", "2")
      .attr("width", xBar.bandwidth())

// Initialize the labels
svgBar
  .selectAll(".myLabelsBarplot")
  .data(bothCOD)
    .enter()
    .append("text")
      .attr("class", "myLabelsBarplot")
      .attr("x", 0)
      .attr("y", 0)
      .text(function(d){ return d })
      .attr('fill', function(d){
        if( typeCOD.includes(d)){
          return 'black'
        }else{
          return "grey"}
      })
      .attr('transform', function(d){ return 'translate( '+ (xBar(d)+xBar.bandwidth()/2) +' , '+ (yBar(0)+10) +'),'+ 'rotate(-90)' })
      .style("opacity", 1)

// Initialize the numbers
svgBar
  .selectAll(".myNumbersBarplot")
  .data(bothCOD)
    .enter()
    .append("text")
      .attr("class", "myNumbersBarplot")
      .attr("x", function(d){return (xBar(d)+xBar.bandwidth()/2) })
      .attr("y", yBar(0))
      .style("opacity", 1)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 10)



// update the barplot
function updateBar(mentalDis){

  // Get appropriatte data
  var dataBar = data_filtered
    .filter(function(d){return d.mentalDis == mentalDis})
    [0]
  dataBar
  console.log(dataBar)
  delete dataBar.sex
  delete dataBar.mentalDis

  // First step: reformatting the data
  var data_long = [];
  for (i in bothCOD) {
    data_long.push({
      COD: bothCOD[i],
      value: dataBar[bothCOD[i]],
    });
  }
  console.log(data_long)

  //Bars
  svgBar
    .selectAll(".myBarsBarplot")
    .data(data_long)
    .transition()
    .duration(1000)
      .attr("height", function(d) { return Math.abs(yBar(d.value) - yBar(0)) })
      .attr("y", function(d) {
              if (d.value >= 0){
                  return yBar(d.value);
              } else {
                  return yBar(0);
              }
      })

  // Labels
  svgBar
    .selectAll(".myLabelsBarplot")
    .data(data_long)
    .transition()
    .duration(1000)
      .style("opacity", 1)
      .attr("text-anchor", (d)=>{
        if( d.value>=0 ){ return("end") }else{ return("start")} })
      .attr('transform', (d)=>{
        if( d.value>=0 ){
          return 'translate( '+ (xBar(d.COD)+xBar.bandwidth()/2) +' , '+ (yBar(0)+10) +'),'+ 'rotate(-90)'
        }else{
          return 'translate( '+ (xBar(d.COD)+xBar.bandwidth()/2) +' , '+ (yBar(0)-10) +'),'+ 'rotate(-90)'
        }
      })
  //
  // // Numbers
  // svgBar
  //   .selectAll(".myNumbersBarplot")
  //   .data(data_long)
  //   .transition()
  //   .duration(1000)
  //     .style("opacity", 1)
  //     .attr("x", function(d){return (xBar(d.COD)+xBar.bandwidth()/2) })
  //     .attr("y",  (d)=>{
  //       if( d.value>=0 ){
  //         return yBar(d.value)-10
  //       }else{
  //         return yBar(d.value)+10
  //       }
  //     })
  //     .text(function(d){ return Math.round(d.value*10)/10 })
  //

}







// ======================= //
// LABELS ON TOP OF STACKED  BARS
// ======================= //

// Compute center of each bar of the first top group
var myMeans = []
for( i in  stackedData){
  inter = stackedData[i][0]
  mean = (inter[0] + inter[1]) / 2
  myMeans.push(mean)
}

// Add label
var topLabels = svg.selectAll("topLabels")
  .data(myMeans)
  .enter()
  .append("text")
    .attr("x", 0)
    .text(function(d,i){ grp=subgroups[i] ; return(grp)})
    .attr("y", 0)
    .style("fill", function(d,i){ grp=subgroups[i] ; return(myColorCOD(grp))})
    .style("font-size",12)
    .style("text-anchor", "start")
    .attr('transform', (d)=>{
          return 'translate( '+x(d)+' , '+0+'),'+ 'rotate(-45)';})
    .style("opacity", 1)





// ======================= //
// X AXIS
// ======================= //

xTickPos = [0,3,6,9,12]

// Vertical lines
svg.selectAll("xTicks")
  .data(xTickPos)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d); })
    .attr("x2", function(d) { return x(d); })
    .attr("y1", 0 )
    .attr("y2", height+30)
    .attr("stroke", "#B0B0B0")
    .attr("stroke-width", 1)

// Special separation for the 0
svg
  .append("line")
    .attr("x1", x(0) )
    .attr("x2", x(0) )
    .attr("y1", 0 )
    .attr("y2", height+30)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .style("stroke-dasharray", ("3, 3"))  // <== This line here!!

// Labels
svg.selectAll("xLabels")
  .data(xTickPos)
  .enter()
  .append("text")
    .attr("x", function(d) { return x(d); })
    .text(function(d){ return d} )
    .attr("y", height+30+12)
    .style("fill", "#B0B0B0")
    .style("font-size",12)
    .style("text-anchor", "middle")

// Title
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width-70)
    .attr("y", height + 30+32)
    .text("Life Years Lost (LYL)");





`
`
// ======================= //
// Y LABELS ON LEFT SIDE
// ======================= //

// Add label
svg.selectAll("leftLabels")
  .data(groups)
  .enter()
  .append("text")
    .attr("x", -20)
    .attr("y", function(d){return y(d) + myPadding(d) + 12})
    .text(function(d){ return d })
    .style("fill", "grey")
    .style("font-size",14)
    .style("text-anchor", "end")




// Close chart function
}

plotStackedbar()

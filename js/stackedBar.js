function plotStackedbar(){


// ======================= //
// DATA, SVG AREAS
// ======================= //

// List of groups = List of Mental Disorder
var groups = ["Any Disorder","Intellectual Disabilities", "Substance Use", "Eating Disorders","Schizophrenia", "Developmental Disorders","Personality Disorders", "Behavioral Disorders", "Mood Disorders", "Neurotic Disorders", "Organic Disorders"]

// List of subgroups
var subgroups = ["Natural Causes","Unnatural Causes"]

// Get filtered data
data_filtered = data_LYL.filter(function(d){ return d.sex == "Males" })

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
// X axis
var xBar = d3.scaleBand()
  .range([ 0, width ])
  .domain(bothCOD)
  .padding(0.2);
svgBar.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xBar))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");




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
  .domain([-3, 15])
  .range([height, 0])
svgBar.append("g")
    .call(d3.axisLeft(yBar))





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
  // var subgroupName = d3.select(this.parentNode).datum().key;
  // tooltip
  //     .html(d.data.mentalDis + " &rarr; " + subgroupName + "<br>" + "<span style='color:grey'>Here I could add a barplot to <br>efficiently compare the different cause<br> of death linked to this mental<br> disorder</span>")
  //     .style("top", (event.pageY)+"px")
  //     .style("left",(event.pageX+20)+"px")
  // tooltip
  //   .transition()
  //   .duration(200)
  //   .style("opacity", 1)
  // // And color of the rect
  // d3.selectAll(".myRect").style("opacity", 0.2)
  // d3.selectAll("."+subgroupName.replace(/\s/g, '')).style("opacity", 1)
}
var mousemove = function(d) {
  // tooltip
  //   .style("top", (event.pageY)+"px")
  //   .style("left",(event.pageX+20)+"px")
}
var mouseleave = function(d) {
  // tooltip
  //   .transition()
  //   .duration(200)
  //   .style("opacity", 0)
  // d3.selectAll(".myRect").style("opacity",0.8)
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







// ======================= //
// BARS OF BARPLOT
// ======================= //

// Get appropriatte data
var dataBar = data_filtered
  .filter(function(d){return d.mentalDis == "Any Disorder"})
  [0]
delete dataBar.sex
delete dataBar.mentalDis

// First step: reformatting the data
var data_long = [];
for (prop in dataBar) {
  data_long.push({
    COD: prop,
    value: dataBar[prop],
  });
}

// Bars
svgBar.selectAll("myBar")
  .data(data_long)
  .enter()
  .append("rect")
    .attr("x", function(d) { return xBar(d.COD); })
    .attr("width", xBar.bandwidth())
    .attr("height", function(d) { return Math.abs(yBar(d.value) - yBar(0)) })
    .attr("y", function(d) {
            if (d.value > 0){
                return yBar(d.value);
            } else {
                return yBar(0);
            }
    })
    .attr("fill", "#69b3a2")








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

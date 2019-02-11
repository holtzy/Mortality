function plotStackedbar(){

// IDEAS
// color palette = one for natural, one for unatural, one for neoplasm
// toggle natural/unatural or list of diseases.
// Hover: show tooltip with barplot to see ranking
// Click: reorder bars to see vertical ranking
// order general bars
// Y scale: any disorder should be separated






// ======================= //
// DATA, SVG AREAS
// ======================= //

// List of groups = List of Mental Disorder
var groups = ["Any Disorder","Intellectual Disabilities", "Substance Use", "Eating Disorders","Schizophrenia", "Developmental Disorders","Personality Disorders", "Behavioral Disorders", "Mood Disorders", "Neurotic Disorders", "Organic Disorders"]

// Get filtered data
data_filtered = data_LYL.filter(function(d){ return d.sex == "Males" })

// Order data following groups
var data_filtered = data_filtered.sort(function(a,b) {
    return groups.indexOf( a.mentalDis ) > groups.indexOf( b.mentalDis );
});

// set the dimensions and margins of the graph
var margin = {top: 100, right: 30, bottom: 90, left: 150},
    width = 960 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

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

// List of colors: manually picked with 2 main groups
var allColors = [
  "#A7729A", "#B69EAA", "#C5CABA",
  "#5D81F8","#518FF0","#459DE8","#39ABE0","#2EBAD9","#22C8D1","#16D6C9","#0BE5C2"]

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(allColors);




// ======================= //
// X AXIS AND SCALE
// ======================= //

// Add X axis
var x = d3.scaleLinear()
  .domain([-3, 15])
  .range([0, width])





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
  tooltip
      .html(d.data.mentalDis + "<br>" + "<span style='color:grey'>Here I could add a barplot to <br>efficiently compare the different cause<br> of death linked to this mental<br> disorder</span>")
      .style("top", (event.pageY)+"px")
      .style("left",(event.pageX+20)+"px")
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 1)
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
// BARS
// ======================= //
console.log("subgroups")
console.log(subgroups)

//stack the data? --> stack per subgroup
var stackedData = d3.stack()
  .keys(subgroups)
  .offset(d3.stackOffsetDiverging)
  (data_filtered)
console.log("stackedData")
console.log(stackedData)

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
      .attr("y", function(d) { return y(d.data.mentalDis)+myPadding(d.data.mentalDis) } )
      .attr("height", y.bandwidth())
      .attr("x", function(d) {  return x(d[0]); })
      .attr("width", function(d) { return Math.abs(x(d[1]) - x(d[0])); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)










// ======================= //
// LABELS ON TOP OF BARS
// ======================= //

// Compute center of each bar of the first top group
var myMeans = []
for( i in  stackedData){
  inter = stackedData[i][0]
  mean = (inter[0] + inter[1]) / 2
  myMeans.push(mean)
}
console.log("myMeans")
console.log(myMeans)

// Add label
svg.selectAll("topLabels")
  .data(myMeans)
  .enter()
  .append("text")
    .attr("x", 0)
    .text(function(d,i){ grp=subgroups[i] ; return(grp)})
    .attr("y", 0)
    .style("fill", function(d,i){ grp=subgroups[i] ; return(color(grp))})
    .style("font-size",12)
    .style("text-anchor", "start")
     .attr('transform', (d)=>{
          return 'translate( '+x(d)+' , '+0+'),'+ 'rotate(-45)';})





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

console.log("data filtered")
console.log(data_filtered)

// Compute the most left position of each mental disorder
// TODO : find a cleaner way to isolate the min of each group
var myMins = []
for (i = 0; i < 11; i++) {
  min = stackedData[4][i][0]
  myMins.push(min)
}
console.log("myMins")
console.log(myMins)

// Add label
svg.selectAll("leftLabels")
  .data(myMins)
  .enter()
  .append("text")
    .attr("x", function(d,i){ return x(myMins[i])-15 })
    .attr("y", function(d,i){return y(groups[i]) + myPadding(groups[i]) + 12})
    .text(function(d,i){ return groups[i] })
    .style("fill", "grey")
    .style("font-size",14)
    .style("text-anchor", "end")




// Close chart function
}

plotStackedbar()

function plotLoliAll(){


// ======================= //
// DATA AND SVG AREAS
// ======================= //

// set the dimensions and margins of the graph
var margin = {top: 20, right: 10, bottom: 20, left: 70},
    width = 260 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;


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
    .append("g")
      // .attr("transform", function(d){
      //     if( d.key=="Any Disorder" || d.key=="Mood Disorders" || d.key == "Intellectual Disabilities"){
      //       a = "translate(" + (margin.left+150) + "," + margin.top + ")"
      //     }else{
      //       a = "translate(" + margin.left + "," + margin.top + ")"
      //     } ;
      //     return a
      // });
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")" )


// Add X axis
var x = d3.scaleLinear()
  .domain([0, 20])
  .range([ 0, width]);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + (height-20) + ")")
  .call(d3.axisBottom(x).tickSize(0)  .ticks(5))
xAxis.select(".domain").remove()
svg.selectAll(".tick line").attr("stroke", "#B0B0B0")
xTickPos = [0,5,10,15]
svg.selectAll("xTicks")
  .data(xTickPos)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d); })
    .attr("x2", function(d) { return x(d); })
    .attr("y1", -20 )
    .attr("y2", height-20)
    .attr("stroke", "#B0B0B0")

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
    .attr('x', -0)
    .attr('y', function(d,i){return posYaxis[i]})
    .text( function(d,i){return bothCOD[i]})
    .attr("text-anchor", "end")
    .style("font-size", 14)
    .style("fill", 'none')
    .attr('class', function(d,i){ cod = bothCOD[i] ; if( typeCOD.includes(cod)){return 'myMainLabel'} })
    .style('alignment-baseline', 'middle')

// Color scale for dots
var myColorLolliSex = d3.scaleOrdinal()
  .domain(["both", "men", "women"])
  .range(["steelblue", "#1E8F89", "#EE5A45"])

// Scale to slightly modify sexes on the Y axis
var myPositionLolliSex = d3.scaleOrdinal()
  .domain(["both", "men", "women"])
  .range([0, -3, 3])

// Add titles to each subplot with disorder Name
svg
  .append("text")
  .attr("text-anchor", "start")
  .attr("y", -15)
  .attr("x", 0)
  .text(function(d){ return(d.key)})

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  selectedClass = d3.select(this).attr("class")
  svg
    .selectAll("circle")
    .transition()
    .duration(300)
    .style("fill", "#B8B8B8")
  svg
    .selectAll("."+selectedClass)
    .transition()
    .duration(300)
    .style("fill", "red")
    .style("opacity", 1)
}
var mouseleave = function(d) {
  console.log("mouseleave")
  selectedClass = d3.select(this).attr("class")
  console.log(selectedClass)
  svg
    .selectAll("circle")
    .transition()
    .duration(300)
    .style("fill", "black")
  horizLines
    .style("opacity", 0)
  vertLines
    .style("opacity", 0)
}

// Add circles
svg
  .selectAll('circle')
  .data( function(d){ return(d.values)} )
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.MRR); })
    .attr("cy", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
    .attr('r', function(d,i){ if(typeCOD.includes(d.COD)){size = 8}else{size=4} ; return size  })
    .attr("class", function(d) { return d.COD; })
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)

// Add Baseline
var horizLines = svg
  .selectAll('horizLines')
  .data( function(d){ return(d.values)} )
  .enter()
  .append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
    .attr("y2", function(d) { id = bothCOD.indexOf(d.COD) ; return posYaxis[id] + myPositionLolliSex(d.sex) })
    .attr("class", function(d) { return d.COD; })
    .attr("stroke", "red")
    .style("opacity",0)
var vertLines = svg
  .selectAll('vertLines')
  .data( function(d){ return(d.values)} )
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.MRR); })
    .attr("x2", function(d) { return x(d.MRR); })
    .attr("y1", 0)
    .attr("y2", height)
    .attr("class", function(d) { return d.COD; })
    .attr("stroke", "red")
    .style("opacity",0)













}

plotLoliAll()

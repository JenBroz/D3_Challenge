// @TODO: YOUR CODE HERE!
function scatterPlot() {
  d3.csv("assets/data/data.csv").then(pobData =>{

      pobData.forEach(function(dat){
          dat.healthcare = +dat.healthcare;
          dat.poverty = +dat.poverty
      });
      
      //SVG editing
      let isSvg = d3.select("#scatter").select("svg");
      if (!isSvg.empty()){
          isSvg.remove();
      }

      let svgWidth = d3.select("#scatter").node().getBoundingClientRect().width;

      let svgHeight = svgWidth

      //margin styling
      let margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
      };

      //chart editing
      let chartHeight = svgHeight - margin.top - margin.bottom;
      let chartWidth = svgWidth - margin.right - margin.left;

      //Creating SVG border
      let svg = d3.select("#scatter").append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

      //Creating a group 
      let chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

      //Y Scale
      let yScale = d3.scaleLinear()
          .domain([0, d3.max(pobData, d => d.healthcare)])
          .range([chartHeight, 0]);

      //X Scale
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(pobData, d => d.poverty)])
          .range([0, chartWidth])

      //Add Axis
      let yAxis = d3.axisLeft(yScale);
      let xAxis = d3.axisBottom(xScale);

      
      chartGroup.append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(xAxis);

      chartGroup.append("g")
          .call(yAxis)

      //Add group
      let stateGroup = chartGroup.append("text")
          .selectAll("tspan")
           .data(pobData)
           .enter()
           .append("tspan")
           .attr("class", "stateText")
           .attr("x", d => xScale(d.poverty))
           .attr("y", d => yScale(d.healthcare) +4)
           .text(d => d.abbr);

      let abbre = pobData.map(d => d.abbr);

      //Add circles
      var circleGroups = chartGroup.selectAll('circle')
          .data(pobData)
          .enter()
          .append("circle")
          .attr("class", "stateCircle")
          .attr("cy", d=> xScale(d.poverty))
          .attr("cx", d=> yScale(d.healthcare))
          .attr("r", "10")
          .attr("opacity", ".75")
  
      // Insert tool tip
      let toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          .html(function(d) {
              return (`Healthcare (%): ${d.healthcare}<br>Poverty (%): ${d.poverty}<br>${d.abbr}`);
          });

      chartGroup.call(toolTip);

      //Tool tip functionality
      circleGroup.on("click", function(data){
          toolTip.show(data, this);
      })
          .on("mouseout", function(data){
              toolTip.hide(data);
          });

      //Add lables to the axis
      chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (svgHeight / 2))
          .attr("dy", "1em")
          .attr("class", "aText")
          .text("Healthcare (%)");

      chartGroup.append("text")
          .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + (margin.top / 1.2)})`)
          .attr("class", "aText")
          .text("Poverty (%)");

  })
}

scatterPlot();

d3.select(window).on("resize", scatterPlot);

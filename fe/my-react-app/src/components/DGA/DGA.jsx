import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DuvalTriangle = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 400;
    const height = 400;
    const padding = 50;

    // Set up the scales
    const xScale = d3.scaleLinear().domain([0, 100]).range([padding, width - padding]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height - padding, padding]);

    // Draw the triangle
    const trianglePoints = [
      { x: xScale(0), y: yScale(0) },  // Bottom left
      { x: xScale(100), y: yScale(0) },  // Bottom right
      { x: xScale(50), y: yScale(100) }  // Top middle
    ];

    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    svg.append('path')
      .datum(trianglePoints)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Example Data
    const plotData = data.map(d => {
      const { CH4, C2H4, C2H2 } = d;

      const xPos = xScale(CH4 + C2H4 * 0.5);  // Calculate X position
      const yPos = yScale(C2H4);  // Y is based on C2H4
      return { xPos, yPos };
    });

    // Plot the points
    svg.selectAll('circle')
      .data(plotData)
      .enter()
      .append('circle')
      .attr('cx', d => d.xPos)
      .attr('cy', d => d.yPos)
      .attr('r', 5)
      .attr('fill', 'red');
  }, [data]);

  return (
    <div>
      <h2>Duval Triangle</h2>
      <svg ref={svgRef} width={400} height={400} />
    </div>
  );
};

export default DuvalTriangle;

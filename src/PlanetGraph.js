import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class PlanetGraph extends Component {
  constructor(props){
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }

  createBarChart() {
    const node = this.node
    const dataMax = max(this.props.data)
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, 0.5 * this.props.height])

    // Add new if necessary
    select(node)
      .selectAll('circle')
      .data(this.props.data)
      .enter()
      .append('circle')

    // Remove if necessary
    select(node)
      .selectAll('circle')
      .data(this.props.data)
      .exit()
      .remove()
   
    const {width, height, data} = this.props;
    const step = width / data.length;
    // Style the bars
    select(node)
      .selectAll('circle')
      .data(this.props.data)
      .style('fill', '#555555')
      .attr('cx', (d, i) => (step/2) + i * step)
      .attr('cy', height/2)
      .attr('r', d => yScale(d))
  }

  render() {
    return (
      <svg 
        ref={node => this.node = node}
        width={this.props.width} height={this.props.height}>
      </svg>
    )
  }

}
export default PlanetGraph

import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class BarChart extends Component {
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
      .range([0, this.props.height])

    // Add new if necessary
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')

    // Remove if necessary
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove()
   
    const {width, data} = this.props;
    const barWidth = width / data.length;
    // Style the bars
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', d => this.props.height - yScale(d))
      .attr('height', d => yScale(d))
      .attr('width', barWidth * 0.9)
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
export default BarChart

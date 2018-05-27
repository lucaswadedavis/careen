import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';
import PlanetGraph from '../PlanetGraph';
//import BarChart from '../BarChart';

import ReactResizeDetector from 'react-resize-detector';
import gaussian from 'gaussian';
import '../App.css';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from  'recharts';
const chartdata = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const more = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res.push(Math.random() * 10 | 0);
  }
  return res;
};

const distribution = (mean, variance) => {
  const steps = 100;
  const res = [];
  const d = gaussian(mean, variance);
  const increment = 0.02 * mean;
  for (let i = 0; i < steps; i++) {
    res.push(d.pdf(increment + (i * increment)));
  }
  return res;
}

class Dash extends Component {
   state = {
    width: null,
    variance1: 50,
    variance2: 50,
    data1: distribution(100, 50),
    data2: distribution(100, 50) 
  }

  saveRef = (ref) => this.containerNode = ref

  measure() {
    const { width } = this.state;
    const {clientWidth} = this.containerNode
    if (width === clientWidth) return; 

    this.setState({
      width: clientWidth,
    })
  }

  componentDidMount() {
    this.measure()
  }

  componentDidUpdate() {
    this.measure()
  }

  updateVariance1(variance1) {
    const data1 = distribution(100, variance1);
    this.setState({data1, variance1});
  }

  updateVariance2(variance2) {
    const data2 = distribution(100, variance2);
    this.setState({data2, variance2});
  }


  render () {
    const { data1, data2, width, variance1, variance2 } = this.state;
    const cData = data1.map((datum, i) => {
      return {a: data1[i], b: data2[i]}
    });

    return (
      <div>
        <Grid>
          <h2>Bells</h2>
          <p>Created with d3</p>
        <div ref={this.saveRef} className="chart-container">
          <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
          <h3>variance of a</h3>
          <Slider min={1} max={200} value={variance1} onChange={val => this.updateVariance1(val)} />
          <h3>variance of b</h3>
          <Slider min={1} max={200} value={variance2} onChange={val => this.updateVariance2(val)} />
          <BarChart width={width} height={300} data={cData}
            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
           <CartesianGrid strokeDasharray="3 3"/>
           <YAxis/>
           <Tooltip/>
           <Legend />
           <Bar dataKey="a" stackId="a" fill="#8884d8" />
           <Bar dataKey="b" stackId="a" fill="#82ca9d" />
          </BarChart>
        </div>
        </Grid>
      </div>
    )
  }

}
// <BarChart data={data} width={width} height={200} />

export default Dash;

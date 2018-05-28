import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Slider from 'rc-slider';
import {Area, AreaChart, Cell, PieChart, Pie, YAxis, CartesianGrid, Tooltip, Legend} from  'recharts';
import ReactResizeDetector from 'react-resize-detector';
import gaussian from 'gaussian';
import '../App.css';

const toPercent = (decimal, fixed = 0) => {
	return `${(decimal * 100).toFixed(fixed)}%`;
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
    variance1: 200,
    variance2: 250,
    data1: distribution(100, 200),
    data2: distribution(100, 250),
  }

  saveRef = (ref) => this.containerNode = ref

  getSum = (data) => {
    console.log(data);
    return data.reduce((acc, d) => {
      return acc + d;
    }, 0);
  }

  renderCustomTooltip = (data) => {
    const c = 10000000;
    let d = data.payload.map(x => {
      return {name: x.name, value: c * x.value};
    });
    if (!d[0]) return;

    //console.log((c * d[0].value) / (c * d[1].value));
    //console.log(d[0].value, d[1].value);
    const a = Math.max(c * d[0].value, c * d[1].value);
    const b = Math.min(c * d[0].value, c * d[1].value);
    const COLORS = ["#8884d8", "#82ca9d"];
    return ( 
        <div>
        <p>{Math.floor(100 * a / b) / 100} : 1</p>
        <PieChart width={80} height={50}>
          <Pie data={d} cx={10} cy={10} dataKey="value" innerRadius={4} outerRadius={16} >
          {
            d.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
          }
          </Pie>
        </PieChart>
      </div>
    );
  }


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
          <div ref={this.saveRef}>
            <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
            <h3>variance of a</h3>
            <Slider min={1} max={450} value={variance1} onChange={val => this.updateVariance1(val)} />
            <h3>variance of b</h3>
            <Slider min={1} max={450} value={variance2} onChange={val => this.updateVariance2(val)} />
            <AreaChart width={width} height={300} data={cData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
             <YAxis/>
             <Tooltip content={ this.renderCustomTooltip } />
             <Legend />
             <Area dataKey="a" fill="#8884d8" />
             <Area dataKey="b" fill="#82ca9d" />
            </AreaChart>
            <AreaChart stackOffset="expand" width={width} height={100} data={cData}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
            <YAxis tickFormatter={toPercent}/>
             <Area dataKey="a" fill="#8884d8" stackId="1" />
             <Area dataKey="b" fill="#82ca9d" stackId="1" />
            </AreaChart>
          </div>
        </Grid>
      </div>
    )
  }

}

export default Dash;

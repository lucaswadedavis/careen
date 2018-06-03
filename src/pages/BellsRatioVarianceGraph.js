import React, { Component } from 'react';
import Slider from 'rc-slider';
import {Area, AreaChart, Cell, PieChart, Pie, YAxis, CartesianGrid, Tooltip} from  'recharts';
import ReactResizeDetector from 'react-resize-detector';
import gaussian from 'gaussian';
import '../App.css';

const toPercent = (decimal, fixed = 0) => {
	return `${(decimal * 100).toFixed(fixed)}%`;
};

const distribution = (mean, variance, multiple=1) => {
  const steps = 100;
  const res = [];
  const d = gaussian(mean, variance);
  const increment = 0.02 * mean;
  for (let i = 0; i < steps; i++) {
    res.push(multiple * d.pdf(increment + (i * increment)));
  }
  return res;
}

class Dash extends Component {
   state = {
    width: null,
    variance1: 220,
    variance2: 230,
    ratio: 50,
    data1: distribution(100, 220),
    data2: distribution(100, 230),
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
    const { ratio, variance2 } = this.state;
    const r1 = 100 - ratio;
    const r2 = ratio; 
    const data1 = distribution(100, variance1, r1);
    const data2 = distribution(100, variance2, r2);
    this.setState({data2, data1, variance1});
  }

  updateVariance2(variance2) {
    const { variance1, ratio } = this.state;
    const r1 = 100 - ratio;
    const r2 = ratio; 
    const data1 = distribution(100, variance1, r1);
    const data2 = distribution(100, variance2, r2);
    this.setState({variance2, data2, data1});
  }


  updateRatio(ratio) {
    // so 90 would be 9 : 1
    // and 1 would be 1 : 99
    const { variance1, variance2 } = this.state;
    const r1 = 100 - ratio;
    const r2 = ratio; 
    const data1 = distribution(100, variance1, r1);
    const data2 = distribution(100, variance2, r2);
    this.setState({data2, data1, ratio});
  }


  render () {
    const { data1, data2, ratio, width, variance1, variance2 } = this.state;
    const cData = data1.map((datum, i) => {
      return {a: data1[i], b: data2[i]}
    });

    return (
          <div ref={this.saveRef}>
            <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
            <AreaChart width={width} height={300} data={cData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip content={ this.renderCustomTooltip } />
             <Area dataKey="a" fill="#8884d8" />
             <Area dataKey="b" fill="#82ca9d" />
            </AreaChart>
            <h3>variance of purple: { variance1 } (standard deviation: { Math.sqrt(variance1).toFixed(2) })</h3>
            <Slider min={1} max={450} value={variance1} onChange={val => this.updateVariance1(val)} />
            <h3>variance of green: { variance2 } (standard deviation: { Math.sqrt(variance2).toFixed(2) })</h3>
            <Slider min={1} max={450} value={variance2} onChange={val => this.updateVariance2(val)} />
            <h3>ratio of purple to green: { 100 - ratio } / { ratio }</h3>
            <Slider min={0} max={100} value={ratio} onChange={val => this.updateRatio(val)} />
            <AreaChart stackOffset="expand" width={width} height={100} data={cData}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
            <YAxis tickFormatter={toPercent}/>
             <Area dataKey="a" fill="#8884d8" stackId="1" />
             <Area dataKey="b" fill="#82ca9d" stackId="1" />
            </AreaChart>
          </div>
    )
  }

}

export default Dash;

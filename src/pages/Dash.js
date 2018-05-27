import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';
import PlanetGraph from '../PlanetGraph';
import BarChart from '../BarChart';
import ReactResizeDetector from 'react-resize-detector';

import '../App.css';

const more = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res.push(Math.random() * 10 | 0);
  }
  return res;
};

class Dash extends Component {
   state = {
    width: null,
    data: [1, 2, 5]
  }

  saveRef = (ref) => this.containerNode = ref

  measure() {
    const { width } = this.state;
    const {clientWidth} = this.containerNode
    console.log(width, clientWidth);
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

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.width !== nextState.width ||
    )
  } 
  */

  updateNumber(val) {
    let { data } = this.state;
    console.log(more(12));
    if (val > data.length) {
      data = data.concat(more(val - data.length));
      console.log(data);
    }
    while (val < data.length) {
      console.log('pop');
      data.pop();
    }
    console.log(val); 
    this.setState({data});
  }

  render () {
    const { data, width } = this.state;
    console.log(data);
    return (
      <div>
        <Grid>
          <h2>Dash</h2>
          <p>Created with d3</p>
        </Grid>
        <div ref={this.saveRef} className="chart-container">
          <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
          <Slider min={0} max={100} value={data.length} onChange={val => this.updateNumber(val)} />
          <BarChart data={data} width={width} height={200} />
          <PlanetGraph data={data} width={width} height={200} />
        </div>
      </div>
    )
  }

}

export default Dash;

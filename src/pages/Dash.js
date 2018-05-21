import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import PlanetGraph from '../PlanetGraph';
import ReactResizeDetector from 'react-resize-detector';

import '../App.css';

class Dash extends Component {
   state = {
    width: null,
    height: null,
  }

  saveRef = (ref) => this.containerNode = ref

  measure() {
    const {clientWidth, clientHeight} = this.containerNode

    this.setState({
      width: clientWidth,
      height: clientHeight,
    })
  }

  componentDidMount() {
    this.measure()
  }

  componentDidUpdate() {
    this.measure()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.width !== nextState.width ||
      this.state.height !== nextState.height
    )
  } 
  render () {
    const { width } = this.state;
    return (
      <div>
        <Grid>
          <h2>Dash</h2>
          <p>Created with d3</p>
        </Grid>
        <div ref={this.saveRef} className="chart-container">
          <ReactResizeDetector handleWidth onResize={() => this.measure()} />
          <PlanetGraph data={[5,50,100,50,30]} width={width} height={200} />
        </div>
      </div>
    )
  }

}

export default Dash;

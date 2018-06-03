import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import BellsRatioVarianceGraph from './BellsRatioVarianceGraph';
import '../App.css';

class Dash extends Component {

  render () {
    return ( 
      <div>
        <Grid>
          <h2>Bells</h2>
          <p>Created with d3</p>
          <BellsRatioVarianceGraph />
        </Grid>
      </div>
    )
  }

}

export default Dash;

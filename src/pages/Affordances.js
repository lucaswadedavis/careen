import React from 'react';
import { Tooltip, Popover, ButtonToolbar, OverlayTrigger, Button, Grid } from 'react-bootstrap';

import '../App.css';

const tooltip = (
  <Tooltip id="tooltip">
    <strong>Holy guacamole!</strong> Check this info.
  </Tooltip>
);


const popoverTop = (
  <Popover id="popover-positioned-scrolling-top" title="Popover top">
    <strong>Holy guacamole!</strong> Check this info.
  </Popover>
);

const positionerInstance = (
  <ButtonToolbar>
    <OverlayTrigger placement="top" overlay={tooltip}>
      <Button bsStyle="default">Holy guacamole!</Button>
    </OverlayTrigger>

    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <Button bsStyle="default">Holy guacamole!</Button>
    </OverlayTrigger>

    <OverlayTrigger placement="top" overlay={popoverTop}>
      <Button bsStyle="default">Holy guacamole!</Button>
    </OverlayTrigger>


    <OverlayTrigger placement="right" overlay={tooltip}>
      <Button bsStyle="default">Holy guacamole!</Button>
    </OverlayTrigger>
  </ButtonToolbar>
);

const Affordances = () => (
  <Grid>
    <h2>Affordances</h2>
    { positionerInstance }
  </Grid>
);

export default Affordances;

import React from 'react';
import { Route, Link } from "react-router-dom";
import { Grid, Row } from 'react-bootstrap';

import '../App.css';

const Topics = ({ match }) => (
  <Grid>
    <h2>Topics</h2>
    <ul>
    <li>
    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
    </li>
    <li>
    <Link to={`${match.url}/components`}>Components</Link>
    </li>
    <li>
    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
    </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </Grid>
);

const Topic = ({ match }) => (
  <Row>
  <h3>{match.params.topicId}</h3>
  </Row>
);


export default Topics;

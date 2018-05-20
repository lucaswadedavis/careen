import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Grid, Nav, NavItem, Navbar, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import BarChart from './BarChart';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>Careen</Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <LinkContainer to="/"><NavItem>Home</NavItem></LinkContainer>
            <LinkContainer to="/about"><NavItem>About</NavItem></LinkContainer>
            <LinkContainer to="/topics"><NavItem>Topics</NavItem></LinkContainer>
          </Nav>
        </Navbar>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
      </div>
      </Router>
    );
  }
}

const Home = () => (
  <Grid>
  <h2>Home</h2>
  </Grid>
);

const About = () => (
  <Grid>
    <h2>About</h2>
    <BarChart data={[50,100,10,3]} size={[500,200]} />
    <p>Created with d3</p>
  </Grid>
);

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


export default App;

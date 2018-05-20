import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import { Grid, Nav, NavItem, Navbar, PageHeader, Row } from 'react-bootstrap';

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
            <NavItem><Link to="/">Home</Link></NavItem>
            <NavItem><Link to="/about">About</Link></NavItem>
            <NavItem><Link to="/topics">Topics</Link></NavItem>
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

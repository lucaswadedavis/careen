import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Grid, Nav, NavItem, Navbar, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import BarChart from './BarChart';
import ReactResizeDetector from 'react-resize-detector';

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

class About extends Component {
   state = {
    width: null,
    height: null,
  }

  saveRef = (ref) => this.containerNode = ref

  measure() {
    const {clientWidth, clientHeight} = this.containerNode
    console.log(this.containerNode);

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
    const { height, width } = this.state;
    console.log(height, width);
    return (
      <div ref={this.saveRef} className="chart-container">
        <ReactResizeDetector handleWidth onResize={() => this.measure()} />
        <Grid>
          <h2>About</h2>
          <p>Created with d3</p>
        </Grid>
        <BarChart data={[50,100,50,30]} width={width} height={200} />
      </div>
    )
  }

}

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

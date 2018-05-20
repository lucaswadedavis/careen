import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <div id="outer-container">
        <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/topics">Topics</Link>
        </Menu>
        <div id="page-wrap">
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
        </div>
      </div>
      </Router>
    );
  }
}

const Home = () => (
  <div>
  <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
  <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
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
  </div>
);

const Topic = ({ match }) => (
  <div>
  <h3>{match.params.topicId}</h3>
  </div>
);


export default App;

import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { Grid, Nav, NavItem, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import About from './pages/About';
import Topics from './pages/Topics';
import Home from './pages/Home';

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

export default App;

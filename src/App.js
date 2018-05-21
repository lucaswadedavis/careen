import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { Glyphicon, Nav, NavItem, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import About from './pages/About';
import Home from './pages/Home';
import Dash from './pages/Dash';
import Topics from './pages/Topics';
import FormElements from './pages/FormElements';

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
            <LinkContainer to="/dash"><NavItem>Dash</NavItem></LinkContainer>
            <LinkContainer to="/form-elements"><NavItem>Form Elements</NavItem></LinkContainer>
            <LinkContainer to="/topics"><NavItem>Topics</NavItem></LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavItem><Glyphicon glyph="star" /></NavItem>
          </Nav>
        </Navbar>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/dash" component={Dash} />
          <Route path="/form-elements" component={FormElements} />
          <Route path="/topics" component={Topics} />
      </div>
      </Router>
    );
  }
}

export default App;

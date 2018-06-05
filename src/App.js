import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { Glyphicon, Nav, NavItem, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './pages/Home';
import Dash from './pages/Dash';
import Bells from './pages/Bells';
import Luck from './pages/Luck';
import Routing from './pages/Routing';
import Affordances from './pages/Affordances';
import FormElements from './pages/FormElements';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>Careen</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/"><NavItem>Home</NavItem></LinkContainer>
            <LinkContainer to="/luck"><NavItem>Luck</NavItem></LinkContainer>
            <LinkContainer to="/form-elements"><NavItem>Form Elements</NavItem></LinkContainer>
            <LinkContainer to="/affordances"><NavItem>Affordances</NavItem></LinkContainer>
            <LinkContainer to="/routing"><NavItem>Routing</NavItem></LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavItem><Glyphicon glyph="star" /></NavItem>
          </Nav>
        </Navbar.Collapse>
        </Navbar>
          <Route exact path="/" component={Home} />
          <Route path="/dash" component={Dash} />
          <Route path="/bells" component={Bells} />
          <Route path="/luck" component={Luck} />
          <Route path="/affordances" component={Affordances} />
          <Route path="/form-elements" component={FormElements} />
          <Route path="/routing" component={Routing} />
      </div>
      </Router>
    );
  }
}

export default App;

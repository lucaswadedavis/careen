import React, { Component } from 'react';
import Slider from 'rc-slider';
import Chance from 'chance';
import gaussian from 'gaussian';
import { Tooltip as RbTooltip, OverlayTrigger, Grid } from 'react-bootstrap';
import {Area, AreaChart, Cell, PieChart, Pie, YAxis, CartesianGrid, ReferenceLine, Tooltip } from  'recharts';
import ReactResizeDetector from 'react-resize-detector';
import '../App.css';

const chance = new Chance('lukedavis');

// TODO:
//  - figure out how to set vertical lines at some value on the charts
//  - add a mouseover listener to the agent squares that links the graphs
//  - add a pie graph that shows percentage scores by decile
//  - change the y axis of the big graph to a percentage
//  - because there's a mismatch between the pdf and ppf sampling use a map

const tooltip = (agent) => {
  return <RbTooltip id={agent.name}>
    { agent.name }
  </RbTooltip>
}

class Agent {
  constructor () {
    this.skills = [];
    this.name = chance.name();
    this.score = 0;
    this.size = 0;
  }
}

class Page extends Component {
   state = {
    width: null,
    agents: [],
    product: [],
    skills: [],
    numberOfAgents: 100,
    numberOfTraits: 5,
  }

  constructor(props) {
    super(props);
    const { agents, skills, product } = this.generatePopulation();
    this.state.skills = skills;
    this.state.agents = agents;
    this.state.product = product;
  }

  generatePopulation(numberOfAgents=this.state.numberOfAgents, numberOfTraits=this.state.numberOfTraits) {
    const mean = 100;
    const variance = 250;
    const skills = []; 
    const agents = [];
    let product = []; 
    // repace this with the trick from bells
    const d = gaussian(mean, variance);
    // get a random element from that distribution
    // const sample = distribution.pdf(Math.random());
    const steps = 100;
    const increment = 0.02 * mean;
    let skill;
    let datum;
    for (let i = 0; i < numberOfTraits; i++) {
      skill = [];
      for (let j = 0; j < steps; j++) {
        datum = d.pdf(increment + (j * increment));
        skill.push(datum);
      }
      skills.push(skill);
    }

    // this assigns trait values to agents
    // and figures out the product
    for (let i = 0; i < numberOfAgents; i++) {
      let prod = 1;
      let trait = null;
      let agent = new Agent();
      for (let j = 0; j < numberOfTraits; j++) {
        trait = d.ppf(Math.random());
        agent.skills.push(trait);
        prod *= trait;
      }
      agent.score = prod;
      agent.size = prod;
      agents.push(agent);
      product.push(prod);
      if (i > 500) debugger;
    }
    product.sort((a, b) => a - b); 
    return {agents, skills, product}
  }

  saveRef = (ref) => this.containerNode = ref

  getSum = (data) => {
    return data.reduce((acc, d) => {
      return acc + d;
    }, 0);
  }

  renderCustomTooltip = (data) => {
    const c = 10000000;
    let d = data.payload.map(x => {
      return {name: x.name, value: c * x.value};
    });
    if (!d[0]) return;
    const a = Math.max(c * d[0].value, c * d[1].value);
    const b = Math.min(c * d[0].value, c * d[1].value);
    const COLORS = ["#8884d8", "#82ca9d"];
    return ( 
        <div>
        <p>{Math.floor(100 * a / b) / 100} : 1</p>
        <PieChart width={80} height={50}>
          <Pie data={d} cx={10} cy={10} dataKey="value" innerRadius={4} outerRadius={16} >
          {
            d.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
          }
          </Pie>
        </PieChart>
      </div>
    );
  }


  measure() {
    const { width } = this.state;
    const {clientWidth} = this.containerNode
    if (width === clientWidth) return; 
    this.setState({width: clientWidth})
  }

  componentDidMount() {

    this.measure()
  }

  componentDidUpdate() {
    this.measure()
  }

  updateNumberOfAgents(numberOfAgents) {
    const { numberOfTraits } = this.state;
    const { agents, skills, product } = this.generatePopulation(numberOfAgents, numberOfTraits);
    this.setState({numberOfAgents, agents, skills, product});
  }

  updateNumberOfTraits(numberOfTraits) {
    const { numberOfAgents } = this.state;
    const { agents, skills, product } = this.generatePopulation(numberOfAgents, numberOfTraits);
    this.setState({numberOfTraits, agents, skills, product});
  }

  renderAgentsContainer() {
    const { agents } = this.state;
    return (
      <div className="Agents-Container">
        <h3>Agents</h3>
        { 
          agents.map((agent, i) => {
            return (
              <OverlayTrigger key={i} placement="top" overlay={tooltip(agent)}>
                <span className="Agent-Cell"></span>
              </OverlayTrigger>
            );
          })
        }
      </div>
    );
  }


  renderTraitChart(width, data, index) {
    console.log(data);
    return (
      <div className="Trait-Chart-Container" key={index} >
        <AreaChart width={width} height={100} data={data}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
         <Area dataKey="a" stackId="a" fill="#8884d8" />
        <ReferenceLine x={100} stroke="red" />
        </AreaChart>
      </div>
    )
  }

  render() {
    const { width, skills, product, numberOfAgents, numberOfTraits } = this.state;
    let pData = [];
    const traits = [];
    if (skills[0] !== undefined) {
      pData = product.map(datum => {
        return {a: datum};
      });
    
      for (let i = 0; i < skills.length; i++) {
        traits.push(skills[i].map(n => {
          return {a: n};
        }));
      }

    }

    return (
      <div>
        <Grid>
          <h2>Luck</h2>
          <p>Created with d3</p>
          <div ref={this.saveRef}>
            <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
            <h3>number of agents ({ numberOfAgents })</h3>
            <Slider min={10} max={200} value={numberOfAgents} onChange={val => this.updateNumberOfAgents(val)} />
            <h3>number of traits ({ numberOfTraits })</h3>
            <Slider min={1} max={10} value={numberOfTraits} onChange={val => this.updateNumberOfTraits(val)} />

            { this.renderAgentsContainer() } 

            <AreaChart width={width} height={300} data={pData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
             <ReferenceLine x={50} stroke="red" />
             <Tooltip />
             <Area dataKey="a" fill="#8884d8" />
            </AreaChart>

            { traits.map((trait, i) => this.renderTraitChart(width / numberOfTraits, trait, i)) }            
          </div>
        </Grid>
      </div>
    )
  }

}

export default Page;

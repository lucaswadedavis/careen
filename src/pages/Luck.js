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
//  - add a pie graph that shows percentage scores by decile

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
    activeAgent: null,
    product: [],
    skills: [],
    numberOfAgents: 100,
    numberOfTraits: 5,
  }

  skillKey = {};

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
        this.skillKey[increment + (j * increment)] = j;
        skill.push(datum);
      }
      skills.push(skill);
    }

    // this assigns trait values to agents
    // and figures out the product
    let sample;
    for (let i = 0; i < numberOfAgents; i++) {
      let prod = 1;
      let trait = null;
      let agent = new Agent();
      for (let j = 0; j < numberOfTraits; j++) {
        sample = Math.random();
        trait = d.ppf(sample);
        // here 
        //this.skillKey[trait] = d.pdf(trait);
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
              <OverlayTrigger key={i} placement="top" onMouseOver={() => this.setState({activeAgent: agent})} overlay={tooltip(agent)}>
                <span className="Agent-Cell"></span>
              </OverlayTrigger>
            );
          })
        }
      </div>
    );
  }


  renderTraitChart(width, data, index) {
    const { activeAgent } = this.state;
    let refLine = null;
    if (activeAgent && data.length) {
      for (let key in this.skillKey) {
        if (key >= activeAgent.skills[index]) {
          refLine = this.skillKey[key];
          break;
        }
      }
    }

    return (
      <div className="Trait-Chart-Container" key={index} >
        <AreaChart width={width} height={100} data={data}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
         <Area dataKey="a" stackId="a" fill="#8884d8" />
        <ReferenceLine x={refLine} stroke="red" />
        </AreaChart>
      </div>
    )
  }

  render() {
    const { activeAgent,  width, skills, product, numberOfAgents, numberOfTraits } = this.state;
    let pData = [];
    let refLine = null;

    if (activeAgent && product.length) {
      for (let i = 0; i < product.length; i++) {
        if (product[i] >= activeAgent.score) {
          refLine = i;
          break;
        }
      }
    }

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
             <ReferenceLine x={refLine} stroke="red" />
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

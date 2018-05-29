import React, { Component } from 'react';
import Slider from 'rc-slider';
import Chance from 'chance';
import { Tooltip as RbTooltip, OverlayTrigger, Grid } from 'react-bootstrap';
import {Area, AreaChart, BarChart, Bar, Cell, PieChart, Pie, YAxis, CartesianGrid, Tooltip } from  'recharts';
import ReactResizeDetector from 'react-resize-detector';
import '../App.css';

const chance = new Chance('lukedavis');

// TODO:
//  - make the Gaussian a real gaussian generator
//  - make the trait graphs smaller and area charts
//  - figure out how to set vertical lines at some value on the charts
//  - add a mouseover listener to the agent squares that links the graphs
//  - add a pie graph that shows percentage scores by decile
//  - change the y axis of the big graph to a percentage

const tooltip = (agent) => {
  return <RbTooltip id={agent.name}>
    { agent.name }
  </RbTooltip>
}

function Gaussian(n=100, m=10) {
  let res = []; 
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < m; j++) {
      sum += Math.random() * 10 | 0;
    }   
    let avg = sum / m;
    res.push(avg);
  }
  return res;
};

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
    //const { numberOfAgents, numberOfTraits } = this.state;
    const skills = []; 
    const agents = [];
    let product = []; 
    for (let i = 0; i < numberOfTraits; i++) {
      skills.push(Gaussian(numberOfAgents, 4));
    }
    for (let i = 0; i < skills[0].length; i++) {
      let prod = 1;
      let agent = new Agent();
      for (let j = 0; j < skills.length; j++) {
        prod *= skills[j][i];
        agent.skills.push(skills[j][i]);
     }
      agent.score = prod;
      agent.size = prod;
      agents.push(agent);
      product.push(prod);
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
    return (
        <BarChart key={index} width={width} height={100} data={data}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip />
         <Bar dataKey="a" stackId="a" fill="#8884d8" />
        </BarChart>
    )

  }

  render() {
    const { width, skills, product, numberOfAgents, numberOfTraits } = this.state;
    let bData = [];
    let pData = [];
    let traits = [];

    if (skills[0] !== undefined) {

      for (let i = 0; i < skills.length; i++) {
        const max = Math.max(...skills[i]);
        const numberOfBuckets = 9;
        bData = skills[i].reduce((acc, datum) => {
          const i = Math.round(numberOfBuckets * datum / max);
          acc[i]++
          return acc;
        }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map(datum => {
          return {a: datum};
        });
        traits.push(bData);
      }

      pData = product.map(datum => {
        return {a: datum};
      });
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
             <YAxis/>
             <Tooltip />
             <Area dataKey="a" fill="#8884d8" />
            </AreaChart>

            { traits.map((trait, i) => this.renderTraitChart(width, trait, i)) }            
          </div>
        </Grid>
      </div>
    )
  }

}

export default Page;

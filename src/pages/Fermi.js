import React, { Component } from 'react';
import Slider from 'rc-slider';
import Chance from 'chance';
import gaussian from 'gaussian';
import { Tooltip as RbTooltip, OverlayTrigger, Grid } from 'react-bootstrap';
import {Area, AreaChart, Cell, Legend, PieChart, Pie, CartesianGrid, ReferenceLine, Tooltip } from  'recharts';
import {interpolateRdPu as colorInterpolate } from 'd3';
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
    numberOfAgents: 200,
    numberOfTraits: 7,
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
    const mean = 10;
    const variance = 5;
    const skills = []; 
    const agents = [];
    let product = []; 
    const d = gaussian(mean, variance);
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
    let minScore = Infinity;
    let sumScore = 0;
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
      if (prod < minScore) minScore = prod;
      sumScore += prod;
      agent.score = prod;
      agent.size = prod;
      agents.push(agent);
    }

    // reset the score values to smaller basis
    for (let i = 0; i < agents.length; i++) {
      //agents[i].score = agents[i].score / minScore;
      agents[i].score = agents[i].score / (sumScore / agents.length);
      agents[i].size = agents[i].score;
      product.push(agents[i].score);
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

  updateFacotr(numberOfTraits) {
    const { numberOfAgents } = this.state;
    const { agents, skills, product } = this.generatePopulation(numberOfAgents, numberOfTraits);
    this.setState({numberOfTraits, agents, skills, product});
  }

  renderAgentsContainer() {
    const { agents, numberOfAgents } = this.state;
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0;  i < agents.length; i++) {
      if (agents[i].score > max) max = agents[i].score;
      if (agents[i].score < min) min = agents[i].score;
    } 

    return (
      <div className="Agents-Container">
        <h3>Models ({ numberOfAgents })</h3>
        <Slider min={10} max={500} value={numberOfAgents} onChange={val => this.updateNumberOfAgents(val)} />
        { 
          agents.map((agent, i) => {
            const style = {backgroundColor: colorInterpolate((agent.score ) / max)};
            return (
              <OverlayTrigger
                key={i}
                placement="top"
                onMouseOver={() => this.setState({activeAgent: agent})}
                onMouseOut={() => this.setState({activeAgent: null})}
                overlay={tooltip(agent)}>
                <span className="Agent-Cell" style={ style }></span>
              </OverlayTrigger>
            );
          })
        }
      </div>
    );
  }


  renderParameterChart(width, data, index) {
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
    const factorValue = 5;

    return (
      <div className="Trait-Chart-Container" key={index} >
        <AreaChart width={width} height={40} data={data}
              margin={{top: 20, right: 2, left: 2, bottom: 5}}>
         <Area dataKey="a" stackId="a" fill="#222" />
        <ReferenceLine x={refLine} stroke="#3BB9FF" />
        </AreaChart>
        <Slider min={1} max={20} value={factorValue} onChange={val => this.updateParameter(val)} />
      </div>
    )
  }

  renderEquationContainer() {
    const { numberOfTraits } = this.state;
    const traitLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rightHand = traitLetters.split('').slice(0, numberOfTraits).join(' x ');

    return (
      <div className="EquationContainer">
        { rightHand } = Total Score
      </div>
    )

  }

  render() {
    const { agents, activeAgent,  width, skills, product, numberOfTraits } = this.state;
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
      for (let i = 0; i < skills.length; i++) {
        traits.push(skills[i].map(n => {
          return {a: n};
        }));
      }
    }

    let a1 = agents.slice().sort((a, b) => b.score - a.score).reverse();
    let a2 = agents.slice().sort((a, b) => b.score - a.score);
    let interval = a2.length / 10;
    let index;
    const deciles = [];
    for (let i = 0; i < a2.length; i++) {
      index = i / interval | 0;
      if (deciles[index]) {
        deciles[index].value += a2[i].score;
      } else {
        deciles[index] = {name: 'decile ' + ( 1 + index ), value: a2[i].score};
      }
    }

    return (
      <div>
        <Grid>
          <h2>Fermi</h2>
          <div ref={this.saveRef}>
            <ReactResizeDetector handleWidth refreshMode="throttle" refreshRate={3000} onResize={() => this.measure()} />
            { this.renderAgentsContainer() } 

            <h3>Parameters</h3>
            { traits.map((trait, i) => this.renderParameterChart(width / numberOfTraits, trait, i)) } 
            { this.renderEquationContainer() }

            <div className="MajorChartContainer">
            <AreaChart width={width - 280} height={200} data={a1} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid strokeDasharray="3 3"/>
             <Area dataKey="score" name="multiple of average" fill="#222" />
             <ReferenceLine x={refLine} stroke="#3BB9FF" />
             <Tooltip />
            </AreaChart>
            </div>

            <div className="MajorChartContainer">
            <PieChart width={280} height={200}>
              <Pie 
                data={deciles}
                dataKey="value"
                nameKey="name"
                cx={80}
                cy={100}
                innerRadius={60}
                outerRadius={80}
              >
              	{
                  deciles.map((entry, index) => <Cell key={index} fill={colorInterpolate(entry.value / deciles[0].value)}/>)
                }
              </Pie>
              <Legend align="right" layout="vertical" />
            </PieChart> 
            </div>
          </div>
        </Grid>
      </div>
    )
  }

}

export default Page;

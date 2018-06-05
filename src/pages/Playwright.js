import React, { Component } from 'react';
import { Checkbox, Radio, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid } from 'react-bootstrap';

import '../App.css';

const intents = [
  {trainingPhrase: 'Hi', response: 'Nice to meet you. Would you like to play a game?'}
];

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

function Intent({ intent }) {
  return (
    <div>
      <div className="IntentCall">
        { intent.trainingPhrase }
      </div>
      <div className="IntentResponse">
        { intent.response }
      </div>
    </div>
  );
}

function Intents() {
  return  intents.map((intent, i) => {
    return <Intent intent={ intent } key={ i } />
    })
}


class Page extends Component {

  renderIntent() {

  }

  renderIntents() {

  }

  render () {
    return (
      <div>
        <Grid>
          <h2>Playwright</h2>
          <form>
            <div className="ChatContainer">
            <Intents />
            </div>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="Text"
              placeholder="Enter text"
            />
          </form>

        </Grid>
      </div>
    )
  }

}

export default Page;

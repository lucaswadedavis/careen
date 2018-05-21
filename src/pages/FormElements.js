import React, { Component } from 'react';
import { Checkbox, Radio, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid } from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';
import '../App.css';
import 'rc-slider/assets/index.css';


function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

const formInstance = (
  <form>
    <FieldGroup
      id="formControlsText"
      type="text"
      label="Text"
      placeholder="Enter text"
    />
    <FieldGroup
      id="formControlsEmail"
      type="email"
      label="Email address"
      placeholder="Enter email"
    />
    <FieldGroup id="formControlsPassword" label="Password" type="password" />
    <FieldGroup
      id="formControlsFile"
      type="file"
      label="File"
      help="Example block-level help text here."
    />

    <Checkbox checked readOnly>
      Checkbox
    </Checkbox>
    <Radio checked readOnly>
      Radio
    </Radio>

    <FormGroup>
      <Checkbox inline>1</Checkbox> <Checkbox inline>2</Checkbox>{' '}
      <Checkbox inline>3</Checkbox>
    </FormGroup>
    <FormGroup>
      <Radio name="radioGroup" inline>
        1
      </Radio>{' '}
      <Radio name="radioGroup" inline>
        2
      </Radio>{' '}
      <Radio name="radioGroup" inline>
        3
      </Radio>
    </FormGroup>

    <FormGroup controlId="formControlsSelect">
      <ControlLabel>Select</ControlLabel>
      <FormControl componentClass="select" placeholder="select">
        <option value="select">select</option>
        <option value="other">...</option>
      </FormControl>
    </FormGroup>
    <FormGroup controlId="formControlsSelectMultiple">
      <ControlLabel>Multiple select</ControlLabel>
      <FormControl componentClass="select" multiple>
        <option value="select">select (multiple)</option>
        <option value="other">...</option>
      </FormControl>
    </FormGroup>

    <FormGroup controlId="formControlsTextarea">
      <ControlLabel>Textarea</ControlLabel>
      <FormControl componentClass="textarea" placeholder="textarea" />
    </FormGroup>

    <FormGroup>
      <ControlLabel>Static text</ControlLabel>
      <FormControl.Static>email@example.com</FormControl.Static>
    </FormGroup>

    <Button type="submit">Submit</Button>
  </form>
);


class FormElements extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: ''
    };
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <Grid>
        <h2>Form Elements</h2>
        <p>Created with React Bootstrap and React slider</p>
        <Slider min={0} max={100} onChange={val => console.log(val)} />
        <Range  min={0} max={100} onChange={val => console.log(val)} />
        <form>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Working example with validation</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Validation is based on string length.</HelpBlock>
          </FormGroup>
        </form>
        { formInstance }
      </Grid>
    );
  }
  
}

export default FormElements;

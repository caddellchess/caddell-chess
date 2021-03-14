// found at https://codesandbox.io/s/w7rwn53eo and slightly modified for use

import React, { Component } from 'react';
import { Switch, SwitchLabel, SwitchRadio, SwitchSelection } from './styles.js';

const titleCase = str =>
  str.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

const ClickableLabel = ({ title, onChange, id }) =>
  <SwitchLabel onClick={() => onChange(title)} className={id}>
    {titleCase(title)}
  </SwitchLabel>;

const ConcealedRadio = ({ value, selected }) =>
  <SwitchRadio readOnly type="radio" name="switch" checked={selected === value} />;

export default class ToggleSwitch extends Component {
  selectionStyle = () => {
    return {
      left: `${this.props.values.indexOf(this.props.selected) / 3 * 100}%`,
    };
  };

  render() {
    return (
      <Switch>
        {this.props.values.map((val, index) => {
          return (
            <span key={index}>
              <ConcealedRadio value={val} selected={this.props.selected} />
              <ClickableLabel title={val} onChange={this.props.onChange.bind(this)} />
            </span>
          );
        })}
        <SwitchSelection style={this.selectionStyle()} />
      </Switch>
    );
  }
}

import React from 'react';
import Select from 'react-select';
import actions from '../actions/actions';
import './SetupEngine.css';

export default class SetupEngine extends React.Component {
  onEngineChoice(value) {
    if (!this.props.levelOptions.hasOwnProperty(value.value)) {
      fetch('/dispatch', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: actions.RETRIEVE_LEVELS,
          payload: {
            engine: value.value
          }
        })
      });
    }

    this.props.onEngineChoice(value);
  }

  render() {
    const { engineSelected } = this.props;

    const levelPlaceholder = engineSelected &&
      this.props.levelOptions.hasOwnProperty(engineSelected.value) &&
      this.props.levelOptions[engineSelected.value].length ?
        'Select...' :
        'None Available';

    const levelOptions = engineSelected && this.props.levelOptions[engineSelected.value];

    const personalityIsDisabled = (engineSelected && this.props.personalityOptions.hasOwnProperty(engineSelected.value) && !this.props.personalityOptions[engineSelected.value].length) || this.props.isLoading;
    const personalityOptions = engineSelected && this.props.personalityOptions.hasOwnProperty(engineSelected.value) && this.props.personalityOptions[engineSelected.value];
    const personalityPlaceholder = engineSelected && this.props.personalityOptions.hasOwnProperty(engineSelected.value) && this.props.personalityOptions[engineSelected.value].length ? 'Select...' : 'No Personalities';
    const personalityValue = engineSelected && this.props.personalityOptions.hasOwnProperty(engineSelected.value) && this.props.personalityOptions[engineSelected.value].length ? this.props.personalitySelected : null;

    return (
      <div className='engine-select'>
        {this.props.phase &&
          <div className='game-phase'>
            {this.props.headings && <label>&nbsp;</label>}
            <p>{this.props.phase}</p>
          </div>
        }
        <div className='engine'>
          {this.props.headings && <label>Engine</label>}
          <Select
            className='input-field'
            options={this.props.engineOptions}
            value={engineSelected}
            onChange={this.onEngineChoice.bind(this)}
          />
        </div>
        <div className='level'>
          {this.props.headings && <label>Level</label>}
          <Select
            className='input-field'
            isLoading={this.props.isLoading}
            isDisabled={this.props.isLoading}
            options={levelOptions}
            placeholder={levelPlaceholder}
            value={this.props.levelSelected}
            onChange={this.props.onLevelChoice.bind(this)}
          />
        </div>
        <div className='personality'>
          {this.props.headings && <label>Personality</label>}
          <Select
            className='input-field'
            isLoading={this.props.isLoading}
            isDisabled={personalityIsDisabled}
            options={personalityOptions}
            placeholder={personalityPlaceholder}
            value={personalityValue}
            onChange={this.props.onPersonalityChoice.bind(this)}
          />
        </div>
      </div>
    );
  }
}

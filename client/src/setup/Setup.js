import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from "react-router-dom";
import _ from 'lodash';
import memoize from 'memoize-one';
import Select from 'react-select';
import ToggleSwitch from '../toggleswitch/ToggleSwitch';
import actions from '../actions/actions';
import './Setup.css';

class Setup extends React.Component {
  constructor(props) {
    super(props);

    const engineOptions = props.system.engineArray.map(engine => ({key: engine.filename, label: engine.fullname, value: engine.filename}));
    const bookOptions = props.system.booksArray.map(book => ({key: book.mri, label: book.hmi, value: book.mri}));
    const levelOptions = [{ key: '1', label: 'Level 1', value: '1'}];
    const personalityOptions = [];

    const personalitySelected = props.currentGame.engine.engineHasPersonalities ?
      {
        key: props.currentGame.engine.personality.mri,
        label: props.currentGame.engine.personality.hmi,
        value: props.currentGame.engine.personality.mri,
      } : null;

    this.state = {
      playerColor: props.currentGame.isPlayerWhite ? 'White' : 'Black',
      engineColor: props.currentGame.isPlayerWhite ? 'Black' : 'White',
      engineOptions,
      bookOptions,
      levelOptions,
      engineDefaults: props.currentGame.engine.engineDefaults,
      personalityOptions,
      engineSelected: engineOptions.find(engine => engine.key === props.currentGame.engine.filename),
      bookSelected: bookOptions.find(book => book.key === props.currentGame.openingBook.filename),
      engineHasPersonalities: props.currentGame.engine.engineHasPersonalities,
      levelSelected: {
        key: props.currentGame.engine.level.hmi,
        label: props.currentGame.engine.level.hmi,
        value: props.currentGame.engine.level.mri
      },
      personalitySelected,
      isLoading: false,
      redirect: false,
      levels: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.levels, prevState.levels)) {
      const { levels } = nextProps;
      const levelOptions = nextProps.levels.levels.map(level => ({ key: level.hmi, label: level.hmi, value: level.mri, mri: level.mri }))
      const levelSelected = levelOptions.length ? {
        key: levelOptions[0].key,
        label: levelOptions[0].label,
        value: levelOptions[0].value
      } : null;
      const engineDefaults = nextProps.levels.engineDefaults;
      const personalityOptions =
        Object.keys(nextProps.levels.personalities).length ?
        Object.entries(nextProps.levels.personalities).map(personality => ({ key: personality[1].mri, label: personality[1].hmi, value: personality[1].mri})) :
        [];
      const personalitySelected = personalityOptions.length ?
        { key: personalityOptions[0].key, label: personalityOptions[0].label, value: personalityOptions[0].value } : null;
      return {
        isLoading: false,
        levelOptions,
        levelSelected,
        engineDefaults,
        personalityOptions,
        personalitySelected,
        engineHasPersonalities: nextProps.levels.engineHasPersonalities,
        levels
      };
    }
    return null;
  }

  componentDidMount() {
    fetch('/dispatch', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: actions.RETRIEVE_LEVELS,
        payload: {
          engine: this.state.engineSelected.value
        }
      })
    });
  }

  onClick() {
    const {
      playerColor,
      engineSelected,
      engineHasPersonalities,
      levelSelected,
      engineDefaults,
      personalitySelected,
      bookSelected
    } = this.state;

    let isPlayerWhite = playerColor === 'White';
    isPlayerWhite = playerColor === 'Random' ? Math.random() < 0.5 : isPlayerWhite;

    const personality = engineHasPersonalities ?
      {
        name: personalitySelected.label,
        mri: personalitySelected.value
      } :
      {};

    const engine = {
      hmi: engineSelected.label,
      filename: engineSelected.value,
      level: {
        hmi: levelSelected.label,
        mri: levelSelected.value
      },
      engineDefaults,
      engineHasPersonalities,
      personality // {name: 'Cloe', mri: 'cloe.txt'}
    };

    const openingBook = {
      name: bookSelected.label,
      filename: bookSelected.value
    };

    const useBook = bookSelected.value !== 'nobook.bin';

    const payload = {
      isPlayerWhite,
      engine,
      openingBook,
      personality,
      useBook
    };

    fetch('/dispatch', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: actions.CLIENT_START_GAME,
        payload: payload
      })
    });

    setTimeout(() => this.setState({ redirect: "/" }), 100);
  }

  togglePlayerChange(val) {
    let engineColor;
    if (val === 'White') {
      engineColor = 'Black';
    } else if (val === 'Black') {
      engineColor = 'White';
    } else {
      engineColor = 'Random';
    }
    this.setState({ playerColor: val, engineColor })
  }

  toggleEngineChange(val) {
    let playerColor;
    if (val === 'White') {
      playerColor = 'Black';
    } else if (val === 'Black') {
      playerColor = 'White';
    } else {
      playerColor = 'Random';
    }
    this.setState({ engineColor: val, playerColor })
  }

  onEngineChoice(value) {
    this.setState({
      engineSelected: value,
      isLoading: true,
      levelSelected: null
    });

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

  onLevelChoice(value) {
    this.setState({ levelSelected: value });
  }

  onPersonalityChoice(value) {
    this.setState({ personalitySelected: value });
  }

  render() {
    const { playerColor, engineColor } = this.state;
    const { engineHasPersonalities } = this.state;

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div className='setup'>
        <h3><span>Color</span></h3>
          <div className='color'>
              <label className='color-label'>Player</label>
              <ToggleSwitch
                values={['White', 'Random', 'Black']}
                selected={playerColor}
                onChange={this.togglePlayerChange.bind(this)}
              />
          </div>
          <div className='color'>
              <label className='color-label'>Engine</label>
              <ToggleSwitch
                values={['White', 'Random', 'Black']}
                selected={engineColor}
                onChange={this.toggleEngineChange.bind(this)}
              />
          </div>

        <h3><span>Engine</span></h3>
        <div className='engine-choice'>
          <div className='engine'>
            <label>Engine</label>
            <Select
              className='input-field'
              options={this.state.engineOptions}
              value={this.state.engineSelected}
              onChange={this.onEngineChoice.bind(this)}
            />
          </div>
          <div className='level'>
            <label>Level</label>
            <Select
              className='input-field'
              isLoading={this.state.isLoading}
              isDisabled={this.state.isLoading}
              options={this.state.levelOptions}
              value={this.state.levelSelected}
              onChange={this.onLevelChoice.bind(this)}
            />
          </div>
          <div className='personality'>
            <label>Personality</label>
            <Select
              className='input-field'
              isLoading={this.state.isLoading}
              isDisabled={!engineHasPersonalities || this.state.isLoading}
              options={this.state.personalityOptions}
              placeholder={engineHasPersonalities ? 'Select...' : 'No Personalities'}
              value={engineHasPersonalities ? this.state.personalitySelected : null}
              onChange={this.onPersonalityChoice.bind(this)}
            />
          </div>
        </div>

        <h3><span>Opening Book</span></h3>
        <div className='opening-book'>
          <div className='book'>
            <label>Opening Book</label>
            <Select
              className='input-field'
              options={this.state.bookOptions}
              value={this.state.bookSelected}
              onChange={value => this.setState({ bookSelected: value })}
            />
          </div>
        </div>

        <hr className='style-seven'/>
        <div className='submit-button'>
          <button
            className='myButton'
            onClick={this.onClick.bind(this)}
          >
            Start new game with these options
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  settings: state => state.client.settings,
  currentGame: state => state.client.currentGame,
  system: state => state.client.system,
  levels: state => state.levels
});

export default connect(mapStateToProps)(Setup);

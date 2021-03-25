import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from "react-router-dom";
import _ from 'lodash';
import SetupEngine from './SetupEngine';
import Select from 'react-select';
import Checkbox from 'react-simple-checkbox';
import ToolTip from 'react-portal-tooltip';
import ToggleSwitch from '../toggleswitch/ToggleSwitch';
import actions from '../actions/actions';
import './Setup.css';

class Setup extends React.Component {
  constructor(props) {
    super(props);

    const engineOptions = props.system.engineArray.map(engine => ({key: engine.filename, label: engine.fullname, value: engine.filename}));
    const bookOptions = props.system.booksArray.map(book => ({key: book.mri, label: book.hmi, value: book.mri}));

    const engineSelected = engineOptions.find(engine => engine.key === props.currentGame.engine.filename);

    const levelSelected = {
      key: props.currentGame.engine.level.hmi,
      label: props.currentGame.engine.level.hmi,
      value: props.currentGame.engine.level.mri
    }

    const personalitySelected = props.currentGame.engine.engineHasPersonalities ?
      {
        key: props.currentGame.engine.personality.mri,
        label: props.currentGame.engine.personality.hmi,
        value: props.currentGame.engine.personality.mri,
      } : null;

    const levelOptions = {}
    levelOptions[engineSelected.value] = [{ key: '1', label: 'Level 1', value: '1'}];
    const personalityOptions = {};
    personalityOptions[engineSelected.value] = [];

    this.state = {
      playerColor: props.currentGame.isPlayerWhite ? 'White' : 'Black',
      engineColor: props.currentGame.isPlayerWhite ? 'Black' : 'White',
      engineOptions,
      bookOptions,
      levelOptions,
      engineDefaults: {[engineSelected.value]: props.currentGame.engine.engineDefaults},
      personalityOptions,
      engineSelected,
      openingEngineSelected: '',
      middleEngineSelected: '',
      endgameEngineSelected: '',
      bookSelected: bookOptions.find(book => book.key === props.currentGame.openingBook.filename),
      engineHasPersonalities: {[engineSelected.value]: props.currentGame.engine.engineHasPersonalities},
      levelSelected,
      openingLevelSelected: '',
      middleLevelSelected: '',
      endgameLevelSelected: '',
      personalitySelected,
      openingPersonalitySelected: '',
      middlePersonalitySelected: '',
      endgamePersonalitySelected: '',
      phase: '',
      isLoading: false,
      redirect: false,
      levels: {},
      relayCheck: false,
      isTooltipActive: false
    };

    this.relayTip = 'Checking this box will enable Relay Chess, a mode in which you will be allowed to select the specific engines/levels/personalities that will be used during the different game phases (opening, middle, and end). This feature is only available via the browser component.'
    this.relayPhases = {opening: {}, middle: {}, endgame: {}};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.levels, prevState.levels)) {
      const { levels } = nextProps;
      const { levelOptions, personalityOptions, engineDefaults, engineHasPersonalities } = prevState;
      levelOptions[nextProps.levels.engine] = nextProps.levels.levels.map(level => ({ key: level.hmi, label: level.hmi, value: level.mri, mri: level.mri }))
      const levelSelected = levelOptions.length ? {
        key: levelOptions[nextProps.levels.engine][0].key,
        label: levelOptions[nextProps.levels.engine][0].label,
        value: levelOptions[nextProps.levels.engine][0].value
      } : null;
      //const engineDefaults = nextProps.levels.engineDefaults;
      engineDefaults[nextProps.levels.engine] = nextProps.levels.engineDefaults;
      personalityOptions[nextProps.levels.engine] =
        Object.keys(nextProps.levels.personalities).length ?
        Object.entries(nextProps.levels.personalities).map(personality => ({ key: personality[1].mri, label: personality[1].hmi, value: personality[1].mri})) :
        [];
      const personalitySelected = personalityOptions.length ?
        {
          key: personalityOptions[nextProps.levels.engine][0].key,
          label: personalityOptions[nextProps.levels.engine][0].label,
          value: personalityOptions[nextProps.levels.engine][0].value
        } : null;
      engineHasPersonalities[nextProps.levels.engine] = nextProps.levels.engineHasPersonalities;

      return {
        isLoading: false,
        levelOptions,
        levelSelected,
        engineDefaults,
        personalityOptions,
        personalitySelected,
        engineHasPersonalities,
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
      bookSelected,
      openingEngineSelected,
      middleEngineSelected,
      endgameEngineSelected,
      openingLevelSelected,
      middleLevelSelected,
      endgameLevelSelected,
      openingPersonalitySelected,
      middlePersonalitySelected,
      endgamePersonalitySelected
    } = this.state;

    let isPlayerWhite = playerColor === 'White';
    isPlayerWhite = playerColor === 'Random' ? Math.random() < 0.5 : isPlayerWhite;

    let personality, level, engine;
    if (!this.state.relayCheck) {
      personality = engineHasPersonalities[engineSelected.value] ?
        {
          name: personalitySelected.label,
          mri: personalitySelected.value
        } :
        {};

      level = levelSelected ?
        { hmi: levelSelected.label, mri: levelSelected.value } :
        {};

      engine = {
        hmi: engineSelected.label,
        filename: engineSelected.value,
        level,
        engineDefaults: engineDefaults[engineSelected.value],
        engineHasPersonalities: engineHasPersonalities[engineSelected.value],
        personality // {name: 'Cloe', mri: 'cloe.txt'}
      };

    }

    const openingBook = {
      name: bookSelected.label,
      filename: bookSelected.value
    };

    const useBook = bookSelected.value !== 'nobook.bin';

    const relayChess = this.state.relayCheck;

    const relayEngine = {
      opening: {
        hmi: openingEngineSelected.label,
        filename: openingEngineSelected.value,
        level: { hmi: openingLevelSelected.label, mri: openingLevelSelected.value },
        engineDefaults: engineDefaults[openingEngineSelected.value],
        engineHasPersonalities: engineHasPersonalities[openingEngineSelected.value],
        personality: openingPersonalitySelected ?
          {
            name: openingPersonalitySelected.label,
            mri: openingPersonalitySelected.value
          } : null
      },
      midgame: {
        hmi: middleEngineSelected.label,
        filename: middleEngineSelected.value,
        level: { hmi: middleLevelSelected.label, mri: middleLevelSelected.value },
        engineDefaults: engineDefaults[middleEngineSelected.value],
        engineHasPersonalities: engineHasPersonalities[middleEngineSelected.value],
        personality: middlePersonalitySelected ?
          {
            name: middlePersonalitySelected.label,
            mri: middlePersonalitySelected.value
          } : null
      },
      endgame: {
        hmi: endgameEngineSelected.label,
        filename: endgameEngineSelected.value,
        level: { hmi: endgameLevelSelected.label, mri: endgameLevelSelected.value },
        engineDefaults: engineDefaults[endgameEngineSelected.value],
        engineHasPersonalities: engineHasPersonalities[endgameEngineSelected.value],
        personality: endgamePersonalitySelected ?
          {
            name: endgamePersonalitySelected.label,
            mri: endgamePersonalitySelected.value
          } : null
      }
    };

    const payload = {
      isPlayerWhite,
      engine,
      openingBook,
      useBook,
      relayChess,
      relayEngine
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

  onEngineChoice(phase, value) {
    const engineSelected = phase ? `${phase}EngineSelected` : 'engineSelected';

    this.setState({
      [engineSelected]: value,
      isLoading: !this.state.levelOptions.hasOwnProperty(value.value),
      levelSelected: null,
      phase
    });
  }

  onLevelChoice(phase, value) {
    const levelSelected = phase ? `${phase}LevelSelected` : 'levelSelected';
    this.setState({ [levelSelected]: value });
  }

  onPersonalityChoice(phase, value) {
    const personalitySelected = phase ? `${phase}PersonalitySelected` : 'personalitySelected';
    this.setState({ [personalitySelected]: value });
  }

  onrelayCheck(value) {
    this.setState({ relayCheck: value })
  }

  showTooltip() {
    this.setState({isTooltipActive: true})
  }
  hideTooltip() {
    this.setState({isTooltipActive: false})
  }

  renderSingleEngine() {
    return (
      <SetupEngine
        onEngineChoice={this.onEngineChoice.bind(this, null)}
        onLevelChoice={this.onLevelChoice.bind(this, null)}
        onPersonalityChoice={this.onPersonalityChoice.bind(this, null)}
        engineOptions={this.state.engineOptions}
        engineSelected={this.state.engineSelected}
        isLoading={this.state.isLoading}
        levelOptions={this.state.levelOptions}
        levelSelected={this.state.levelSelected}
        personalityOptions={this.state.personalityOptions}
        personalitySelected={this.state.personalitySelected}
        headings
      />
    );
  }

  renderrelayEngine() {
    return (
      <React.Fragment>
        {Object.keys(this.relayPhases).map((phase, phaseNumber) => (
          <SetupEngine
            key={phaseNumber}
            phase={phase}
            onEngineChoice={this.onEngineChoice.bind(this, phase)}
            onLevelChoice={this.onLevelChoice.bind(this, phase)}
            onPersonalityChoice={this.onPersonalityChoice.bind(this, phase)}
            engineOptions={this.state.engineOptions}
            engineSelected={this.state[`${phase}EngineSelected`]}
            isLoading={this.state.isLoading}
            levelOptions={this.state.levelOptions}
            levelSelected={this.state[`${phase}LevelSelected`]}
            personalityOptions={this.state.personalityOptions}
            personalitySelected={this.state[`${phase}PersonalitySelected`]}
            headings={phaseNumber === 0}
          />
        ))}
      </React.Fragment>
    );
  }

  render() {
    const { playerColor, engineColor } = this.state;

    const style = {
      style: {
        background: 'rgb(55 60 68)',
        border: '4px solid #ADB8A5',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '6px 6px 5px rgba(0,0,0,.5)',
        color: '#E4E4E4',
        width: '40vw',
        lineHeight: '28px'
      },
      arrowStyle: {
        color: '#ADB8A5',
        borderColor: false
      }
    };

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
        <div
          id={'relay'}
          className='relay'
          onMouseEnter={this.showTooltip.bind(this)}
          onMouseLeave={this.hideTooltip.bind(this)}
        >
          <label>Relay Chess</label>
          <Checkbox
            className='relay-check'
            size={3}
            checked={this.state.relayCheck}
            tickAnimationDuration={250}
            borderThickness={3}
            tickSize={3}
            color={{
              backgroundColor:'rgb(55 60 68)',
              borderColor:'rgb(55 60 68)',
              uncheckedBorderColor:'rgb(55 60 68)',
              tickColor:'#BFC7D4'
            }}
            onChange={this.onrelayCheck.bind(this)}
          />
          <ToolTip
            active={this.state.isTooltipActive}
            position="right"
            arrow="center"
            parent="#relay"
            tooltipTimeout={100}
            style={style}
          >
            <div>
              <p>{this.relayTip}</p>
            </div>
          </ToolTip>
        </div>
        <div className='engine-choice'>
          {this.state.relayCheck ? this.renderrelayEngine() : this.renderSingleEngine()}
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

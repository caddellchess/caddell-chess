const createReducer = require('./create-reducer');
const actions = require('../actions/actions');

const getInitialState = () => ({
  openingBook: {
    name: 'No book',
    filename: 'nobook.bin'
  },
  isPlayerWhite: true,
  engine: {
    hmi: 'Stockfish 12',
    filename: 'a-stockf',
    level: {
      hmi: 'Level 00',
      mri: [{
        key: 'Skill Level',
        value: '0'
      }]
    },
    engineDefaults: [],
    engineHasPersonalities: false,
    personality: {}
  },
  isComboboxEngines: false,
  isComboboxLevels: false,
  isComboboxBooks: false,
  isComboboxPersonalities: false
});

const actionHandlers = {
  [actions.SET_SETTINGS_COLOR]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.isPlayerWhite = payload.isPlayerWhite;
    return newState;
  },

  [actions.REMEMBER_COMBOBOX_TYPE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.isComboboxEngines = payload.isComboboxEngines;
    newState.isComboboxLevels = payload.isComboboxLevels;
    newState.isComboboxBooks = payload.isComboboxBooks;
    newState.isComboboxPersonalities = payload.isComboboxPersonalities;
    return newState;
  },

  [actions.SELECTION_MADE]: (state, {payload}) => {
    const newState = Object.assign({}, state);

    if (payload.hasOwnProperty('engine')) {
      newState.engine.hmi = payload.engine.hmi;
      newState.engine.filename = payload.engine.filename;
    }

    if (payload.hasOwnProperty('level')) {
      newState.engine.level.hmi = payload.level.hmi;
      let levelMRI = [];
      payload.level.mri.forEach(mri => {
        const key = mri.engineLevelKEY;
        const value = mri.engineLevelVALUE;
        levelMRI.push({ key: key, value: value });
      })
      newState.engine.level.mri = levelMRI;
    }

    if (payload.hasOwnProperty('openingBook')) {
      newState.openingBook = payload.openingBook;
    }

    if (payload.hasOwnProperty('personality')) {
      newState.engine.personality = payload.personality;
    }

    if (payload.hasOwnProperty('engineDefaults')) {
      newState.engine.engineDefaults = payload.engineDefaults;
    }

    if (payload.hasOwnProperty('engineHasPersonalities')) {
      newState.engine.engineHasPersonalities = payload.engineHasPersonalities;
    }
    return newState;
  },

  [actions.SELECTION_MADE_TWO]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    if (payload.hasOwnProperty('openingBook')) {
      newState.openingBook = payload.openingBook;
    }

    if (payload.hasOwnProperty('personality')) {
      newState.personality = payload.personality;
    }
    return newState;
  },

  [actions.SEED_SETTINGS]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.settings = {}
    newState.settings.isPlayerWhite = payload.currentGame.isPlayerWhite;
    newState.settings.openingBook = payload.currentGame.openingBook;
    newState.settings.engine = payload.currentGame.engine;
    newState.settings.personality = payload.currentGame.personality;
    return newState;
  }
};

//module.exports = createReducer(getInitialState(), actionHandlers);
module.exports = {
  settings: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

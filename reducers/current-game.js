const createReducer = require('./create-reducer');
const actions = require('../actions/actions');

const getInitialState = () => ({
  isPlayerWhite: true,
  randomMove: 0,
  useBook: false,
  isBookMove: true,
  opening: '',
  gameOverReason: '',
  openingBook: {
    name: 'No book',
    filename: 'nobook.bin'
  },
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
  }
});

const actionHandlers = {
  [actions.START_UP]: state => {
    const newState = Object.assign({}, state);
    return newState;
  },

  [actions.NEW_OPENING]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.opening = payload.opening;
    return newState;
  },

  [actions.BOOK_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.isBookMove = payload.isBookMove;
    return newState;
  },

  [actions.GAME_OVER]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gameOverReason = payload.reason;
    return newState;
  },

  [actions.APPLY_SETTINGS]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.isPlayerWhite = payload.isPlayerWhite;
    newState.randomMove = 0;
    newState.isBookMove = true;
    newState.openingBook = payload.openingBook;;
    newState.gameOverReason = '';
    newState.engine = payload.engine;
    newState.engine.personality = payload.personality;
    newState.useBook = payload.useBook;
    return newState;
  },

  [actions.BOOK_MOVE_INCREASE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.randomMove = payload.randomMove;
    return newState;
  },

  [actions.EMPTIED_BOOK]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.useBook = payload.useBook;
    return newState;
  }
}

//module.exports = createReducer(getInitialState(), actionHandlers);
module.exports = {
  currentGame: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

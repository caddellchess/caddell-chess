const createReducer = require('./create-reducer');
const actions = require('../actions/actions');
const getGamePhase = require('../helpers/get-game-phase');

const getInitialState = () => ({
  isPlayerWhite: true,
  randomMove: 0,
  useBook: false,
  isBookMove: true,
  opening: '',
  gameOverReason: '',
  gamePhase: 'opening',
  lastMoveGamePhase: '',
  openingBook: {
    name: 'No book',
    filename: 'nobook.bin'
  },
  currentEngine: 'Stockfish 12',
  currentLevel: 'Level 00',
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
  relayChess: true,
  relayEngine: {
    opening: {
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
    midgame: {
      hmi: 'Stockfish 13',
      filename: 'b-stockf',
      level: {
        hmi: 'Level 10',
        mri: [{
          key: 'Skill Level',
          value: '10'
        }]
      },
      engineDefaults: [],
      engineHasPersonalities: false,
      personality: {}
    },
    endgame: {
      hmi: 'Stockfish 12',
      filename: 'a-stockf',
      level: {
        hmi: 'Level 01',
        mri: [{
          key: 'Skill Level',
          value: '1'
        }]
      },
      engineDefaults: [],
      engineHasPersonalities: false,
      personality: {}
    }
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
    if (!payload.relayChess) {
      newState.engine = payload.engine;
      newState.currentEngine = payload.engine.hmi;
      newState.currentLevel = payload.engine.level.hmi;
    } else {
      newState.engine = payload.relayEngine.opening;
      newState.currentEngine = payload.relayEngine.opening.hmi;
      newState.currentLevel = payload.relayEngine.opening.level.hmi;
    }
    newState.useBook = payload.useBook;
    newState.relayChess = payload.relayChess;
    newState.relayEngine = payload.relayEngine;
    return newState;
  },

  [actions.LOAD_NEW_ENGINE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    if (state.relayChess) {
      newState.currentEngine = state.relayEngine[state.gamePhase].hmi;
      newState.currentLevel = state.relayEngine[state.gamePhase].level.hmi;
    }
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
  },

  [actions.FIND_GAME_PHASE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    const { gamePhase } = state;
    const { fen } = payload;
    const newGamePhase = getGamePhase(fen, gamePhase);
    newState.lastMoveGamePhase = gamePhase;
    newState.gamePhase = newGamePhase;
    return newState;
  }
}

module.exports = {
  currentGame: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

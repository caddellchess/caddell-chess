const createReducer = require('./create-reducer');
const actions = require('../actions/actions');

const getInitialState = () => ({
  gameMoves: [],
  bestmove: '',
  evaluation: 0,
  hintMove: '',
  gauge: 50,
  blunder: {
    text: '',
    grade: ''
  },
  board: {
    board: [],
    whiteTaken: [],
    blackTaken: []
  }
});

const actionHandlers = {
  [actions.APPEND_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gameMoves = [...newState.gameMoves, payload.move];
    return newState;
  },

  [actions.ENGINE_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.bestmove = payload.move.bestmove;
    newState.gameMoves = [...newState.gameMoves, payload.move.bestmove];
    return newState;
  },

  [actions.SAVE_EVAL]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.evaluation = payload.evaluation;
    newState.hintMove = payload.hintMove;
    newState.gauge = payload.gauge;
    return newState;
  },

  [actions.SAVE_BLUNDER]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.blunder.text = payload.blunderText;
    newState.blunder.grade = payload.blunderGrade;
    return newState;
  },

  [actions.VISUALIZE_BOARD]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.board.board = payload.board;
    newState.board.whiteTaken = payload.whiteTaken;
    newState.board.blackTaken = payload.blackTaken;
    return newState;
  },

  [actions.CLEAR_GAME]: state => {
    const newState = Object.assign({}, state);
    newState.gameMoves = [];
    newState.bestmove = '';
    newState.evaluation = 0;
    newState.hintMove = '';
    newState.gauge = 50;
    newState.blunder = { text: '', grade: '' };
    newState.board = { board: [], whiteTaken: [], blackTaken: [] };
    return newState;
  }
};

//module.exports = createReducer(getInitialState(), actionHandlers);
module.exports = {
  gamePlay: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

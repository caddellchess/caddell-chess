import createReducer from './create-reducer';
import actions from '../actions/actions';

//const actions = {
//  APPEND_MOVE: 'APPEND_MOVE',
//  ENGINE_MOVE: 'ENGINE_MOVE',
//  NEW_OPENING: 'NEW_OPENING',
//  SAVE_EVAL: 'SAVE_EVAL',
//  PRIME_GUI: 'PRIME_GUI'
//};

const getInitialState = () => ({
  usermove: '',
  bestmove: '',
  gamePlay: {
    info: [],
    gameMoves: [
      //'a2a3','a7a6',
      //'b2b3','b7b6',
      //'c2c3','c7c6',
      //'d2d3','d7d6',
      //'e2e3','e7e6',
      //'f2f3','f7f6',
      //'g2g3','g7g6',
      //'h2h3','h7h6',
      //'a3a4','a6a5',
      //'b3b4','b6b5',
      //'c3c4','c6c5',
      //'d3d4','d6d5',
      //'e3e4','e6e5',
      //'f3f4','f6f5',
      //'g3g4','g6g5',
      //'h3h4','h6h5',
      //'a4b5', 'b8c6',
      //'g1f3', 'a8a7',
      //'f1g2', 'h8h7',
      //'e1g1'
    ],
    //evaluation: -1.58
    evaluation: 0
  },
  currentGame: {
    isPlayerWhite: true,
    //opening: 'Queen\'s Gambit',
    opening: '',
    openingBook: {
      name: 'No book',
      filename: 'nobook.bin'
    },
    engine: {
      hmi: 'Stockfish 12',
      filename: 'a-stockf',
      level: {
        hmi: 'Level 00'
      },
      engineHasPersonalities: false,
      personality: {}
    }
  }
});

const actionHandlers = {
  [actions.APPEND_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.usermove = payload.move;
    newState.gamePlay.gameMoves = [...state.gamePlay.gameMoves, payload.move];
    return newState;
  },

  [actions.ENGINE_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.bestmove = payload.move.bestmove;
    newState.gamePlay.gameMoves = [...state.gamePlay.gameMoves, payload.move.bestmove];
    newState.gamePlay.info = payload.move.info;
    return newState;
  },

  [actions.NEW_OPENING]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.currentGame.opening = payload.opening;
    return newState;
  },

  [actions.SAVE_EVAL]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gamePlay.evaluation = payload.evaluation;
    return newState;
  },

  [actions.PRIME_GUI]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gamePlay = payload.gamePlay;
    newState.currentGame = payload.currentGame;
    return newState;
  }
}

export default createReducer(getInitialState(), actionHandlers);

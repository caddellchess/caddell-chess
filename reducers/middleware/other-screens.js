const populateBoard = require('../../actions/populate-board.js');
const actions = require('../../actions/actions');

const otherScreens = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.SHOW_BOARD) {
    const fen = chess.fen();
    populateBoard(dispatch)(fen);
  }

  if (action.type == actions.DISPLAY_BOARD) {
    const state = getState();
    const board = state.gamePlay.board.board;
    const whiteTaken = state.gamePlay.board.whiteTaken;
    const blackTaken = state.gamePlay.board.blackTaken;
    await nextion.setPage('6');
    for (let rank = 0; rank < 8; rank++) {
      await nextion.setValue(`page6.t${rank}.txt`, `"${board[rank]}"`);
    }
    await nextion.setValue('page6.t8.txt', `"${whiteTaken.join('')}"`);
    await nextion.setValue('page6.t9.txt', `"${blackTaken.join('')}"`);
  }

  if (action.type == actions.SHOW_GAME_OVER) {
    const state = getState();
    const gameOverReason = state.currentGame.gameOverReason;
    const gameMoves = state.gamePlay.gameMoves;
    const lastMove = gameMoves.pop();
    await nextion.setPage('5');
    await nextion.setValue('page5.t0.txt', `"${lastMove}\r${gameOverReason}"`);
    await nextion.setValue('page5.t0.font', '2');
    await nextion.setValue('page5.t0.pco', '65504');
  }
}

module.exports = otherScreens;

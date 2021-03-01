const { evaluateCurrentPosition } = require('../../actions/evaluate-current-position');
const { getOpening } = require('../../actions/get-opening');
const actions = require('../../actions/actions');

// For using opening books
var Polyglot = require('polyglot-chess');
var polyglot = new Polyglot();

const handleMoves = (dispatch, getState, engine, chess, nextion) => async action => {
  const checkForGameOver = () => {
    if (chess.in_checkmate()) { return 'CHECKMATE!'; }
    if (chess.in_stalemate()) { return 'STALEMATE!'; }
    if (chess.in_threefold_repetition()) { return 'THREEFOLD REPETITION DRAW!'; }
    if (chess.insufficient_material()) { return 'INSUFFICIENT MATERIAL DRAW!'; }
    if (chess.in_draw()) { return 'DRAW!'; }
    return '';
  }

  const promoteToPiece = async onOff => {
    // turn off regular game-play elements
    for (let i = 0; i < 8; i++) {
      await nextion.setVisible(`b${i}`, !onOff);
    }
    await nextion.setVisible('b8', !onOff);
    await nextion.setVisible('b10', !onOff);
    await nextion.setVisible('b11', !onOff);
    await nextion.setVisible('b12', !onOff);
    // turn on promotion elements
    await nextion.setVisible('q1', onOff);
    await nextion.setVisible('t6', onOff);
    await nextion.setVisible('b13', onOff);
    await nextion.setVisible('b14', onOff);
    await nextion.setVisible('b15', onOff);
    await nextion.setVisible('b16', onOff);
  }

  if (action.type == actions.INVALID_MOVE) {
    await nextion.setValue('page1.t0.font', '1');
    await nextion.setValue('page1.t0.pco', '64008');
    await nextion.setValue('page1.t0.txt', '"INVALID!"');
  }

  if (action.type == actions.SEND_MOVE) {
    await nextion.setValue('page1.t0.font', '2');
    await nextion.setValue('page1.t0.pco', '65504');
    await nextion.setValue('page1.t0.txt', '"thinking..."');
    const state = getState();
    const usermove = state.buttonPress.usermove;
    await dispatch({ type: actions.VERIFY_MOVE, payload: { move: usermove }});
    const gameOverReason = checkForGameOver();
    if (gameOverReason) {
      dispatch({ type: actions.GAME_OVER, payload: { reason: gameOverReason }});
      dispatch({ type: actions.SHOW_GAME_OVER});
    }
  }

  if (action.type == actions.PROMOTE_PAWN) {
    const state = getState();
    let usermove = state.buttonPress.usermove;
    const promotionPiece = action.payload.piece;
    usermove += promotionPiece;
    dispatch({ type: actions.CLEAR_MOVE });
    const moveObject = chess.move(usermove, { sloppy: true });
    if (!moveObject) {
      dispatch({ type: actions.INVALID_MOVE });
    } else {
      await dispatch({ type: actions.APPEND_MOVE, payload: { move: usermove }});
      dispatch({ type: actions.PLAY_ENGINE });
    }
    promoteToPiece(false);
  }

  if (action.type == actions.PLAY_ENGINE) {
    let resultedMove = {};
    const state = getState();
    let useBook = state.currentGame.useBook;
    const openingBookFilename = state.currentGame.openingBook.filename;
    if (useBook) {
      let randomMove = state.currentGame.randomMove;
      const fen = chess.fen();
      const bookmove = polyglot.find(
        fen,
        `./books/${openingBookFilename}`,
        (++randomMove <= 2)
      );
      dispatch({ type: actions.BOOK_MOVE_INCREASE, payload: { randomMove: randomMove }});
      if (bookmove) {
        resultedMove.bestmove = bookmove;
      } else {
        useBook = false;
        dispatch({ type: actions.EMPTIED_BOOK, payload: { useBook: useBook }});
      }
    }

    if (!useBook) {
      //await engine.position('startpos', [...state.gamePlay.gameMoves, usermove]);
      await engine.position('startpos', state.gamePlay.gameMoves);
      // TODO REMOVE THE FOLLOWING: For testing promotions only
      //await engine.position('8/P4r2/4k3/8/8/4K3/5B2/8 w - - 0 1', state.gamePlay.gameMoves);
      resultedMove = await engine.go({ movetime: 5000 });
    }
    chess.move(resultedMove.bestmove, { sloppy: true });
    await dispatch({ type: actions.ENGINE_MOVE, payload: { move: resultedMove }});
    getOpening(dispatch)(chess.pgn());
    await evaluateCurrentPosition(dispatch, getState)(resultedMove);
    dispatch({ type: actions.SHOW_EVAL });
    dispatch({ type: actions.EVAL_BLUNDER });
    const gameOverReason = checkForGameOver();
    if (gameOverReason) {
      dispatch({ type: actions.GAME_OVER, payload: { reason: gameOverReason }});
      dispatch({ type: actions.SHOW_GAME_OVER});
    }
  }

  verification: if (action.type == actions.VERIFY_MOVE ) {
    // check for promotion
    const state = getState();
    let usermove = action.payload.move;
    const isPlayerWhite = state.currentGame.isPlayerWhite;
    if (isPlayerWhite && usermove.substr(3,1) == '8' ||
      !isPlayerWhite && usermove.substr(3,1) == '1') {
      const piece = chess.get(usermove.substr(0,2));
      if (piece.type.toLowerCase() == 'p') {
        promoteToPiece(true);
        break verification;
      }
    }

    dispatch({ type: actions.CLEAR_MOVE });
    const moveObject = chess.move(usermove, { sloppy: true });
    if (!moveObject) {
      dispatch({ type: actions.INVALID_MOVE });
    } else {
      await dispatch({ type: actions.APPEND_MOVE, payload: { move: usermove } });
      dispatch({ type: actions.PLAY_ENGINE });
    }

  }

  if (action.type == actions.ENGINE_MOVE || action.type == actions.RESTORE_ENGINE_MOVE) {
    const bestmove = action.payload.move.bestmove;
    const showEngineMove = bestmove +
      (chess.in_checkmate() ? '#' :
        (chess.in_check() ? '+' : '')
      );
    await nextion.setValue('page1.t0.font', '1');
    await nextion.setValue('page1.t0.pco', '1733');
    await nextion.setValue('page1.t0.txt', `"${showEngineMove}"`);
  }

  if (action.type == actions.ENGINE_MOVE) {
    dispatch({ type: actions.SHOW_EVAL });
  }
}

module.exports = handleMoves;

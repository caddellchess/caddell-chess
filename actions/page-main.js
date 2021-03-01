const store = require('../index');
const actions = require('./actions');

const pageMain = (dispatch, getState) => async (data) => {
  const state = getState();
  switch (data.buttonId) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      await dispatch({
        type: actions.USER_MOVE,
        payload: {
          button: data.buttonId
        }
      });
      dispatch({ type: actions.UPDATE_DISPLAY });
      break;
    case 9:
      // send button
      dispatch({
        type: actions.SEND_MOVE
      });
      break;
    case 10:
      await dispatch({ type: actions.CLEAR_MOVE });
      dispatch({ type: actions.UPDATE_DISPLAY });
      break;
    case 11:
      dispatch({
        type: actions.SHOW_BOARD
      });
      break;
    case 19:
      dispatch({
        type: actions.SHOW_HINT
      });
      break;
    case 20:
      // settings button
      await dispatch({
        type: actions.SEED_SETTINGS,
        payload: {currentGame: state.currentGame}
      });
      dispatch({ type: actions.PRELOAD_SETTINGS });
      break;
    case 24:
      // promote to a queen
      dispatch({ type: actions.PROMOTE_PAWN, payload: { piece: 'q' } });
      break;
    case 25:
      // promote to a bishop
      dispatch({ type: actions.PROMOTE_PAWN, payload: { piece: 'b' } });
      break;
    case 26:
      // promote to a knight
      dispatch({ type: actions.PROMOTE_PAWN, payload: { piece: 'n' } });
      break;
    case 27:
      // promote to a rook
      dispatch({ type: actions.PROMOTE_PAWN, payload: { piece: 'r' } });
      break;
  }
}

module.exports = pageMain;

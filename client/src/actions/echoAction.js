import actions from './actions';

export const echoAction = (actionFromServer) => dispatch => {
  switch (actionFromServer.type) {
    case actions.APPEND_MOVE:
    case actions.ENGINE_MOVE:
    case actions.LOAD_LEVELS:
    case actions.NEW_OPENING:
    case actions.SAVE_EVAL:
    case actions.UPDATE_CLIENT_ENGINE:
    case actions.PRIME_GUI:
      dispatch({...actionFromServer});
      break;
    default:
      dispatch({
        type: actions.ECHO_ACTION,
        payload: actionFromServer
      });
  };
}

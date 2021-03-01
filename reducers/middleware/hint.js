const actions = require('../../actions/actions');

const hint = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.SHOW_HINT) {
    const state = getState();
    const hint = state.gamePlay.hintMove;
    await nextion.setValue('page1.t0.font', '2');
    await nextion.setValue('page1.t0.pco', '52857');
    await nextion.setValue('page1.t0.txt', `"hint: ${hint}"`);
    await nextion.setVisible('t4', false);
    await nextion.setVisible('t5', false);
    dispatch({ type: actions.PRIME_MOVE, payload: { move: hint }});
    dispatch({ type: actions.RESET_BUTTONS });
  }
}

module.exports = hint;

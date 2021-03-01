const actions = require('../../actions/actions');

const display = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.UPDATE_DISPLAY) {
    const state = getState();
    dispatch({ type: actions.RESET_BUTTONS });
    const usermove = state.buttonPress.usermove;
    await nextion.setValue('page1.t0.font', '1');
    await nextion.setValue('page1.t0.pco', '64875');
    await nextion.setValue('page1.t0.txt', `"${usermove}"`);
  }

  if (action.type == actions.RESET_BUTTONS) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const state = getState();
    const isLetters = state.buttonPress.isLetters;
    for (let i = 0; i < 8; i++) {
      await nextion.setValue(`page1.b${i}.txt`, `"${isLetters ? letters[i] : numbers[i]}"`);
    }
  }

  if (action.type == actions.CLEAR_DISPLAY) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let i = 0; i < 8; i++) {
      await nextion.setValue(`page1.b${i}.txt`, `"${letters[i]}"`);
    }
    await nextion.setValue('page1.t0.txt', `""`);
    await nextion.setVisible('t5', false);
  }

  if (action.type == actions.RELOAD_MAIN) {
    const state = getState();
    const opening = state.currentGame.opening;
    const move = { move: state.gamePlay };
    dispatch({ type: actions.SHOW_ENGINE });
    dispatch({ type: actions.NEW_OPENING, payload: { opening: opening }});
    dispatch({ type: actions.SHOW_EVAL });
    dispatch({ type: actions.RESTORE_ENGINE_MOVE, payload: move });
  }

  if (action.type == actions.NEW_OPENING) {
    const opening = action.payload.opening;
    let openingText = ''
    if (opening) {
      openingText = `${opening.name} ${opening.variation}`;
    }
    await nextion.setValue('page1.t2.txt', `"${openingText}"`);
  }
}

module.exports = display;

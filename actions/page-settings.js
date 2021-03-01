const store = require('../index');
const actions = require('./actions');

const pageSettings = dispatch => data => {
  switch (data.buttonId) {
    case 2:
      dispatch({ type: actions.RELOAD_MAIN });
      break;
    case 3:
      // goto settings page 2
      dispatch({ type: actions.PRELOAD_SETTINGS_TWO });
      break;
    case 4:
      dispatch({ type: actions.START_NEW_GAME });
      break;
    case 5:
    case 6:
      dispatch({ type: actions.SET_PLAYER_COLOR });
      break;
    case 7:
      // engine chooser
      dispatch({ type: actions.SETUP_ENGINE_CHOOSER });
      break;
    case 8:
      // level chooser
      dispatch({ type: actions.SETUP_LEVEL_CHOOSER });
      break;
    case 9:
      // drop down slider
      dispatch({ type: actions.SLIDER_POSITION });
      break;
    case 10:
    case 11:
    case 12:
    case 13:
      // an item in the drop down list
      const offset = 10;
      dispatch({ type: actions.SELECTION_MADE, payload: { offset: (data.buttonId - offset) } });
      break;
  }
}

module.exports = pageSettings;

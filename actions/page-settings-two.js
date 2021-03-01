const store = require('../index');
const actions = require('./actions');

const pageSettingsTwo = dispatch => data => {
  switch (data.buttonId) {
    case 1:
      // personalities chooser
      dispatch({ type: actions.SETUP_PERSONALITY_CHOOSER });
      break;
    case 2:
      // go back to settings page one
      dispatch({ type: actions.PRELOAD_SETTINGS });
      break;
    case 3:
      // save and restart game
      dispatch({ type: actions.START_NEW_GAME });
      break;
    case 4:
      // shutdown
      break;
    case 5:
      // opening books chooser
      dispatch({ type: actions.SETUP_BOOK_CHOOSER });
    case 10:
      // drop down slider
      dispatch({ type: actions.SLIDER_POSITION_TWO });
      break;
    case 6:
    case 7:
    case 8:
    case 9:
      // an item in the drop down list
      const offset = 6;
      dispatch({ type: actions.SELECTION_MADE_TWO, payload: { offset: (data.buttonId - offset) } });
      break;
  }
}

module.exports = pageSettingsTwo;

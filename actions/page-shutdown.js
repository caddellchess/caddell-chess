const store = require('../index');
const actions = require('./actions');

const pageShutdown = dispatch => data => {
  switch (data.buttonId) {
    case 1:
      dispatch({ type: actions.POWER_DOWN });
      break;
    case 2:
      dispatch({ type: actions.PRELOAD_SETTINGS_TWO });
      break;
  }
}

module.exports = pageShutdown;

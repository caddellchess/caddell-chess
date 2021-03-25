const store = require('../index');
const actions = require('./actions');

const pageGameOver = dispatch => data => {
  switch (data.buttonId) {
    case 1:
      dispatch({ type: actions.START_NEW_GAME });
      break;
    case 2:
      dispatch({ type: actions.POWER_DOWN });
      break;
  }
}

module.exports = pageGameOver;

const store = require('../index');
const actions = require('./actions');

const pageBoard = dispatch => data => {
  switch (data.buttonId) {
    case 1:
      dispatch({ type: actions.RELOAD_MAIN });
      break;
  }
}

module.exports = pageBoard;

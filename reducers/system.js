const createReducer = require('./create-reducer');
const actions = require('../actions/actions');

const getInitialState = () => ({
  //areYouSure: false,
  booksArray: [],
  engineArray: []
});

const actionHandlers = {
  [actions.POWER_DOWN]: state => {
    require('child_process')
      .exec('sudo /sbin/shutdown -h now',
        function (msg) { console.info(msg) } // silly this is, log it right
      );
  },

  [actions.START_UP]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.booksArray = payload.booksArray;
    newState.engineArray = payload.engineArray;
    return newState;
  }
}

//module.exports = createReducer(getInitialState(), actionHandlers);
module.exports = {
  system: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

const createReducer = require('./create-reducer');
const actions = require('../actions/actions');

const getInitialState = () => ({
  usermove: '',
  isLetters: true,
  hintShowing: false
});

const letters = [, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // notice leading comma
const numbers = [, '1', '2', '3', '4', '5', '6', '7', '8']; // notice leading comma

const actionHandlers = {
  [actions.USER_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    if (state.hintShowing) {
      newState.usermove = ''
      newState.hintShowing = false;
    }
    newState.usermove = newState.usermove + (newState.isLetters ? letters[payload.button] : numbers[payload.button]);
    newState.isLetters = !newState.isLetters;
    return newState;
  },

  [actions.CLEAR_MOVE]: state => {
    const newState = Object.assign({}, state);
    newState.usermove = '';
    newState.isLetters = true;
    return newState;
  },

  [actions.PRIME_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.usermove = payload.move;
    newState.hintShowing = true;
    newState.isLetters = true;
    return newState;
  }
};

//module.exports = createReducer(getInitialState(), actionHandlers);
module.exports = {
  buttonPress: createReducer(getInitialState(), actionHandlers),
  getInitialState: getInitialState
}

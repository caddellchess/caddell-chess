const getInitialState = () => ({
  action: '',
  payload: {}
});

// every action gets written to global state
const lastAction = (state = null, action) => {
  console.log('action -->', action);
  return action;
};

module.exports = {
  lastAction: lastAction,
  getInitialState: getInitialState
}

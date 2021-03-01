import createReducer from './create-reducer';
const actions = {
  ECHO_ACTION: 'ECHO_ACTION'
};

const getInitialState = () => ({
  empty: null
});

const actionHandlers = {
  [actions.ECHO_ACTION]: (state, {payload}) => {
    return state;
  }
}

export default createReducer(getInitialState(), actionHandlers);

import createReducer from './create-reducer';
import actions from  '../actions/actions';

const getInitialState = () => ({
  empty: null
});

const actionHandlers = {
  [actions.ECHO_ACTION]: (state, {payload}) => {
    return state;
  }
}

export default createReducer(getInitialState(), actionHandlers);

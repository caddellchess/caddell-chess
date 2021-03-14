import createReducer from './create-reducer';
import actions from '../actions/actions';

const getInitialState = () => ({
  levels: [],
  engineDefaults: [],
  personalities: {},
  engineHasPersonalities: false
});

const actionHandlers = {
  [actions.LOAD_LEVELS]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.levels = payload.engineLevels.levelArray;
    newState.engineDefaults = payload.engineLevels.engineDefaults;
    newState.engineHasPersonalities = payload.engineLevels.engineHasPersonalities;
    newState.personalities = payload.personalities;
    return newState;
  }
};

export default createReducer(getInitialState(), actionHandlers);
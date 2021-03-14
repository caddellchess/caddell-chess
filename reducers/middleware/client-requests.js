const getEngineLevels = require('../../helpers/get-engine-levels');
const getEnginePersonalities = require('../../helpers/get-personalities');
const actions = require('../../actions/actions');

const clientRequests = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.RETRIEVE_LEVELS) {
    const engine = action.payload.engine;
    const engineLevels = await getEngineLevels(engine);

    let engineHasPersonalities = engineLevels.engineHasPersonalities;

    let personalities = {};
    if (engineHasPersonalities) {
      personalities = await getEnginePersonalities(engine);
    }

    dispatch({
      type: actions.LOAD_LEVELS,
      payload: { engineLevels, personalities }
    });
  }

  if (action.type == actions.CLIENT_START_GAME) {
    const { isPlayerWhite, engine, openingBook, personality, useBook } = action.payload;
    await dispatch({
      type: actions.APPLY_SETTINGS,
      payload: {
        isPlayerWhite,
        engine,
        openingBook,
        personality,
        useBook
      }
    });
    await dispatch({ type: actions.CLEAR_GAME });
    await dispatch({ type: actions.NEW_GAME });
    await dispatch({ type: actions.SHOW_ENGINE });
    const state = getState();
    dispatch({ type: actions.PRIME_GUI, payload: state });
  }
}

module.exports = clientRequests;

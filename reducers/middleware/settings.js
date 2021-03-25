const setupCombobox = require('./setup-combobox');
const getEngineLevels = require('../../helpers/get-engine-levels');
const getEnginePersonalities = require('../../helpers/get-personalities');
const actions = require('../../actions/actions');

let levelArray = [];

const settings = (dispatch, getState, engine, chess, nextion) => async action => {
  const actOnEngineComboboxSelection = async index => {
    const state = getState();
    const engineArray = state.system.engineArray;
    await nextion.setValue('page2.t0.txt', `"${engineArray[index].hmi}"`);
    action.payload.engine = {};
    action.payload.engine.hmi = engineArray[index].hmi;
    action.payload.engine.filename = engineArray[index].filename;

    // levels
    const engineLevels = await getEngineLevels(engineArray[index].filename);
    let levelArray = engineLevels.levelArray;
    let engineDefaults = engineLevels.engineDefaults;
    action.payload.level = {};
    action.payload.level.hmi = levelArray[0].hmi;
    action.payload.level.mri = levelArray[0].mri;
    action.payload.engineDefaults = engineDefaults;

    //personalities
    let engineHasPersonalities = engineLevels.engineHasPersonalities;
    action.payload.engineHasPersonalities = engineHasPersonalities;
    await nextion.setVisible('q0', engineHasPersonalities);
    if (engineHasPersonalities) {
      const personalities = await getEnginePersonalities(engineArray[index].filename);
      if (Object.keys(personalities).length) {
        const firstPersonalityKey = Object.keys(personalities)[0];
        action.payload.personality = personalities[firstPersonalityKey];
      }
    }

    const levelHMI = levelArray[0].hmi;
    await nextion.setValue('page2.t1.txt', `"${levelHMI}"`);
  }

  const actOnLevelComboboxSelection = async index => {
    await nextion.setValue('page2.t1.txt', `"${levelArray[index].hmi}"`);
    action.payload.level = {};
    action.payload.level.hmi = levelArray[index].hmi;
    action.payload.level.mri = levelArray[index].mri;
  }

  if (action.type == actions.SET_PLAYER_COLOR) {
    const getPlayerWhiteValue = await nextion.getValue('page2.bt0.val');
    const playerWhiteValue = getPlayerWhiteValue.data.value;
    dispatch({ type: actions.SET_SETTINGS_COLOR, payload: { isPlayerWhite: !playerWhiteValue }});
  }

  if (action.type == actions.PRELOAD_SETTINGS) {
    const state = getState();
    const isPlayerWhite = state.settings.isPlayerWhite;
    const engineName = state.settings.engine.hmi;
    const levelHMI = state.settings.engine.level.hmi;
    await nextion.setValue('page2.bt0.val', isPlayerWhite ? 0 : 1);
    await nextion.setValue('page2.bt1.val', isPlayerWhite ? 0 : 1);
    await nextion.setValue('page2.t0.txt', `"${engineName}"`);
    await nextion.setValue('page2.t1.txt', `"${levelHMI}"`);
  }

  if (action.type == actions.START_NEW_GAME) {
    const state = getState();
    const isPlayerWhite = state.settings.isPlayerWhite;
    const engine = state.settings.engine;
    const openingBook = state.settings.openingBook;
    const personality = state.settings.personality;
    const useBook = state.settings.openingBook.filename != 'nobook.bin';

    await dispatch({
      type: actions.APPLY_SETTINGS,
      payload: {
        isPlayerWhite: isPlayerWhite,
        engine: engine,
        openingBook: openingBook,
        personality: personality,
        useBook: useBook,
        relayChess: false,
        relayEngine: {}
      }
    });
    await dispatch({
      type: actions.CLEAR_GAME
    });
    await dispatch({ type: actions.NEW_GAME });
    dispatch({ type: actions.SHOW_ENGINE });
  }

  if (action.type == actions.SETUP_ENGINE_CHOOSER) {
    const state = getState();
    const engineArray = state.system.engineArray;
    await nextion.setVisible('t0', false);
    await nextion.setVisible('t1', false);
    setupCombobox(engineArray, nextion);
    dispatch({
      type: actions.REMEMBER_COMBOBOX_TYPE,
      payload: {
        isComboboxEngines: true,
        isComboboxLevels: false,
        isComboboxBooks: false,
        isComboboxPersonalities: false
      }
    });
  }

  if (action.type == actions.SETUP_LEVEL_CHOOSER) {
    const state = getState();
    const engine = state.settings.engine.filename;
    const engineLevels = await getEngineLevels(engine);
    levelArray = engineLevels.levelArray;
    await nextion.setVisible('t0', false);
    await nextion.setVisible('t1', false);
    setupCombobox(levelArray, nextion);
    dispatch({
      type: actions.REMEMBER_COMBOBOX_TYPE,
      payload: {
        isComboboxEngines: false,
        isComboboxLevels: true,
        isComboboxBooks: false,
        isComboboxPersonalities: false
      }
    });
  }

  if (action.type == actions.SLIDER_POSITION) {
    const state = getState();
    const isComboboxLevels = state.settings.isComboboxLevels;
    const isComboboxEngines = state.settings.isComboboxEngines;
    if (isComboboxEngines || isComboboxLevels) {
      const engineArray = state.system.engineArray;
      const h0val = await nextion.getValue('page2.h0.val');
      if (h0val.code == 113) {
        const index = (isComboboxLevels ? levelArray.length : engineArray.length) - (h0val.data.value + 4) + 0;
        await nextion.setValue('page2.b3.txt', `"${(isComboboxLevels ? levelArray : engineArray)[index+0].hmi}"`);
        await nextion.setValue('page2.b4.txt', `"${(isComboboxLevels ? levelArray : engineArray)[index+1].hmi}"`);
        await nextion.setValue('page2.b5.txt', `"${(isComboboxLevels ? levelArray : engineArray)[index+2].hmi}"`);
        await nextion.setValue('page2.b6.txt', `"${(isComboboxLevels ? levelArray : engineArray)[index+3].hmi}"`);
      }
    }
  }

  if (action.type == actions.SELECTION_MADE) {
    const state = getState();
    const isComboboxLevels = state.settings.isComboboxLevels;
    const isComboboxEngines = state.settings.isComboboxEngines;
    if (isComboboxLevels || isComboboxEngines) {
      const engineArray = state.system.engineArray;
      const h0val = await nextion.getValue('page2.h0.val');
      if (h0val.code == 113) {
        const index = (isComboboxLevels ? levelArray.length : engineArray.length) - (h0val.data.value + 4) + action.payload.offset;
        isComboboxLevels ? actOnLevelComboboxSelection(index) : actOnEngineComboboxSelection(index, nextion);
        await nextion.setVisible('t0', true);
        await nextion.setVisible('t1', true);
      }
    }
  }
}

module.exports = settings;

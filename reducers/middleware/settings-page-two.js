const setupCombobox = require('./setup-combobox');
const getEnginePersonalities = require('../../helpers/get-personalities');
const actions = require('../../actions/actions');

let personalityArray = [];

const settingsPageTwo = (dispatch, getState, engine, chess, nextion) => async action => {
  const actOnBooksComboboxSelection = async index => {
    const state = getState();
    const booksArray = state.system.booksArray;
    await nextion.setValue('page3.t0.txt', `"${booksArray[index].hmi}"`);
    action.payload.openingBook = {};
    action.payload.openingBook.name = booksArray[index].hmi;
    action.payload.openingBook.filename = booksArray[index].mri;
  }

  const actOnPersonalityComboboxSelection = async index => {
    await nextion.setValue('page3.t1.txt', `"${personalityArray[index].hmi}"`);
    action.payload.personality = {};
    action.payload.personality.name = personalityArray[index].hmi;
    action.payload.personality.mri = personalityArray[index].mri;
  }

  if (action.type == actions.PRELOAD_SETTINGS_TWO) {
    const state = getState();
    const openingBook = state.settings.openingBook;
    const engineHasPersonalities = state.settings.engine.engineHasPersonalities;
    const personality = state.settings.engine.personality;
    await nextion.setValue('page3.t0.txt', `"${openingBook.name}"`);
    if (engineHasPersonalities) {
      await nextion.setValue('page3.t1.txt', `"${personality.hmi}"`);
      await nextion.setVisible('t1', true);
      await nextion.setVisible('q0', true);
    } else {
      await nextion.setVisible('t1', false);
      await nextion.setVisible('q0', false);
    }
  }

  if (action.type == actions.SETUP_BOOK_CHOOSER) {
    const state = getState();
    const booksArray = state.system.booksArray;
    await nextion.setVisible('page3.t0.txt', false);
    await nextion.setVisible('page3.t1.txt', false);
    setupCombobox(booksArray, nextion);
    dispatch({
      type: actions.REMEMBER_COMBOBOX_TYPE,
      payload: {
        isComboboxEngines: false,
        isComboboxLevels: false,
        isComboboxBooks: true,
        isComboboxPersonalities: false
      }
    });
  }

  if (action.type == actions.SETUP_PERSONALITY_CHOOSER) {
    const state = getState();
    const engine = state.settings.engine.hmi;
    const engineFilename = state.settings.engine.filename;
    const rawPersonalities = await getEnginePersonalities(engineFilename);
    if (engineFilename == 'd-rodent4') {
      personalityArray = Object.keys(rawPersonalities)
        .map(p => ({hmi: p, mri: rawPersonalities[p].mri}));
    } else {
      personalityArray = Object.keys(rawPersonalities)
        .map(p => ({hmi: p, mri: rawPersonalities[p].mri}));
    }
    await nextion.setVisible('page3.t0.txt', false);
    await nextion.setVisible('page3.t1.txt', false);
    setupCombobox(personalityArray, nextion);
    dispatch({
      type: actions.REMEMBER_COMBOBOX_TYPE,
      payload: {
        isComboboxEngines: false,
        isComboboxLevels: false,
        isComboboxBooks: false,
        isComboboxPersonalities: true
      }
    });
  }

  if (action.type == actions.SLIDER_POSITION_TWO) {
    const state = getState();
    const isComboboxBooks = state.settings.isComboboxBooks;
    const isComboboxPersonalities = state.settings.isComboboxPersonalities;
    if (isComboboxBooks || isComboboxPersonalities) {
      const booksArray = state.system.booksArray;
      const h0val = await nextion.getValue('page3.h0.val');
      if (h0val.code == 113) {
        const index = (isComboboxBooks ? booksArray.length : personalityArray.length) - (h0val.data.value + 4) + 0;
        await nextion.setValue('page3.b3.txt', `"${(isComboboxBooks ? booksArray : personalityArray)[index+0].hmi}"`);
        await nextion.setValue('page3.b4.txt', `"${(isComboboxBooks ? booksArray : personalityArray)[index+1].hmi}"`);
        await nextion.setValue('page3.b5.txt', `"${(isComboboxBooks ? booksArray : personalityArray)[index+2].hmi}"`);
        await nextion.setValue('page3.b6.txt', `"${(isComboboxBooks ? booksArray : personalityArray)[index+3].hmi}"`);
      }
    }
  }

  if (action.type == actions.SELECTION_MADE_TWO) {
    const state = getState();
    const isComboboxBooks = state.settings.isComboboxBooks;
    const isComboboxPersonalities = state.settings.isComboboxPersonalities;
    if (isComboboxBooks || isComboboxPersonalities) {
      const booksArray = state.system.booksArray;
      const h0val = await nextion.getValue('page3.h0.val');
      if (h0val.code == 113) {
        const index = (isComboboxBooks ? booksArray.length : personalityArray.length) - (h0val.data.value + 4) + action.payload.offset;
        isComboboxBooks ? actOnBooksComboboxSelection(index) : actOnPersonalityComboboxSelection(index, nextion);
        await nextion.setVisible('t0', true);
        await nextion.setVisible('t1', true);
      }
    }
  }
}

module.exports = settingsPageTwo;

const Nextion = require('nextion');
const { Engine } = require('node-uci');
const { Chess } = require('chess.js');
const processTouchEvent = require('../process-touch-event');
const initialize = require('./middleware/initialize');
const evaluations = require('./middleware/evaluations');
const display = require('./middleware/display');
const hint = require('./middleware/hint');
const otherScreens = require('./middleware/other-screens');
const handleMoves = require('./middleware/handle-moves');
const settings = require('./middleware/settings');
const settingsPageTwo = require('./middleware/settings-page-two');
const getAllBooks = require('../helpers/get-books');
const { getAllEngines } = require('../helpers/get-engines');
const actions = require('../actions/actions');

const chess = new Chess();

let nextion;
let engine;
let isNextionSetup = false;

function middleware({ getState, dispatch }) {
  return next => async action => {
    if (!isNextionSetup) {
      isNextionSetup = true;
      nextion = await Nextion.fromPort('/dev/ttyAMA0');
      await nextion.setPage('1');
      await nextion.setValue('page1.t0.font', '2');
      await nextion.setValue('page1.t0.pco', '65504');
      await nextion.setValue('page1.t0.txt', '"loading..."');
      await nextion.setScreenBrightness('100');
      nextion.on('touchEvent', async data => {
        processTouchEvent(dispatch, getState)(data);
      })
    }

    if (action.type == actions.NEW_GAME) {
      await engine.quit();
      await nextion.setPage('1');
    }

    if (action.type == actions.START_UP) {
      const booksArray = await getAllBooks();
      const engineArray = await getAllEngines();
      action.payload = {
        booksArray: booksArray,
        engineArray: engineArray
      }; // dubious at best... but for now it works
    }

    if (action.type == actions.START_UP || action.type == actions.NEW_GAME) {
      const state = getState();
      const engineFile = state.currentGame.engine.filename;
      engine = await new Engine(`./engines/armv7l/${engineFile}`);
    }

    await initialize(dispatch, getState, engine, chess, nextion)(action);
    await display(dispatch, getState, engine, chess, nextion)(action);
    await handleMoves(dispatch, getState, engine, chess, nextion)(action);
    await evaluations(dispatch, getState, engine, chess, nextion)(action);
    await hint(dispatch, getState, engine, chess, nextion)(action);
    await otherScreens(dispatch, getState, engine, chess, nextion)(action);
    await settings(dispatch, getState, engine, chess, nextion)(action);
    await settingsPageTwo(dispatch, getState, engine, chess, nextion)(action);

    const returnValue = next(action)
    return returnValue
  }
}

module.exports = middleware;

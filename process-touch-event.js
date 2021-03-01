// actions
const pageMain = require('./actions/page-main');
const pageSettings = require('./actions/page-settings');
const pageSettingsTwo = require('./actions/page-settings-two');
const pageGameOver = require('./actions/page-game-over');
const pageBoard = require('./actions/page-board');
const pageShutdown = require('./actions/page-shutdown');

const processTouchEvent = (dispatch, getState) => data => {
  switch (data.pageId) {
    case 1:
      pageMain(dispatch, getState)(data);
      break;
    case 2:
      pageSettings(dispatch)(data);
      break;
    case 3:
      pageSettingsTwo(dispatch)(data);
      break;
    case 5:
      pageGameOver(dispatch)(data);
      break;
    case 6:
      pageBoard(dispatch)(data);
      break;
    case 7:
      pageShutdown(dispatch)(data);
    default:
  }
}

module.exports = processTouchEvent

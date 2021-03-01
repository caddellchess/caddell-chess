const ChessTools = require('chess-tools');
const actions = require('./actions');

const ECO = ChessTools.ECO;
const eco = new ECO();

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms || DEFAULT_DELAY));
}

let isECOLoaded = false;

(function loadECO() {
  eco.load_default();
  eco.on('loaded', () => {
    isECOLoaded = true;
  });
})();

const getOpening = dispatch => async pgn => {
  while (!isECOLoaded) {
    await sleep(100);
  }

  const opening = eco.find(pgn);
  dispatch({
    type: actions.NEW_OPENING,
    payload: {
      opening: opening
    }
  });
};

const checkForBookMove = dispatch => async pgn => {
  while (!isECOLoaded) {
    await sleep(100);
  }

  const opening = eco.find(pgn, true);
  dispatch({
    type: actions.BOOK_MOVE,
    payload: {
      isBookMove: !!opening
    }
  });
};

module.exports = {
  getOpening,
  checkForBookMove
};

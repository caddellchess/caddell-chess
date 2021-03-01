const buttonPress = require('../reducers/button-press').getInitialState;
const currentGame = require('../reducers/current-game').getInitialState;
const gamePlay = require('../reducers/game-play').getInitialState;
const lastAction = require('../reducers/last-action').getInitialState;
const settings = require('../reducers/settings').getInitialState;
const system = require('../reducers/system').getInitialState;

module.exports = {
  buttonPress: buttonPress(),
  gamePlay: gamePlay(),
  lastAction: lastAction(),
  currentGame: currentGame(),
  settings: settings(),
  system: system()
};

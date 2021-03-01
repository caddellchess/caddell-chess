const combineReducers = require('redux').combineReducers;
const buttonPress = require('./button-press').buttonPress;
const currentGame = require('./current-game').currentGame;
const gamePlay = require('./game-play').gamePlay;
const lastAction = require('./last-action').lastAction;
const settings = require('./settings').settings;
const system = require('./system').system;

module.exports = combineReducers({
  buttonPress,
  currentGame,
  gamePlay,
  lastAction,
  settings,
  system
});

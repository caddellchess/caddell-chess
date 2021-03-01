const { Engine } = require('node-uci');
const { povChances } = require('../helpers/winning-chances');
const { moveGrade } = require('../helpers/move-grade');
const actions = require('./actions');

let ponderEngine;
let evalEngine;

(async function setupPonderEngine() {
  ponderEngine = new Engine('./engines/armv7l/a-stockf');
  await ponderEngine.init();
  await ponderEngine.isready();
  await ponderEngine.setoption('MultiPV', 4);
  await ponderEngine.setoption('Hash', 192);
  await ponderEngine.setoption('Threads', 1);
  await ponderEngine.setoption('Slow Mover', 33);
  await ponderEngine.setoption('Move Overhead', 2000);
  await ponderEngine.setoption('Use NNUE', false);
  await ponderEngine.ucinewgame();
  await ponderEngine.isready();
})();

(async function setupEvalEngine() {
  evalEngine = new Engine('./engines/armv7l/a-stockf');
  await evalEngine.init();
  await evalEngine.isready();
  await evalEngine.setoption('MultiPV', 4);
  await evalEngine.setoption('Hash', 192);
  await evalEngine.setoption('Threads', 1);
  await evalEngine.setoption('Slow Mover', 33);
  await evalEngine.setoption('Move Overhead', 2000);
  await evalEngine.setoption('Use NNUE', false);
  await evalEngine.ucinewgame();
  await evalEngine.isready();
})();

const getScore = suggestedMove => {
  let evaluation = {};
  const { info: infos = [] } = suggestedMove;
  let index = infos.length;

  let reversedIterator = {
    next : () => {
      return { done: --index < 0, value: infos[index] }
    }
  }
  reversedIterator[Symbol.iterator] = function() { return this; };

  for (let info of reversedIterator) {
    if (info.hasOwnProperty('score')) {
      if (info.score.unit == 'cp') {
        evaluation.cp = info.score.value * -1;
        break;
      } else if (info.score.unit == 'mate') {
        evaluation.mate = info.score.value;
        break;
      }
    }
  }

  return evaluation;
}

const evaluateCurrentPosition = (dispatch, getState) => async (resultedMove) => {
  const state = getState();
  const gameMoves = [...state.gamePlay.gameMoves];

  await ponderEngine.position('startpos', gameMoves);
  const hintSuggestedMove = await ponderEngine.go({ depth: 4 });

  const evaluation = getScore(resultedMove);

  const isPlayerWhite = state.currentGame.isPlayerWhite;
  const gauge = povChances(isPlayerWhite, evaluation);

  await dispatch({
    type: actions.SAVE_EVAL,
    payload: {
      hintMove: hintSuggestedMove.bestmove,
      evaluation: typeof evaluation.mate != 'undefined' ? ('M' + evaluation.mate) : (evaluation.cp / 100),
      gauge: gauge
    }
  });
};

getScoreEval = (dispatch, getState) => async engineEval => {
  const state = getState();
  const gameMoves = [...state.gamePlay.gameMoves];
  const isPlayerWhite = state.currentGame.isPlayerWhite;
  // get bestmove from "array minus two moves" to represent player move
  await evalEngine.position('startpos', gameMoves.slice(0, gameMoves.length - 2));
  const suggestedMove = await evalEngine.go({ depth: 1 });
  const evaluation = getScore(suggestedMove);
  const playerEval = typeof evaluation.mate != 'undefined' ? ('M' + evaluation.mate) : (evaluation.cp / 100);

  // from: https://www.chess.com/forum/view/general/how-does-the-analysis-engine-determine-some-moves-are-blunders-vs-mistakes-or-inaccuracies
  // * playerSdiff: the score-difference between the player
  // move and the best engine move (always positive)
  //
  // * playerRelativeScore: the absolute engine score after the
  // given player move, cast into positive/negative according to
  // the perspective of the current player, *not* signed
  // according to white/black.
  const playerSdiff = Math.abs((typeof playerEval == 'string' ? 1000 : playerEval) - (typeof engineEval == 'string' ? 1000 : engineEval));
  const playerRelativeScore = (typeof engineEval == 'string' ? 1000 : engineEval) * -1;

  const { letter, number, gradeIndex } = moveGrade(playerSdiff, playerRelativeScore);
  await dispatch({
    type: actions.SAVE_BLUNDER,
    payload: {
      blunderText: letter,
      blunderGrade: gradeIndex
    }
  });
}

module.exports = {
  evaluateCurrentPosition,
  getScoreEval
}

const { checkForBookMove } = require('../../actions/get-opening');
const { getScoreEval } = require('../../actions/evaluate-current-position');
const actions = require('../../actions/actions');

const evaluations = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.SHOW_BLUNDER) {
    const state = getState();
    const isBookMove = state.currentGame.isBookMove;
    if (isBookMove) {
      await nextion.setValue('page1.t5.txt', '"book move"');
      await nextion.setValue('page1.t5.pco', '52863');
      await nextion.setVisible('t5', true);
    } else {
      const blunderText = state.gamePlay.blunder.text;
      const blunderGrade = state.gamePlay.blunder.grade;
      await nextion.setValue('page1.t5.txt', `"${blunderText}"`);
      if (blunderGrade == 0) { await nextion.setValue('page1.t5.pco', '55299'); }
      if (blunderGrade == 1) { await nextion.setValue('page1.t5.pco', '64610'); }
      if (blunderGrade == 4) { await nextion.setValue('page1.t5.pco', '1733'); }
      await nextion.setVisible('t5', (blunderGrade == 2 || blunderGrade == 3) ? false : true);
    }
  }

  if (action.type == actions.SHOW_EVAL) {
    const state = getState();
    const gauge = state.gamePlay.gauge;
    await nextion.setValue('page1.j0.val', `${Math.round(gauge)}`);
    await nextion.bringToFront('q0');
  }

  if (action.type == actions.EVAL_BLUNDER) {
    const state = getState();
    const evaluation = state.gamePlay.evaluation;
    checkForBookMove(dispatch)(chess.pgn());
    await getScoreEval(dispatch, getState)(evaluation);
    dispatch({ type: actions.SHOW_BLUNDER });
  }
}

module.exports = evaluations;

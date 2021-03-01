const actions = require('../../actions/actions');

const initialize = (dispatch, getState, engine, chess, nextion) => async action => {
  if (action.type == actions.START_UP || action.type == actions.NEW_GAME) {
    const state = getState();
    const isPlayerWhite = state.currentGame.isPlayerWhite;
    chess.reset();
    //chess.load('8/P4r2/4k3/8/8/4K3/5B2/8 w - - 0 1'); // TODO REMOVE FEN, this is for testing
    await engine.init();
    await engine.isready();
    await engine.ucinewgame();
    await engine.isready();
    await nextion.setValue('page1.t2.txt', '""');
    await nextion.setValue('page1.t3.txt', '""');
    await nextion.setValue('page1.t5.txt', '""');
    await nextion.setValue('page1.t0.font', '1');
    await nextion.setValue('page1.t0.pco', '65504');
    await nextion.setValue('page1.t0.txt', '"your move"');

    // set defaults
    const engineDefaults = state.currentGame.engine.engineDefaults;
    for (const defaultOption of engineDefaults) {
      await engine.setoption(defaultOption.key, defaultOption.value);
    }

    // testing this option
    await engine.setoption('MultiPV', 4);

    // set level
    const level = state.currentGame.engine.level;
    for (const mri of level.mri) {
      await engine.setoption(mri.key, mri.value);
    }

    // set personality
    const engineHasPersonalities = state.currentGame.engine.engineHasPersonalities;
    if (engineHasPersonalities) {
      const personality = state.currentGame.engine.personality.mri;
      await engine.setoption('Verbose', true);
      await engine.setoption('PersonalityFile', `${__dirname}/../../engines/rodent4/personalities/${personality}`);
    }

    // set opening book
    const openingBook = state.currentGame.openingBook;
    if (openingBook.filename != 'nobook.bin') {
      await nextion.setValue('page1.t3.txt',`"Book: ${openingBook.name}"`);
    }

    if (!isPlayerWhite) {
      await nextion.setValue('page1.t0.font', '2');
      await nextion.setValue('page1.t0.pco', '65504');
      await nextion.setValue('page1.t0.txt', '"thinking..."');
      dispatch({ type: actions.PLAY_ENGINE });
    }
  }

  if (action.type == actions.SHOW_ENGINE) {
    const state = getState();
    const engineId = engine.id;
    const engineLevel = `${state.currentGame.engine.level.hmi}`;
    const engineHasPersonalities = state.currentGame.engine.engineHasPersonalities;
    let engineText = '';
    if (engineHasPersonalities) {
      const personality = state.currentGame.engine.personality.name;
      engineText = `"${engineId.name} - ${engineLevel} - ${personality}"`;
    } else {
      engineText =`"${engineId.name} - ${engineLevel}"`
    }
    await nextion.setValue('page1.t1.txt', engineText);
  }
};

module.exports = initialize;

const actions = require('../../actions/actions');

const initialize = (dispatch, getState, engine, chess, nextion) => async action => {
  const getCurrentEngine = () => {
    const currentState = getState();
    const { currentGame } = currentState;
    if (currentGame.relayChess) {
      return currentGame.relayEngine[currentGame.gamePhase];
    }
    return currentGame.engine;
  }

  initEngine: if (
    action.type == actions.START_UP ||
    action.type == actions.NEW_GAME ||
    action.type == actions.LOAD_NEW_ENGINE
    ) {
    const state = getState();
    if (action.type == actions.LOAD_NEW_ENGINE && state.currentGame.gamePhase == state.currentGame.lastMoveGamePhase) {
      break initEngine;
    }
    const isPlayerWhite = state.currentGame.isPlayerWhite;
    !actions.LOAD_NEW_ENGINE && chess.reset();
    //chess.load('8/P4r2/4k3/8/8/4K3/5B2/8 w - - 0 1'); // TODO REMOVE FEN, this is for testing
    await engine.init();
    await engine.isready();
    await engine.ucinewgame();
    await engine.isready();
    if (action.type != actions.LOAD_NEW_ENGINE) {
      await nextion.setValue('page1.t2.txt', '""');
      await nextion.setValue('page1.t3.txt', '""');
      await nextion.setValue('page1.t5.txt', '""');
      await nextion.setValue('page1.t0.font', '1');
      await nextion.setValue('page1.t0.pco', '65504');
      if (isPlayerWhite) {
        await nextion.setValue('page1.t0.txt', '"your move"');
      }
    }

    const currentEngine = getCurrentEngine();
    // set defaults
    const engineDefaults = currentEngine.engineDefaults;
    for (const defaultOption of engineDefaults) {
      await engine.setoption(defaultOption.key, defaultOption.value);
    }

    // testing this option
    await engine.setoption('MultiPV', 4);

    // set level
    const level = currentEngine.level;
    if (!level.hasOwnProperty('mri')) {
      level.mri = [];
    }
    for (const mri of level.mri) {
      await engine.setoption(mri.key, mri.value);
    }

    // set personality
    const engineHasPersonalities = currentEngine.engineHasPersonalities;
    if (engineHasPersonalities) {
      const personality = currentEngine.personality.mri;
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

  if (action.type == actions.SHOW_ENGINE || action.type == actions.LOAD_NEW_ENGINE) {
    const state = getState();
    const currentEngine = getCurrentEngine();
    const level = currentEngine.level;
    const engineId = engine.id;
    const engineLevel = level.hmi;
    const engineHasPersonalities = currentEngine.engineHasPersonalities;
    let engineText = '';
    if (engineHasPersonalities) {
      const personality = currentEngine.personality.name;
      engineText = `"${engineId.name} - ${engineLevel} - ${personality}"`;
    } else if (engineLevel && engineLevel != 'undefined') {
      engineText =`"${engineId.name} - ${engineLevel}"`;
    } else {
      engineText = `"${engineId.name}"`;
    }
    await nextion.setValue('page1.t1.txt', engineText);
    dispatch({
      type: actions.UPDATE_CLIENT_ENGINE,
      payload: {
        engine: engineId.name,
        level: engineLevel
      }
    });
  }
};

module.exports = initialize;

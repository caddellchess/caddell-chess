import createReducer from './create-reducer';
import actions from  '../actions/actions';

const getInitialState = () => ({
  usermove: '',
  bestmove: '',
  gamePlay: {
    info: [],
    gameMoves: [
      //'a2a3','a7a6',
      //'b2b3','b7b6',
      //'c2c3','c7c6',
      //'d2d3','d7d6',
      //'e2e3','e7e6',
      //'f2f3','f7f6',
      //'g2g3','g7g6',
      //'h2h3','h7h6',
      //'a3a4','a6a5',
      //'b3b4','b6b5',
      //'c3c4','c6c5',
      //'d3d4','d6d5',
      //'e3e4','e6e5',
      //'f3f4','f6f5',
      //'g3g4','g6g5',
      //'h3h4','h6h5',
      //'a4b5', 'b8c6',
      //'g1f3', 'a8a7',
      //'f1g2', 'h8h7',
      //'e1g1'
    ],
    //evaluation: -1.58
    evaluation: 0
  },
  currentGame: {
    isPlayerWhite: true,
    //opening: 'Queen\'s Gambit',
    opening: '',
    openingBook: {
      name: 'No book',
      filename: 'nobook.bin'
    },
    currentEngine: 'Stockfish 12',
    currentLevel: 'Level 00',
    engine: {
      hmi: 'Stockfish 12',
      filename: 'a-stockf',
      level: {
        hmi: 'Level 00'
      },
      engineHasPersonalities: false,
      personality: {}
    }
  },
  settings: {
    openingBook: {
      name: 'No book',
      filename: 'nobook.bin'
    },
    isPlayerWhite: true,
    engine: {
      hmi: 'Stockfish 12',
      filename: 'a-stockf',
      level: {
        hmi: 'Level 00',
        mri: [{
          key: 'Skill Level',
          value: '0'
        }]
      },
      engineDefaults: [],
      engineHasPersonalities: false,
      personality: {}
    },
    isComboboxEngines: false,
    isComboboxLevels: false,
    isComboboxBooks: false,
    isComboboxPersonalities: false
  },
  system: {
    booksArray: [
      {mri: "nobook.bin", hmi: "No book"},
      {mri: "flank.bin", hmi: "Flank"},
      {mri: "semiopen.bin", hmi: "Semi-open"},
      {mri: "open.bin", hmi: "Open"},
      {mri: "closed.bin", hmi: "Closed"},
      {mri: "indian.bin", hmi: "Indian"},
      {mri: "fun.bin", hmi: "Fun"},
      {mri: "varied.bin", hmi: "Varied"},
      {mri: "gm1950.bin", hmi: "GM 1950"},
      {mri: "performance.bin", hmi: "Performance"},
      {mri: "stfish.bin", hmi: "Stockfish"},
      {mri: "anand.bin", hmi: "Anand"},
      {mri: "korchnoi.bin", hmi: "Korchnoi"},
      {mri: "larsen.bin", hmi: "Larsen"},
      {mri: "pro.bin", hmi: "Pro"},
      {mri: "gm2001.bin", hmi: "GM 2001"}
    ],
    engineArray: [
      {filename: "a-stockf", hmi: "Stockfish12", fullname: "Stockfish 12"},
      {filename: "b-stockf", hmi: "Stockfish13", fullname: "Stockfish 13"},
      {filename: "c-maia", hmi: "Maia 0.24.1", fullname: "Maia v0.24.1+git.4b8acff"},
      {filename: "j-texel", hmi: "Texel108a8", fullname: "Texel 1.08a8 32-bit"},
      {filename: "k-arasan", hmi: "Arasan 22.1.0", fullname: "Arasan v22.1.0-62-g5e5272c"},
      {filename: "d-rodent4", hmi: "Rodent 4", fullname: "Rodent IV 0.32"},
      {filename: "e-zurich", hmi: "Zurich Mstr", fullname: "Zurichess Master (Nidwalden)"},
      {filename: "f-wyld", hmi: "WyldChess", fullname: "WyldChess"},
      {filename: "g-galjoe", hmi: "Galjoen0401", fullname: "Galjoen 0.40.1"},
      {filename: "h-sayuri", hmi: "Sayuri 2018", fullname: "Sayuri 2018.05.23"},
      {filename: "i-floyd", hmi: "Floyd 0.9", fullname: "Floyd 0.9"},
      {filename: "l-laser", hmi: "Laser18beta", fullname: "Laser 1.8 beta"},
      {filename: "r-roboci", hmi: "Robocide0.4", fullname: "Robocide 0.4"},
      {filename: "v-vajole", hmi: "Vajolet2280", fullname: "Vajolet2 2.8.0"},
      {filename: "crystal", hmi: "Crystal v2", fullname: "Crystal 310720 (last day pre NNUE)"},
      {filename: "ct800", hmi: "CT800 v1.41", fullname: "CT800 V1.41 32 bit"},
      {filename: "dragontooth", hmi: "Dragontooth", fullname: "Dragontooth 0.3 Cadmus 4CPU linux-arm"},
      {filename: "igel", hmi: "Igel 2.9", fullname: "Igel 2.9-dev-2 CUSTOM"},
      {filename: "Lc0v0270", hmi: "Lc0 v0.27.0", fullname: "Lc0 v0.27.0-dev+git.c20ef4b built Nov 21 2020"},
      {filename: "McBrain", hmi: "McBrain 9.9", fullname: "McBrain 9.9 32"},
      {filename: "saruman", hmi: "Saruman", fullname: "Saruman"},
      {filename: "stash", hmi: "Stash 24.5", fullname: "Stash v24.5"},
      {filename: "wasp", hmi: "Wasp 4.0", fullname: "Wasp 4.0"},
      {filename: "remote_stkf11", hmi: "Stockfsh(R)", fullname: "Stockfish 11 on remote server"}
    ]
  },
  loading: true
});

const actionHandlers = {
  [actions.LOAD_LEVELS]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    return newState;
  },

  [actions.APPEND_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.usermove = payload.move;
    newState.gamePlay.gameMoves = [...state.gamePlay.gameMoves, payload.move];
    return newState;
  },

  [actions.ENGINE_MOVE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.bestmove = payload.move.bestmove;
    newState.gamePlay.gameMoves = [...state.gamePlay.gameMoves, payload.move.bestmove];
    newState.gamePlay.info = payload.move.info;
    return newState;
  },

  [actions.NEW_OPENING]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.currentGame.opening = payload.opening;
    return newState;
  },

  [actions.SAVE_EVAL]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gamePlay.evaluation = payload.evaluation;
    return newState;
  },

  [actions.APPLY_SETTINGS]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.settings.isPlayerWhite = payload.isPlayerWhite;
    newState.settings.openingBook = payload.openingBook;
    newState.settings.engine = payload.engine;
    newState.settings.engine.personality = payload.personality;
    newState.settings.useBook = payload.useBook;
    return newState;
  },

  [actions.UPDATE_CLIENT_ENGINE]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.currentGame.currentEngine = payload.engine;
    newState.currentGame.currentLevel = payload.level;
    return newState;
  },

  [actions.PRIME_GUI]: (state, {payload}) => {
    const newState = Object.assign({}, state);
    newState.gamePlay = payload.gamePlay;
    newState.currentGame = payload.currentGame;
    newState.settings = payload.settings;
    newState.system = payload.system;
    newState.loading = false;
    return newState;
  },

}

export default createReducer(getInitialState(), actionHandlers);

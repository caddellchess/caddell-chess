const actions = require('./actions');
const pieces = {
  'p': 'o',
  'P': 'p',
  'r': 't',
  'R': 'r',
  'n': 'm',
  'N': 'n',
  'b': 'v',
  'B': 'b',
  'q': 'w',
  'Q': 'q',
  'k': 'l',
  'K': 'k'
};
const takenPieces = [
  'o','o','o','o','o','o','o','o','t','t','m','m','v','v','w','l',
  'p','p','p','p','p','p','p','p','r','r','n','n','b','b','q','k'
];

const populateBoard = dispatch => async fen => {
  const spaceLocator = fen.search(' ');
  const boardOnlyFen = fen.substr(0, spaceLocator)
  const ranks = boardOnlyFen.split('/');
  const board = [];
  const whiteTaken = [];
  const blackTaken = [];

  ranks.forEach(rank => {
    let displayRank = [];
    rank.split('').forEach(square => {
      if (!isNaN(square)) {
        for (let i = 0; i < square; i++) {
          displayRank.push(' ');
        }
      } else {
        displayRank.push(pieces[square]);
        const index = takenPieces.indexOf(pieces[square]);
        if (index != -1) {
          takenPieces.splice(index, 1);
        }
      }
    })
    board.push(displayRank.join(''));
  });

  takenPieces.forEach(piece => {
    const sortingPiece = Object.keys(pieces).find(key => pieces[key] === piece);
    if (sortingPiece.toUpperCase() == sortingPiece) {
      whiteTaken.push(piece);
    } else {
      blackTaken.push(piece)
    }
  });

  whiteTaken.reverse();
  blackTaken.reverse();

  // add line break after every 5th
  if (whiteTaken.length > 5) {
    whiteTaken.splice(5, 0, '\\r');
  }
  if (whiteTaken.length > 11) {
    whiteTaken.splice(11, 0, '\\r');
  }

  if (blackTaken.length > 5) {
    blackTaken.splice(5, 0, '\\r');
  }
  if (blackTaken.length > 11) {
    blackTaken.splice(11, 0, '\\r');
  }

  await dispatch({
    type: actions.VISUALIZE_BOARD,
    payload: {
      board: board,
      whiteTaken: whiteTaken,
      blackTaken: blackTaken
    }
  });
  dispatch({ type: actions.DISPLAY_BOARD });
}

module.exports = populateBoard;

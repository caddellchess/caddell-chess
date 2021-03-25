/****************************************************************************************************************
Basically the late game starts when there are 6 or fewer major or minor pieces,
and the midgame starts when there are 10 or fewer major or minors OR the back
rank is sparse OR the white and black pieces are sufficiently mixed on the board.

Inspiration came from the logic in the https://github.com/ornicar/scalachess project
Found at https://www.reddit.com/r/chess/comments/8kk044/how_does_lichess_decide_where_is_the_middlegame/dz8cu7k
*****************************************************************************************************************/

const majorAndMinorPieces = 'rnbq';

const score = (white, black, rank) => {
  // white/black is count of color pieces on current rank
  // rank is 1 - 8, 1 being white's homerow
  if (white == 0 && black == 0) { return 0; }
  if (white == 1 && black == 0) { return 1 + (8 - rank); }
  if (white == 2 && black == 0) { return rank > 2 ? 2 + (rank - 2) : 0; }
  if (white == 3 && black == 0) { return rank > 1 ? 3 + (rank - 1) : 0; }
  if (white == 4 && black == 0) { return rank > 1 ? 3 + (rank - 1) : 0; } // group of 4 on homerow = 0

  if (white == 0 && black == 1) { return 1 + rank; }
  if (white == 1 && black == 1) { return 5 + Math.abs(3 - rank); }
  if (white == 2 && black == 1) { return 4 + rank; }
  if (white == 3 && black == 1) { return 5 + rank; }

  if (white == 0 && black == 2) { return rank < 6 ? 2 + (6 - rank) : 0; }
  if (white == 1 && black == 2) { return 4 + (6 - rank); }
  if (white == 2 && black == 2) { return 7; }

  if (white == 0 && black == 3) { return rank < 7 ? 3 + (7 - rank) : 0; }
  if (white == 1 && black == 3) { return 5 + (6 - rank); }

  if (white == 0 && black == 4) { return rank < 7 ? 3 + (7 - rank) : 0; }

  return 0;
}

const majorsAndMinors = fen => {
  const fenParts = fen.split(' ');
  const pieces = fenParts[0];

  let majorMinorCount = 0;
  for (const piece of pieces) {
    if (isNaN(piece) && piece !== '/') {
      if (piece.toLowerCase() !== 'p' && piece.toLowerCase() !== 'k') {
        majorMinorCount++;
      }
    }
  }
  return majorMinorCount;
}

const backrankSparse = fen => {
  // number of own pieces on own backranks less than 4 then true
  const fenParts = fen.split(' ');
  const fenRanks = fenParts[0].split('/');

  const blackBackRankCount = fenRanks[0].split('').reduce((n, piece) =>
    {return n + (majorAndMinorPieces.includes(piece))}
    , 0
  );

  const whiteBackRankCount = fenRanks[7].split('').reduce((n, piece) =>
    {return n + (majorAndMinorPieces.toUpperCase().includes(piece))}
    , 0
  );

  return blackBackRankCount < 4 || whiteBackRankCount < 4;
}

const isWhite = piece => piece == piece.toUpperCase();
const isBlack = piece => piece == piece.toLowerCase();
const pieceColor = piece => piece == piece.toUpperCase() ? 'white' : 'black';

const mixedness = fen => {
  const fenParts = fen.split(' ');
  const fenRanks = fenParts[0].split('/').reverse();
  let rankNumber = 0;
  let totalScore = 0;
  let whiteCount, blackCount;

  const incrementCounts = (piece) => {
    if (isWhite(piece)) {
      whiteCount++;
    } else if (isBlack(piece)) {
      blackCount++;
    }
  }

  const clearCounts = (color) => {
    if (color != 'white') { blackCount = 0;}
    if (color != 'black') { whiteCount = 0;}
  }

  const incrementTotal = (color) => {
    totalScore += score(whiteCount, blackCount, rankNumber);
    clearCounts(color);
  }

  for (const rank of fenRanks) {
    rankNumber++;
    clearCounts();
    let lastPieceColor = '';
    let onSecondColorBreak = false;

    for (const piece of rank) {
      if (!isNaN(piece)) {
        incrementTotal();
      } else {
        if (pieceColor(piece) !== lastPieceColor && !!lastPieceColor) {
          if (onSecondColorBreak) {
            incrementTotal(pieceColor(piece));
            incrementCounts(piece);
          } else {
            incrementCounts(piece);
            onSecondColorBreak = !!lastPieceColor && true;
            lastPieceColor = pieceColor(piece);
          }
        } else {
          incrementCounts(piece);
          lastPieceColor = pieceColor(piece);
        }
      }
    }
    incrementTotal();
  }

  return totalScore;
}

const midGame = fen => {
  return (
    majorsAndMinors(fen) <= 10 ||
    backrankSparse(fen) ||
    mixedness(fen) > 75
  );
};

const endGame = fen => midGame && majorsAndMinors(fen) <= 6;

const getGamePhase = (fen, lastPhase) => {
  let gamePhase = lastPhase || 'opening';
  if (gamePhase == 'opening' && midGame(fen)) {
    gamePhase = 'midgame';
  }
  if (gamePhase == 'midgame' && endGame(fen)) {
    gamePhase = 'endgame';
  }
  return gamePhase;
}

module.exports = getGamePhase;

import React from 'react';
import './Board.css';
import Chessboard from 'chessboardjsx';
import noise from '../img/noise.svg';

import wP from "../img/wp.png";
import wR from "../img/wr.png";
import wN from "../img/wn.png";
import wB from "../img/wb.png";
import wQ from "../img/wq.png";
import wK from "../img/wk.png";
import bP from "../img/bp.png";
import bR from "../img/br.png";
import bN from "../img/bn.png";
import bB from "../img/bb.png";
import bQ from "../img/bq.png";
import bK from "../img/bk.png";

export default class Pgn extends React.Component {
  render() {
    const { fen, isPlayerWhite = true } = this.props;

    const darkSquareStyle = {
      background: `linear-gradient(160deg, rgba(108,101,111,1) 0%, rgba(108,101,111,1) 67%, rgba(127,119,131,1) 100%),url(${noise})`
    }
    const lightSquareStyle = { backgroundColor: '#8699AB' }

    const pieceDef = (name, alt) => {
      return ({squareWidth}) => {
        return (
          <img
            style={{
              width: squareWidth,
              height: squareWidth
            }}
            src={name}
            alt={alt}
          />
        )
      }
    }

    return (
      <div className='board' ref={this.myInput}>
        <Chessboard
          position={fen}
          undo={false}
          draggable={false}
          lightSquareStyle={lightSquareStyle}
          darkSquareStyle={darkSquareStyle}
          orientation={isPlayerWhite ? 'white' : 'black'}
          pieces={{
            bK: pieceDef(bK, 'black king'),
            bQ: pieceDef(bQ, 'black queen'),
            bR: pieceDef(bR, 'black rook'),
            bN: pieceDef(bN, 'black knight'),
            bB: pieceDef(bB, 'black bishop'),
            bP: pieceDef(bP, 'black pawn'),
            wK: pieceDef(wK, 'white king'),
            wQ: pieceDef(wQ, 'white queen'),
            wR: pieceDef(wR, 'white rook'),
            wN: pieceDef(wN, 'white knight'),
            wB: pieceDef(wB, 'white bishop'),
            wP: pieceDef(wP, 'white pawn')
          }}
        />
        <div className='fen'>{fen}</div>
      </div>
    );
  }
}

import React from 'react';
import _ from 'lodash';
import Chess from 'chess.js';
import Board from '../board/Board';
import Pgn from '../pgn/Pgn';
import Info from '../info/Info';
import './Main.css';

const chess = new Chess();

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: '',
      gameMoves: [],
      undoMoves: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.gamePlay.gameMoves, prevState.gameMoves)) {
      chess.reset();
      nextProps.gamePlay.gameMoves.forEach(move => chess.move(move, { sloppy: true }));
      const fen = chess.fen();
      const pgn = chess.pgn().split(' ').filter((move, index) => index%3 != 0);
      return {
        fen: fen,
        pgn: pgn,
        gameMoves: nextProps.gamePlay.gameMoves
      }
    }
    return null;
  }

  moveBack() {
    const undoneMove = chess.undo();
    if (undoneMove) {
      const fen = chess.fen();
      this.setState(state => {
        const undoMoves = this.state.undoMoves.concat(`${undoneMove.from}${undoneMove.to}`);
        return { fen, undoMoves };
      });
    }
  }

  moveForward() {
    if (!this.state.undoMoves.length) {
      return
    }
    const redoneMove = _.last(this.state.undoMoves);
    chess.move(redoneMove, {sloppy: true});
    const fen = chess.fen();
    this.setState(state => {
      const lastMove = this.state.undoMoves.length - 1;
      const undoMoves = this.state.undoMoves.filter((item, i) => i !== lastMove);
      return { fen, undoMoves };
    });
  }

  moveReset() {
    chess.reset();
    this.props.gamePlay.gameMoves.forEach(move => chess.move(move, { sloppy: true }));
    const fen = chess.fen();
    this.setState({
      fen,
      undoMoves: []
    });
  }

  pgnForDownload() {
    return chess.pgn();
  }

  render() {
    const fen = this.state.fen;
    const pgn = this.state.pgn;
    const gameMoves = this.state.gameMoves;
    //const { info = [] } = this.props.gamePlay;
    let info = [];
    if (this.props.gamePlay.hasOwnProperty('info')) {
      info = this.props.gamePlay.info;
    }

    return (
      <div className='container'>
        <header className="caddell-header">
          <div className="brand">Caddell Chess Computer</div>
          <nav className="nav"></nav>
        </header>
        <div className='wrapper'>
          <div className='board-pane'>
            <Board
              fen={fen}
            />
          </div>
          <div className='pgn-pane'>
            <Pgn
              gameMoves={gameMoves}
              pgn={pgn}
              pgnForDownload={this.pgnForDownload.bind(this)}
              evaluation={this.props.gamePlay.evaluation}
              currentGame={this.props.currentGame}
              moveBack={this.moveBack.bind(this)}
              moveForward={this.moveForward.bind(this)}
              moveReset={this.moveReset.bind(this)}
              movesRemoved={this.state.undoMoves.length}
            />
          </div>
        </div>
        <Info info={info} />
      </div>
    );
  }
}

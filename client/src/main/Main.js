import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import _ from 'lodash';
import Chess from 'chess.js';
import Routes from './Routes';
import Board from '../board/Board';
import Pgn from '../pgn/Pgn';
import Info from '../info/Info';
import Setup from '../setup/Setup';
import Loading from '../loading/Loading';
import './Main.css';

const chess = new Chess();

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: '',
      gameMoves: [],
      undoMoves: [],
      loading: true
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.gamePlay.gameMoves, prevState.gameMoves)) {
      chess.reset();
      nextProps.gamePlay.gameMoves.forEach(move => chess.move(move, { sloppy: true }));
      const fen = chess.fen();
      const pgn = chess.pgn().split(' ').filter((move, index) => index%3 !== 0);
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

  renderMain() {
    const { fen, pgn, gameMoves } = this.state;
    const { isPlayerWhite } = this.props.currentGame;
    const { info = [] } = this.props.gamePlay;

    return (
      <Switch>
        <Route path='/setup'>
          <div className='wrapper-setup'>
            <div className='setup-pane'>
              <Setup />
            </div>
          </div>
        </Route>

        <Route path='/'>
          <div className='wrapper'>
            <div className='board-pane'>
              <Board
                fen={fen}
                isPlayerWhite={isPlayerWhite}
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
        </Route>
      </Switch>
    );
  }

  render() {
    if (!this.props.loading && this.state.loading) {
      setTimeout(() => this.setState({ loading: false }), 1500);
    }

    return (
      <div className='container'>
        <Router>
          <header className="caddell-header">
            <div className="brand">Caddell Chess Computer</div>
            {this.props.loading ? null : <Routes /> }
          </header>
          {this.props.loading ? <Loading /> : this.renderMain() }
        </Router>
      </div>
    );
  }
}

Main.propTypes = {
  gamePlay: PropTypes.shape({
    gameMoves: PropTypes.array,
    bestmove: PropTypes.string,
    evaluation: PropTypes.number,
    hintMove: PropTypes.string,
    gauge: PropTypes.number,
    blunder: PropTypes.shape({
      text: PropTypes.string,
      grade: PropTypes.string
    }),
    board: PropTypes.shape({
      board: PropTypes.array,
      whiteTaken: PropTypes.array,
      blackTaken: PropTypes.array
    })
  }),
  currentGame: PropTypes.shape({
    isPlayerWhite: PropTypes.bool,
    randomMove: PropTypes.number,
    useBook: PropTypes.bool,
    isBookMove: PropTypes.bool,
    opening: PropTypes.string,
    gameOverReason: PropTypes.string,
    openingBook: PropTypes.shape({
      name: PropTypes.string,
      filename: PropTypes.string
    }),
    engine: PropTypes.shape({
      hmi: PropTypes.string,
      filename: PropTypes.string,
      level: PropTypes.shape({
        hmi: PropTypes.string,
        mri: PropTypes.array
      })
    }),
    engineDefaults: PropTypes.array,
    engineHasPersonalities: PropTypes.bool,
    pesonality: PropTypes.object
  }),
  system: PropTypes.shape({
    booksArray: PropTypes.array,
    engineArray:  PropTypes.array
  }),
  loading: PropTypes.bool
};

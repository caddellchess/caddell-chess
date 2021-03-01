import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Header from '../header/Header';
import './Pgn.css';

export default class Pgn extends React.Component {
  downloadPgnFile = () => {
     const element = document.createElement("a");
     const file = new Blob([this.props.pgnForDownload()],
       {type: 'text/plain;charset=utf-8'});
     element.href = URL.createObjectURL(file);
     element.download = "pgn.txt";
     document.body.appendChild(element);
     element.click();
   }

   pairMoves(arr) {
    const movePair = [];
    const arrLength = arr.length;
    const addShade = arrLength - this.props.movesRemoved - 1;
    for (let i = 0; i < arrLength; i++) {
      movePair.push(
        <li key={i}>
          <span className={i > addShade && 'shade'}>{arr[i]}, </span>
          <span className={++i > addShade && !!this.props.movesRemoved && 'shade'}>
            {i <= arr.length - 1 ? arr[i] : '...'}
          </span>
        </li>
      );
    }
    return movePair;
   }

  render() {
    const algebraicPair = this.pairMoves(this.props.gameMoves);
    const descriptivePair = this.pairMoves(this.props.pgn);

    return (
      <>
        <Header
          engine={this.props.currentGame.engine.hmi}
          level={this.props.currentGame.engine.level.hmi}
          openingBook={this.props.currentGame.openingBook.name}
          opening={this.props.currentGame.opening}
          evaluation={this.props.evaluation}
        />
        <div className='pgn'>
          <Tabs className='pgn-tabs' selectedTabClassName={'pgn-selected-tab'}>
            <TabList>
              <Tab>Long Algebraic</Tab>
              <Tab>Descriptive</Tab>
            </TabList>
            <TabPanel>
              <ol className='algebraic'>{algebraicPair}</ol>
            </TabPanel>
            <TabPanel>
              <ol className='descriptive'>{descriptivePair}</ol>
            </TabPanel>
          </Tabs>
          <div>
            <button onClick={this.downloadPgnFile}>Download PGN</button>
          </div>
          <div>
            <button onClick={this.props.moveBack}>Back</button>
            <button onClick={this.props.moveForward}>Forward</button>
            <button onClick={this.props.moveReset}>Reset</button>
          </div>
        </div>
      </>
    );
  }
}

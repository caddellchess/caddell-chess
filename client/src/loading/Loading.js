import React from 'react';
import './Loading.css';

export default class Loading extends React.Component {
  getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changeWord(a) {
    const words = [
      "Reti",
      "Grunfeld",
      "English",
      "Indian",
      "Pirc",
      "Petroff",
      "Stafford Gambit",
      "Sicilian",
      "French",
      "Ruy Lopez",
      "Caro-Kann",
      "Italian Game",
      "King's Gambit",
      "Scotch Game",
      "Vienna Game",
      "Queen's Gambit",
      "Alekhine's",
      "Scandinavian",
      "Bongcloud"
    ];
      a.style.opacity = '0.1';
      a.innerHTML = words[this.getRandomInt(0, words.length - 1)];
      setTimeout(() => {
          a.style.opacity = '1';
      }, this.getRandomInt(300, 800));
      const changeWord = this.changeWord.bind(this);
      setTimeout(() => {
          changeWord(a);
      }, this.getRandomInt(300, 1000));
  }

  componentDidMount() {
    const changeWord = this.changeWord.bind(this);
    window.addEventListener("load", function() {
      const randoms = window.document.getElementsByClassName("randoms");
      for (let i = 0; i < randoms.length; i++)
        changeWord(randoms[i]);
    }, false);
  }



  render() {
    return (
      <div className="loading-container">
        <div className="right">
          <h4 className="randoms"></h4>
          <h1 className="randoms"></h1>
          <h2 className="randoms"></h2>
          <h4 className="randoms"></h4>
        </div>
        <div className="left">
          <h4 className="randoms"></h4>
          <h2 className="randoms"></h2>
          <h1 className="randoms"></h1>
          <h4 className="randoms"></h4>
        </div>
      </div>
    );
  }
}

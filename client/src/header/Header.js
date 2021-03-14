import React from 'react';
import './Header.css';

export default class Header extends React.Component {
  render() {
    const { opening = {}, openingBook } = this.props;
    const { eco_code = '', name = '', variation = '' } = opening;

    return (
      <div className='header'>
        <div>{this.props.engine} - {this.props.level}</div>
        <div className='opening-book'>{openingBook !== 'No book' && 'Book: '}{openingBook}</div>
        <div>{`${eco_code} ${name} ${variation}`}&nbsp;</div>
        <div>Current Evaluation: {this.props.evaluation}</div>
      </div>
    );
  }
}

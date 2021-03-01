import React from 'react';
import util from 'util';
import './Info.css';

export default class Info extends React.Component {
  componentDidUpdate() {
    this.infoLine && this.infoLine.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <div className='info-wrapper'>
        <div className='info'>
          {this.props.info.map((row, index) => (
            <p
              key={index}
              ref={(ref) => this.infoLine = ref}
            >
              {util.inspect(row)}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

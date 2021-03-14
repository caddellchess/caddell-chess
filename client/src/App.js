import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { echoAction } from './actions/echoAction';
import Main from './main/Main';

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
}

function App(props) {
  useConstructor(() => {
    let eventSource = new EventSource("/actions");
    eventSource.onmessage = e => props.echoAction(JSON.parse(e.data));
  });

  useEffect(() => {
    // ask for current state
    setTimeout(() => fetch('/prime-gui', {method: 'POST'}), 0)
  }, []);

  return (
    <div className="App">
      <Main
        gamePlay={{...props.client.gamePlay}}
        currentGame={{...props.client.currentGame}}
        system={{...props.client.system}}
        loading={props.client.loading}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  echoAction: (actionFromServer) => dispatch(echoAction(actionFromServer))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

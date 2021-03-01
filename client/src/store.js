import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

//const initialState = {
//  client: {
//    usermove: '',
//    bestmove: '',
//    gamePlay: {
//      gameMoves: []
//    },
//    currentGame: {}
//  },
//  echo: {}
//};

export default function configureStore() {
 return createStore(
   rootReducer,
   //initialState,
   applyMiddleware(thunk)
 );
}

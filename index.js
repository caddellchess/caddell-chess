const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const reducer = require('./reducers/index');
const initialState = require('./reducers/initial-state');
const middleware = require('./reducers/middleware');
const run = require('./server.js')
const actions = require('./actions/actions');

const middlewareEnhancer = applyMiddleware(middleware);
//const store = createStore(reducer, initialState, middlewareEnhancer)

let storeRef = null;
const getStore = () => storeRef;

const store = (storeRef = createStore(
  reducer,
  initialState,
  middlewareEnhancer
));

store.dispatch({
  type: actions.START_UP
})
.then(() => store.dispatch({ type: actions.SHOW_ENGINE }));

run(getStore).catch(err => console.log(err));

'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const actions = require('./actions/actions');

async function run(getStore) {
  const app = express();
  app.use(express.json());

  app.get('/actions', async function(req, res) {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');

    // subscribe to the server store
    const serverStore = getStore();
    serverStore.subscribe(() => {
      res.write(`data: ${JSON.stringify(serverStore.getState().lastAction)}\n\n`);
    });
  });

  app.post('/prime-gui', async function(req, res) {
    const serverStore = getStore();
    const state = serverStore.getState();
    serverStore.dispatch({ type: actions.PRIME_GUI, payload: state });
    res.send('ok');
  });

  app.post('/dispatch', async function(req, res) {
    const serverStore = getStore();
    const { type, payload = null } = req.body;
    const action = { type: type };
    if (payload) {
      action.payload = payload;
    }
    serverStore.dispatch(action);
    res.send('ok');
  });

  const index = fs.readFileSync('./client/build/index.html', 'utf8');
  app.get('/', (req, res) => res.send(index));

  app.use(express.static('client/build'));

  await app.listen(3000);
  console.log('Listening on port 3000');
}

module.exports = run;

/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import io from 'socket.io-client';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import {syncReduxAndRouter} from 'redux-simple-router';
import getRoutes from './routes';

const client = new ApiClient();

const dest = document.getElementById('content');
const store = createStore(client, window.__data);
const history = createHistory();

syncReduxAndRouter(history, store);

function initSocket() {
  const socket = io('', {path: '/api/ws', transports: ['polling']});
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', (data) => {
    console.log(data);
  });

  return socket;
}

global.socket = initSocket();

function createElement(Component, props) {
  if (Component.fetchData) {
//    setTimeout(() => {  // hack
      Component.fetchData(store.getState, store.dispatch,
                        props.location, props.params);

//    }, 0);
  }
  return React.createElement(Component, props);
}

const component = (
  <Router createElement={createElement} history={history}>
    {getRoutes(store)}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}

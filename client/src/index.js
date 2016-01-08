import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'; // eslint-disable-line
import configureStore from './store/configureStore';
import {ReduxRouter} from 'redux-router';

import Polyfill from 'babel-core/polyfill'; //eslint-disable-line

require('./index.scss');

const store = configureStore();

render(
  <div style={{height: '100%', width: '100%'}}>
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
    <DebugPanel top right bottom>
      {/* <DevTools store={store} monitor={LogMonitor} /> */}
    </DebugPanel>
  </div>,
  document.getElementById('app')
);

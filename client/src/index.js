import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import App from './containers/app';
import configureStore from './store/configureStore';
import {ReduxRouter} from 'redux-router';
import { Route, Link } from 'react-router';

require('./index.scss');

const store = configureStore();

render(
  <div style={{height: '100%', width: '100%'}}>
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
    <DebugPanel top right bottom>
      {/*<DevTools store={store} monitor={LogMonitor} />*/}
    </DebugPanel>
  </div>,
  document.getElementById('app')
);

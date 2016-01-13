import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
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
  </div>,
  document.getElementById('app')
);

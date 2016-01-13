import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';
import {clusterState} from './server';
import {clusterLayout} from './cluster-layout';
import {appIntent, appIntentWizard} from './app-intent';
import {appConfiguration} from './app-configuration';
import {nodes} from './nodes';
import { routerStateReducer } from 'redux-router';

const reducers = {
  apiStatus,
  socketStatus,
  nodes,
  clusterState,
  clusterLayout,
  appIntent,
  appIntentWizard,
  appConfiguration,
  router: routerStateReducer,
};

export function registerReducer(name, reducerFn) {
  reducers[name] = reducerFn;
}

const genRootReducer = () => combineReducers(reducers);

export default genRootReducer;

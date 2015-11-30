import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';
import {nodes} from './nodes';
import {frameworks} from './frameworks.js';
import { routerStateReducer } from 'redux-router';

const reducers = {
  apiStatus,
  socketStatus,
  nodes,
  frameworks,
  router: routerStateReducer,
};

export function registerReducer(name, reducerFn) {
  reducers[name] = reducerFn;
}

const genRootReducer = () => combineReducers(reducers);

export default genRootReducer;

import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';
import {nodes} from './nodes';

const reducers = {
  apiStatus,
  socketStatus,
  nodes,
};

export function registerReducer(name, reducerFn) {
  reducers[name] = reducerFn;
}

const genRootReducer = () => combineReducers(reducers);

export default genRootReducer;

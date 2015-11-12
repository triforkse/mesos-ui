import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';
import {nodes} from './nodes';

const rootReducer = combineReducers({
  apiStatus,
  socketStatus,
  nodes,
});

export default rootReducer;

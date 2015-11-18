import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';
import {nodes} from './nodes';
import {panel} from './panel';

const rootReducer = combineReducers({
  apiStatus,
  socketStatus,
  nodes,
  panel,
});

export default rootReducer;

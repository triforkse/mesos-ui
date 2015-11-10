import {combineReducers} from 'redux';
import {apiStatus} from './api';
import {socketStatus} from './webSockets';

const rootReducer = combineReducers({
  apiStatus,
  socketStatus,
});

export default rootReducer;

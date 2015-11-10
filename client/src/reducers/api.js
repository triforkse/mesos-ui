import {API_STATUS_REQUESTED, API_STATUS_RECEIVED} from '../actions';

export function apiStatus(state = { status: null, requesting: false }, action) {
  switch (action.type) {
  case API_STATUS_REQUESTED:
    return Object.assign({}, state, { requesting: true });
  case API_STATUS_RECEIVED:
    return Object.assign({}, state, { requesting: false, status: action.data });
  default:
    return state;
  }
}

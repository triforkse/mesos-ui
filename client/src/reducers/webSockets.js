import {WEB_SOCKET_CONNECTION_REQUESTED, WEB_SOCKET_MESSAGE} from '../actions';

export function socketStatus(state = { status: null, connecting: false }, action) {
  switch (action.type) {
  case WEB_SOCKET_CONNECTION_REQUESTED:
    return Object.assign({}, state, { connecting: true });
  case WEB_SOCKET_MESSAGE:
    return Object.assign({}, state, { connecting: false, status: action.message });
  default:
    return state;
  }
}

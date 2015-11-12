import * as api from '../api-client';

export const API_STATUS_REQUESTED = 'API_STATUS_REQUESTED';
export const API_STATUS_RECEIVED = 'API_STATUS_RECEIVED';
export const WEB_SOCKET_CONNECTION_REQUESTED = 'WEB_SOCKET_CONNECTION_REQUESTED';
export const WEB_SOCKET_MESSAGE = 'WEB_SOCKET_MESSAGE';

export function requestApiStatus() {
  return {
    type: API_STATUS_REQUESTED,
  };
}

export function respondeWithApiStatus(data) {
  return {
    type: API_STATUS_RECEIVED,
    data,
  };
}

export function checkApi() {
  return dispatch => {
    dispatch(requestApiStatus());
    api.fetchStatus(data => dispatch(respondeWithApiStatus(data)));
  };
}

export function requestWebSocketConnection() {
  return {
    type: WEB_SOCKET_CONNECTION_REQUESTED,
  };
}

export function webSocketMessage(message) {
  return {
    type: WEB_SOCKET_MESSAGE,
    message,
  };
}

export function connectWebSocket() {
  return dispatch => {
    dispatch(requestWebSocketConnection());
    api.connectWebSocket(message => dispatch(webSocketMessage(message)));
  };
}
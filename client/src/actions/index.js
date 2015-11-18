import * as api from '../api-client';

export const API_STATUS_REQUESTED = 'API_STATUS_REQUESTED';
export const API_STATUS_RECEIVED = 'API_STATUS_RECEIVED';
export const WEB_SOCKET_CONNECTION_REQUESTED = 'WEB_SOCKET_CONNECTION_REQUESTED';
export const WEB_SOCKET_MESSAGE = 'WEB_SOCKET_MESSAGE';
export const CLUSTER_NODE_UPDATE = 'CLUSTER_NODE_UPDATE';
export const CLUSTER_NODE_ADDED = 'CLUSTER_NODE_ADDED';
export const CLUSTER_NODE_REMOVED = 'CLUSTER_NODE_REMOVED';
export const NODE_SELECTION = 'NODE_SELECTION';
export const SHOW_NODE_DETAILS = 'SHOW_NODE_DETAILS';
export const TOGGLE_PANEL = 'TOGGLE_PANEL';

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

export function clusterUpdate(message) {
  return {
    type: CLUSTER_NODE_UPDATE,
    message,
  };
}

export function addNodes(message) {
  return {
    type: CLUSTER_NODE_ADDED,
    message,
  };
}

export function removeNodes(message) {
  return {
    type: CLUSTER_NODE_REMOVED,
    message,
  };
}

export function connectWebSocket() {
  return dispatch => {
    dispatch(requestWebSocketConnection());
    api.connectWebSocket(message => dispatch(webSocketMessage(message)));
  };
}

export function togglePanel(id) {
  return {
    type: TOGGLE_PANEL,
    id,
  };
}

export function selectNode(node) {
  return {
    type: NODE_SELECTION,
    node,
  };
}

export function showDetails(node) {
  return {
    type: SHOW_NODE_DETAILS,
    node,
  };
}

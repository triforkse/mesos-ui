import * as api from '../api-client';

export const API_STATUS_REQUESTED = 'API_STATUS_REQUESTED';
export const API_STATUS_RECEIVED = 'API_STATUS_RECEIVED';
export const WEB_SOCKET_CONNECTION_REQUESTED = 'WEB_SOCKET_CONNECTION_REQUESTED';
export const WEB_SOCKET_INIT = 'WEB_SOCKET_INIT';
export const WEB_SOCKET_DIFF = 'WEB_SOCKET_DIFF';
export const CLUSTER_NODE_UPDATE = 'CLUSTER_NODE_UPDATE';
export const CLUSTER_NODE_ADDED = 'CLUSTER_NODE_ADDED';
export const CLUSTER_NODE_REMOVED = 'CLUSTER_NODE_REMOVED';
export const NODE_SELECTION = 'NODE_SELECTION';
export const SHOW_NODE_DETAILS = 'SHOW_NODE_DETAILS';
export const TOGGLE_PANEL = 'TOGGLE_PANEL';
export const FRAMEWORK_FOCUS = 'FRAMEWORK_FOCUS';
export const FRAMEWORK_BLUR = 'FRAMEWORK_BLUR';
export const FRAMEWORK_TOGGLE = 'FRAMEWORK_TOGGLE';

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
    dispatch({
      type: WEB_SOCKET_CONNECTION_REQUESTED,
    });

    api.connectWebSocket(({type, payload}) => {
      if (type === 'MESOS_INIT') {
        dispatch({
          type: WEB_SOCKET_INIT,
          message: payload,
        });
      } else {
        dispatch({
          type: WEB_SOCKET_DIFF,
          changes: payload,
        });
      }
    });
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

export function focusFramework(framework) {
  return {
    type: FRAMEWORK_FOCUS,
    framework,
  };
}

export function blurFramework(framework) {
  return {
    type: FRAMEWORK_BLUR,
    framework,
  };
}

export function toggleFramework(framework) {
  return {
    type: FRAMEWORK_TOGGLE,
    framework,
  };
}

let actionCreators = {
  requestApiStatus,
  respondeWithApiStatus,
  checkApi,
  clusterUpdate,
  addNodes,
  removeNodes,
  connectWebSocket,
  selectNode,
  showDetails,
  focusFramework,
  blurFramework,
  toggleFramework,
};

export function registerActionCreators(creators) {
  actionCreators = Object.assign({}, actionCreators, creators);
}

export function getActionCreators() {
  return actionCreators;
}

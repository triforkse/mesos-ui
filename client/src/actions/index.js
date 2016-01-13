import * as api from '../api-client';

export const API_STATUS_REQUESTED = 'API_STATUS_REQUESTED';
export const API_STATUS_RECEIVED = 'API_STATUS_RECEIVED';
export const WEB_SOCKET_CONNECTION_REQUESTED = 'WEB_SOCKET_CONNECTION_REQUESTED';
export const WEB_SOCKET_INIT = 'WEB_SOCKET_INIT';
export const WEB_SOCKET_DIFF = 'WEB_SOCKET_DIFF';
export const LOADER_SUBSCRIPTIONS_REQUESTED = 'LOADER_SUBSCRIPTIONS_REQUESTED';
export const LOADER_FRAMEWORKS = 'LOADER_FRAMEWORKS';
export const LOADER_MESSAGE = 'LOADER_MESSAGE';
export const CLUSTER_NODE_UPDATE = 'CLUSTER_NODE_UPDATE';
export const CLUSTER_NODE_ADDED = 'CLUSTER_NODE_ADDED';
export const CLUSTER_NODE_REMOVED = 'CLUSTER_NODE_REMOVED';
export const NODE_SELECTION = 'NODE_SELECTION';
export const SHOW_NODE_DETAILS = 'SHOW_NODE_DETAILS';
export const TOGGLE_PANEL = 'TOGGLE_PANEL';
export const FRAMEWORK_FOCUS = 'FRAMEWORK_FOCUS';
export const FRAMEWORK_BLUR = 'FRAMEWORK_BLUR';
export const FRAMEWORK_TOGGLE = 'FRAMEWORK_TOGGLE';
export const FRAMEWORK_CLEAR = 'FRAMEWORK_CLEAR';
export const SLAVE_TOGGLE = 'SLAVE_TOGGLE';
export const SLAVE_CLEAR = 'SLAVE_CLEAR';
export const INTENT_VALUE = 'INTENT_VALUE';
export const WIZARD_NEXT = 'WIZARD_NEXT';
export const WIZARD_PREV = 'WIZARD_PREV';
export const SERVICE_ADD = 'SERVICE_ADD';
export const SERVICE_REMOVE = 'SERVICE_REMOVE';

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

function framworkSubscriptionDispatcher(dispatch, framework) {
  return message => dispatch({type: LOADER_MESSAGE, framework, message});
}

async function setupSubscriptions(dispatch) {
  const session = await api.connectWamp();
  const frameworks = await api.listLoaderFrameworks(session);
  dispatch({type: LOADER_FRAMEWORKS, frameworks});
  frameworks.forEach(framework =>
    api.startSubsription(session, framework.name, framworkSubscriptionDispatcher(dispatch, framework.name)));
}

export function subscribeToLoaderFrameworks() {
  return dispatch => {
    dispatch({
      type: LOADER_SUBSCRIPTIONS_REQUESTED,
    });

    setupSubscriptions(dispatch);
  };
}

export function toggleSlave(pid) {
  return {
    type: SLAVE_TOGGLE,
    pid,
  };
}

export function clearSlaves() {
  return {
    type: SLAVE_CLEAR,
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

export function clearFrameworks() {
  return {
    type: FRAMEWORK_CLEAR,
  };
}

export function newRadarValue(layer, metric, value) {
  let newValue = parseFloat(value);
  if (Number.isNaN(newValue)) {
    newValue = 0;
  }
  return {
    type: INTENT_VALUE,
    payload: {
      metric,
      layer,
      value: newValue,
    },
  };
}

export function wizardNext(size) {
  return {
    type: WIZARD_NEXT,
    size,
  };
}

export function wizardPrev(size) {
  return {
    type: WIZARD_PREV,
    size,
  };
}

export function addService(framework) {
  return {
    type: SERVICE_ADD,
    framework,
  };
}

export function removeService(index) {
  return {
    type: SERVICE_REMOVE,
    index,
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
  subscribeToLoaderFrameworks,
  selectNode,
  showDetails,
  focusFramework,
  blurFramework,
  toggleFramework,
  toggleSlave,
  clearFrameworks,
  clearSlaves,
  newRadarValue,
  wizardNext,
  wizardPrev,
  addService,
  removeService,
};

export function registerActionCreators(creators) {
  actionCreators = Object.assign({}, actionCreators, creators);
}

export function getActionCreators() {
  return actionCreators;
}

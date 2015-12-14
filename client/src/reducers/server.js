import * as actions from '../actions';
import {fromJS} from 'immutable';
import patch from 'immutablepatch';
import {ServerState, Cluster, Slave, Framework, Resources} from '../records';

const initialState = new ServerState();

function assertSlaveFrameworksAsRecord(slave) {
  return slave.update('frameworks', frameworks => {
    return frameworks.map(f =>
      f instanceof Framework
      ? f
      : new Framework(f));
  });
}

function assertSlaveResourcesAsRecord(slave) {
  return slave.update('resources', resources =>
    resources instanceof Resources ? resources : new Resources(resources)
  ).update('used_resources', usedResources =>
    usedResources instanceof Resources ? usedResources : new Resources(usedResources)
  );
}

function assertSlaveAsRecord(status) {
  return status.update('slaves', slaves => {
    return slaves.map(slave =>
      slave instanceof Slave
      ? slave
      : new Slave(slave))
                 .map(assertSlaveResourcesAsRecord)
                 .map(assertSlaveFrameworksAsRecord);
  });
}

function assertFrameworkAsRecord(status) {
  return status.update('frameworks', frameworks => {
    return frameworks.map(framework =>
      framework instanceof Framework
      ? framework
      : new Framework(framework));
  });
}

function parseInitialState(state, message) {
  const serverState = state.set('connecting', false)
                           .set('cluster', new Cluster(message));

  return serverState.update('cluster', cluster =>
    cluster.update(assertSlaveAsRecord)
           .update(assertSlaveFrameworksAsRecord));
}

function updateState(state, changes) {
  return state.update('cluster', s => {
    return patch(s, changes)
      .update(assertSlaveAsRecord)
      .update(assertFrameworkAsRecord);
  });
}

export function clusterState(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return parseInitialState(state, fromJS(action.message));
  case actions.WEB_SOCKET_DIFF:
    return updateState(state, fromJS(action.changes));
  default:
    return state;
  }
}

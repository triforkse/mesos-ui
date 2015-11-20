import Immutable from 'immutable';
import {compose} from 'lodash';
import {
  NODE_SELECTION, SHOW_NODE_DETAILS,
  CLUSTER_NODE_UPDATE, CLUSTER_NODE_ADDED,
  CLUSTER_NODE_REMOVED } from '../actions';

const initialState = Immutable.fromJS([
  {
    pid: 'slave(1)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.5,
      disk: 100,
      mem: 300,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(2)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(3)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(4)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(5)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(6)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
  {
    pid: 'slave(7)@127.0.0.1:5052',
    hostname: 'mesos',
    resources: {
      cpus: 1,
      disk: 13483,
      mem: 498,
      ports: '[12000-12999]',
    },
    used_resources: {
      cpus: 0.2,
      disk: 10,
      mem: 32,
      ports: '[12103-12103, 12723-12723]',
    },
  },
]);

function selectNode(state) {
  return state;
}

function showDetails(state, node) {
  return state.update(s => {
    return s.map(n => {
      if (node.pid === n.get('pid')) {
        return n.set('details', true);
      }
      return n.set('details', false);
    });
  });
}

function updateCluster(state, message) {
  return state.update(s => {
    return s.map(n => {
      const node = message.find(un => un.get('pid') === n.get('pid'));
      if (node) {
        return node;
      }
      return n;
    }).sort();
  });
}

function addNodes(state, message) {
  return message.reduce((newState, node) => {
    if (!newState.find(n => n.get('pid') === node.get('pid'))) {
      return state.push(node);
    }
    return state;
  }, state);
}

function removeNodes(state, message) {
  return message.reduce((newState, node) => {
    return newState.filter(n => n.get('pid') !== node.get('pid'));
  }, state);
}


const FULL_ARC = 2 * Math.PI;
function calculateQuota(fullQuota, usedQuota) {
  return (usedQuota / fullQuota) * FULL_ARC;
}

function quota(node, selector) {
  return calculateQuota(
    node.getIn(['resources', selector]),
    node.getIn(['used_resources', selector]),
  );
}

function setQuota(state) {
  return state.map(n => n.set('prevCpusQuota', n.get('cpusQuota') || 0)
                         .set('cpusQuota', quota(n, 'cpus'))
                         .set('prevDiskQuota', n.get('diskQuota') || 0)
                         .set('diskQuota', quota(n, 'disk'))
                         .set('prevMemQuota', n.get('memQuota') || 0)
                         .set('memQuota', quota(n, 'mem')));
}

export function nodes(state = setQuota(initialState), action) {
  switch (action.type) {
  case NODE_SELECTION:
    return selectNode(state, action.node);
  case SHOW_NODE_DETAILS:
    return showDetails(state, action.node);
  case CLUSTER_NODE_UPDATE:
    return compose(setQuota, updateCluster)(state, action.message);
  case CLUSTER_NODE_ADDED:
    return compose(setQuota, addNodes)(state, action.message);
  case CLUSTER_NODE_REMOVED:
    return removeNodes(state, action.message);
  default:
    return state;
  }
}

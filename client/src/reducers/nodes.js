import Immutable from 'immutable';
import {NODE_SELECTION, SHOW_NODE_DETAILS} from '../actions';

const initialState = Immutable.fromJS([
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
  Immutable.Map({
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
  }),
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

export function nodes(state = initialState, action) {
  switch (action.type) {
  case NODE_SELECTION:
    return selectNode(state, action.node);
  case SHOW_NODE_DETAILS:
    return showDetails(state, action.node);
  default:
    return state;
  }
}

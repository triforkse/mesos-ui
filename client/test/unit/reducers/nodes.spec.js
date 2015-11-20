/* global it expect describe */

import Immutable from 'immutable';
import * as Reducers from '../../../src/reducers/nodes';
import {clusterUpdate, addNodes, removeNodes} from '../../../src/actions';

describe('reducers - nodes', () => {
  const initialState = [
    {
      pid: 'TEST_ID_1',
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
      pid: 'TEST_ID_2',
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
  ];

  describe('#CLUSTER_NODE_UPDATE', () => {
    it('should update all matching nodes', () => {
      const state = initialState;
      const message = [
        {
          pid: 'TEST_ID_1',
          hostname: 'mesos',
          resources: {
            cpus: 1,
            disk: 13483,
            mem: 498,
            ports: '[12000-12999]',
          },
          used_resources: {
            cpus: 0.4,
            disk: 20,
            mem: 34,
            ports: '[12103-12103, 12723-12723]',
          },
        },
      ];

      let result = Reducers.nodes(
                       Immutable.fromJS(state),
                       clusterUpdate(Immutable.fromJS(message))
                     );
      result = result.toJS();

      expect(result[0].used_resources.cpus).to.equal(0.4);
      expect(result[0].used_resources.disk).to.equal(20);
      expect(result[0].used_resources.mem).to.equal(34);

      expect(result[1].used_resources.cpus).to.equal(0.2);
      expect(result[1].used_resources.disk).to.equal(10);
      expect(result[1].used_resources.mem).to.equal(32);
    });
  });

  describe('#CLUSTER_NODE_ADDED', () => {
    it('should add new nodes', () => {
      const state = initialState;
      const message = [
        {
          pid: 'TEST_ID_3',
          hostname: 'mesos',
          resources: {
            cpus: 1,
            disk: 13483,
            mem: 498,
            ports: '[12000-12999]',
          },
          used_resources: {
            cpus: 0.4,
            disk: 20,
            mem: 34,
            ports: '[12103-12103, 12723-12723]',
          },
        },
      ];

      let result = Reducers.nodes(
                       Immutable.fromJS(state),
                       addNodes(Immutable.fromJS(message))
                     );
      result = result.toJS();

      expect(result[0].pid).to.equal(initialState[0].pid);
      expect(result[1].pid).to.equal(initialState[1].pid);

      expect(result[2].pid).to.equal(message[0].pid);
    });
  });

  it('should not add existing nodes', () => {
    const state = initialState;
    const message = [
      {
        pid: 'TEST_ID_2',
        hostname: 'mesos',
        resources: {
          cpus: 1,
          disk: 13483,
          mem: 498,
          ports: '[12000-12999]',
        },
        used_resources: {
          cpus: 0.4,
          disk: 20,
          mem: 34,
          ports: '[12103-12103, 12723-12723]',
        },
      },
    ];

    let result = Reducers.nodes(
                     Immutable.fromJS(state),
                     addNodes(Immutable.fromJS(message))
                   );
    result = result.toJS();

    expect(result.length).to.equal(initialState.length);
    expect(result[0].pid).to.equal(initialState[0].pid);
    expect(result[1].pid).to.equal(initialState[1].pid);
    expect(result[1].used_resources.cpus).to.equal(initialState[1].used_resources.cpus);
  });

  describe('#CLUSTER_NODE_REMOVED', () => {
    it('should remove all matching nodes', () => {
      const state = initialState;
      const message = [
        {
          pid: 'TEST_ID_1',
        },
      ];

      let result = Reducers.nodes(
                       Immutable.fromJS(state),
                       removeNodes(Immutable.fromJS(message))
                     );
      result = result.toJS();

      expect(result.length).to.equal(1);
      expect(result[0].pid).to.equal(initialState[1].pid);
    });
  });
});

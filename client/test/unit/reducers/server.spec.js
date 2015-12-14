/*eslint-disable*/

import {fromJS, Map} from 'immutable';
import d3 from 'd3';
import {WEB_SOCKET_INIT, WEB_SOCKET_DIFF} from '../../../src/actions';
import {clusterState} from '../../../src/reducers/server';
import {ServerState, Cluster, Slave, Framework} from '../../../src/records';

const colors = d3.scale.category10();
colors.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

describe('reducers - cluster-layout', () => {
  describe('#WEB_SOCKET_INIT', () => {
    it('should set default values on slaves and framewoks for non specified fields', () => {
      const data = {
        slaves: [{pid: 'test-pid'}],
        frameworks: [{name: 'test-framework'}],
      };
      const result = clusterState(new ServerState(), {type: WEB_SOCKET_INIT, message: data}).toJS();
      console.log('result', result);

      expect(result.cluster.slaves[0].pid).to.equal('test-pid');
      expect(result.cluster.slaves[0].resources.cpus).to.equal(0);
      expect(result.cluster.slaves[0].used_resources.cpus).to.equal(0);
      expect(result.cluster.frameworks[0].name).to.equal('test-framework');
      expect(result.cluster.frameworks[0].resources.cpus).to.equal(0);
      expect(result.cluster.frameworks[0].used_resources.cpus).to.equal(0);
    });
  });

  describe('#WEB_SOCKET_DIFF', () => {
    it('should add salves and frameworks as Records', () => {
      const state = new ServerState({
        cluster: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2'}),
          ]),
          frameworks: fromJS([
            new Framework({name: 'framework1'}),
            new Framework({name: 'framework2'}),
          ]),
        }),
      });

      const changes = [
        {op: 'add', path: '/frameworks/2', value: {name: 'framework3'} },
        {op: 'add', path: '/slaves/2', value: {pid: 'slave3'} },
      ];

      const result = clusterState(state, {type: WEB_SOCKET_DIFF, changes: changes});

      expect(result.cluster.slaves.get(0).pid).to.equal('slave1');
      expect(result.cluster.slaves.get(1).pid).to.equal('slave2');
      expect(result.cluster.slaves.get(2).pid).to.equal('slave3');
      expect(result.cluster.frameworks.get(0).name).to.equal('framework1');
      expect(result.cluster.frameworks.get(1).name).to.equal('framework2');
      expect(result.cluster.frameworks.get(2).name).to.equal('framework3');
    });
  });
});

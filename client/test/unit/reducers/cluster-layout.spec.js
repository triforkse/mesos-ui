/*eslint-disable*/

import {fromJS, Map} from 'immutable';
import d3 from 'd3';
import {WEB_SOCKET_INIT, WEB_SOCKET_DIFF, FRAMEWORK_BLUR, FRAMEWORK_TOGGLE, FRAMEWORK_FOCUS, SLAVE_TOGGLE} from '../../../src/actions';
import {clusterLayout} from '../../../src/reducers/cluster-layout';
import {ClusterLayout} from '../../../src/records';

describe('reducers - cluster-layout', () => {
  describe('#SLAVE_TOGGLE', () => {
    it('should set slave to selected if it was not', () => {
      const state = new ClusterLayout({
        selectedSlaves: fromJS(['slave1'])
      });

      const result = clusterLayout(state, {type: SLAVE_TOGGLE, pid: 'slave2'}).selectedSlaves;

      expect(result.count()).to.equal(2);
      expect(result.get(0)).to.equal('slave1');
      expect(result.get(1)).to.equal('slave2');
    });

    it('should remove slave as selected if it was', () => {
      const state = new ClusterLayout({
        selectedSlaves: fromJS(['slave1', 'slave2'])
      });

      const result = clusterLayout(state, {type: SLAVE_TOGGLE, pid: 'slave2'}).selectedSlaves;

      expect(result.count()).to.equal(1);
      expect(result.get(0)).to.equal('slave1');
    });
  });
});

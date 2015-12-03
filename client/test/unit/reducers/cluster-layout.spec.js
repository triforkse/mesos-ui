/* global it expect describe */

import {fromJS, Map} from 'immutable';
import d3 from 'd3';
import {WEB_SOCKET_INIT, WEB_SOCKET_DIFF} from '../../../src/actions';
import {clusterLayout} from '../../../src/reducers/cluster-layout';

const colors = d3.scale.category10();

describe('reducers - cluster-layout', () => {
  describe('#WEB_SOCKET_INIT', () => {
    it('should set a color for each framework', () => {
      const data = {
        frameworks: [{name: 'framework1'}, {name: 'framework2'}],
      };
      const result = clusterLayout(fromJS({colors: {}}), {type: WEB_SOCKET_INIT, message: data}).toJS();

      expect(result.colors.frameworks['framework1']).to.equal(colors(0));
      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });
  });

  describe('#WEB_SOCKET_DIFF', () => {
    it('should set a new color for a new framework', () => {
      const state = fromJS({
        colors: {
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        },
      });

      const changes = [{op: 'add', path: '/frameworks/2', value: {name: 'framework3'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework3']).to.equal(colors(2));
    });

    it('should not set a new color for an existing framework', () => {
      const state = fromJS({
        colors: {
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        },
      });

      const changes = [{op: 'add', path: '/frameworks/2', value: {name: 'framework2'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });

    it('should not set a new color for an updated framework', () => {
      const state = fromJS({
        colors: {
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        },
      });

      const changes = [{op: 'add', path: '/frameworks/0', value: {name: 'framework2'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });
  });
});

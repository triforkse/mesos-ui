/*eslint-disable*/

import {fromJS, Map} from 'immutable';
import d3 from 'd3';
import {WEB_SOCKET_INIT, WEB_SOCKET_DIFF, FRAMEWORK_BLUR, FRAMEWORK_TOGGLE, FRAMEWORK_FOCUS, SLAVE_TOGGLE} from '../../../src/actions';
import {clusterLayout} from '../../../src/reducers/cluster-layout';
import {ClusterState, Cluster, Slave, Framework, Colors, FrameworkList, Layout} from '../../../src/records';

const colors = d3.scale.category10();
colors.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

describe('reducers - cluster-layout', () => {
  describe('#WEB_SOCKET_INIT', () => {
    it('should set a color for each framework', () => {
      const data = {
        slaves: [],
        frameworks: [{name: 'framework1'}, {name: 'framework2'}],
      };
      const result = clusterLayout(fromJS({colors: {}}), {type: WEB_SOCKET_INIT, message: data}).toJS();

      expect(result.colors.frameworks['framework1']).to.equal(colors(0));
      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });

    it('should set default values on slaves and framewoks for non specified fields', () => {
      const data = {
        slaves: [{pid: 'test-pid'}],
        frameworks: [{name: 'test-framework'}],
      };
      const result = clusterLayout(fromJS({colors: {}}), {type: WEB_SOCKET_INIT, message: data}).toJS();

      expect(result.status.slaves[0].pid).to.equal('test-pid');
      expect(result.status.slaves[0].resources.cpus).to.equal(0);
      expect(result.status.slaves[0].used_resources.cpus).to.equal(0);
      expect(result.status.frameworks[0].name).to.equal('test-framework');
      expect(result.status.frameworks[0].resources.cpus).to.equal(0);
      expect(result.status.frameworks[0].used_resources.cpus).to.equal(0);
    });
  });

  describe('#WEB_SOCKET_DIFF', () => {
    it('should set a new color for a new framework', () => {
      const state = new ClusterState({
        status: new Cluster({
          frameworks: fromJS([
            new Framework({name: 'framework1'}),
            new Framework({name: 'framework2'}),
          ]),
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
      });

      const changes = [{op: 'add', path: '/frameworks/2', value: {name: 'framework3'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework3']).to.equal(colors(2));
    });

    it('should not set a new color for an existing framework', () => {
      const state = new ClusterState({
        status: new Cluster({
          frameworks: fromJS([
            new Framework({name: 'framework1'}),
            new Framework({name: 'framework2'}),
          ]),
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
      });

      const changes = [{op: 'add', path: '/frameworks/2', value: {name: 'framework2'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });

    it('should not set a new color for an updated framework', () => {
      const state = new ClusterState({
        status: new Cluster({
          frameworks: fromJS([
            new Framework({name: 'framework1'}),
            new Framework({name: 'framework2'}),
          ]),
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
      });

      const changes = [{op: 'add', path: '/frameworks/0', value: {name: 'framework2'} }];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).toJS();

      expect(result.colors.frameworks['framework2']).to.equal(colors(1));
    });

    it('should add salves and frameworks as Records', () => {
      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2'}),
          ]),
          frameworks: fromJS([
            new Framework({name: 'framework1'}),
            new Framework({name: 'framework2'}),
          ]),
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
      });

      const changes = [
        {op: 'add', path: '/frameworks/2', value: {name: 'framework3'} },
        {op: 'add', path: '/slaves/2', value: {pid: 'slave3'} },
      ];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes});

      expect(result.status.slaves.get(0).pid).to.equal('slave1');
      expect(result.status.slaves.get(1).pid).to.equal('slave2');
      expect(result.status.slaves.get(2).pid).to.equal('slave3');
      expect(result.status.frameworks.get(0).name).to.equal('framework1');
      expect(result.status.frameworks.get(1).name).to.equal('framework2');
      expect(result.status.frameworks.get(2).name).to.equal('framework3');
    });

    it('should keep selected slaves as selected', () => {
      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1', layout: new Layout({selected: true})}),
            new Slave({pid: 'slave2', layout: new Layout({selected: false})}),
          ]),
        }),
      });

      const changes = [
        {op: 'replace', path: '/slaves/0/used_resources/cpus', value: 0.5 },
        {op: 'replace', path: '/slaves/1/used_resources/cpus', value: 0.5 },
        {op: 'add', path: '/slaves/2', value: {pid: 'slave3'} },
      ];

      const result = clusterLayout(state, {type: WEB_SOCKET_DIFF, changes: changes}).status.slaves;

      expect(result.get(0).layout.selected).to.be.true;
      expect(result.get(1).layout.selected).to.be.false;
      expect(result.get(2).layout.selected).to.be.false;
    });
  });

  describe('#FRAMEWORK_TOGGLE', () => {
    it('should set layout to fixed on slaves containing selected framework', () => {
      const frameworks = fromJS(['framework1', 'framework2']);

      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2', frameworks: frameworks.map(f => new Framework({name: f}))}),
            new Slave({pid: 'slave3', frameworks: frameworks.map(f => new Framework({name: f}))}),
          ]),
          frameworks,
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
        frameworkList: new FrameworkList({selected: frameworks}),
      });

      const result = clusterLayout(state, {type: FRAMEWORK_TOGGLE, framework: 'framework1'});

      expect(result.status.slaves.get(0).layout.fixed).to.be.false
      expect(result.status.slaves.get(1).layout.fixed).to.be.true
      expect(result.status.slaves.get(2).layout.fixed).to.be.true
    });
  });

  describe('#FRAMEWORK_FOCUS', () => {
    it('should set layout to fixed on slaves containing focused framework', () => {
      const frameworks = fromJS(['framework1', 'framework2']);

      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2', frameworks: frameworks.map(f => new Framework({name: f}))}),
            new Slave({pid: 'slave3', frameworks: frameworks.map(f => new Framework({name: f}))}),
          ]),
          frameworks,
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
        frameworkList: new FrameworkList({selected: fromJS([])}),
      });

      const result = clusterLayout(state, {type: FRAMEWORK_FOCUS, framework: 'framework1'});

      expect(result.status.slaves.get(0).layout.fixed).to.be.false
      expect(result.status.slaves.get(1).layout.fixed).to.be.true
      expect(result.status.slaves.get(2).layout.fixed).to.be.true
    });
  });

  describe('#FRAMEWORK_BLUR', () => {
    it('should set layout to not fixed when no framework is selected or focused', () => {
      const frameworks = fromJS(['framework1', 'framework2']);

      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2', frameworks: frameworks.map(f => new Framework({name: f})), layout: new Layout({fixed: true})}),
            new Slave({pid: 'slave3', frameworks: frameworks.map(f => new Framework({name: f})), layout: new Layout({fixed: true})}),
          ]),
          frameworks,
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
        frameworkList: new FrameworkList({selected: fromJS([])}),
      });

      const result = clusterLayout(state, {type: FRAMEWORK_BLUR});

      expect(result.status.slaves.get(0).layout.fixed).to.be.false
      expect(result.status.slaves.get(1).layout.fixed).to.be.false
      expect(result.status.slaves.get(2).layout.fixed).to.be.false
    });

    it('should set keep layout fixed when frameworks are selected but not focused', () => {
      const frameworks = fromJS(['framework1', 'framework2']);

      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1'}),
            new Slave({pid: 'slave2', frameworks: frameworks.map(f => new Framework({name: f}))}),
            new Slave({pid: 'slave3', frameworks: frameworks.map(f => new Framework({name: f}))}),
          ]),
          frameworks,
        }),
        colors: new Colors(Map({
          frameworks: Map([
            ['framework1', colors(0)],
            ['framework2', colors(1)],
          ]),
        })),
        frameworkList: new FrameworkList({selected: frameworks}),
      });

      const result = clusterLayout(state, {type: FRAMEWORK_BLUR});

      expect(result.status.slaves.get(0).layout.fixed).to.be.false
      expect(result.status.slaves.get(1).layout.fixed).to.be.true
      expect(result.status.slaves.get(2).layout.fixed).to.be.true
    });
  });

  describe('#SLAVE_TOGGLE', () => {
    it('should set slave to selected if it was not', () => {
      const state = new ClusterState({
        status: new Cluster({
          slaves: fromJS([
            new Slave({pid: 'slave1', layout: new Layout({selected: true})}),
            new Slave({pid: 'slave2', layout: new Layout({selected: false})}),
          ]),
        }),
      });

      const result = clusterLayout(state, {type: SLAVE_TOGGLE, pid: 'slave2'}).status.slaves;

      expect(result.get(0).layout.selected).to.be.true;
      expect(result.get(1).layout.selected).to.be.true;
    });
  });
});

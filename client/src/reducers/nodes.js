import Immutable from 'immutable';
import {NODE_SELECTION} from '../actions';

const initialState = Immutable.Map({
  name: 'cluster',
  children: Immutable.List([
    Immutable.Map({
      name: 'node1',
      children: Immutable.List([
        Immutable.Map({id: 1, name: 'ElasticSerach', cpu: 10, color: '#0DFF19', links: [2, 3] }),
        Immutable.Map({id: 2, name: 'Logstash', cpu: 15, color: '#3D300C' }),
        Immutable.Map({name: 'Spark', cpu: 10, color: '#FF0000' }),
        Immutable.Map({name: 'Storm', cpu: 5, color: '#100CE8' }),
        Immutable.Map({name: 'Postgres', cpu: 10, color: '#ADF7D3' }),
        Immutable.Map({name: 'Rails', cpu: 40, color: '#FF0DFF' }),
      ]),
    }),
    Immutable.Map({
      name: 'node2',
      children: Immutable.List([
        Immutable.Map({name: 'ElasticSerach', cpu: 10, color: '#0DFF19' }),
        Immutable.Map({name: 'Logstash', cpu: 15, color: '#3D300C' }),
        Immutable.Map({name: 'Spark', cpu: 10, color: '#FF0000' }),
        Immutable.Map({name: 'Storm', cpu: 5, color: '#100CE8' }),
        Immutable.Map({name: 'Postgres', cpu: 10, color: '#ADF7D3' }),
        Immutable.Map({id: 3, name: 'Rails', cpu: 30, color: '#FF0DFF' }),
      ]),
    }),
    Immutable.Map({
      name: 'node3',
      children: Immutable.List([
        Immutable.Map({name: 'ElasticSerach', cpu: 10, color: '#0DFF19' }),
        Immutable.Map({name: 'Logstash', cpu: 15, color: '#3D300C' }),
        Immutable.Map({name: 'Spark', cpu: 10, color: '#FF0000' }),
        Immutable.Map({name: 'Storm', cpu: 5, color: '#100CE8' }),
        Immutable.Map({name: 'Postgres', cpu: 10, color: '#ADF7D3' }),
        Immutable.Map({name: 'Rails', cpu: 10, color: '#FF0DFF' }),
      ]),
    }),
    Immutable.Map({
      name: 'node4',
      children: Immutable.List([
        Immutable.Map({name: 'ElasticSerach', cpu: 10, color: '#0DFF19' }),
        Immutable.Map({name: 'Logstash', cpu: 15, color: '#3D300C' }),
        Immutable.Map({name: 'Spark', cpu: 10, color: '#FF0000' }),
        Immutable.Map({name: 'Storm', cpu: 5, color: '#100CE8' }),
        Immutable.Map({name: 'Postgres', cpu: 10, color: '#ADF7D3' }),
        Immutable.Map({name: 'Rails', cpu: 20, color: '#FF0DFF' }),
      ]),
    }),
  ]),
});

function toggleActive(framework, name) {
  if (framework.get('name') === name) {
    return framework.set('active', false);
  }
  return framework.set('active', true);
}

function selectNode(state, node) {
  state.update(s => {
    return s.children.map(mesosNode => {
      if ( mesosNode.get('name') === node.parent.name ) {
        return mesosNode.update(mn => {
          return mn.children.map(framework => {
            return toggleActive(framework, node.name);
          });
        });
      }
      return mesosNode;
    });
  });
  return state;
}

export function nodes(state = initialState, action) {
  switch (action.type) {
  case NODE_SELECTION:
    return selectNode(state, action.node);
  default:
    return state;
  }
}

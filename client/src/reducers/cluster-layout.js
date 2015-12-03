import * as actions from '../actions';
import patch from 'immutablepatch';
import {Map, fromJS} from 'immutable';
import d3 from 'd3';

const initialState = fromJS({colors: {frameworks: {}}});

const colors = d3.scale.category10();
colors.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // TODO: replace with sane color generation

function generateColor(framework, index) {
  return [framework.get('name'), colors(index)];
}

function generateInitialColors(data) {
  const frameworkColors = data.get('frameworks').map(generateColor);
  return Map(frameworkColors);
}

function generateColors(colorOffset, update) {
  const frameworkColors = update.get('frameworks')
    .map((framework, i) => generateColor(framework, i + colorOffset));
  return Map(frameworkColors);
}

function parseInitialState(state, message) {
  return state.merge({colors: {frameworks: generateInitialColors(message)}});
}

function updateState(state, changes) {
  const additions = changes.filter(c => c.get('op') === 'add');
  const update = patch(fromJS({}), additions);
  if (update.has('frameworks')) {
    const colorOffset = state.getIn(['colors', 'frameworks']).count();
    const frameworkColors = generateColors(colorOffset, update);
    return state.updateIn(['colors', 'frameworks'], frameworks => {
      return frameworkColors.merge(frameworks);
    });
  }
  return state;
}

export function clusterLayout(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return parseInitialState(state, fromJS(action.message));
  case actions.WEB_SOCKET_DIFF:
    return updateState(state, fromJS(action.changes));
  default:
    return state;
  }
}

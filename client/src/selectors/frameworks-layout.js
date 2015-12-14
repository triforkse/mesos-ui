import {createSelector} from 'reselect';
import {Map} from 'immutable';
import d3 from 'd3';

const colorsFn = d3.scale.category10();
colorsFn.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // TODO: replace with sane color generation

function generateColor(framework, index) {
  return [framework.get('name'), colorsFn(index)];
}

function generateColors(frameworks) {
  const frameworkColors = frameworks.map(generateColor);
  return Map(frameworkColors);
}

const frameworksSelector = state => state.clusterState.cluster.frameworks;

export default createSelector(
  frameworksSelector,
  generateColors
);

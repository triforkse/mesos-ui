import {createSelector} from 'reselect';
import {Layout} from '../records';

function setLayout(slaves, focusedFramework, selectedFramworks, selectedSlaves) {
  const createLayout = slave => {
    return new Layout({
      selected: slave.frameworks.some(f => selectedFramworks.includes(f.name)) ||
                selectedSlaves.contains(slave.pid),
      focus: slave.frameworks.some(f => focusedFramework === f.name),
    });
  };

  return slaves.map(s => s.set('layout', createLayout(s)));
}

const slavesSelector = state => state.clusterState.cluster.slaves;
const focusedFrameworkSelector = state => state.clusterLayout.focusedFramework;
const selectedFrameworksSelector = state => state.clusterLayout.selectedFrameworks;
const selectedSlavesSelector = state => state.clusterLayout.selectedSlaves;

export default createSelector(
  slavesSelector,
  focusedFrameworkSelector,
  selectedFrameworksSelector,
  selectedSlavesSelector,
  (slaves, focusedFramework, selectedFrameworks, selectedSlaves) => {
    return setLayout(slaves, focusedFramework, selectedFrameworks, selectedSlaves);
  }
);

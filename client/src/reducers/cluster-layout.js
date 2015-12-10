import * as actions from '../actions';
import patch from 'immutablepatch';
import {Map, fromJS} from 'immutable';
import {partial} from 'lodash';
import d3 from 'd3';
import {ClusterState, Cluster, Slave, Framework, Colors} from '../records';

const initialState = new ClusterState();

const colorsFn = d3.scale.category10();
colorsFn.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // TODO: replace with sane color generation

function generateColor(framework, index) {
  return [framework.get('name'), colorsFn(index)];
}

function generateInitialColors(data) {
  const frameworkColors = data.get('frameworks').map(generateColor);
  return Map(frameworkColors);
}


function assertSlaveFrameworksAsRecord(slave) {
  return slave.update('frameworks', frameworks => {
    return frameworks.map(f => f instanceof Framework ? f : new Framework(f));
  });
}

function parseInitialState(state, message) {
  let status = new Cluster(message);
  status = status
    .set('slaves', message.get('slaves').map(s => new Slave(s)).map(assertSlaveFrameworksAsRecord))
    .set('frameworks', message.get('frameworks').map(f => new Framework(f)));

  const colors = new Colors({frameworks: generateInitialColors(message)});

  return state.merge({status, colors});
}

function assertSlaveAsRecord(status) {
  return status.update('slaves', slaves => {
    return slaves.map(slave => slave instanceof Slave ? slave : new Slave(slave))
                 .map(assertSlaveFrameworksAsRecord);
  });
}

function assertFrameworkAsRecord(status) {
  return status.update('frameworks', frameworks => {
    return frameworks.map(framework => framework instanceof Framework ? framework : new Framework(framework));
  });
}

function assertFramewokColors(state) {
  const frameworksInCluster = state.status.frameworks.map(f => f.name);

  return state.updateIn(['colors', 'frameworks'], frameworksWithColors => {
    return frameworksInCluster.reduce((newFrameworkWithColors, frameworkName) => {
      return frameworksWithColors.has(frameworkName)
        ? newFrameworkWithColors
        : newFrameworkWithColors.set(frameworkName, colorsFn(newFrameworkWithColors.count()));
    }, frameworksWithColors);
  });
}

function updateState(state, changes) {
  return state.update('status', s => {
    return patch(s, changes)
      .update(assertSlaveAsRecord)
      .update(assertFrameworkAsRecord);
  }).update(assertFramewokColors);
}

function toggleSelecton(framework, selectedFrameworks) {
  return selectedFrameworks.contains(framework)
    ? selectedFrameworks.remove(selectedFrameworks.indexOf(framework))
    : selectedFrameworks.push(framework);
}

function toggleFocus(state) {
  const selected = state.frameworkList.selected;
  const focused = state.frameworkList.focus;
  const shouldBeFocused = slave => {
    return slave.frameworks.some(f => selected.contains(f.name) || focused === f.name);
  };

  return state.updateIn(['status', 'slaves'], slaves => {
    return slaves.map(slave => {
      return slave.update('layout', l => l.set('focus', shouldBeFocused(slave)));
    });
  });
}

function toggleSelectionOfFrameworks(state, framework) {
  return state.updateIn(['frameworkList', 'selected'], partial(toggleSelecton, framework))
              .update(toggleFocus);
}

function focusFramework(state, framework) {
  return state.setIn(['frameworkList', 'focus'], framework)
    .update(toggleFocus);
}

function blurFramework(state) {
  return state.setIn(['frameworkList', 'focus'], null)
    .update(toggleFocus);
}

function toggleSlaveSelection(state, pid) {
  return state.updateIn(['status', 'slaves'], slaves => {
    return slaves.map(slave => {
      return slave.pid === pid
        ? slave.update('layout', layout => layout.set('selected', !layout.selected).set('fixed', !layout.selected))
        : slave;
    });
  });
}

export function clusterLayout(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return parseInitialState(state, fromJS(action.message));
  case actions.WEB_SOCKET_DIFF:
    return updateState(state, fromJS(action.changes));
  case actions.FRAMEWORK_FOCUS:
    return focusFramework(state, action.framework);
  case actions.FRAMEWORK_BLUR:
    return blurFramework(state);
  case actions.FRAMEWORK_TOGGLE:
    return toggleSelectionOfFrameworks(state, action.framework);
  case actions.SLAVE_TOGGLE:
    return toggleSlaveSelection(state, action.pid);
  default:
    return state;
  }
}

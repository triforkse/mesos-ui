import * as actions from '../actions';
import {ClusterLayout} from '../records';
import { fromJS } from 'immutable';

const initialState = new ClusterLayout();

function toggleSlaveSelection(state, slaveId) {
  return state.update('selectedSlaves', slaves => {
    if (slaves.contains(slaveId)) {
      return slaves.remove(slaves.indexOf(slaveId));
    }
    return slaves.push(slaveId);
  });
}

function toggleFrameworkSelection(state, frameworkId) {
  return state.update('selectedFrameworks', frameworks => {
    if (frameworks.contains(frameworkId)) {
      return frameworks.remove(frameworks.indexOf(frameworkId));
    }
    return frameworks.push(frameworkId);
  });
}

export function clusterLayout(state = initialState, action) {
  switch (action.type) {
  case actions.SLAVE_TOGGLE:
    return toggleSlaveSelection(state, action.pid);
  case actions.SLAVE_CLEAR:
    return state.set('selectedSlaves', fromJS([]));
  case actions.FRAMEWORK_FOCUS:
    return state.set('focusedFramework', action.framework);
  case actions.FRAMEWORK_BLUR:
    return state.set('focusedFramework', null);
  case actions.FRAMEWORK_TOGGLE:
    return toggleFrameworkSelection(state, action.framework);
  case actions.FRAMEWORK_CLEAR:
    return state.set('selectedFrameworks', fromJS([]));
  default:
    return state;
  }
}

import * as actions from '../actions';
import patch from 'immutablepatch';
import diff from 'immutablediff';
import {Map, fromJS} from 'immutable';

const initialState = new Map({ status: null, connecting: true });

function updateStatus(state, changes) {
  return state.update('status', s => {
    const newStatus = patch(s, changes);

    // Re add the previous used_resources as prev_used_resources so d3 can animate
    let prevPatch = diff(newStatus, s);
    prevPatch = prevPatch
      .filter(d => d.get('path').includes('used_resources'))
      .map(d =>
        d.update('path', p => p.replace('used_resources', 'prev_used_resources')).set('op', 'add'));
    return patch(newStatus, prevPatch);
  });
}

export function socketStatus(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return state.merge({ connecting: false, status: action.message });
  case actions.WEB_SOCKET_DIFF:
    const changes = fromJS(action.changes);
    return updateStatus(state, changes);
  default:
    return state;
  }
}

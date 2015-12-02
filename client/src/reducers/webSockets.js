import * as actions from '../actions';
import patch from 'immutablepatch';
import diff from 'immutablediff';
import {Map, fromJS, Range} from 'immutable';

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


function generateGrid(rowSize) {
  return Range(1, 1000).map(i => {
    return Map({col: (i % 10), row: Math.ceil(i / rowSize)});
  }).toSeq();
}

function getAvailableSlots(slaves) {
  const grid = generateGrid(10);
  const usedSlots = slaves.filter(s => s.get('pos_in_grid')).map(s => s.get('pos_in_grid'));
  return grid.filter(slot => !usedSlots.includes(slot));
}

function placeSalavesInGrid(state) {
  return state.updateIn(['status', 'slaves'], s => {
    let gridIndex = 0;
    const availableSlots = getAvailableSlots(s);
    return s.map(slave => {
      if (!slave.get('pos_in_grid')) {
        return slave.set('pos_in_grid', availableSlots.get(gridIndex++));
      }
      return slave;
    });
  });
}

export function socketStatus(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return placeSalavesInGrid(state.merge({ connecting: false, status: action.message }));
  case actions.WEB_SOCKET_DIFF:
    const changes = fromJS(action.changes);
    return placeSalavesInGrid(updateStatus(state, changes));
  default:
    return state;
  }
}

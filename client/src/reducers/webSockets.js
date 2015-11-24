import * as actions from '../actions';
import patch from 'immutablepatch';
import {Map, fromJS} from 'immutable';

const initialState = new Map({ status: null, connecting: true });

export function socketStatus(state = initialState, action) {
  switch (action.type) {
  case actions.WEB_SOCKET_INIT:
    return state.merge({ connecting: false, status: action.message });
  case actions.WEB_SOCKET_DIFF:
    const changes = fromJS(action.changes);
    return state.update('status', s => patch(s, changes));
  default:
    return state;
  }
}

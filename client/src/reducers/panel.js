import Immutable from 'immutable';
import {TOGGLE_PANEL} from '../actions';

const initialState = Immutable.fromJS({});

export function panel(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_PANEL:
    return state.update(action.id, v => !v);
  default:
    return state;
  }
}

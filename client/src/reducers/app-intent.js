import { INTENT_VALUE } from '../actions';
import { fromJS } from 'immutable';

const initialState = fromJS({
  normal: {
    cpu: 8,
    ram: 8,
    disk: 8,
    bandwidth: 8,
    cpu2: 8,
    ram2: 8,
    disk2: 8,
    bandwidth2: 8,
  },
  max: {
    cpu: 10,
    ram: 10,
    disk: 10,
    bandwidth: 10,
    cpu2: 10,
    ram2: 10,
    disk2: 10,
    bandwidth2: 10,
  },
});

export function appIntent(state = initialState, action) {
  switch (action.type) {
  case INTENT_VALUE:
    let newState = state.setIn([action.payload.layer, action.payload.metric], action.payload.value);
    if (action.payload.value > newState.getIn(['max', action.payload.metric])) {
      newState = newState.setIn(['max', action.payload.metric], action.payload.value);
    }
    if (action.payload.value < newState.getIn(['normal', action.payload.metric])) {
      newState = newState.setIn(['normal', action.payload.metric], action.payload.value);
    }
    return newState;
  default:
    return state;
  }
}

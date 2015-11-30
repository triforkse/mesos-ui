import { FRAMEWORK_FOCUS, FRAMEWORK_BLUR, FRAMEWORK_TOGGLE } from '../actions';
import { fromJS } from 'immutable';

const initialState = fromJS({ focus: null, selected: [] });

function toggle(state, framework) {
  return state.update('selected', s => {
    if (s.contains(framework)) {
      return s.remove(s.indexOf(framework));
    }
    return s.push(framework);
  });
}

export function frameworks(state = initialState, action) {
  switch (action.type) {
  case FRAMEWORK_FOCUS:
    return state.set('focus', action.framework);
  case FRAMEWORK_BLUR:
    return state.set('focus', null);
  case FRAMEWORK_TOGGLE:
    return toggle(state, action.framework);
  default:
    return state;
  }
}

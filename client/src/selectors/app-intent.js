import {createSelector} from 'reselect';

const stateSelector = state => state;
const defaultSelector = createSelector(
  stateSelector,
  state => {
    const {appIntent, appIntentWizard, router} = state;
    return {
      appIntent,
      wizard: appIntentWizard,
      query: state.router.location.query,
      router,
    };
  });

export default createSelector(
  defaultSelector,
  state => ({...state})
);

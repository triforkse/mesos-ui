import {createSelector} from 'reselect';
import slavesLayoutSelector from './slaves-layout';
import frameworksLayoutSelector from './frameworks-layout';

const stateSelector = state => state;
const defaultSelector = createSelector(
  stateSelector,
  state => {
    const {apiStatus, appIntent, nodes, panel, router, clusterState, clusterLayout } = state;
    return {
      api: apiStatus,
      appIntent,
      cluster: clusterState.cluster,
      connecting: clusterState.connecting,
      clusterLayout,
      nodes,
      panel,
      query: state.router.location.query,
      router,
    };
  });

export const selector = createSelector(
  defaultSelector,
  slavesLayoutSelector,
  frameworksLayoutSelector,
  (state, slaves, frameworkColors) => ({...state, slaves, frameworkColors})
);

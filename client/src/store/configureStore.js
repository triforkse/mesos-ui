import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import { reduxReactRouter} from 'redux-router';
import { createHistory } from 'history';
import routes from '../routes';

const finalCreateStore = compose(
  applyMiddleware(
    thunkMiddleware,
    createLogger()
  ),
  reduxReactRouter({
    routes,
    createHistory
  }),
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

export default function configureStore(initialState) {
  const reducer = rootReducer();
  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = rootReducer();
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

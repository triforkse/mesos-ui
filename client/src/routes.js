import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';
import NodeView from './components/node-view';
import AppIntentContainer from './containers/app-intent';

const Error404 = React.createClass({
  render() {
    return <div>404</div>;
  },
});

export default (
  <Route path="/" component={App}>
    <IndexRoute component={NodeView}/>
    <Route path="/appIntent" component={AppIntentContainer} />
    <Route path="*" component={Error404}/>
  </Route>
);

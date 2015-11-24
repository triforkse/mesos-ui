import React from 'react';
import { Route } from 'react-router';
import App from './containers/app';

const Error404 = React.createClass({
  render() {
    return <div>404</div>;
  }
});

export default (
  <Route path="/" component={App}>
    <Route path="*" component={Error404}/>
  </Route>
);

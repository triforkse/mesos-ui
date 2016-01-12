import React, { Component, PropTypes } from 'react';

export default class AppIntentAdd extends Component {

  static propTypes() {
    return {
      appIntent: PropTypes.object.isRequired,
      children: PropTypes.object,
      actions: PropTypes.object.isRequired,
    };
  }

  render() {
    return (<div className="app-intent-add">
      <div className="app-intent-add__framework-list">
        List
      </div>
      <div className="app-intent-add__selected-framework">
        Selected
      </div>
    </div>);
  }
}

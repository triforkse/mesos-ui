import React, { Component, PropTypes } from 'react';
import SpiderGraph from './spider-graph';
import AppIntentForm from './app-intent-form';

require('./app-intent.scss');

export default class AppIntent extends Component {

  transformData(immutableData) {
    const data = immutableData.toJS();
    return Object.keys(data).map(key => {
      const curr = data[key];
      return {
        className: key,
        axes: Object.keys(curr).map(axe => {
          return {axis: axe, value: curr[axe]};
        }),
      };
    });
  }

  calcCost(layer, data) {
    const value = data.get(layer).reduce((previousValue, currentValue) => previousValue + currentValue);
    return value * 10;
  }
  render() {
    return (<div className="app-intent">
      <div className="intent">
        <SpiderGraph data={this.transformData(this.props.appIntent)} />
        <div className="intent-form">
          <div className="intent-cost">Hard limit budget: ${this.calcCost('max', this.props.appIntent)} - Soft limit budget: ${this.calcCost('normal', this.props.appIntent)}</div>
          <AppIntentForm appIntent={this.props.appIntent} newRadarValue={this.props.newRadarValue} />
        </div>
      </div>
    </div>);
  }
}

AppIntent.propTypes = {
  appIntent: PropTypes.object.isRequired,
  children: PropTypes.object,
  newRadarValue: PropTypes.func.isRequired,
};

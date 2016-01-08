import React, { Component, PropTypes } from 'react';
import SpiderGraph from './spider-graph';
import AppIntentForm from './app-intent-form';
import { fromJS } from 'immutable';

export default class AppIntent extends Component {

  componentDidMount() {
    this.props.newRadarValue('normal', 'cpu', 10);
  }

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
  render() {
    // For monitoring all data should come fromJS
    // WAMP. For appIntent we shouldn't display monitoring
    // data (because there is none)
    const fakeData = fromJS({
      reservedres: {
        cpu: 3,
        ram: 4,
        disk: 1,
        bandwidth: 6,
        cpu2: 7,
        ram2: 3,
        disk2: 3,
        bandwidth2: 4,
      },
      actual: {
        cpu: 2,
        ram: 2,
        disk: 1,
        bandwidth: 2,
        cpu2: 4,
        ram2: 3,
        disk2: 3,
        bandwidth2: 4,
      },
    });
    const data = this.transformData(this.props.appIntent.merge(fakeData));
    return (<div className="app-intent">
      <AppIntentForm appIntent={this.props.appIntent} newRadarValue={this.props.newRadarValue} />
      <SpiderGraph data={data} />
    </div>);
  }
}

AppIntent.propTypes = {
  appIntent: PropTypes.object.isRequired,
  children: PropTypes.object,
  newRadarValue: PropTypes.func.isRequired,
};

import React, { Component, PropTypes } from 'react';
import SpiderGraph from '../spider-graph';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import {selector} from '../../selectors';
import AppIntentForm from './app-intent-form';
import AppIntentCost from './app-intent-cost';

require('./app-intent.scss');

export default class AppIntent extends Component {

  transformData(immutableData, convertTable) {
    const data = immutableData.toJS();
    return Object.keys(data).map(key => {
      const curr = data[key];
      return {
        className: key,
        axes: Object.keys(curr).map(axe => {
          let value = curr[axe];
          if (convertTable[axe]) {
            value = value * convertTable[axe];
          }
          return {
            axis: axe,
            value,
          };
        }),
      };
    });
  }


  render() {
    const convertTable = {
      'cpu': 1,
      'ram': 1.5,
      'disk': 0.1,
      'bandwidth': 0.1,
    };

    return (<div>
      <div className="intent">
        <div className="paper">
          <SpiderGraph data={this.transformData(this.props.appIntent, convertTable)} />
        </div>
        <div className="intent-form paper">
          <AppIntentCost appIntent={this.props.appIntent} />
          <AppIntentForm appIntent={this.props.appIntent} newRadarValue={this.props.actions.newRadarValue} />
        </div>
      </div>
    </div>);
  }
}

AppIntent.propTypes = {
  appIntent: PropTypes.object.isRequired,
  children: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

export default connect(
  selector,
  mapDispatchToProps,
)(AppIntent);

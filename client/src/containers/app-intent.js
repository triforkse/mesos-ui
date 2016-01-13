import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import appIntentSelector from '../selectors/app-intent';
import AppIntent from '../components/app-intent/app-intent';
import AppIntentAdd from '../components/app-intent/app-intent-add';
import Button from '../components/button';

require('./app-intent.scss');

export default class AppIntentContainer extends Component {

  static propTypes() {
    return {
      appIntent: PropTypes.object.isRequired,
      wizard: PropTypes.object.isRequired,
      appConfiguration: PropTypes.object.isRequired,
      children: PropTypes.object,
      actions: PropTypes.object.isRequired,
    };
  }

  componentDidMount() {
    this.props.actions.subscribeToLoaderFrameworks();
  }

  generateWizardStep(step) {
    switch (step) {
    case 1:
      return <AppIntentAdd appConfiguration={this.props.appConfiguration} actions={this.props.actions} />;
    case 2:
      return <AppIntent />;
    default:
      return null;
    }
  }

  render() {
    const {next, prev, step} = this.props.wizard;

    return (<div className="app-intent">
      <div className="app-intent__navigation paper">
        <h2>Compose your App</h2>
        <div>
          <Button onClick={() => this.props.actions.wizardPrev(2)} disabled={!prev}>Prev</Button>
          <Button onClick={() => this.props.actions.wizardNext(2)} disabled={!next}>Next</Button>
        </div>
      </div>
      {this.generateWizardStep(step)}
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

export default connect(
  appIntentSelector,
  mapDispatchToProps,
)(AppIntentContainer);

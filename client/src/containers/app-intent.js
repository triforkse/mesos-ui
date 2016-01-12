import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import appIntentSelector from '../selectors/app-intent';
import AppIntent from '../components/app-intent/app-intent';
import AppIntentAdd from '../components/app-intent/app-intent-add';
import Button from '../components/button';

export default class AppIntentContainer extends Component {

  static propTypes() {
    return {
      appIntent: PropTypes.object.isRequired,
      wizard: PropTypes.object.isRequired,
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
      return <AppIntentAdd />;
    case 2:
      return <AppIntent />;
    default:
      return null;
    }
  }

  render() {
    const {next, prev, step} = this.props.wizard;

    return (<div>
      <h2>Add framework</h2>
      <div>
        <Button onClick={() => this.props.actions.wizardPrev(2)} disabled={!prev}>Prev</Button>
        <Button onClick={() => this.props.actions.wizardNext(2)} disabled={!next}>Next</Button>
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

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Button from '../components/button.js';
import {selector} from '../selectors';
import NodeView from '../components/node-view.js';
import AppIntent from '../components/app-intent';

require('./app.scss');

class App extends React.Component {

  componentDidMount() {
    this.props.actions.connectWamp();
  }

  render() {
    return (
      <div className="page">
        <div className="page__master">
          <div className="menu">
            <div className="menu__logo">
              <img src={require('../images/logo.svg')} alt="Mesos UI" />
            </div>
            <div className="menu__items">
              <a href="google.com" className="menu__item menu__item--active">
                <div className="menu__label">Infrastructure</div>
              </a>
            </div>
            <div id="install-button">
              <Button>Install Application</Button>
            </div>
          </div>
        </div>
        <div className="page__slave">
          <NodeView
            connecting={this.props.connecting}
            cluster={this.props.cluster}
            actions={this.props.actions}
            slaves={this.props.slaves}
            clusterLayout={this.props.clusterLayout}
            frameworkColors={this.props.frameworkColors} />
        </div>
      </div>);
  }
}

App.propTypes = {
  api: React.PropTypes.object.isRequired,
  socket: React.PropTypes.object.isRequired,
  nodes: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  panel: React.PropTypes.object.isRequired,
  cluster: React.PropTypes.object, // We might not have it yet.
  connecting: React.PropTypes.bool.isRequired,
  slaves: React.PropTypes.object.isRequired,
  clusterLayout: React.PropTypes.object.isRequired,
  frameworkColors: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

export default connect(
  selector,
  mapDispatchToProps,
)(App);

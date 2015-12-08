import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Galaxy from '../components/galaxy.js';
import Button from '../components/button.js';
import Frameworks from '../components/frameworks.js';

require('./app.scss');

class App extends React.Component {

  componentDidMount() {
    // TODO: We need to save a reference to this, so
    // we can disconnect.
    this.props.actions.connectWebSocket();
  }

  onNodeClick(node) {
    this.props.actions.selectNode(node);
  }

  onNodeMouseOver(node) {
    this.props.actions.showDetails(node);
  }

  render() {
    const { frameworkList, colors, status } = this.props.clusterLayout;
    const slaveNodes = status.slaves;
    const slaveFrameworks = status.frameworks;
    const frameworksActions = {
      focusFramework: this.props.actions.focusFramework,
      blurFramework: this.props.actions.blurFramework,
      toggleFramework: this.props.actions.toggleFramework,
    };
    const clusterActions = {
      toggleSlave: this.props.actions.toggleSlave,
    };

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
          <Galaxy
            master={status.layout}
            nodes={slaveNodes}
            frameworkColors={colors.frameworks}
            actions={clusterActions}/>
          <Frameworks frameworks={slaveFrameworks} frameworksActions={frameworksActions} active={frameworkList.selected} />
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
  clusterLayout: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

function mapStateToProps(state) {
  const {apiStatus, nodes, panel, router, clusterLayout } = state;

  return {
    api: apiStatus,
    cluster: clusterLayout.get('status'),
    nodes,
    panel,
    query: state.router.location.query,
    router,
    clusterLayout,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

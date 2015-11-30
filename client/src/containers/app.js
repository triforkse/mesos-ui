import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Cluster from '../components/cluster.js';
import Galaxy from '../components/galaxy.js';
import Panel from '../components/panel.js';
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
    const {cluster} = this.props;

    if (!cluster) {
      return <div></div>;
    }

    const slaveNodes = cluster.get('slaves');
    const frameworks = cluster.get('frameworks');
    console.log("actions", this.props.actions);
    const frameworksActions = {
      focusFramework: this.props.actions.focusFramework,
      blurFramework: this.props.actions.blurFramework,
      toggleFramework: this.props.actions.toggleFramework,
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
              <Frameworks frameworks={frameworks} frameworksActions={frameworksActions} />
            </div>
            <div id="install-button">
              <Button>Install Application</Button>
            </div>
          </div>
        </div>
        <div className="page__slave">
          <Galaxy master={{master: true}} nodes={slaveNodes} />
          <Panel id="details" panel={this.props.panel} actions={this.props.actions}>
            {/* REVIEW: Why (node) => f(node) instead of just "f"? */}
            {cluster && <Cluster nodes={slaveNodes} selector="cpus" mouseOverHandler={(node) => this.onNodeMouseOver(node)} />}
          </Panel>
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
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

function mapStateToProps(state) {
  const {apiStatus, socketStatus, nodes, panel, router } = state;

  return {
    api: apiStatus,
    socket: socketStatus,
    cluster: socketStatus.get('status') ? socketStatus.get('status') : null,
    nodes,
    panel,
    query: state.router.location.query,
    router,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

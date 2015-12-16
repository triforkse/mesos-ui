import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Galaxy from '../components/galaxy.js';
import Button from '../components/button.js';
import Frameworks from '../components/frameworks.js';
import Detail from '../components/detail.js';
import SlavesDetail from '../components/slaves-details.js';
import FrameworksDetail from '../components/frameworks-details.js';
import {selector} from '../selectors';

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
    if (this.props.connecting) {
      return <div>Connecting...</div>;
    }

    const cluster = this.props.cluster;
    const selectedFrameworks = this.props.clusterLayout.selectedFrameworks;
    const selectedSlaves = this.props.clusterLayout.selectedSlaves;
    const frameworkColors = this.props.frameworkColors;
    const slaveNodes = this.props.slaves;
    const clearSlaves = this.props.actions.clearSlaves;
    const slaveFrameworks = cluster.frameworks;
    const clearFrameworks = this.props.actions.clearFrameworks;
    const frameworksActions = {
      focusFramework: this.props.actions.focusFramework,
      blurFramework: this.props.actions.blurFramework,
      toggleFramework: this.props.actions.toggleFramework,
      clearFrameworks: this.props.actions.clearFrameworks,
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
            master={cluster.layout}
            nodes={slaveNodes}
            frameworkColors={frameworkColors}
            actions={clusterActions}/>
          <Frameworks frameworks={slaveFrameworks}
            frameworksActions={frameworksActions}
            active={selectedFrameworks}
            colors={frameworkColors} />

          {selectedSlaves.count() > 0 &&
            (<Detail title="Agent(s)" clear={clearSlaves}>
              <SlavesDetail slaves={slaveNodes} selectedSlaves={selectedSlaves} />
            </Detail>)
          }

          {selectedFrameworks.count() > 0 &&
            (<Detail title="Framework(s)" clear={clearFrameworks}>
              <FrameworksDetail frameworks={slaveFrameworks} selectedFrameworks={selectedFrameworks} />
            </Detail>)
          }
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

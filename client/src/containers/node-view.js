import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import {selector} from '../selectors';

import Galaxy from '../components/galaxy.js';
import Frameworks from '../components/frameworks.js';
import Detail from '../components/detail.js';
import SlavesDetail from '../components/slaves-details.js';
import FrameworksDetail from '../components/frameworks-details.js';

require('./node-view.scss');

export default class NodeView extends Component {

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

    return (<div>
      <div className="node-view paper">
        <div className="galaxy__container">
          <Galaxy
            master={cluster.layout}
            nodes={slaveNodes}
            frameworkColors={frameworkColors}
            actions={clusterActions}/>
        </div>

        <Frameworks frameworks={slaveFrameworks}
          frameworksActions={frameworksActions}
          active={selectedFrameworks}
          colors={frameworkColors} />
      </div>

      {selectedSlaves.count() > 0 &&
        (<Detail title="Agent(s)" close={clearSlaves}>
          <SlavesDetail slaves={slaveNodes} selectedSlaves={selectedSlaves} />
        </Detail>)
      }

      {selectedFrameworks.count() > 0 &&
        (<Detail title="Framework(s)" close={clearFrameworks}>
        <FrameworksDetail frameworks={slaveFrameworks} selectedFrameworks={selectedFrameworks} />
      </Detail>)
      }
    </div>);
  }
}

NodeView.propTypes = {
  cluster: React.PropTypes.object, // We might not have it yet.
  actions: PropTypes.object.isRequired,
  slaves: React.PropTypes.object.isRequired,
  clusterLayout: React.PropTypes.object.isRequired,
  frameworkColors: React.PropTypes.object.isRequired,
  connecting: React.PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

export default connect(
  selector,
  mapDispatchToProps,
)(NodeView);

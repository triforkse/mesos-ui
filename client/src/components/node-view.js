import React, { Component, PropTypes } from 'react';

import Galaxy from '../components/galaxy.js';
import Frameworks from '../components/frameworks.js';
import Detail from '../components/detail.js';
import SlavesDetail from '../components/slaves-details.js';
import FrameworksDetail from '../components/frameworks-details.js';

export default class NodeView extends Component {

  render() {
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
};

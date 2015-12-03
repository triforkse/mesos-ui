import React from 'react';
// import RingChart from './ring-chart';

require('./cluster.scss');

export default class Cluster extends React.Component {

  getUsage(node, resourceName) {
    const n = node.toJS();
    return (n.used_resources[resourceName] / n.resources[resourceName] * 100);
  }

  getPrevUsage(node, resourceName) {
    const n = node.toJS();
    return n.prev_used_resources
           ? (n.prev_used_resources[resourceName] / n.resources[resourceName] * 100)
           : 0;
  }

  render() {
    // const nodes = this.props.nodes;
    return <div></div>;
  }
}

Cluster.propTypes = {
  nodes: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
};

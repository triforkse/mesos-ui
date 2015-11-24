import React from 'react';
// import * as d3Grid from '../d3/d3Grid';
import RingChart from './ring-chart';

require('./cluster.scss');

export default class Cluster extends React.Component {

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // d3Grid.create(el, this.props, this.props.nodes.toJS());
  }

  componentDidUpdate() {
    // const el = ReactDOM.findDOMNode(this);
    // d3Grid.update(el, this.props, this.props.nodes.toJS());
  }

  getUsage(node, resourceName) {
    const n = node.toJS();
    return (n.used_resources[resourceName] / n.resources[resourceName] * 100);
  }

  render() {
    const nodes = this.props.nodes;
    return <div className="cluster-rings">{nodes.map(n => <RingChart key={n.get('pid')} value={this.getUsage(n, 'cpus')} />)}</div>;
  }
}

Cluster.propTypes = {
  nodes: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
};

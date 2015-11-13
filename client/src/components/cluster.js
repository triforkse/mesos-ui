import React from 'react';
import ReactDOM from 'react-dom';
import * as d3Node from '../d3/d3Node';

export default class Cluster extends React.Component {

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3Node.create(el, {
      diameter: 960,
      margin: 20,
      nodes: this.props.nodes.toJS(),
      onClick: this.props.onNodeClick,
    });
  }

  componentDidUpdate() {
    const el = ReactDOM.findDOMNode(this);
    d3Node.update(el, {
      diameter: 960,
      margin: 20,
      nodes: this.props.nodes.toJS(),
      onClick: this.props.onNodeClick,
    });
  }

  render() {
    return <div className="Cluster"></div>;
  }
}

Cluster.propTypes = {
  nodes: React.PropTypes.object,
  onNodeClick: React.PropTypes.func,
};

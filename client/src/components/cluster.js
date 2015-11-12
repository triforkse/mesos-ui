import React from 'react';
import ReactDOM from 'react-dom';
import * as d3Node from '../d3/d3Node';

export default class Cluster extends React.Component {

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3Node.create(el, {
      diameter: 960,
      margin: 20,
    }, this.props.nodes);
  }

  render() {
    return <div className="Cluster"></div>;
  }
}

Cluster.propTypes = {
  nodes: React.PropTypes.object,
};

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3Grid from '../d3/d3Grid';

export default class Cluster extends React.Component {

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3Grid.create(el, this.props, this.props.nodes.toJS());
  }

  componentDidUpdate() {
    const el = ReactDOM.findDOMNode(this);
    d3Grid.update(el, this.props, this.props.nodes.toJS());
  }

  render() {
    return <div className="Cluster"></div>;
  }
}

Cluster.propTypes = {
  nodes: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
};

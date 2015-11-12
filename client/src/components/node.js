import React from 'react';
import ReactDOM from 'react-dom';
import * as d3Node from '../d3/d3Node';

export default class Node extends React.Component {

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3Node.create(el, {
      width: '100%',
      height: '300px',
    }, this.props.data);
  }

  render() {
    return <div className="Node"></div>;
  }
}

Node.propTypes = {
  data: React.PropTypes.array,
};

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import RadarChart from '../vendor/radar-chart';
RadarChart.defaultConfig.color = () => {};
const chart = RadarChart.chart();
const cfg = RadarChart.defaultConfig;

require('./spider-graph.scss');

export default class SpiderGraph extends Component {

  componentDidMount() {
    this.svg = d3.select(ReactDOM.findDOMNode(this)).append('svg')
      .attr('width', cfg.w)
      .attr('height', cfg.h);
    this.svg.append('g').classed('single', 1).datum(this.props.data).call(chart);
  }

  componentWillUpdate(nextProps) {
    this.svg.data([nextProps.data]).call(chart);
  }

  render() {
    return (<div className="spider-graph" id="spiderGraph"></div>);
  }
}

SpiderGraph.propTypes = {
  data: PropTypes.array.isRequired,
};

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import {distirbuteNodes, createLinks} from '../d3/calculations';

require('./galaxy.scss');

export default class Galaxy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      force: d3.layout.force(),
    };
  }

  componentDidMount() {
    const {el, width, height} = this.getDOMProperties();
    this.createSvgContainer(el, width, height);
    this.renderD3(el, width, height);
  }

  componentDidUpdate() {
    const {el, width, height} = this.getDOMProperties();
    this.renderD3(el, width, height);
  }

  getDOMProperties() {
    const el = ReactDOM.findDOMNode(this);
    return {
      el,
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  }

  createSvgContainer(el, width, height) {
    let container;
    function zoomed() {
      container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    const zoom = d3.behavior.zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', zoomed);

    const svg = d3.select(el)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
        .call(zoom);

    container = svg.append('g').attr('class', 'galaxy');
    container.append('g').attr('id', 'galaxy__links');
    container.append('g').attr('id', 'galaxy__nodes');
  }

  formatData(props, width, height) {
    const {nodes, master} = props;
    const nodesArray = nodes.toJS();
    const masterAndNodes = [master].concat(nodesArray);

    return {nodes: distirbuteNodes(masterAndNodes, width, height), links: createLinks(nodesArray)};
  }

  renderD3(el, width, height) {
    const force = this.state.force;

    const {nodes, links} = this.formatData(this.props, width, height);

    const container = d3.select(el).selectAll('.galaxy');

    force
      .charge(-200)
      .linkDistance(200)
      .friction(0)
      .nodes(nodes)
      .links(links)
      .size([width, height])
      .on('tick', tick) //eslint-disable-line
      .start();

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed('fixed', d.fixed = true);
      force.start();
    }

    function dragged(d) {
      d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
    }

    function dragended() {
      d3.select(this).classed('dragging', false);
    }

    const drag = force.drag()
            .origin(d => d)
            .on('dragstart', dragstarted)
            .on('drag', dragged)
            .on('dragend', dragended);

    const link = container.select('#galaxy__links').selectAll('.galaxy__link')
        .data(links, d => d.source.pid);

    link.enter().append('line')
        .attr('id', d => d.source.pid)
        .attr('class', 'galaxy__link')
        .style('stroke-width', d => Math.sqrt(d.value));

    link.exit().remove();

    const node = container.select('#galaxy__nodes').selectAll('.galaxy__node')
        .data(nodes, d => d.pid || 'master');

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'galaxy__node')
        .call(drag);

    nodeEnter.append('circle')
      .attr('id', d => d.pid)
      .attr('r', d => d.r)
      .style('fill', '#F6F6F6');

    node.exit().remove();

    node.on('mouseover', function onMouseOver(d) {
      d3.select(this).select('circle').transition()
        .duration(500)
        .attr('r', d.r * 1.5);
    });

    node.on('mouseout', function onMouseOut(d) {
      d3.select(this).select('circle').transition()
        .duration(500)
        .attr('r', d.r);
    });

    function tick() {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.x);

      node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    }

    tick();
  }

  render() {
    return (<svg className="galaxy"></svg>);
  }
}

Galaxy.propTypes = {
  nodes: React.PropTypes.object,
  master: React.PropTypes.object,
};

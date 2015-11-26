/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import {distirbuteNodes} from '../d3/calculations';

require('./galaxy.scss');

export default class Galaxy extends React.Component {
  componentDidMount() {

    const el = ReactDOM.findDOMNode(this);

    const width = el.offsetWidth,
    height = el.offsetHeight;

    const color = d3.scale.category20c();

    const force = d3.layout.force()
        .charge(-200)
        .linkDistance(200)
        .size([width, height]);

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      console.log('fixed', d.fixed);
      d3.select(this).classed("dragging", true);
      d3.select(this).classed('fixed', d.fixed = true);
      force.start();
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }

    const drag = force.drag()
            .origin(d => d)
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);

    const zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on('zoom', zoomed);

    function zoomed() {
      container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale +')');
    }

    var svg = d3.select(el).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
        .call(zoom);

    var container = svg.append('g');

    const graph = getData(width, height);

    graph.nodes = distirbuteNodes(graph.nodes, width, height * 0.7);

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    const link = container.append('g').selectAll('.galaxy__link')
        .data(graph.links)
        .enter().append('line')
        .attr('class', 'galaxy__link')
        .style('stroke-width', function(d) { return Math.sqrt(d.value); });

    const node = container.append('g').selectAll('.galaxy__node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'galaxy__node')
        .call(drag);

    const circle = node.append('circle')
      .attr('r', d => d.r)
      .each(d => d.fixed = true)
      .style('fill', function(d) { return color(d.group); });

    force.on('tick', function() {
      link.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      circle.attr('cx', d => d.x).attr('cy', d => d.y);
    });
  }

  render() {
    return (<div className='galaxy'></div>);
  }
}



function getData(width, height) {
  return {
  'nodes':[
    {'name':'MesosMaster','group':0, master: true},
    {'name':'Node1','group':1, x: 100, y: 50},
    {'name':'Node2','group':2, x: 200, y: 50},
    {'name':'Node3','group':3, x: 400, y: 50},
    {'name':'Node4','group':4, x: 600, y: 50},
    {'name':'Node5','group':5, x: 100, y: 300},
    {'name':'Node6','group':6, x: 200, y: 300},
    {'name':'Node7','group':7, x: 400, y: 300},
    {'name':'Node8','group':8, x: 600, y: 300},
    {'name':'Node9','group':9, x: 600, y: 150},
  ],
  'links':[
    {'source':1,'target':0,'value':10},
    {'source':2,'target':0,'value':10},
    {'source':3,'target':0,'value':10},
    {'source':4,'target':0,'value':10},
    {'source':5,'target':0,'value':10},
    {'source':6,'target':0,'value':10},
    {'source':7,'target':0,'value':10},
    {'source':8,'target':0,'value':10},
    {'source':9,'target':0,'value':10},
  ]
};
}
/*eslint-enable */

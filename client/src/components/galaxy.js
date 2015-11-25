/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';

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

    const graph = getData();

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
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .call(drag);

    node.append('circle')
      .attr('r', 40)
      .style('fill', function(d) { return color(d.group); });

    force.on('tick', function() {
      link.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
  }

  render() {
    return (<div className='galaxy'></div>);
  }
}



function getData() {
  return {
  'nodes':[
    {'name':'MesosMaster','group':0},
    {'name':'Node1','group':1},
    {'name':'Node2','group':2},
    {'name':'Node3','group':3},
    {'name':'Node4','group':4},
    {'name':'Node5','group':5},
    {'name':'Node6','group':6},
    {'name':'Node7','group':7},
    {'name':'Node8','group':8},
    {'name':'Node9','group':9},
  ],
  'links':[
    {'source':1,'target':0,'value':10},
    {'source':2,'target':0,'value':10},
    {'source':3,'target':0,'value':10},
    {'source':3,'target':2,'value':10},
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

import d3 from 'd3';
import {distirbuteNodes, createLinks} from './calculations';
import {createFrameworks} from './framework';
import {sample, merge, remove, any, each, find} from 'lodash';

function dummyTakeFramewoks(frameworks) {
  const numberToTake = Math.floor(Math.random() * frameworks.length);
  return sample(frameworks, numberToTake);
}

export default class Cluster {
  constructor({el, width, height}, data) {
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

    this.container = container;

    const {nodes, links} = this.formatData(data, width, height);
    this.force = d3.layout.force()
      .charge(-300)
      .linkStrength(0)
      .nodes(nodes)
      .links(links)
      .size([width, height]);

    this.renderD3(width, height, data);
  }

  formatData(data, width, height) {
    const {nodes, master} = data;
    const nodesArray = nodes.toJS();
    const masterAndNodes = [master].concat(nodesArray);

    return {nodes: distirbuteNodes(masterAndNodes, width, height), links: createLinks(nodesArray)};
  }

  renderD3(width, height, data) {
    const force = this.force;
    const container = this.container;
    const layout = data.layout;
    const {nodes} = this.formatData(data, width, height);

    // Begin hack to update force layout witch will otherwise reanimate the whole cluster
    const forceNodes = force.nodes();
    const forceLinks = force.links();

    const removedNodes = remove(forceNodes, n => !any(nodes, {pid: n.pid}) && !n.master);
    remove(forceLinks, l => any(removedNodes, {pid: l.id}));

    each(nodes, n => {
      const foundNode = find(forceNodes, {pid: n.pid});
      if (foundNode) {
        merge(foundNode, n);
      } else if (!n.master) {
        const newNode = n;
        forceNodes.push(newNode);
        forceLinks.push({source: newNode, target: forceNodes[0], id: newNode.pid, value: 10});
      }
    });
    // End hack

    force
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
        .data(force.links(), d => d.source.pid);

    link.enter().append('line')
        .attr('id', d => d.source.pid)
        .attr('class', 'galaxy__link')
        .style('stroke-width', d => Math.sqrt(d.value));

    link.exit().remove();

    const node = container.select('#galaxy__nodes').selectAll('.galaxy__node')
        .data(force.nodes(), d => d.pid || 'master');

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'galaxy__node')
        .call(drag);

    nodeEnter.each(function addNode(d) {
      const g = d3.select(this);
      // Slave node
      g.append('circle')
        .attr('id', slave => slave.pid)
        .attr('r', slave => slave.r)
        .style('fill', n => n.master ? 'url(#mesos-logo)' : '#F6F6F6');

      // Frameworks for node
      if (!d.master) {
        createFrameworks(g, d.r, dummyTakeFramewoks(d.frameworks),
           layout.getIn(['colors', 'frameworks']));
      }
    });

    node.exit().remove();

    node.on('mouseover', function onMouseOver() {
      d3.select(this).select('circle').transition()
        .duration(500)
        .attr('r', d => d.master ? d.r : (d.r * 1.5));
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
          .attr('y2', d => d.target.y);

      node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    }

    tick();
  }
}

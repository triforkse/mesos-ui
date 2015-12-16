import d3 from 'd3';
import {distributeNodes, onNodeFocus, onNodeBlur, preventCollision} from './calculations';
import {createFrameworks, updateFrameworkColors} from './framework';
import {merge, rest, remove, any, each, find, partial} from 'lodash';

export default class Cluster {
  constructor({el, width, height}, props) {
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

    const nodes = distributeNodes(props, width, height);
    const links = rest(nodes).map(partial(this.addLink, nodes[0]));

    this.force = d3.layout.force()
      .charge(-300)
      .linkStrength(0)
      .nodes(nodes)
      .links(links)
      .size([width, height]);

    this.renderD3(nodes, props);
  }

  addLink(master, node) {
    return {source: node, target: master, id: node.pid, value: 10};
  }

  update(props, width, height) {
    const nodes = distributeNodes(props, width, height);
    this.renderD3(nodes, props);
  }

  renderD3(nodes, {actions, frameworkColors}) {
    const force = this.force;
    const container = this.container;

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
        forceLinks.push(this.addLink(forceNodes[0], newNode));
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
      d3.event.sourceEvent.stopPropagation();
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

    nodeEnter
      .append('circle')
      .attr('id', slave => slave.pid)
      .attr('r', slave => slave.r);

    nodeEnter.each(function addFrameworks(d) {
      const g = d3.select(this);
      if (!d.master) {
        createFrameworks(g, d, frameworkColors);
      }
    });

    node.each(function update(slave) {
      if (slave.fixed) {
        onNodeFocus.call(this);
      } else {
        onNodeBlur.call(this);
      }
      updateFrameworkColors.call(this, frameworkColors, slave);
    });

    node.style('fill', n => {
      if (n.master) {
        return 'url(#mesos-logo)';
      } else if (n.selected) {
        return '#F6F6F6';
      }
      return '#FFFFFF';
    });

    node.exit().remove();

    node.on('click', d => {
      // So dragstart and dragend not triggering click
      if (d3.event.defaultPrevented) {
        return;
      }
      actions.toggleSlave(d.pid);
    });

    function tick() {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node.each(preventCollision(0.5, force.nodes()))
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    }
  }
}

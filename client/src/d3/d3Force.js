import d3 from 'd3';

export default class D3Force {
  constructor(el, width, height) {
    this.el = el;
    this.width = width;
    this.height = height;
    this.force = d3.layout.force();

    this.create();
  }

  create() {
    const {el, width, height} = this;

    function zoomed() {
      this.container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    const zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on('zoom', zoomed);

    const svg = d3.select(el)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
        .call(zoom);

    this.container = svg.append('g').attr('class', 'galaxy');

    this.link = this.container.append('g').selectAll('.galaxy__link')
        .data(this.force.links());

    this.node = this.container.append('g').selectAll('.galaxy__node')
        .data(this.force.nodes(), d => d.pid || 'master');

    this.node.on('mouseover', function onMouseOver(d) {
      d3.select(this).select('circle').transition()
        .duration(500)
        .attr('r', d.r * 1.5);
    });

    this.node.on('mouseout', function onMouseOut(d) {
      d3.select(this).select('circle').transition()
        .duration(500)
        .attr('r', d.r);
    });
  }

  enter() {
    const {node, link, force} = this;

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

    link.enter()
        .append('line')
        .attr('class', 'galaxy__link')
        .style('stroke-width', d => Math.sqrt(d.value));

    this.nodeEnter = node.enter()
        .append('g')
        .attr('class', 'galaxy__node')
        .call(drag);

    force.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      // circle.attr('cx', d => d.x).attr('cy', d => d.y);
    });
  }

  update({nodes, links}) {
    this.force.nodes(nodes).links(links);
  }
}

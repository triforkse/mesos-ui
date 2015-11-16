import d3 from 'd3';
import d3Grid from 'd3-grid'; // eslint-disable-line

require('./d3Grid.scss');

function createGridLayout(width, height) {
  return d3.layout.grid()
    .bands()
    .size([width, height])
    .padding([0.1, 0.1]);
}

function addCircle(radius, translateOffset, color, className, elements, mouseOverHandler) {
  elements.enter()
    .append('circle')
    .attr('class', className)
    .attr('r', 1e-6)
    .style('fill', color)
    .attr('transform', d => 'translate(' + (d.x + translateOffset) + ',' + (d.y + translateOffset) + ')')
    .on('mouseover', mouseOverHandler);

  elements.transition()
    .attr('r', radius)
    .attr('transform', d => 'translate(' + (d.x + translateOffset) + ',' + (d.y + translateOffset) + ')');

  elements.exit().transition()
    .attr('r', 1e-6)
    .remove();
}

export function update(el, props, data) {
  const {mouseOverHandler} = props;

  const gridLayout = createGridLayout(400, 400);

  const cluster = d3.select(el).selectAll('.cluster');
  const gridData = gridLayout(data);

  const radius = gridLayout.nodeSize()[0] / 2;

  const nodes = cluster.selectAll('.node')
    .data(gridData);
  addCircle(radius, radius, '#505A66', 'node', nodes, mouseOverHandler);

  const cpus = cluster.selectAll('.cpu')
    .data(gridData);
  addCircle(0.8 * radius, radius, '#0DFF19', 'cpu', cpus, mouseOverHandler);

  const memory = cluster.selectAll('.memory')
    .data(gridData);
  addCircle(0.7 * radius, radius, '#3D300C', 'memory', memory, mouseOverHandler);

  const storage = cluster.selectAll('.storage')
    .data(gridData);
  addCircle(0.6 * radius, radius, '#FF0000', 'storage', storage, mouseOverHandler);

  const inner = cluster.selectAll('.inner')
    .data(gridData);
  addCircle(0.5 * radius, radius, '#505A66', 'inner', inner, mouseOverHandler);
}

export function create(el, props, data) {
  d3.select(el).append('svg')
    .attr('class', 'cluster')
    .attr('width', 800)
    .attr('height', 800)
    .append('g');

  update(el, props, data);
}

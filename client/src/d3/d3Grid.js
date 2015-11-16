import d3 from 'd3';
import d3Grid from 'd3-grid'; // eslint-disable-line
import {FULL_ARC, calculateQuota} from './calculations';

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

function addArc(outerRadius, innerRadius, offset, quotaFn, color, className, elements) {
  const arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .startAngle(0);

  // Background arc
  elements.enter()
    .append('path')
    .datum(d => {
      return { endAngle: FULL_ARC, x: d.x, y: d.y };
    })
    .attr('class', className)
    .style('stroke', '#ddd')
    .style('fill', '#000')
    .attr('d', arc);

  // Foreground arc
  elements.enter()
    .append('path')
    .datum(d => {
      return { endAngle: quotaFn(d), x: d.x, y: d.y };
    })
    .attr('class', className)
    .attr('d', arc)
    .style('fill', color);

  elements.transition()
    .duration(750);

  elements.transition()
    .attr('transform', d => 'translate(' + (d.x + offset) + ',' + (d.y + offset) + ')');
}

function quota(quotaSelector) {
  return d => calculateQuota(d.resources[quotaSelector], d.used_resources[quotaSelector]);
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
  addArc(0.8 * radius, 0.7 * radius,
     radius, quota('cpus'),
     '#0DFF19', 'cpu', cpus, mouseOverHandler);

  const memory = cluster.selectAll('.memory')
    .data(gridData);
  addArc(0.7 * radius, 0.6 * radius,
    radius, quota('mem'),
    '#3D300C', 'memory', memory, mouseOverHandler);

  const storage = cluster.selectAll('.storage')
    .data(gridData);
  addArc(0.6 * radius, 0.5 * radius,
    radius, quota('disk'),
    '#FF0000', 'storage', storage, mouseOverHandler);
}

export function create(el, props, data) {
  d3.select(el).append('svg')
    .attr('class', 'cluster')
    .attr('width', 800)
    .attr('height', 800)
    .append('g');

  update(el, props, data);
}

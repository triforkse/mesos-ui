import d3 from 'd3';
import d3Grid from 'd3-grid'; // eslint-disable-line

import {calculateQuota} from './calculations';

require('./d3Grid.scss');

function createGridLayout(width, height) {
  return d3.layout.grid()
    .bands()
    .size([width, height])
    .padding([0.1, 0.1]);
}

function createDropShadowFilter(svg) {
  const filter = svg.append('filter')
    .attr('id', 'drop-shadow');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 3);

  filter.append('feOffset')
    .attr('dx', 2)
    .attr('dy', 4);

  const merge = filter.append('feMerge');

  merge.append('feMergeNode');
  merge.append('feMergeNode')
    .attr('in', 'SourceGraphic');
}

function addCircle(radius, translateOffset, color, className, elements, mouseOverHandler) {
  elements.enter()
    .append('circle')
    .attr('class', className)
    .attr('r', 1e-6)
    .style('fill', color)
    .style('filter', 'url(#drop-shadow)')
    .attr('transform', d => 'translate(' + (d.x + translateOffset) + ',' + (d.y + translateOffset) + ')')
    .on('mouseover', mouseOverHandler);

  elements.transition()
    .attr('r', radius)
    .attr('transform', d => 'translate(' + (d.x + translateOffset) + ',' + (d.y + translateOffset) + ')');

  elements.exit().transition()
    .attr('r', 1e-6)
    .remove();
}

function addArc(outerRadius, offset, quotaFn, color, className, elements) {
  const arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(0)
    .startAngle(0)
    .endAngle(d => {
      return d;
    });

  const tween = (d) => {
    d.endAngle = d.endAngle || 1e-6;
    const interpolate = d3.interpolate(d.endAngle, quotaFn(d));
    return t => {
      return arc(interpolate(t));
    };
  };

  elements.enter()
    .append('path')
    .attr('id', d => d.pid)
    .attr('class', className)
    .attr('transform', d => 'translate(' + (d.x + offset) + ',' + (d.y + offset) + ')')
    .style('fill', color);

  elements.transition()
    .attr('transform', d => 'translate(' + (d.x + offset) + ',' + (d.y + offset) + ')')
    .duration(750)
    .attrTween('d', tween);

  elements.exit().transition()
    .remove();
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
  addArc(radius, radius, quota('cpus'),
     '#0DFF19', 'cpu', cpus);
}

export function create(el, props, data) {
  const svg = d3.select(el).append('svg')
    .attr('class', 'cluster')
    .attr('width', 800)
    .attr('height', 800);

  svg.append('g');

  createDropShadowFilter(svg);

  update(el, props, data);
}

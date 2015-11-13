import d3 from 'd3';
import {find, filter, flatten} from 'lodash';

require('./d3Node.scss');

function createPackFormatter(props, selector) {
  const {padding, diameter, margin} = props;

  return d3.layout.pack()
    .padding(padding)
    .size([diameter - margin, diameter - margin])
    .value(selector);
}

function getNodeClass(data) {
  if (data.parent) {
    return data.children ? 'node' : 'node node--leaf';
  }
  return 'node node--root';
}

function transformLinkCoordinates(links) {
  return links.map(l => {
    return {
      x1: l[0].x,
      y1: l[0].y,
      x2: l[1].x,
      y2: l[1].y,
    };
  });
}

function calculateLinks(nodes) {
  const nodesWithLinks = filter(nodes, d => d.links);

  const links = nodesWithLinks.map(d => {
    return d.links.map(l => {
      const linkedNode = find(nodes, {id: l});
      return [{x: d.x, y: d.y, r: d.r}, {x: linkedNode.x, y: linkedNode.y, r: linkedNode.r}];
    });
  });
  return transformLinkCoordinates(flatten(links));
}

const color = d3.scale.linear()
              .domain([-1, 5])
              .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
              .interpolate(d3.interpolateHcl);

function drawPoints(el, props, nodes) {
  const cluster = d3.select(el).selectAll('.cluster');

  cluster.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('class', getNodeClass)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .on('click', props.onClick)
      .style('fill', d => d.children ? color(d.depth) : d.color);

  cluster.selectAll('line')
       .data(calculateLinks(nodes))
       .enter().append('line')
       .attr('class', 'link')
       .attr('stroke', 'black')
       .attr('x1', d => d.x1)
       .attr('y1', d => d.y1)
       .attr('x2', d => d.x2)
       .attr('y2', d => d.y2);

  const node = cluster.selectAll('circle,text,line');

  function zoomHandler() {
    node.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  }
  const zoomListener = d3.behavior.zoom()
    .scaleExtent([0.1, 3])
    .on('zoom', zoomHandler);

  zoomListener(cluster);
}

export function update(el, props) {
  const nodes = createPackFormatter({padding: 100, margin: 20, diameter: 960 }, d => d.cpu)(props.nodes);
  drawPoints(el, props, nodes);
}

export function create(el, props) {
  d3.select(el).append('svg')
      .attr('class', 'cluster')
      .attr('width', props.diameter)
      .attr('height', props.diameter)
      .append('g')
      .attr('class', 'cluster')
      .style('background', color(-1));

  update(el, props);
}

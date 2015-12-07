import d3 from 'd3';

export function createFrameworks(selection, radius, data, colors) {
  const diameter = radius * 2;
  const offset = radius;
  d3.layout.force()
    .size([diameter, diameter])
    .charge(-100)
    .gravity(1)
    .links([])
    .nodes(data)
    .on('tick', innerTick) //eslint-disable-line
    .start();

  const framework = selection.selectAll('g.galaxy__node__framework')
    .data(data, d => d.id);

  framework.enter().append('g')
    .attr('class', 'galaxy__node__framework');

  framework.append('circle')
    .attr('id', d => d.id)
    .attr('r', radius * 0.2)
    .style('fill', d => colors.get(d.id));

  function innerTick() {
    framework.attr('transform', d => 'translate(' + (d.x - offset) + ',' + (d.y - offset) + ')');
  }

  framework.exit().remove();

  innerTick();
}

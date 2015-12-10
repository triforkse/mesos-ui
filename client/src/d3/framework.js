import d3 from 'd3';
import {saturateColor} from './calculations';

export function updateFrameworkColors(colors, slave) {
  const frameworkColors = slave.fixed || !slave.anyFocusedOrSelected
    ? colors
    : colors.map(saturateColor);

  d3.select(this).selectAll('.galaxy__node__framework')
    .style('fill', f => frameworkColors.get(f.id));
}

export function createFrameworks(selection, data) {
  const {frameworks, r} = data;
  const diameter = r * 2;
  const offset = r;
  d3.layout.force()
    .size([diameter, diameter])
    .charge(-100)
    .gravity(1)
    .links([])
    .nodes(frameworks)
    .on('tick', innerTick) //eslint-disable-line
    .start();

  const framework = selection.selectAll('g.galaxy__node__framework')
    .data(frameworks, d => d.id);

  const frameworkNode = framework.enter()
    .append('g')
    .attr('class', 'galaxy__node__framework')
    .append('circle')
    .attr('id', d => d.id);

  frameworkNode
    .attr('r', 6); // TODO make this dynamic when nodes resize

  function innerTick() {
    framework.attr('transform', d => 'translate(' + (d.x - offset) + ',' + (d.y - offset) + ')');
  }

  framework.exit().remove();

  innerTick();
}

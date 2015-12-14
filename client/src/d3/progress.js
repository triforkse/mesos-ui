import d3 from 'd3';

export default class Progress {
  constructor(el, props, prevValue) {
    const {id, width, color, value} = props;
    const {innerRadius, outerRadius} = this.getRadius(width);

    this.arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    this.color = i => (i === 0 ? '#AF00D3' : '#EFEFEF');

    this.container = d3.select(el)
        .attr({width, height: width})
        .append('g')
        .attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

    this.pie = d3.layout.pie([value, 100 - value]).sort(null);

    this.renderD3(id, value, prevValue, color);
  }

  getRadius(width) {
    const outerRadius = width / 2;
    const innerRadius = outerRadius / 1.5;
    return {outerRadius, innerRadius};
  }

  update({value, color, id}, prevValue) {
    this.renderD3(id, value, prevValue, color);
  }

  renderD3(id, value, prevValue) {
    const container = this.container;
    const data = [value, 100 - value];
    const prevData = [prevValue, 100 - prevValue];

    // Add the groups that will hold the arcs
    const arc = container.selectAll('.arc')
      .data(this.pie(data));

    const path = arc.enter()
        .append('path')
        .attr('id', (d, i) => id + i);

    path.attr({
      'fill': (d, i) => this.color(i),
      'd': this.arc,
      'class': 'arc',
    });

    function arcTween(finish, index) {
      const start = this.pie(prevData)[index];
      const i = d3.interpolate(start, finish);
      return d => this.arc(i(d));
    }

    // Create the actual slices of the pie
    arc.transition()
      .duration(750).attrTween('d', arcTween.bind(this));
  }
}

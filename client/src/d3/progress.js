import d3 from 'd3';

export default class Progress {
  constructor(el, props, prevValue) {
    const {id, width, color, value} = props;
    const {innerRadius, outerRadius} = this.getRadius(width);

    this.arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    this.color = i => (i === 0 ? color : '#EFEFEF');

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

    const percentEnter = arc.enter()
      .append('text');

    // So we dont add text for background arc
    percentEnter.each(function addText(d, index) {
      if (index !== 0) return;
      d3.select(this)
        .attr('class', 'progress-text')
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .text(p => p.value.toFixed(0));
    });

    function arcTween(finish, index) {
      const start = this.pie(prevData)[index];
      const i = d3.interpolate(start, finish);
      return d => this.arc(i(d));
    }

    function textTween(finish, index) {
      if (index !== 0) return () => finish;
      const i = d3.interpolate(+this.textContent.replace('%', ''), finish.toFixed(0));
      const that = this;
      return (t) => {
        that.textContent = parseFloat(i(t)).toFixed(0) + '%';
      };
    }

    // Create the actual slices of the pie
    arc.transition()
      .duration(750)
      .attrTween('d', arcTween.bind(this));

    container.selectAll('.progress-text')
      .transition()
      .duration(750)
      .tween('text', function tween(_, index) { return textTween.call(this, value, index); });
  }
}

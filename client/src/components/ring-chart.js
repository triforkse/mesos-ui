import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

var maxWidth = 60;

export default class RingChart extends React.Component {

  renderD3(value) {
    var data = [
        {id: 0, value: value},
        {id: 1, value: 100 - value},
    ];

    const outerRadius = maxWidth / 2;
    const innerRadius = outerRadius / 1.5;

    const el = ReactDOM.findDOMNode(this);

    var pie = d3.layout.pie().value(function(d) {
      return d.value;
    });

    var color = i => (i === 0 ? '#AF00D3' : '#EFEFEF');
    var arc = d3.svg.arc();

    arc.outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var svg = d3.select(el)
        .attr({
          width : maxWidth,
          height: maxWidth,
        });

    svg.select('text.ring-chart__label').text(value.toFixed(0)).style('text-anchor', 'middle');

    // Add the groups that will hold the arcs
    var groups = svg.selectAll('g.arc')
    .data(pie(data))
    .enter()
    .append('g');

    groups.attr({
      'class': 'arc',
      'transform': 'translate(' + outerRadius + ', ' + outerRadius + ')'
    });

    function arcTween(finish) {
      var start = {
        startAngle: 0,
        endAngle: 0
      };
      var i = d3.interpolate(start, finish);
      return function(d) { return arc(i(d)); };
    }

    // Create the actual slices of the pie
    groups.append('path').attr({
      'fill': (d, i) => color(i),
      'd': arc
    })
    .transition().duration(200).attrTween('d', arcTween);
  }

  componentDidMount() {
    this.renderD3(this.props.value);
  }

  componentDidUpdate() {
    this.renderD3(this.props.value);
  }

  render() {
    return (<svg className="ring-chart"><text className="ring-chart__label"></text></svg>);
  }
}

RingChart.propTypes = {
  text: React.PropTypes.string,
  value: React.PropTypes.number.isRequired,
};

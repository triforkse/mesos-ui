import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

const maxWidth = 60;

export default class RingChart extends React.Component {

  componentDidMount() {
    this.renderD3(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return !(nextProps.value === this.props.value);
  }

  componentDidUpdate() {
    this.renderD3(this.props);
  }

  renderD3(props) {
    const {value, prevValue, id} = props;
    const data = [value, 100 - value];
    const prevData = [prevValue, 100 - prevValue];

    const outerRadius = maxWidth / 2;
    const innerRadius = outerRadius / 1.5;

    const el = ReactDOM.findDOMNode(this);

    const pie = d3.layout.pie().sort(null);

    const color = i => (i === 0 ? '#AF00D3' : '#EFEFEF');
    const arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    const svg = d3.select(el)
        .attr({
          width: maxWidth,
          height: maxWidth,
        })
        .append('g');

    svg.select('text.ring-chart__label').text(value.toFixed(0)).style('text-anchor', 'middle');

    // Add the groups that will hold the arcs
    const groups = svg.selectAll('g.arc')
      .data(pie(data));

    groups.enter()
      .append('path').attr({
        'fill': (d, i) => color(i),
        'd': arc,
        'id': (d, i) => id + i,
        'class': 'arc',
        'transform': 'translate(' + outerRadius + ', ' + outerRadius + ')',
      });

    function arcTween(finish, index) {
      const start = pie(prevData)[index];
      const i = d3.interpolate(start, finish);
      return d => arc(i(d));
    }

    // Create the actual slices of the pie
    groups.transition()
      .duration(750).attrTween('d', arcTween);
  }

  render() {
    return (<svg className="ring-chart"><text className="ring-chart__label"></text></svg>);
  }
}

RingChart.propTypes = {
  text: React.PropTypes.string,
  id: React.PropTypes.string,
  value: React.PropTypes.number.isRequired,
  prevValue: React.PropTypes.number.isRequired,
};

import React from 'react';
import ReactDOM from 'react-dom';
import Progress from '../d3/progress';

export default class RingChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {progress: null, prevValue: 0};
  }

  componentDidMount() {
    const progress = new Progress(ReactDOM.findDOMNode(this), this.props, this.props.value);
    this.setState({progress});
  }

  componentWillReceiveProps() {
    this.setState({prevValue: this.props.value});
  }

  shouldComponentUpdate(nextProps) {
    return !(nextProps.value === this.props.value);
  }

  componentDidUpdate() {
    this.state.progress.update(this.props, this.state.prevValue);
  }

  render() {
    return (<svg className="ring-chart"><text fill="black" className="ring-chart__label">Text</text></svg>);
  }
}

RingChart.propTypes = {
  text: React.PropTypes.string,
  id: React.PropTypes.string,
  value: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
};

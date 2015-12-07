import React from 'react';
import ReactDOM from 'react-dom';
import Cluster from '../d3/cluster';

require('./galaxy.scss');

export default class Galaxy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cluster: null,
    };
  }

  componentDidMount() {
    const cluster = new Cluster(this.getDOMProperties(), this.props);
    this.setState({cluster});
  }

  componentDidUpdate() {
    const {width, height} = this.getDOMProperties();
    this.state.cluster.renderD3(width, height, this.props);
  }

  getDOMProperties() {
    const el = ReactDOM.findDOMNode(this);
    return {
      el,
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  }

  render() {
    return (<svg className="galaxy">
     <defs id="mdef">
        <pattern id="mesos-logo" x="0" y="0" height="1" width="1">
          <image x="-5" y="-5" width="100" height="100" xlinkHref={require('../images/logo-with-background.svg')}></image>
        </pattern>
      </defs>
    </svg>);
  }
}

Galaxy.propTypes = {
  nodes: React.PropTypes.object,
  master: React.PropTypes.object,
  frameworkColors: React.PropTypes.object,
};

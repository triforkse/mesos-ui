import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Cluster from '../components/cluster.js';

class App extends React.Component {

  constructor() {
    super();

    setTimeout(() => {
      this.props.actions.checkApi();
      this.props.actions.connectWebSocket();
    }, 1000);
  }

  render() {
    return (
      <div className="page">
        <Cluster nodes={this.props.nodes} />
      </div>);
  }
}


App.propTypes = {
  api: React.PropTypes.object.isRequired,
  socket: React.PropTypes.object.isRequired,
  nodes: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state) {
  const {apiStatus, socketStatus, nodes} = state;

  return {
    api: apiStatus,
    socket: socketStatus,
    nodes,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

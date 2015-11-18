import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as actions from '../actions';
import Cluster from '../components/cluster.js';

class App extends React.Component {

  constructor() {
    super();

    const update = () => {
      const index = Math.floor(Math.random() * (this.props.nodes.count() - 1), 1);
      const node = this.props.nodes.get(index).setIn(['used_resources', 'cpus'], Math.random(1));
      this.props.actions.clusterUpdate(
        Immutable.List([
          node,
        ]));
    };

    const add = () => {
      const index = Math.floor(Math.random() * (this.props.nodes.count() - 1), 1);
      const blueprint = this.props.nodes.get(index);
      const pid = blueprint.get('pid') + Math.floor(Math.random() * 10, 1);
      this.props.actions.addNodes(
        Immutable.List([
          blueprint.set('pid', pid).setIn(['used_resources', 'cpus'], 0),
        ]));
    };

    const remove = () => {
      const index = Math.floor(Math.random() * (this.props.nodes.count() - 1), 1);
      this.props.actions.removeNodes(
        Immutable.List([
          this.props.nodes.get(index),
        ]));
    };

    setInterval(() => {
      const rand = Math.random() * 10;
      if (this.props.nodes.count() > 50 && rand > 5) {
        remove();
      } else if (this.props.nodes.count() <= 50 && rand < 5) {
        add();
      } else {
        update();
      }
    }, 10000);
  }

  onNodeClick(node) {
    this.props.actions.selectNode(node);
  }

  onNodeMouseOver(node) {
    this.props.actions.showDetails(node);
  }

  render() {
    return (
      <div className="page">
        <Cluster nodes={this.props.nodes} selector="cpus" mouseOverHandler={(node) => this.onNodeMouseOver(node)} />
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

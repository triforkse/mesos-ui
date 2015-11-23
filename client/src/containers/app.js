import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as actions from '../actions';
import Cluster from '../components/cluster.js';
import Galaxy from '../components/galaxy.js';
import Panel from '../components/panel.js';

require('./app.scss');

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

    // REVIEW: Why, are we not stopping this on componentWillUnmount or something?
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
        <div className="page__master">
          <div className="menu">
            <div className="menu__logo">
              <img src={require('./logo.svg')} alt="Mesos UI" />
            </div>
            <div className="menu__items">
              <a href="google.com" className="menu__item">
                <div className="menu__label">Infrastructure</div>
              </a>
              <div className="menu__item">
                <div className="menu__label">Applications</div>
                <a href="#_" className="menu__subitem">
                  Elastic Search
                </a>
                <a href="#_" className="menu__subitem">
                  Logstash
                </a>
                <a href="#_" className="menu__subitem">
                  Hadoop
                </a>
                <a href="#_" className="menu__subitem">
                  HDFS
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="page__slave">
          <Galaxy />
          <Panel id="details" panel={this.props.panel} actions={this.props.actions}>
            {/* REVIEW: Why (node) => f(node) instead of just "f"? */}
            <Cluster nodes={this.props.nodes} selector="cpus" mouseOverHandler={(node) => this.onNodeMouseOver(node)} />
          </Panel>
        </div>
      </div>);
  }
}

App.propTypes = {
  api: React.PropTypes.object.isRequired,
  socket: React.PropTypes.object.isRequired,
  nodes: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  panel: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.getActionCreators(), dispatch),
  };
}

function mapStateToProps(state) {
  const {apiStatus, socketStatus, nodes, panel} = state;

  return {
    api: apiStatus,
    socket: socketStatus,
    nodes,
    panel,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

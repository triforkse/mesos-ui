import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import ActivityIndicator from '../components/activity-indicator.js';

class App extends React.Component {

  constructor() {
    super();

    setTimeout(() => {
      this.props.actions.checkApi();
      this.props.actions.connectWebSocket();
    }, 1000);
  }

  render() {
    const {api, socket} = this.props;
    return (
      <div className="page">
        <div className="box">
          <h1>Welcome to your new project!</h1>
          <div className="box__center">{api.requesting ? <ActivityIndicator /> : ('API Status: ' + api.status)}</div>
          <div className="box__center">{socket.connecting ? <ActivityIndicator /> : ('Web socket Status: ' + socket.status)}</div>
        </div>
      </div>);
  }
}


App.propTypes = {
  api: React.PropTypes.object.isRequired,
  socket: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state) {
  const {apiStatus, socketStatus} = state;

  return {
    api: apiStatus,
    socket: socketStatus,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

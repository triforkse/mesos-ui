import React from 'react';

require('./panel.scss');

export default class Panel extends React.Component {
  render() {
    return (
      <div className="panel">
        <div className="panel__handle" onClick={this.props.actions.togglePanel(this.props.id)}></div>
        <div className="panel__content">
          {this.props.children}
        </div>
      </div>);
  }
}

Panel.propTypes = {
  id: React.PropTypes.string.isRequired,
  actions: React.PropTypes.object.isRequired,
  children: React.PropTypes.node.isRequired,
};

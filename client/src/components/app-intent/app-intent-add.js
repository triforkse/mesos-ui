import React, { Component, PropTypes } from 'react';
import Framework from './framework';

require('./app-intent-add.scss');

export default class AppIntentAdd extends Component {

  static propTypes() {
    return {
      appConfiguration: PropTypes.object.isRequired,
      children: PropTypes.object,
      actions: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {draggedService: null};
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drag(service) {
    this.setState({draggedService: service});
  }

  dropAdd(e) {
    e.preventDefault();
    if (this.state.draggedService) {
      this.props.actions.addService(this.state.draggedService);
    }
  }

  dropRemove(e) {
    e.preventDefault();
    if (this.state.draggedService) {
      const {selectedServices} = this.props.appConfiguration;
      this.props.actions.removeService(selectedServices.indexOf(this.state.draggedService));
    }
  }

  render() {
    const {availableServices, selectedServices} = this.props.appConfiguration;
    return (<div className="app-intent-add">
      <div className="app-intent-add__available-frameworks paper" onDragOver={this.allowDrop} onDrop={this.dropRemove.bind(this)}>
        <h4>Drag & Drop predefined services</h4>
        <div className="app-intent-add__available-frameworks__list">
          {availableServices.map(f => Framework({abbreviation: f.abbreviation, name: f.name, dragstart: this.drag.bind(this, f)}))}
        </div>
      </div>
      <div className="app-intent-add__selected-frameworks paper" onDragOver={this.allowDrop} onDrop={this.dropAdd.bind(this)}>
        <h4>Selected services</h4>
        <div className="app-intent-add__selected-frameworks__list">
          {selectedServices.map(f => Framework({abbreviation: f.abbreviation, name: f.name, dragstart: this.drag.bind(this, f)}))}
        </div>
      </div>
    </div>);
  }
}

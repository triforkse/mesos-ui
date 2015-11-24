import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {registerReducer} from '../reducers';
import {registerActionCreators} from '../actions';

require('./panel.scss');

const TOGGLE_PANEL = 'TOGGLE_PANEL';
const PANEL_DRAGGING_START = 'PANEL_DRAGGING_START';
const PANEL_DRAGGING_STOP = 'PANEL_DRAGGING_STOP';
const PANEL_DRAGGING = 'PANEL_DRAGGING';

const initialState = Immutable.fromJS({details: {dragging: false}});

function togglePanel(id) {
  return {
    type: TOGGLE_PANEL,
    id,
  };
}

function startDragging(id) {
  return {
    type: PANEL_DRAGGING_START,
    id,
  };
}

function stopDragging(id) {
  return {
    type: PANEL_DRAGGING_STOP,
    id,
  };
}

function panelDragging(id, height) {
  return {
    type: PANEL_DRAGGING,
    id,
    height,
  };
}

function panel(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_PANEL:
    return state;
  case PANEL_DRAGGING_START:
    return state.update(action.id, v => v.set('dragging', true));
  case PANEL_DRAGGING_STOP:
    return state.update(action.id, v => v.set('dragging', false));
  case PANEL_DRAGGING:
    return state.update(action.id, v => v.set('height', action.height));
  default:
    return state;
  }
}

registerReducer('panel', panel);
registerActionCreators({togglePanel, startDragging, stopDragging, panelDragging});

export default class Panel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.onMouseMove = (e) => {
      const panelProps = this.props.panel.get(this.props.id);

      if (panelProps.get('dragging')) {
        const styles = window.getComputedStyle(node);
        const height = styles.height.replace('px', '');

        const newHeight = height - e.movementY;
        this.props.actions.panelDragging(this.props.id, newHeight);
      }
    };

    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    this.props.actions.stopDragging(this.props.id);
  }

  startDragging(e, id) {
    e.preventDefault();
    this.props.actions.startDragging(id);
  }

  render() {
    const panelProps = this.props.panel.get(this.props.id);
    const style = panelProps && panelProps.has('height')
                ? {height: panelProps.get('height')}
                : {};

    return (
      <div className="panel" style={style}>
        <div className="panel__handle"
           onMouseDown={(e) => this.startDragging(e, this.props.id)}
           onDoubleClick={() => this.props.actions.togglePanel(this.props.id)}></div>
        <div className="panel__content">
          {this.props.children}
        </div>
      </div>);
  }
}

Panel.propTypes = {
  id: React.PropTypes.string.isRequired,
  panel: React.PropTypes.object,
  actions: React.PropTypes.object,
  children: React.PropTypes.node,
};

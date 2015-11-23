import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {registerReducer} from '../reducers';
import {registerActionCreators} from '../actions';

require('./panel.scss');

const TOGGLE_PANEL = 'TOGGLE_PANEL';
const PANEL_DRAGGING_START = 'PANEL_DRAGGING_START';
const PANEL_DRAGGING_STOP = 'PANEL_DRAGGING_STOP';

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

function panel(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_PANEL:
    return state.update(action.id, v => !v);
  case PANEL_DRAGGING_START:
    return state.update(action.id, v => v.set('dragging', true));
  case PANEL_DRAGGING_STOP:
    return state.update(action.id, v => v.set('dragging', false));
  default:
    return state;
  }
}

registerReducer('panel', panel);
registerActionCreators({togglePanel, startDragging, stopDragging});

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
        this.setState({height: newHeight});
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

  render() {
    const height = this.state.height;
    const style = height
                ? {height: height}
                : {};

    return (
      <div className="panel" style={style}>
        <div className="panel__handle"
           onMouseDown={() => this.props.actions.startDragging(this.props.id)}
           onClick={() => this.props.actions.togglePanel(this.props.id)}></div>
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
  children: React.PropTypes.node.isRequired,
};

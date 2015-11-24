import React from 'react';

require('./button.scss');

export default class Button extends React.Component {
  render() {
    return <button {...this.props} className="button" type="button">{this.props.children}</button>;
  }
}

Button.propTypes = {
  children: React.PropTypes.string,
};

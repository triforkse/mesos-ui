import React from 'react';

require('./button.scss');

const Button = props => (
  <button {...props} className="button" type="button">{props.children}</button>
);

Button.propTypes = {
  children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
};

export default Button;

import React from 'react';

require('./button.scss');

const Button = props => (
  <button {...props} className="button" type="button">{props.children}</button>
);

Button.propTypes = {
  children: React.PropTypes.string,
};

export default Button;

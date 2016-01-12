import React, { PropTypes } from 'react';

require('./button.scss');

const Button = props => (
  <button {...props} className="button" type="button">{props.children}</button>
);

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default Button;

import React from 'react';

require('./detail.scss');

export default class Detail extends React.Component {

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscape.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape.bind(this), false);
  }

  handleEscape(e) {
    if (e.keyCode === 27) {
      this.props.clear(); // Uncaught TypeError: Cannot read property 'clear' of undefined
    }
  }

  render() {
    const {title} = this.props;
    return (<div className="detail">
      <h4>{title} <span className="clear" onClick={this.props.clear}>(clear)</span></h4>
      {this.props.children}
    </div>);
  }
}

Detail.propTypes = {
  title: React.PropTypes.string,
  children: React.PropTypes.object,
  clear: React.PropTypes.func.isRequired,
};

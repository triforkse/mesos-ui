import React from 'react';

require('./detail.scss');

export default class Detail extends React.Component {

  render() {
    const {title} = this.props;
    return (<div className="detail">
      <h4>{title}</h4>
    </div>);
  }
}

Detail.propTypes = {
  title: React.PropTypes.string,
};

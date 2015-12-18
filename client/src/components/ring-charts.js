import React from 'react';
import RingChart from './ring-chart';

require('./detail.scss');

export default class RingCharts extends React.Component {
  render() {
    return (<div className="details-container">
      {this.props.charts.map(c => {
        return (
          <div key={c.id}>
            <h4 className="details-container-title">{c.text}</h4>
            <RingChart value={c.value} width={c.width} color={c.color} id={c.id}/>
          </div>
        );
      })}
    </div>);
  }

}

RingCharts.propTypes = {
  charts: React.PropTypes.object.isRequired,
};

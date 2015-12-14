import React from 'react';

require('./resouce-usage.scss');

export default class ResourceUsage extends React.Component {

  getPoint(r, degree) {
    const size = 100;
    const trackWidth = 15;
    const d = degree / 180 * Math.PI;

    return {
      x: r * Math.sin(d) + size / 2,
      y: trackWidth / 2 + r * (1 - Math.cos(d)),
    };
  }

  render() {
    const size = 100;
    const r = 40;
    const progress = 35;
    const startDegree = 0;
    const endDegree = startDegree + progress * 360 / 100;
    const s = this.getPoint(r, startDegree);
    const e = this.getPoint(r, endDegree);

    let progressPath = null;
    if (progress < 50) {
      progressPath = `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    } else {
      const m = this.getPoint(r, startDegree + 180);
      progressPath =
        `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${m.x},${m.y}
        M ${m.x} ${m.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    }
    return (
      <svg {...this.props} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="resource-usage"
          cx={size / 2}
          cy={size / 2}
          r={r}/>

        {progress > 0 ?
        <path
          d={progressPath}
          className="resource-usage__progress"
        /> : null}

        {progress > 0 ?
        <circle
          cx={s.x}
          cy={s.y}
          r={15 / 2}
          className="resource-usage__progress"
        /> : null}

        {progress > 0 ?
        <circle
          cx={e.x}
          cy={e.y}
          r={15 / 2}
          className="resource-usage__progress"
        /> : null}
      </svg>
    );
  }

}

ResourceUsage.propTypes = {
};

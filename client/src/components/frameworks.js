import React from 'react';

require('./frameworks.scss');

export default class Frameworks extends React.Component {
  renderList(frameworks) {
    const { focusFramework, blurFramework, toggleFramework } = this.props.frameworksActions;
    const active = this.props.active.get('selected');

    return frameworks.map(i => {
      const name = i.get('name');
      const className = active.includes(name) ? 'frameworks__item frameworks__item--active' : 'frameworks__item';
      return (<a href="#_" className={className}
        onMouseOver={() => focusFramework(name)}
        onMouseOut={() => blurFramework(name)}
        onClick={() => toggleFramework(name)}
        key={name}>
        {name}
      </a>);
    });
  }
  render() {
    return (<div className="frameworks">
      <div className="frameworks__label">Frameworks</div>
      {this.renderList(this.props.frameworks)}
    </div>);
  }
}

Frameworks.propTypes = {
  frameworks: React.PropTypes.object.isRequired,
  frameworksActions: React.PropTypes.object.isRequired,
  active: React.PropTypes.object.isRequired,
};

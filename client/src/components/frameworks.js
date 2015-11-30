import React from 'react';

export default class Frameworks extends React.Component {
  renderList(frameworks) {
    const { focusFramework, blurFramework, toggleFramework } = this.props.frameworksActions;

    return frameworks.map(i => {
      const name = i.get('name');
      return (<a href="#_" className="menu__subitem"
        onMouseOver={() => focusFramework(name)}
        onMouseOut={() => blurFramework(name)}
        onClick={() => toggleFramework(name)}
        key={name}>
        {name}
      </a>);
    });
  }
  render() {
    return (<div className="menu__item">
      <div className="menu__label">Frameworks</div>
      {this.renderList(this.props.frameworks)}
    </div>);
  }
}

Frameworks.propTypes = {
  frameworks: React.PropTypes.object.isRequired,
  frameworksActions: React.PropTypes.object.isRequired,
};

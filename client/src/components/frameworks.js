import React from 'react';

require('./frameworks.scss');

export default class Frameworks extends React.Component {
  renderList(frameworks) {
    const { focusFramework, blurFramework, toggleFramework } = this.props.frameworksActions;
    const active = this.props.active;

    return frameworks.map(i => {
      const name = i.get('name');
      const className = active.includes(name) ? 'frameworks__item frameworks__item--active' : 'frameworks__item';
      const style = { backgroundColor: this.props.colors.get(name) };
      return (<li className={className}
        onMouseOver={() => focusFramework(name)}
        onMouseOut={() => blurFramework(name)}
        onClick={() => toggleFramework(name)}
        key={name}>
        <div className="framework__item__text">{name}</div>
        <div className="framework__item__color" style={style}></div>
      </li>);
    });
  }
  render() {
    return (<div className="frameworks">
      <div className="frameworks__label">Frameworks</div>
      <ul>
       {this.renderList(this.props.frameworks)}
     </ul>
    </div>);
  }
}

Frameworks.propTypes = {
  frameworks: React.PropTypes.object.isRequired,
  frameworksActions: React.PropTypes.object.isRequired,
  active: React.PropTypes.object.isRequired,
  colors: React.PropTypes.object.isRequired,
};

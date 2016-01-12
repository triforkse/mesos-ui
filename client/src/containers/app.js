import React from 'react';
import {Link} from 'react-router';
import Button from '../components/button.js';

require('./app.scss');

export default class App extends React.Component {

  static propTypes() {
    return {
      children: React.PropTypes.object,
    };
  }

  render() {
    return (
      <div className="page">
        <div className="page__master">
          <div className="menu">
            <div className="menu__logo">
              <img src={require('../images/logo.svg')} alt="Mesos UI" />
            </div>
            <div className="menu__button">
              <Button><Link to="/" className="menu__label">Cluster</Link></Button>
            </div>
            <div className="menu__button">
              <Button><Link to="appIntent" className="menu__label">Add Framework</Link></Button>
            </div>
          </div>
        </div>
        <div className="page__slave">
          {this.props.children}
        </div>
      </div>);
  }
}

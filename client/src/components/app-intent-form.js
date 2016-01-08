import React, { Component, PropTypes } from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

export default class AppIntentForm extends Component {

  renderTabHeaders(appIntent) {
    const titles = appIntent.map((_value, key) => key);
    return (<TabList>
      {titles.map(t => <Tab key={t}>{t}</Tab>)}
    </TabList>);
  }

  renderTabPanels(appIntent) {
    const newRadarValue = this.props.newRadarValue;
    function keypress(layer, metric, e) {
      newRadarValue(layer, metric, e.currentTarget.value);
    }
    return appIntent.map((dataMap, layer) => {
      const inputs = dataMap.map((value, metric) => {
        return (<div key={metric}>
          {metric}: <input type="number" step="0.25" onChange={e => {
            keypress(layer, metric, e);
          } } value={value} />
        </div>);
      });
      return (<TabPanel key={layer}>
        {inputs}
      </TabPanel>);
    });
  }
  render() {
    return (<div className="app-intent-form">
      Hello from App Intent Form
      <Tabs>
        {this.renderTabHeaders(this.props.appIntent)}
        {this.renderTabPanels(this.props.appIntent)}
      </Tabs>
    </div>);
  }
}

AppIntentForm.propTypes = {
  appIntent: PropTypes.object.isRequired,
  newRadarValue: PropTypes.func.isRequired,
};

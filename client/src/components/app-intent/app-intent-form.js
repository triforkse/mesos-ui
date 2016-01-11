import React, { PropTypes } from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

require('./app-intent-form.scss');

function renderTabHeaders(appIntent) {
  const titles = appIntent.map((_value, key) => key);
  return (<TabList>
    {titles.map(t => <Tab key={t}>{t}</Tab>)}
  </TabList>);
}

function renderTabPanels(appIntent, newRadarValue) {
  return appIntent.map((dataMap, layer) => {
    const inputs = dataMap.map((value, metric) => (
      <div key={metric}>
        <label>{metric}:</label> <input type="number" min="0.25" step="0.25" onChange={e => {
          newRadarValue(layer, metric, e.currentTarget.value);
        } } value={value} />
      </div>
    ));
    return (<TabPanel key={layer}>
      {inputs}
    </TabPanel>);
  });
}

const AppIntentForm = ({ appIntent, newRadarValue }) => (
  <div className="app-intent-form">
    <Tabs>
      {renderTabHeaders(appIntent)}
      {renderTabPanels(appIntent, newRadarValue)}
    </Tabs>
  </div>
);

AppIntentForm.propTypes = {
  appIntent: PropTypes.object.isRequired,
  newRadarValue: PropTypes.func.isRequired,
};

export default AppIntentForm;

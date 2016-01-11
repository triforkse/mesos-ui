import React, { PropTypes } from 'react';

function calcCost(layer, data) {
  const value = data.get(layer).reduce((previousValue, currentValue) => previousValue + currentValue);
  return value * 10;
}

const AppIntentCost = ({appIntent}) => (
  <div className="app-intent-cost">
    Hard limit budget: ${calcCost('max', appIntent)} -
    Soft limit budget: ${calcCost('normal', appIntent)}
  </div>
);

AppIntentCost.propTypes = {
  appIntent: PropTypes.object.isRequired,
};

export default AppIntentCost;

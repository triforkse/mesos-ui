import React from 'react';

function calcCost(layer, data) {
  const value = data.get(layer).reduce((previousValue, currentValue) => previousValue + currentValue);
  return value * 10;
}

export default ({appIntent}) => (
  <div className="app-intent-cost">
    Hard limit budget: ${calcCost('max', appIntent)} -
    Soft limit budget: ${calcCost('normal', appIntent)}
  </div>
);

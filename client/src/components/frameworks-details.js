import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import RingCharts from './ring-charts';

require('./detail.scss');

export default class SlavesDetail extends React.Component {
  calculatePercent(used, max) {
    if (max === 0) return 0;
    if (used === 0) return 0;
    return Math.round((used / max) * 100);
  }

  renderTabHeaders(slaves) {
    const titles = slaves.map(f => f.name);
    return (<TabList>
             {titles.map(t => <Tab key={t}>{t}</Tab>)}
            </TabList>);
  }

  renderTabPanels(frameworks) {
    return frameworks.map(f => {
      const {cpus: usedCpus, mem: usedMem, disk: usedDisk} = f.used_resources.toJS();
      const {cpus: maxCpus, mem: maxMem, disk: maxDisk} = f.resources.toJS();
      const charts = [
        {
          id: 'cpus',
          text: 'CPUS',
          color: '#00CC00',
          width: 60,
          value: this.calculatePercent(usedCpus, maxCpus),
        },
        {
          id: 'mem',
          text: 'Memory',
          color: '#CD0074',
          width: 60,
          value: this.calculatePercent(usedMem, maxMem),
        },
        {
          id: 'disk',
          text: 'Disk',
          color: '#FF7400',
          width: 60,
          value: this.calculatePercent(usedDisk, maxDisk),
        },
      ];

      return (<TabPanel key={f.name}>
        <div >
            <RingCharts charts={charts} />
        </div>
      </TabPanel>);
    });
  }

  render() {
    const selectedFrameworks = this.props.selectedFrameworks;
    const frameworks = this.props.frameworks.filter(s => selectedFrameworks.contains(s.name));
    return (<Tabs>
      {this.renderTabHeaders(frameworks)}
      {this.renderTabPanels(frameworks)}
    </Tabs>);
  }

}

SlavesDetail.propTypes = {
  frameworks: React.PropTypes.object.isRequired,
  selectedFrameworks: React.PropTypes.object.isRequired,
};

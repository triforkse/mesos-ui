import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import RingCharts from './ring-charts';

require('./detail.scss');

export default class SlavesDetail extends React.Component {
  calculatePercent(used, max) {
    return Math.round((used / max) * 100);
  }

  renderTabHeaders(slaves) {
    const titles = slaves.map(s => s.pid);
    return (<TabList>
             {titles.map(t => <Tab>{t}</Tab>)}
            </TabList>);
  }

  renderTabPanels(slaves) {
    return slaves.map(s => {
      const {cpus: usedCpus, mem: usedMem, disk: usedDisk} = s.used_resources;
      const {cpus: maxCpus, mem: maxMem, disk: maxDisk} = s.resources;
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
      return (<TabPanel>
        <div>
            <RingCharts charts={charts} />
        </div>
      </TabPanel>);
    });
  }

  render() {
    const selectedSlaves = this.props.selectedSlaves;
    const slaves = this.props.slaves.filter(s => selectedSlaves.contains(s.pid));
    return (<Tabs>
      {this.renderTabHeaders(slaves)}
      {this.renderTabPanels(slaves)}
    </Tabs>);
  }

}

SlavesDetail.propTypes = {
  slaves: React.PropTypes.object.isRequired,
  selectedSlaves: React.PropTypes.object.isRequired,
};

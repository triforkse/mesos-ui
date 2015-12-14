import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import RingChart from './ring-chart';

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
      return (<TabPanel>
         <table>
           <tr>
             <td>CPU</td>
             <td>{usedCpus.toFixed(2)} / {maxCpus} ({this.calculatePercent(usedCpus, maxCpus)}%)</td>
           </tr>
           <tr>
             <td>Memory</td>
             <td>{usedMem.toFixed(2)} / {maxMem} ({this.calculatePercent(usedMem, maxMem)}%)</td>
           </tr>
           <tr>
             <td>Disk</td>
             <td>{usedDisk.toFixed(2)} / {maxDisk} ({this.calculatePercent(usedDisk, maxDisk)}%)</td>
           </tr>
         </table>
         <RingChart value={usedCpus * 100} width={60} color="green" id="test"/>
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

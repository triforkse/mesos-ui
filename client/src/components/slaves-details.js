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
      return (<TabPanel>
        <div className="details-container">
          <div>
            <h4 className="details-container-title">CPUS</h4>
            <RingChart value={usedCpus * 100} width={60} color="#00CC00" id="cpus"/>
          </div>
          <div>
            <h4 className="details-container-title">Memory</h4>
            <RingChart value={usedMem * 100} width={60} color="#CD0074" id="mem"/>
          </div>
          <div>
            <h4 className="details-container-title">Disk</h4>
            <RingChart value={usedDisk * 100} width={60} color="#FF7400" id="disk"/>
          </div>
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

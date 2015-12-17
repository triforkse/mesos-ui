import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import RingChart from './ring-chart';

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

      return (<TabPanel key={f.name}>
        <div className="details-container">
          <div>
            <h4 className="details-container-title">CPUS</h4>
            <RingChart value={this.calculatePercent(usedCpus, maxCpus)} width={60} color="#00CC00" id="cpus"/>
          </div>
          <div>
            <h4 className="details-container-title">Memory</h4>
            <RingChart value={this.calculatePercent(usedMem, maxMem)} width="60" color="#CD0074" id="mem"/>
          </div>
          <div>
            <h4 className="details-container-title">Disk</h4>
            <RingChart value={this.calculatePercent(usedDisk, maxDisk)} width={60} color="#FF7400" id="disk"/>
          </div>
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

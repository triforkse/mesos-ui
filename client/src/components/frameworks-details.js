import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import RingChart from './ring-chart';

require('./detail.scss');

export default class SlavesDetail extends React.Component {
  calculatePercent(used, max) {
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
                <table>
                  <tbody>
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
                  </tbody>
                </table>
                <RingChart value={this.calculatePercent(usedCpus, maxCpus)} width={60} color="green" id="test"/>
      </TabPanel>);
    });
  }

  render() {
    const selectedFrameworks = this.props.selectedFrameworks;
    const frameworks = this.props.frameworks.filter(s => selectedFrameworks.contains(s.name));
    console.log(frameworks.toJS());
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

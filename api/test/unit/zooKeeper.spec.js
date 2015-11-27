/* global it expect describe beforeEach */

import * as zookeeper from '../../src/zooKeeper.js';

const zkData = '{"address":{"hostname":"192.168.99.100","ip":"192.168.99.100","port":5050},"hostname":"192.168.99.100","id":"8b3ebf2c-7c89-4a85-bd7a-fbe7337f6303","ip":1684252864,"pid":"master@192.168.99.100:5050","port":5050,"version":"0.25.0"}';

describe('In the ZooKeeper module,', () => {
  let zkContext = null;

  beforeEach(() => {
    zkContext = zookeeper.createContext();
  });

  it('it changes the path when instructed to', () => {
    const fakePath = '/mesos';
    zookeeper.setPath(zkContext, fakePath);
    expect(zkContext.path).to.equal(fakePath);
  });

  it('it parses the ZNode data correctly', () => {
    expect(zookeeper.parseToUrl(zkData)).to.equal('http://192.168.99.100:5050');
  });
});

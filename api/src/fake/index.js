import express from 'express';
import {fromJS} from 'immutable';
import logger from 'winston';

const app = express();

function createContext() {
  let data = fromJS(require('./data.js'));
  const frameworkDummy = data.getIn(['frameworks', 0]);
  const slaveDummy = data.getIn(['slaves', 0]);
  data = data.set('frameworks', fromJS([])).set('slaves', fromJS([]));
  const frameworks = [
    'Hadoop',
    'ElasticSearch',
    'Marathon',
    'Chronos',
    'Logstash',
  ];

  return {
    frameworks,
    slaves: [],
    data,
    frameworkDummy,
    slaveDummy,
  };
}

const fakeContext = createContext();

function addFrameworks(context, threshhold = 0.75) {
  let frameworks = context.frameworks.filter(() => Math.random() < threshhold)
    .map(framework => context.frameworkDummy.set('name', framework)
      .setIn(['used_resources', 'cpus'], Math.random())
      .setIn(['resources', 'cpus'], 1));

  if (frameworks.length === 0) {
    frameworks = [];
  }
  return frameworks;
}

function addSlave(context) {
  if (context.slaves.length < 25) {
    const last = context.slaves[context.slaves.length - 1] || { pid: 5050 };
    context.slaves.push({
      pid: +last.pid + 1,
      cpus: Math.random(),
      frameworks: addFrameworks(context),
    });
  }
}

function removeSlave(context) {
  if (context.slaves.length > 3) {
    const index = Math.floor(Math.random() * context.slaves.length);
    context.slaves.splice(index, 1);
  }
}

function build(context, pid = 5050) {
  // pid 5050 is the master
  const master = pid === 5050;
  let buildData = context.data;
  if (master) {
    buildData = buildData.set('frameworks', context.frameworks.map((fw) => {
      const length = context.slaves.length || 1;
      const cpus = Math.random() * length;
      const maxCpus = length;
      return context.frameworkDummy
        .set('name', fw)
        .setIn(['used_resources', 'cpus'], cpus)
        .setIn(['resources', 'cpus'], maxCpus);
    }));
    buildData = buildData
      .set('slaves', context.slaves.map((slave) => {
        return context.slaveDummy
          .setIn(['used_resources', 'cpus'], slave.cpus)
          .setIn(['unreserved_resources', 'cpus'], 1 - slave.cpus)
          .set('pid', 'SLAVE:' + slave.pid);
      }))
      .set('activated_slaves', context.slaves.length || 0);
  } else {
    const pidSlave = context.slaves.filter(slave => slave.pid === +pid)[0];
    let frameworks;
    if (typeof(pidSlave) === 'undefined') {
      frameworks = [];
    } else {
      frameworks = pidSlave.frameworks;
    }
    buildData = buildData
      .set('frameworks', frameworks)
      .set('pid', 'SLAVE:' + pid);
  }
  return buildData;
}

setInterval(() => {
  fakeContext.slaves.forEach(s => s.cpus = Math.random());
  if (Math.random() < 0.5) {
    addSlave(fakeContext);
  } else {
    removeSlave(fakeContext);
  }
}, 2000);

app.get('/state.json', (req, res) => {
  res.json(build(fakeContext, 5050));
});

app.get('/:pid/state.json', (req, res) => {
  res.json(build(fakeContext, req.params.pid));
});

export function start() {
  app.listen(5050, () => {
    logger.info('fake server started at 5050');
  });
}

import express from 'express';
import {fromJS} from 'immutable';
import fs from 'fs';

const app = express();

function createContext() {
  let data = fromJS(JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8')));
  const frameworkDummy = data.getIn(['frameworks', 0]);
  const slaveDummy = data.getIn(['slaves', 0]);
  data = data.set('frameworks', fromJS([]));
  data = data.set('slaves', fromJS([]));

  return {
    frameworks: [
      'Hadoop',
      'ElasticSearch',
      'Marathon',
      'Chronos',
      'Logstash',
    ],
    slaves: [
      {
        pid: 5051,
        cpus: Math.random(),
      },
    ],
    data,
    frameworkDummy,
    slaveDummy,
  };
}

const fakeContext = createContext();

function addSlave(context) {
  const last = context.slaves[context.slaves.length - 1];
  context.slaves.push({
    pid: +last.pid + 1,
    cpus: Math.random(),
  });
}

function removeSlave(context) {
  if (context.slaves.length > 1) {
    const index = Math.floor(Math.random() * context.slaves.length);
    context.slaves.splice(index, 1);
  }
}

function changeCpus(context) {
  context.slaves = context.slaves.map((i) => {
    i.cpus = Math.random();
    return i;
  });
}

function build(context, pid = 5050) {
  // pid 5050 is the master
  const master = pid === 5050;
  let buildData = context.data;
  buildData = buildData.set('frameworks', context.frameworks.map((fw) => {
    let cpus = Math.random();
    let maxCpus = 1;
    if (master) {
      cpus = cpus * context.slaves.length;
      maxCpus = context.slaves.length;
    }
    return context.frameworkDummy.set('name', fw)
      .setIn(['used_resources', 'cpus'], cpus)
      .setIn(['resources', 'cpus'], maxCpus);
  }));
  if (master) {
    buildData = buildData.set('slaves', context.slaves.map((slave) => {
      return context.slaveDummy
        .setIn(['used_resources', 'cpus'], slave.cpus)
        .setIn(['unreserved_resources', 'cpus'], 1 - slave.cpus)
        .set('pid', 'SLAVE:' + slave.pid);
    }));
  }
  if (!master) {
    buildData = buildData.set('pid', 'SLAVE:' + pid);
  }
  return buildData;
}

setInterval(() => {
  changeCpus(fakeContext);
}, 1000);

setInterval(() => {
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
    console.log('fake server started at 5050'); // eslint-disable-line
  });
}

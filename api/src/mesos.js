import request from 'request';
import Immutable from 'immutable';

let state = Immutable.Map({initial: true});
let prevState = state;

function getJSON() {
  request({
    url: 'http://192.168.99.101:5050/state.json',
    json: true,
  }, (err, res) => {
    if (err) {
      return;
    }
    const mesos = res.body;

    const frameworks = mesos.frameworks.map((fw) => {
      return {
        name: fw.name,
        id: fw.id,
        resources: fw.resources,
        used_resources: fw.used_resources,
        webui_url: fw.webui_url,
      };
    });

    const slaves = mesos.slaves.map((slave) => {
      // let port = slave.pid.split(':')[1]; // use this to query slaves
      // let port = slave.pid.split('@')[1]; // or maybe this
                                             // Need to figure out which one
                                             // would be correct in a real cluster
      return {
        pid: slave.pid,
        hostname: slave.hostname,
        resources: slave.resources,
        used_resources: slave.used_resources,
      };
    });

    const data = {
      cluster: mesos.cluster,
      version: mesos.version,
      flags: mesos.flags,
      git_tag: mesos.git_tag,
      hostname: mesos.hostname,
      frameworks,
      slaves,
    };

    const newState = Immutable.Map({ mesos: data });
    if (!Immutable.is(state, newState)) {
      state = newState;
    }
  });
}

setInterval(() => {
  getJSON();
}, 5000);

export function start(socket) {
  setInterval(() => {
    if (!Immutable.is(state, prevState)) {
      prevState = state;
      socket.emit('mesos', state);
    }
  }, 5000);
}

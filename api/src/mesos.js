import request from 'request';
import Immutable from 'immutable';
import diff from 'immutablediff';
import Q from 'q';

let state = Immutable.Map({initial: true});
let prevState = state;
let clients = Immutable.List([]);

function parse(json) {
  const frameworks = json.frameworks.map((fw) => {
    return {
      active: fw.active,
      name: fw.name,
      id: fw.id,
      resources: fw.resources,
      used_resources: fw.used_resources,
      webui_url: fw.webui_url,
    };
  });

  const slaves = json.slaves.map((slave) => {
    slave.url = slave.pid.split('@')[1];

    return {
      pid: slave.pid,
      hostname: slave.hostname,
      resources: slave.resources,
      used_resources: slave.used_resources,
    };
  });

  const data = {
    activated_slaves: json.activated_slaves,
    cluster: json.cluster,
    flags: json.flags,
    frameworks,
    git_tag: json.git_tag,
    hostname: json.hostname,
    slaves,
    version: json.version,
  };

  const newState = Immutable.fromJS({ mesos: data });

  return newState;
}

function getJSON() {
  const deferred = Q.defer();
  request({
    url: process.env.MESOS_MASTER + '/state.json',
    json: true,
  }, (err, res) => {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(parse(res.body));
  });
  return deferred.promise;
}

function updateState(newState) {
  if (!Immutable.is(state, newState)) {
    state = newState;
    clients = clients.map(client => {
      return client.set('nextMessage', diff(client.get('state'), newState))
        .set('state', newState);
    });
  }
  return clients;
}

function updateClients(allClients) {
  allClients.forEach(client => {
    if (client.get('newMessage')) {
      client.get('socket').emit('NEW_MESSAGE', client.get('newMessage'));
    }
  });
}

setInterval(() => {
  getJSON().then(updateState).then(updateClients);
}, 5000);

export function connect(socket) {
  socket.emit('mesos', state);
  clients = clients.push({
    state: state,
    socket,
  });
}

export function disconnect(id) {
  clients = clients.filter(client => client.socket.id !== id);
}

export function listClients() {
  return clients;
}

export function start(socket) {
  setInterval(() => {
    if (!Immutable.is(state, prevState)) {
      prevState = state;
      socket.emit('mesos', state);
    }
  }, 5000);
}

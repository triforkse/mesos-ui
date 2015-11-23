import request from 'request';
import { Map, List, fromJS } from 'immutable';
import diff from 'immutablediff';
import Q from 'q';

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

  const newState = fromJS({ mesos: data });

  return newState;
}

function getJSON() {
  const master = process.env.MESOS_MASTER || 'http://localhost:5050';
  const deferred = Q.defer();
  request({
    url: master + '/state.json',
    json: true,
  }, (err, res) => {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(parse(res.body));
  });
  return deferred.promise;
}

export function updateState(context, newState) {
  context.state = newState;
  context.clients = context.clients.map(client => {
    return client.set('newMessage', diff(client.get('state'), newState))
      .set('state', newState);
  });

  return context.clients;
}

function notifyListeners(allClients) {
  allClients.forEach(client => {
    if (client.get('newMessage').count() > 0) {
      client.get('socket').emit('MESOS_DIFF', client.get('newMessage'));
    }
  });
}

export function connect(context, socket) {
  socket.emit('MESOS_INIT', context.state);
  context.clients = context.clients.push(fromJS({
    state: context.state,
    socket,
  }));
}

export function disconnect(context, id) {
  context.clients = context.clients.filter(client => client.getIn(['socket', 'id']) !== id);
}

export function listClients(context) {
  return context.clients;
}

export function createContext() {
  return {
    pollId: null,
    clients: new List([]),
    state: new Map({initial: true}),
  };
}

export function start(context) {
  context.pollId = setInterval(() => {
    getJSON().then(data => updateState(context, data)).then(notifyListeners);
  }, 5000);
}

export function stop(context) {
  clearInterval(context.pollId);
  context.pollId = null;
}

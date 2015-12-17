import * as config from './config.js';
import http from 'lil-http';
import io from 'socket.io-client';

let socket = null;

export function fetchStatus(success) {
  const base = config.apiAddress();
  return http.get(`${base}/api/1.0/status`, (err, res) => {
    if (err) throw new Error('Cannot perform the request: ' + err.status);
    if (res.status === 200) {
      console.log(res.data); // eslint-disable-line no-console
    }

    success(res.data);
  });
}

export function connectWebSocket(cb) {
  const base = config.apiAddress();
  socket = io(base);
  socket.on('greeting', cb);
  socket.on('MESOS_INIT', m => cb({type: 'MESOS_INIT', payload: m}));
  socket.on('MESOS_DIFF', m => cb({type: 'MESOS_DIFF', payload: m}));
  socket.emit('greeting', 'hi from client');
}

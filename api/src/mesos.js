import request from 'request';

export function start(socket) {
  const mesosMaster = 'http://192.168.99.101:5050/';
  setInterval(() => {
    request({
      url: mesosMaster + 'metrics/snapshot',
      json: true,
    }, (err, res) => {
      socket.emit('mesos', 'Uptime: ' + res.body['master/uptime_secs']);
    });
  }, 5000);
}

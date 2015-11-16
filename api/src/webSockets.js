import socketIO from 'socket.io';
import logger from 'winston';
import * as mesos from './mesos';

export function init(server) {
  const io = socketIO.listen(server);
  io.on('connection', socket => {
    mesos.connect(socket);
    socket.on('disconnect', () => {
      logger.info('client %s disconnected', socket.id);
      mesos.disconnect(socket.id);
    });
  });
}

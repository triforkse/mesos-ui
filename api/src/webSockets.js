import socketIO from 'socket.io';
import logger from 'winston';
import * as mesos from './mesos';

export function init(server) {
  const io = socketIO.listen(server);
  const mesosContext = mesos.createContext();
  mesos.start(mesosContext);
  io.on('connection', socket => {
    mesos.connect(mesosContext, socket);
    socket.on('disconnect', () => {
      logger.info('client %s disconnected', socket.id);
      mesos.disconnect(mesosContext, socket.id);
    });
  });
}

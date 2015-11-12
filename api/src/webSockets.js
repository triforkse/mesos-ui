import socketIO from 'socket.io';
import logger from 'winston';
import Q from 'q';

export function init(server) {
  const io = socketIO.listen(server);
  const deferred = Q.defer();
  io.on('connection', socket => {
    socket.on('disconnect', () => logger.info('client %s disconnected', socket.id));
    socket.on('greeting', (message) => {
      logger.info('client on %s says %s', socket.id, message);
      socket.emit('greeting', 'hi from server');
      deferred.resolve(socket);
    });
  });

  return deferred.promise;
}

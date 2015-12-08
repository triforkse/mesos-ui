import server from './server';
import logger from 'winston';
import * as fake from './fake';

require('babel-polyfill'); // polyfill for es7

const port = process.env.PORT || 3000;
server.create(port).run(() => {
  logger.info('Running on port %s', port);
});

fake.start();

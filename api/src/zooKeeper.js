import zookeeper from 'node-zookeeper-client';
import logger from 'winston';

export function createContext() {
  return {
    client: null,
    path: '/',
    masterUrl: null,
  };
}

export function setPath(context, path) {
  context.path = path;
}

export function parseToUrl(data) {
  if (data.length === 0) {
    return false;
  }
  const json = JSON.parse(data);
  return 'http://' + json.address.ip + ':' + json.address.port;
}

function getData(context, child) {
  context.client.getData(
    context.path + '/' + child,
    (error, data) => {
      if (error) {
        return;
      }
      context.masterUrl = parseToUrl(data.toString('utf8'));
      logger.info('Master URL is now %s', context.masterUrl);
    }
  );
}

function watchNode(context) {
  logger.info('Got new ZNode event');
  context.client.getChildren(
    context.path,
    () => {
      watchNode(context);
    },
    (error, children) => {
      if (error) {
        return;
      }
      if (children.length > 0) {
        getData(context, children[0]);
      }
    }
  );
}

export function connect(context, address) {
  context.client = zookeeper.createClient(address);
  context.client.connect();
  context.client.once('connected', () => {
    logger.info('Connected to ZooKeeper');
    watchNode(context);
  });
}

/* global it expect describe */

import * as mesos from '../../src/mesos.js';
// import Immutable from 'Immutable';

// const state = Immutable.Map({initial: true});
const socket = {
  id: 123,
  emit: (id, message) => {
    return {
      id,
      message,
    };
  },
};

describe('Mesos module', () => {
  describe('Websocket connections', () => {
    it('connects a client', () => {
      mesos.connect(socket);
      expect(mesos.listClients().count()).to.equal(1);
    });
    it('disconnects a client', () => {
      mesos.disconnect(socket.id);
      expect(mesos.listClients().count()).to.equal(0);
    });
  });
});

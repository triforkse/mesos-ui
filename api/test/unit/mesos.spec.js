/* global it expect describe beforeEach */

import * as mesos from '../../src/mesos.js';
import { Map, is } from 'immutable';

const newState = Map({initial: true, modified: true});
const socket = {
  id: 123,
  emit: (id, message) => {
    return {
      id,
      message,
    };
  },
};
const socket2 = {
  id: 456,
  emit: (id, message) => {
    return {
      id,
      message,
    };
  },
};

describe('In the Mesos module,', () => {
  let mesosContext = null;

  beforeEach(() => {
    mesosContext = mesos.createContext();
  });

  function assertClientCount(expectedCount) {
    const actual = mesos.listClients(mesosContext).count();
    expect(actual).to.equal(expectedCount);
  }

  it('when a client connects the client is added to the list of clients', () => {
    mesos.connect(mesosContext, socket);
    assertClientCount(1);
  });

  it('disconnects a client', () => {
    mesos.connect(mesosContext, socket);
    mesos.disconnect(mesosContext, socket.id);
    assertClientCount(0);
  });

  it('when a client disconnects it removes the correct client', () => {
    mesos.connect(mesosContext, socket);
    mesos.connect(mesosContext, socket2);
    mesos.disconnect(mesosContext, socket.id);
    const result = mesos.listClients(mesosContext).get(0).toJS();
    assertClientCount(1);
    expect(result.socket.id).to.eql(456);
  });

  it('it updates states', () => {
    mesos.connect(mesosContext, socket);
    mesos.connect(mesosContext, socket);
    mesos.updateState(mesosContext, newState);
    expect(is(mesosContext.state, newState)).to.eql(true);
  });
});

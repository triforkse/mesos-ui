/*eslint-disable*/
import {appConfiguration} from '../../../src/reducers/app-configuration';
import {SERVICE_ADD, SERVICE_REMOVE} from '../../../src/actions';
import {AppConfiguration, Service} from '../../../src/records';
import {List} from 'immutable';

describe('reducers - appConfiguration', () => {
  describe('#SERVICE_ADD', () => {
    it('should add framework to selected services', () => {
      const state = new AppConfiguration({availableServices: List.of(new Service({id: 'test1'}))});
      const newState = appConfiguration(state, {type: SERVICE_ADD, framework: state.availableServices.first()});

      expect(newState.selectedServices.first().id).to.equal('test1');
    });
  });

  describe('#SERVICE_REMOVE', () => {
    it('should remove framework at index', () => {
      const state = new AppConfiguration({selectedServices: List.of('test1')});
      const newState = appConfiguration(state, {type: SERVICE_REMOVE, index: 0});

      expect(newState.selectedServices.count()).to.equal(0);
    });
  });
});

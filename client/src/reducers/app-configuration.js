import { SERVICE_ADD, SERVICE_REMOVE } from '../actions';
import { AppConfiguration, Service } from '../records';

const initialState = new AppConfiguration({
  availableServices: [
    new Service({name: 'ElasticSearch', id: 'testid1', abbreviation: 'ES'}),
    new Service({name: 'Kibana', id: 'testid2', abbreviation: 'KB'}),
    new Service({name: 'Logstash', id: 'testid3', abbreviation: 'LS'}),
  ]});

export function appConfiguration(state = initialState, action) {
  switch (action.type) {
  case SERVICE_ADD:
    return state.updateIn(['selectedServices'], s => s.push(action.framework));
  case SERVICE_REMOVE:
    return state.updateIn(['selectedServices'], s => s.delete(action.index));
  default:
    return state;
  }
}

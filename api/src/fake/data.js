/*eslint-disable */
export default {
  'activated_slaves': 2,
  'build_date': '2015-10-12 20:57:28',
  'build_time': 1444683448,
  'build_user': 'root',
  'cluster': 'docker-compose',
  'completed_frameworks': [],
  'deactivated_slaves': 0,
  'elected_time': 1448273613.75414,
  'frameworks': [
    {
      'active': true,
      'capabilities': [],
      'checkpoint': true,
      'completed_tasks': [],
      'executors': [],
      'failover_timeout': 604800,
      'hostname': 'mesos',
      'id': '33c5f659-8721-4034-b530-9219f4dbb7c3-0000',
      'name': 'chronos-2.4.0',
      'offered_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      },
      'offers': [],
      'pid': 'scheduler-0dea5a6a-8a57-4bbb-aa58-febd8694b0cc@127.0.0.1:47568',
      'registered_time': 1448273715.75291,
      'resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      },
      'role': '*',
      'tasks': [],
      'unregistered_time': 0,
      'used_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      },
      'user': 'root',
      'webui_url': 'http://mesos:8888'
    }
  ],
  'git_sha': '2dd7f7ee115fe00b8e098b0a10762a4fa8f4600f',
  'git_tag': '0.25.0',
  'hostname': '192.168.99.100',
  'id': '33c5f659-8721-4034-b530-9219f4dbb7c3',
  'leader': 'master@192.168.99.100:5050',
  'orphan_tasks': [],
  'pid': 'master@192.168.99.100:5050',
  'slaves': [
    {
      'active': true,
      'attributes': {},
      'hostname': 'mesos',
      'id': '33c5f659-8721-4034-b530-9219f4dbb7c3-S1',
      'offered_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      },
      'pid': 'slave(1)@127.0.0.1:5052',
      'registered_time': 1448273614.57058,
      'reserved_resources': {},
      'resources': {
        'cpus': 1,
        'disk': 13483,
        'mem': 498,
        'ports': '[12000-12999]'
      },
      'unreserved_resources': {
        'cpus': 1,
        'disk': 13483,
        'mem': 498,
        'ports': '[12000-12999]'
      },
      'used_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      }
    },
    {
      'active': true,
      'attributes': {},
      'hostname': 'mesos',
      'id': '33c5f659-8721-4034-b530-9219f4dbb7c3-S0',
      'offered_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      },
      'pid': 'slave(1)@127.0.0.1:5051',
      'registered_time': 1448273614.55414,
      'reserved_resources': {},
      'resources': {
        'cpus': 1,
        'disk': 13483,
        'mem': 498,
        'ports': '[11000-11999]'
      },
      'unreserved_resources': {
        'cpus': 1,
        'disk': 13483,
        'mem': 498,
        'ports': '[11000-11999]'
      },
      'used_resources': {
        'cpus': 0,
        'disk': 0,
        'mem': 0
      }
    }
  ],
  'start_time': 1448273613.72155,
  'unregistered_frameworks': [],
  'version': '0.25.0'
};

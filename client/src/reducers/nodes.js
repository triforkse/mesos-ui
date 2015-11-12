const initialState = {
  name: 'wrapper',
  children: [{
    name: 'cluster',
    children: [
      {
        name: 'node1',
        children: [
          {id: 1, name: 'ElasticSerach', cpu: 10, color: '#0DFF19', links: [2, 3] },
          {id: 2, name: 'Logstash', cpu: 15, color: '#3D300C' },
          {name: 'Spark', cpu: 10, color: '#FF0000' },
          {name: 'Storm', cpu: 5, color: '#100CE8' },
          {name: 'Postgres', cpu: 10, color: '#ADF7D3' },
          {name: 'Rails', cpu: 40, color: '#FF0DFF' },
        ],
      },
      {
        name: 'node2',
        children: [
          {name: 'ElasticSerach', cpu: 10, color: '#0DFF19' },
          {name: 'Logstash', cpu: 15, color: '#3D300C' },
          {name: 'Spark', cpu: 10, color: '#FF0000' },
          {name: 'Storm', cpu: 5, color: '#100CE8' },
          {name: 'Postgres', cpu: 10, color: '#ADF7D3' },
          {id: 3, name: 'Rails', cpu: 30, color: '#FF0DFF' },
        ],
      },
      {
        name: 'node3',
        children: [
          {name: 'ElasticSerach', cpu: 10, color: '#0DFF19' },
          {name: 'Logstash', cpu: 15, color: '#3D300C' },
          {name: 'Spark', cpu: 10, color: '#FF0000' },
          {name: 'Storm', cpu: 5, color: '#100CE8' },
          {name: 'Postgres', cpu: 10, color: '#ADF7D3' },
          {name: 'Rails', cpu: 10, color: '#FF0DFF' },
        ],
      },
      {
        name: 'node4',
        children: [
          {name: 'ElasticSerach', cpu: 10, color: '#0DFF19' },
          {name: 'Logstash', cpu: 15, color: '#3D300C' },
          {name: 'Spark', cpu: 10, color: '#FF0000' },
          {name: 'Storm', cpu: 5, color: '#100CE8' },
          {name: 'Postgres', cpu: 10, color: '#ADF7D3' },
          {name: 'Rails', cpu: 20, color: '#FF0DFF' },
        ],
      },
    ],
  }],

};

export function nodes(state = initialState) {
  return state;
}

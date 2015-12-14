import { Record, fromJS } from 'immutable';

const Resources = Record({cpus: 0, mem: 0, disk: 0, ports: null});

export const Layout = Record({
  r: 30,
  fixed: false,
  master: false,
  selected: false,
  focus: false,
});

export const ClusterLayout = Record({
  selectedSlaves: fromJS([]),
  selectedFrameworks: fromJS([]),
  focusedFramework: null,
});

export const Slave = Record({
  pid: null,
  hostname: null,
  resources: new Resources(),
  used_resources: new Resources(),
  layout: new Layout(),
  frameworks: fromJS([]),
});

export const Framework = Record({
  active: false,
  name: null,
  id: null,
  resources: new Resources(),
  used_resources: new Resources(),
  webui_url: null,
});

export const Cluster = Record({
  activated_slaves: fromJS([]),
  cluster: null,
  flags: fromJS([]),
  frameworks: fromJS([]),
  git_tag: null,
  hostname: null,
  slaves: fromJS([]),
  layout: new Layout({r: 45, fixed: true, master: true}),
});

export const ServerState = Record({
  connecting: true,
  cluster: new Cluster(),
});

export const Colors = Record({
  frameworks: fromJS({}),
});

export const FrameworkList = Record({
  focus: null,
  selected: fromJS([]),
});

export const ClientState = Record({
  colors: new Colors(),
  frameworkList: new FrameworkList(),
});

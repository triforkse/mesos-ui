import {merge} from 'lodash';

export const FULL_ARC = 2 * Math.PI;

export function calculateQuota(fullQuota, usedQuota) {
  return usedQuota / fullQuota * FULL_ARC;
}

export function distirbuteNodes({master, nodes}, width, height) {
  const masterWidthFactor = 0.5;
  const masterHeightFactor = 0.5;
  const masterFn = d => {
    return {
      pid: 'master',
      x: width * masterWidthFactor,
      y: height * masterHeightFactor,
      r: d.r,
      fixed: d.fixed,
      master: true,
    };
  };

  const slaveFn = d => {
    const s = merge(d.layout, {pid: d.pid, frameworks: d.frameworks.map(f => {
      return {id: f.name};
    })});

    // console.log('slave', s);
    return s;
  };

  const masterAndNodes = [master.toJS()].concat(nodes.toJS());

  return masterAndNodes.map(s => s.master ? masterFn(s) : slaveFn(s));
}

export function createLinks(nodes) {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  return nodes.map((n, i) => {
    return {source: i + 1, target: 0, value: 10, id: n.pid};
  });
}

// import {max} from 'lodash';

export const FULL_ARC = 2 * Math.PI;

export function calculateQuota(fullQuota, usedQuota) {
  return usedQuota / fullQuota * FULL_ARC;
}

export function distirbuteNodes(data, width, height) {
  const masterWidthFactor = 0.5;
  const masterHeightFactor = 0.5;

  const master = {pid: 'master', x: width * masterWidthFactor, y: height * masterHeightFactor, r: 45, fixed: true};
  const slave = () => {
    return {r: 30};
    // return {r: max([30, d.frameworks.length * 10])};
  };

  return data.map(s => Object.assign({}, s, s.master ? master : slave(s)));
}

export function createLinks(nodes) {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  return nodes.map((n, i) => {
    return {source: i + 1, target: 0, value: 10, id: n.pid};
  });
}

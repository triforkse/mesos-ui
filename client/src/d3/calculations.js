import d3 from 'd3';
import {zipWith} from 'lodash';

export const FULL_ARC = 2 * Math.PI;

export function calculateQuota(fullQuota, usedQuota) {
  return usedQuota / fullQuota * FULL_ARC;
}

export function distirbuteNodes(data, width, height) {
  const bubble = d3.layout.pack()
      .size([width, height])
      .value(d => d.size)
      .padding(50);

  const nodesWithWeight = data.map(n => Object.assign({}, {size: n.master ? 100 : 50}));
  const positions = bubble.nodes({children: nodesWithWeight}).filter(d => !d.children);

  return zipWith(data, positions, (n, p) => Object.assign(n, {x: p.x, y: p.y, r: p.r}));
}

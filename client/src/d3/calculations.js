export const FULL_ARC = 2 * Math.PI;

export function calculateQuota(fullQuota, usedQuota) {
  return usedQuota / fullQuota * FULL_ARC;
}

export function distirbuteNodes(data, width, height) {
  const masterWidthFactor = 0.6;
  const masterHeightFactor = 0.1;

  const rowHeight = height * 0.2;
  const offset = 50;

  const master = {x: width * masterWidthFactor, y: height * masterHeightFactor, r: 45, fixed: true};
  const slave = s => {
    const {row, col} = s.pos_in_grid;
    return {x: width * (col * 0.1) + offset, y: rowHeight * row, r: 30, fixed: true};
  };

  return data.map(s => Object.assign({}, s, s.master ? master : slave(s)));
}

export function createLinks(nodes) {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  return nodes.map((n, i) => {
    return {source: i + 1, target: 0, value: 10, fixed: true};
  });
}

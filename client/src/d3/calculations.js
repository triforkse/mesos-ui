import d3 from 'd3';

export const FULL_ARC = 2 * Math.PI;

export function calculateQuota(fullQuota, usedQuota) {
  return usedQuota / fullQuota * FULL_ARC;
}

const focusedOrSelected = node => node.layout.focus || node.layout.selected;

export function distributeNodes({master, nodes}, width, height) {
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

  const anyFocusedOrSelected = nodes.some(focusedOrSelected);

  const slaveFn = d => {
    return {
      pid: d.pid,
      r: focusedOrSelected(d) ? d.layout.r * 1.5 : d.layout.r,
      focusedOrSelected: d.layout.focus || d.layout.selected,
      frameworks: d.frameworks.map(f => ({id: f.name})),
      anyFocusedOrSelected,
      master: false,
    };
  };

  const masterAndNodes = [master.toJS()].concat(nodes.toJS());

  return masterAndNodes.map(s => s.master ? masterFn(s) : slaveFn(s));
}

export function saturateColor(color) {
  return d3.hsl(color).brighter(1.3).toString();
}

export function onNodeFocus() {
  d3.select(this).select('circle').transition()
    .duration(500)
    .attr('r', d => d.r);
}

export function onNodeBlur() {
  d3.select(this).select('circle').transition()
    .duration(500)
    .attr('r', d => d.r);
}

function validNumbers(node, quadPoint) {
  return (node.x - quadPoint.x) !== 0 && (node.y - quadPoint.y) !== 0;
}

export function preventCollision(alpha, nodes) {
  const padding = 1.5;
  const maxRadius = 12;
  const quadtree = d3.geom.quadtree(nodes);
  return function quadCb(d) {
    let r = d.r + maxRadius + padding;
    const nx1 = d.x - r;
    const nx2 = d.x + r;
    const ny1 = d.y - r;
    const ny2 = d.y + r;
    quadtree.visit(function visitCb(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d) && validNumbers(d, quad.point)) {
        let x = d.x - quad.point.x;
        let y = d.y - quad.point.y;
        let l = Math.sqrt(x * x + y * y);
        r = d.r + quad.point.r + padding;

        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

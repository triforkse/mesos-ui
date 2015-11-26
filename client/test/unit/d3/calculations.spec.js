/* global it expect describe */

import * as Calculations from '../../../src/d3/calculations';

describe('Calculations', () => {
  describe('#calculateQuota', () => {
    it('should return Math.PI for full quota 100 and used quota 50', () => {
      expect(Calculations.calculateQuota(100, 50)).to.be.closeTo(Math.PI, 0.1);
    });
  });

  describe('#distirbuteNodes', () => {
    it('should assign x, y and r values on depending on size', () => {
      const nodes = [
        {master: true, name: 'master'},
        {master: false, name: 'node1'},
        {master: false, name: 'node2'},
      ];

      const distribution = Calculations.distirbuteNodes(nodes, 500, 500);

      expect(distribution[0].x).to.exist;
      expect(distribution[0].y).to.exist;
      expect(distribution[1].x).to.exist;
      expect(distribution[1].y).to.exist;
      expect(distribution[2].x).to.exist;
      expect(distribution[2].y).to.exist;

      expect(distribution[0].r).to.be.above(distribution[1].r);
      expect(distribution[0].r).to.be.above(distribution[2].r);
    });
  });
});

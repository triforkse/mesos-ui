/* global it expect describe */

import * as Calculations from '../../../src/d3/calculations';

describe('Calculations', () => {
  describe('#calculateQuota', () => {
    it('should return Math.PI for full quota 100 and used quota 50', () => {
      expect(Calculations.calculateQuota(100, 50)).to.be.closeTo(Math.PI, 0.1);
    });
  });
});

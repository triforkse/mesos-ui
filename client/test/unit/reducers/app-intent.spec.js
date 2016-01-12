/*eslint-disable*/
import {appIntentWizard} from '../../../src/reducers/app-intent';
import {WIZARD_NEXT, WIZARD_PREV} from '../../../src/actions';
import {Wizard} from '../../../src/records';

describe('reducers - appIntentWizard', () => {
  describe('#WIZARD_NEXT', () => {
    it('should increase step and enable both prev and next', () => {
      const state = new Wizard();
      const newState = appIntentWizard(state, {type: WIZARD_NEXT, size: 3});

      expect(newState.step).to.equal(2);
      expect(newState.prev).to.be.true;
      expect(newState.next).to.be.true;
    });

    it('should disable next on last step', () => {
      const state = new Wizard({step: 2});
      const newState = appIntentWizard(state, {type: WIZARD_NEXT, size: 3});

      expect(newState.next).to.be.false;
    });
  });

  describe('#WIZARD_PREV', () => {
    it('should decrease step and enable next if on last step', () => {
      const state = new Wizard({step: 3, prev: true, next: false});
      const newState = appIntentWizard(state, {type: WIZARD_PREV, size: 3});

      expect(newState.step).to.equal(2);
      expect(newState.next).to.be.true;
      expect(newState.prev).to.be.true;
    });

    it('should disable prev on first step', () => {
      const state = new Wizard({step: 2, prev: true, next: true});
      const newState = appIntentWizard(state, {type: WIZARD_PREV, size: 3});

      expect(newState.prev).to.be.false;
    });
  });
});

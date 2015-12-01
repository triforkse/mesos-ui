/* global it expect describe */

import {fromJS} from 'immutable';
import * as Reducers from '../../../src/reducers/webSockets';
import {WEB_SOCKET_DIFF} from '../../../src/actions';

describe('reducers - webSockets', () => {
  describe('socketStatus', () => {
    describe('#WEB_SOCKET_DIFF', () => {
      it('should set prev_used_resources when a new stataus arrives', () => {
        const state = fromJS({
          status: {
            slaves: [
              {
                used_resources: {
                  cpus: 0.5,
                },
              },
            ],
          },
          connecting: false,
        });
        const action = {
          changes: fromJS([{
            op: 'replace',
            path: '/slaves/0/used_resources/cpus',
            value: 0.7,
          }]),
          type: WEB_SOCKET_DIFF,
        };

        const newState = Reducers.socketStatus(state, action).toJS();

        expect(newState.status.slaves[0].used_resources.cpus).to.equal(0.7);
        expect(newState.status.slaves[0].prev_used_resources.cpus).to.equal(0.5);
      });

      it('should set prev_used_resources on already patched status when a new stataus arrives', () => {
        let state = fromJS({
          status: {
            slaves: [
              {
                used_resources: {
                  cpus: 0.5,
                },
              },
            ],
          },
          connecting: false,
        });
        const action1 = {
          changes: fromJS([{
            op: 'replace',
            path: '/slaves/0/used_resources/cpus',
            value: 0.7,
          }]),
          type: WEB_SOCKET_DIFF,
        };
        const action2 = {
          changes: fromJS([{
            op: 'replace',
            path: '/slaves/0/used_resources/cpus',
            value: 0.9,
          }]),
          type: WEB_SOCKET_DIFF,
        };

        state = Reducers.socketStatus(state, action1);
        const newState = Reducers.socketStatus(state, action2).toJS();

        expect(newState.status.slaves[0].used_resources.cpus).to.equal(0.9);
        expect(newState.status.slaves[0].prev_used_resources.cpus).to.equal(0.7);
      });

      it('should set not prev_used_resources when patch is not used_resources when new stataus arrives', () => {
        const state = fromJS({
          status: {
            slaves: [
              {
                resources: {
                  mem: 200,
                },
                used_resources: {
                  cpus: 0.5,
                },
              },
            ],
          },
          connecting: false,
        });
        const action = {
          changes: fromJS([{
            op: 'replace',
            path: '/slaves/0/resources/mem',
            value: 300,
          }]),
          type: WEB_SOCKET_DIFF,
        };

        const newState = Reducers.socketStatus(state, action).toJS();

        expect(newState.status.slaves[0].used_resources.cpus).to.equal(0.5);
        expect(newState.status.slaves[0].resources.mem).to.equal(300);
        expect(newState.status.slaves[0].prev_used_resources).to.be.undefined; // eslint-disable-line
      });

      // it('should set not pos_in_grid to fist available slot', () => {
      //   const state = fromJS({
      //     status: {
      //       slaves: [
      //         {
      //           resources: {
      //             mem: 200,
      //           },
      //           used_resources: {
      //             cpus: 0.5,
      //           },
      //           pos_in_grid: {
      //             col: 2,
      //             row: 1,
      //           },
      //         },
      //         {
      //           resources: {
      //             mem: 200,
      //           },
      //           used_resources: {
      //             cpus: 0.5,
      //           },
      //         },
      //       ],
      //     },
      //     connecting: false,
      //   });
      //   const action = {
      //     changes: fromJS([{
      //       op: 'replace',
      //       path: '/slaves/0/resources/mem',
      //       value: 300,
      //     }]),
      //     type: WEB_SOCKET_DIFF,
      //   };
      //
      //   const newState = Reducers.socketStatus(state, action).toJS();
      //
      //   expect(newState.status.slaves[0].pos_in_grid.col).to.equal(2);
      //   expect(newState.status.slaves[0].pos_in_grid.row).to.equal(1);
      //   expect(newState.status.slaves[1].pos_in_grid.row).to.equal(1);
      //   expect(newState.status.slaves[1].pos_in_grid.col).to.equal(1);
      // });
    });
  });
});

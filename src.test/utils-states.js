'use strict';

import {expect} from 'mai-chai';

import {
  fingerprint,
  findState,
  removeState,
  replaceState,
  replaceStates
} from '../src/utils/states.js';

/******************************************************************************/

describe ('FieldStates', () => {
  describe ('utils/states', () => {
    describe ('fingerprint()', () => {
      it ('produces sorted fingerprint', () => {
        const result = fingerprint ({id: 1, x: 'X', y: 'Y', a: 'A'});
        expect (result).to.equal ('a,x,y');
      });

      it ('returns empty string for empty state', () => {
        expect (fingerprint ()).to.equal ('');
        expect (fingerprint ({})).to.equal ('');
      });
    });

    describe ('findState()', () => {
      it ('finds the matching state', () => {
        const state1 = {id: 1, x: 'X'};
        const state2 = {id: 2, x: 'X', y: 'Y'};
        const state3 = {id: 3, a: 'A'};
        const states = [state1, state2, state3];
        expect (findState (states, 'x')).to.equal (state1);
        expect (findState (states, 'x,y')).to.equal (state2);
        expect (findState (states, 'x,y,z')).to.be.null ();
        expect (findState (states, 'a')).to.equal (state3);
      });

      it ('does not find mismatching state', () => {
        const state1 = {id: 1, x: 'X'};
        const state2 = {id: 2, x: 'X', y: 'Y'};
        const state3 = {id: 3, a: 'A'};
        const states = [state1, state2, state3];
        expect (findState (states, 'y,x')).to.be.null ();
        expect (findState (states, 'x,y,z')).to.be.null ();
        expect (findState (states, 'A')).to.be.null ();
      });
    });

    describe ('removeState()', () => {
      it ('removes first matching state', () => {
        const state1 = {id: 1, x: 'X'};
        const state2 = {id: 2, x: 'XX'};
        const state3 = {id: 3, a: 'A'};
        const states = [state1, state2, state3];
        const result = removeState (states, 'x');
        expect (result[0]).to.equal (state2);
        expect (result[1]).to.equal (state3);
      });
    });

    describe ('replaceState()', () => {
      it ('accepts undefined states', () => {
        const state1 = {id: 1, x: 'X'};
        let   states;
        const result = replaceState (states, state1);
        expect (result).to.deep.equal ([state1]);
      });

      it ('inserts missing state', () => {
        const state1 = {id: 1, x: 'X'};
        const states = [];
        const result = replaceState (states, state1);
        expect (result).to.deep.equal ([state1]);
        expect (states).to.deep.equal ([]);
      });

      it ('inserts missing state', () => {
        const state1 = {id: 1, x: 'X'};
        const state2 = {id: 2, y: 'Y'};
        const states = [state2];
        const result = replaceState (states, state1);
        expect (result).to.deep.equal ([state2, state1]);
        expect (states).to.deep.equal ([state2]);
      });

      it ('clones inserted state', () => {
        const state1 = {id: 1, x: 'X'};
        const states = [];
        const result = replaceState (states, state1);
        expect (result[0]).to.have.property ('id', 1);
        expect (result[0]).to.have.property ('x', 'X');
        state1.id = 2;
        state1.x = '*';
        expect (result[0]).to.have.property ('id', 1);
        expect (result[0]).to.have.property ('x', 'X');
      });

      it ('does not alter equivalent state', () => {
        const state1 = {id: 1, x: 'X'};
        const states = [state1];
        const result = replaceState (states, {id: 1, x: 'X'});
        expect (result[0]).to.equal (state1);
      });

      it ('updates matching state', () => {
        const state1 = {id: 1, x: 'X'};
        const states = [state1];
        const result = replaceState (states, {id: 2, x: '*'});
        expect (result[0]).to.deep.equal ({id: 2, x: '*'});
      });

      it ('does nothing if state is undefined', () => {
        const state1 = {id: 1, x: 'X'};
        const states = [state1];
        expect (replaceState (states)).to.equal (states);
        expect (replaceState (states, {})).to.equal (states);
      });
    });
    describe ('replaceState()', () => {
      it ('replaces multiple states', () => {
        const state1 = {id: 1, x: 'X'};
        const state2 = {id: 2, x: 'X', y: 'Y'};
        const state3 = {id: 3, a: 'A'};
        const states = [state1, state2, state3];
        const result = replaceStates (states, {id: 2, x: 'x'}, {id: 4, y: 'y'});
        expect (result[0]).to.have.property ('x', 'x');
        expect (result[1]).to.equal (state2);
        expect (result[2]).to.equal (state3);
        expect (result[3]).to.have.property ('y', 'y');
      });
    });
  });
});

/******************************************************************************/

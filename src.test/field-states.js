'use strict';

import {expect} from 'mai-chai';
import {FieldStates} from 'electrum-field';

/******************************************************************************/

describe ('FieldStates', () => {
  describe ('create()', () => {
    it ('creates an empty field state collection', () => {
      const fs = FieldStates.create ();
      expect (fs).to.exist ();
      expect (fs.get ()).to.have.length (0);
    });
  });

  describe ('from()', () => {
    it ('creates a decoupled field states collection', () => {
      const state1 = {x: 1};
      const state2 = {y: 2};
      const fs = FieldStates.from (state1, state2);
      expect (fs.get ()).to.deep.equal ([{x: 1}, {y: 2}]);
      // Mutate original state: this should not affect FieldStates
      state1.x = 'x';
      expect (fs.get ()).to.deep.equal ([{x: 1}, {y: 2}]);
    });

    it ('accepts array of field states', () => {
      const state1 = {x: 1};
      const state2 = {y: 2};
      const states = [state1, state2];
      const fs = FieldStates.from (states);
      expect (fs.get ()).to.deep.equal ([{x: 1}, {y: 2}]);
      // Mutate original state: this should not affect FieldStates
      state1.x = 'x';
      expect (fs.get ()).to.deep.equal ([{x: 1}, {y: 2}]);
    });
  });

  describe ('find()', () => {
    it ('retrieves an immutable state', () => {
      const state1 = {x: 1};
      const state2 = {y: 2};
      const fs = FieldStates.from (state1, state2);
      expect (fs.find ('x')).to.have.property ('x', 1);
      expect (fs.find ('y')).to.have.property ('y', 2);
      expect (fs.find ('x')).to.not.equal (state1);
      // Make sure the returned object is a immutable:
      expect (() => fs.find ('x').z = 3).to.throw ('Can\'t add property z, object is not extensible');
    });

    it ('returns undefined on mismatch', () => {
      const state1 = {x: 1};
      const state2 = {y: 2};
      const fs = FieldStates.from (state1, state2);
      expect (fs.find ('z')).to.be.undefined ();
    });
  });

  describe ('add()', () => {
    it ('adds new state', () => {
      const fs1 = FieldStates.create ();
      const fs2 = fs1.add ({x: 'x'});
      const fs3 = fs2.add ({x: 'x'});
      const fs4 = fs3.add ({x: 'X'});
      expect (fs2).to.not.equal (fs1);
      expect (fs3).to.equal (fs2);
      expect (fs4).to.not.equal (fs3);
      expect (fs4.get ()).to.deep.equal ([{x: 'X'}]);
      expect (fs4.find ('x')).has.property ('x', 'X');
    });
    it ('adds multiple states in one call', () => {
      const fs1 = FieldStates.create ();
      const fs2 = fs1.add ({x: 'X'}, {y: 'Y'}, {a: 'A'});
      const fs3 = fs2.add ({a: 'A'}, {x: 'X'});
      expect (fs3).to.equal (fs2);
      expect (fs2.find ('x')).has.property ('x', 'X');
      expect (fs2.find ('y')).has.property ('y', 'Y');
      expect (fs2.find ('a')).has.property ('a', 'A');
    });
  });

  describe ('remove()', () => {
    it ('removes state', () => {
      const fs1 = FieldStates.create ();
      const fs2 = fs1.add ({x: 'x'}).add ({y: 'y'}).add ({a: 'a'});
      const fs3 = fs2.remove ({y: 'zz'});
      const fs4 = fs3.remove ({y: 'zz'});
      const fs5 = fs4.remove ({x: 'x'});
      expect (fs3).to.not.equal (fs2);
      expect (fs4).to.equal (fs3);
      expect (fs5).to.not.equal (fs4);
      expect (fs5.get ()).to.deep.equal ([{a: 'a'}]);
    });

    it ('removes state based on fingerprint', () => {
      const fs1 = FieldStates.create ();
      const fs2 = fs1.add ({x: 'x'}).add ({y: 'y'}).add ({a: 'a'});
      const fs3 = fs2.remove ('y');
      const fs4 = fs3.remove ('y');
      const fs5 = fs4.remove ('x');
      expect (fs3).to.not.equal (fs2);
      expect (fs4).to.equal (fs3);
      expect (fs5).to.not.equal (fs4);
      expect (fs5.get ()).to.deep.equal ([{a: 'a'}]);
    });
  });

  describe ('get()', () => {
    it ('returns an immutable array', () => {
      const fs = FieldStates.from ({x: 'x'}, {y: 'y'});
      const result = fs.get ();
      expect (() => result[0] = {}).to.throw ('Cannot assign to read only property \'0\'');
      expect (() => result.push ({})).to.throw ('Can\'t add property 2, object is not extensible');
    });

    it ('returns an immutable array of immutable objects', () => {
      const fs = FieldStates.from ({x: 'x'}, {y: 'y'});
      const result = fs.get ();
      expect (() => result[0].x = 'X').to.throw ('Cannot assign to read only property \'x\'');
      expect (() => result[0].a = 'A').to.throw ('Can\'t add property a, object is not extensible');
    });
  });
});

/******************************************************************************/

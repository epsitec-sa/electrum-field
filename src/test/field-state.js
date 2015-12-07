'use strict';

import {expect} from 'mai-chai';

import {FieldState} from '../index.js';

describe ('FieldState', () => {
  describe ('create()', () => {
    it ('creates an empty field state', () => {
      const field = FieldState.create ();
      expect (field).to.exist ();
    });
  });
});

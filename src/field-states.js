/******************************************************************************/

import * as Utils from './utils/states.js';

/******************************************************************************/

function clone (array) {
  return array
    .filter (x => (x !== undefined))
    .map (x => Object.assign ({}, x));
}

function freeze (array) {
  array.forEach (x => Object.freeze (x));
  return Object.freeze (array);
}

/******************************************************************************/

const secretKey = {};

export default class FieldStates {
  constructor (key, states) {
    if (key !== secretKey) {
      throw new Error ('Do not call FieldStates constructor directly; use FieldStates.create instead');
    }
    this._states = freeze (states);
  }

  get () {
    return this._states;
  }

  find (fingerprint) {
    const state = Utils.findState (this._states, fingerprint);
    if (state) {
      return state;
    }
  }

  add (state) {
    if (arguments.length === 0) {
      return this;
    } else if (arguments.length === 1) {
      return this.mutate (Utils.replaceState (this._states, state));
    } else {
      return this.mutate (Utils.replaceStates (this._states, ...arguments));
    }
  }

  remove (state) {
    if (typeof state === 'string') {
      return this.mutate (Utils.removeState (this._states, state));
    } else {
      return this.remove (FieldStates.fingerprint (state));
    }
  }

  mutate (states) {
    if (states === this._states) {
      return this;
    } else {
      return FieldStates.from (...states);
    }
  }

  static from (...states) {
    if (states.length === 1 && Array.isArray (states[0])) {
      return new FieldStates (secretKey, clone (states[0]));
    } else {
      return new FieldStates (secretKey, clone (states));
    }
  }

  static create () {
    return new FieldStates (secretKey, []);
  }
}

/******************************************************************************/

FieldStates.fingerprint = Utils.fingerprint;
FieldStates.clone = clone;

/******************************************************************************/

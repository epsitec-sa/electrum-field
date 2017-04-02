/******************************************************************************/

import {shallowEqual} from 'electrum-utils';

/******************************************************************************/

export function fingerprint (state) {
  if (!state) {
    return '';
  }
  const keys = Object.keys (state);
  return keys.filter (k => k !== 'id')
        .sort ()
        .join ();
}

export function findState (states, matchState) {
  if (states && matchState.length > 0) {
    for (const state of states) {
      const what = fingerprint (state);
      if (what === matchState) {
        return state;
      }
    }
  }
  return null;
}

export function removeState (states, matchState) {
  if (states === undefined) {
    states = [];
  }
  if (!Array.isArray (states)) {
    throw new Error ('states is not an array');
  }
  if (matchState.length > 0) {
    for (let i = 0; i < states.length; i++) {
      if (fingerprint (states[i]) === matchState) {
        states = states.slice ();
        states.splice (i, 1);
        return states;
      }
    }
  }
  return states;
}


export function replaceState (states, newState) {
  if (states === undefined) {
    states = [];
  }
  if (!Array.isArray (states)) {
    throw new Error ('states is not an array');
  }
  const what = fingerprint (newState);
  if (what.length > 0) {
    for (let i = 0; i < states.length; i++) {
      if (fingerprint (states[i]) === what) {
        if (!shallowEqual (states[i], newState)) {
          states = states.slice ();
          states.splice (i, 1, Object.assign ({}, newState));
        }
        return states;
      }
    }
    states = states.slice ();
    states.push (Object.assign ({}, newState));
  }
  return states;
}

export function replaceStates (states, ...newStates) {
  if (newStates) {
    for (let state of newStates) {
      states = replaceState (states, state);
    }
  }
  return states;
}

/******************************************************************************/

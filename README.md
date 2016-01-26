# Electrum Field

[![NPM version](https://img.shields.io/npm/v/electrum-field.svg)](https://www.npmjs.com/package/electrum-field)
[![Build Status](https://travis-ci.org/epsitec-sa/electrum-field.svg?branch=master)](https://travis-ci.org/epsitec-sa/electrum-field)
[![Build status](https://ci.appveyor.com/api/projects/status/8c6nooep3fbnoytc?svg=true)](https://ci.appveyor.com/project/epsitec/electrum-field)

The `electrum-field` module handles state associated with form fields and is
used with `electrum-state`.

# Manipulating field states

A field can have multiple states associated with it:

* A state describing whether the field is enabled or read-only.
* A state describing the position of the cursor or the selection.
* etc.

Each state is represented as a simple object.

# Fingerprint

The _fingerprint_ of a state is built by concatenating the sorted
names of the state's properties (property `id` is not included in
the computation of the fingerprint).

```javascript
import {FieldStates} from 'electrum-field';

const state = {
  id: '1234',
  begin: 12,
  end: 23
};

expect (FieldStates.fingerprint (state)).to.equal ('begin,end');
```

# FieldStates

The states are managed by class `FieldStates`, which maintains a read-only
array of simple state objects. An instance of `FieldStates` is **immutable**.

To create a `FieldStates` instance, use one of the static methods:

* `FieldStates.create ()` &rarr; creates an empty states collection.
* `FieldStates.from (s1, s2, ...)` &rarr; create a states collection based
  on the provided states `s1`, `s2`, etc.

To manipulate a `FieldStates` instance:

* `add (state)` &rarr; adds or updates the state based on its fingerprint;
* `remove (state)` &rarr; removes the state.
* `find (state)` &rarr; returns a copy of the state (if it is found) or
  `null` otherwise.
* `get ()` &rarr; returns an array with a copy of all the states.

Methods `remove()` and `find()` accept either a simple object (the
values of the fields are not used in the comparison) or a fingerprint
to specify the state.

Methods `add()` and `remove()` return a new instance of `FieldStates` if
the state changes; otherwise, they just return the same instance.

> Note: states are considered to be equal if they respond `true` to
> _shallow equality_. Since states should be simple objects where all
> properties are just value types, a shallow comparison is enough.
